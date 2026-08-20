"""
SBS NBA Ensemble Model Utilities

Cleaned up from a Jupyter notebook:
- Removed cell markers / notebook artifacts
- Grouped similar functions together
- Consolidated / deduped imports
- Kept your logic intact (only light safety fixes + organization)

Notes:
- This file assumes env var `SBS_V1_MONGO_URI` exists.
- Mongo/GridFS collections are initialized at import time (same as your notebook).
"""

from __future__ import annotations

import io
import json
import os
import re
from datetime import datetime, timedelta, timezone
from functools import reduce
from pprint import pprint
from typing import Any, Dict, Iterable, List, Optional, Tuple

import cloudpickle
import gridfs
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
from bson import ObjectId
from catboost import CatBoostClassifier
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from sklearn.calibration import CalibratedClassifierCV
from sklearn.cluster import KMeans
from sklearn.compose import ColumnTransformer
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import RandomizedSearchCV, TimeSeriesSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, StandardScaler
from xgboost import XGBClassifier


# =============================================================================
# JSON helpers
# =============================================================================

def json_serial(obj: Any):
    """JSON serializer for objects not serializable by default."""
    if isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


# =============================================================================
# MongoDB / GridFS initialization
# =============================================================================

URI = os.getenv("SBS_V1_MONGO_URI")
client = MongoClient(URI, server_api=ServerApi("1"))
db = client["SBSV1"]
fs = gridfs.GridFS(db)

try:
    client.admin.command("ping")
except Exception as e:
    print(e)

nba_games_historical_collection = db["nba_games_historical"]
nba_team_aggregated_game_stats_historical_collection = db["nba_team_aggregated_game_stats_historical"]
nba_game_player_stats_historical_collection = db["nba_game_player_stats_historical"]
nba_player_aggregated_game_stats_historical_collection = db["nba_player_aggregated_game_stats_historical"]
nba_player_aggregated_odds_historical_collection = db["nba_player_aggregated_odds_historical"]
cached_web_api_response_collection = db["cached_web_api_response"]
nba_odds_historical_collection = db["nba_odds_historical"]
ml_models_collection = db["ml_models"]
bet_reports_collection = db["bet_reports"]


# =============================================================================
# Constants
# =============================================================================

NBA_SUPPORTED_BET_TYPES: List[str] = [
    "player_points",
    "player_assists",
    "player_rebounds",
    "player_points_rebounds_assists",
    "player_points_rebounds",
    "player_points_assists",
    "player_threes",
]

NBA_SEASON_DATES_MAP: Dict[int, Dict[str, str]] = {
    2022: {
        "regular_season_start": "2022-11-18",
        "regular_season_end": "2023-04-09",
        "playoff_season_start": "2023-04-15",
        "playoff_season_end": "2023-06-18",
        "all_season_start": "2022-11-18",
        "all_season_end": "2023-06-18",
    },
    2023: {
        "regular_season_start": "2023-10-24",
        "regular_season_end": "2024-04-14",
        "playoff_season_start": "2024-04-20",
        "playoff_season_end": "2024-06-20",
        "all_season_start": "2023-10-24",
        "all_season_end": "2024-06-20",
    },
    2024: {
        "regular_season_start": "2024-10-22",
        "regular_season_end": "2025-04-13",
        "playoff_season_start": "2025-04-19",
        "playoff_season_end": "2025-06-22",
        "all_season_start": "2024-10-22",
        "all_season_end": "2025-06-22",
    },
    2025: {
        "regular_season_start": "2025-10-21",
        "regular_season_end": "2026-04-12",
        "playoff_season_start": "2026-04-14",
        "playoff_season_end": "2026-06-30",  # placeholder
        "all_season_start": "2025-10-21",
        "all_season_end": "2026-06-30",  # placeholder
    },
}


# =============================================================================
# Sports Betting Sandbox API
# =============================================================================

def get_events(sports: str):
    url = "https://sportsbettingsandboxapi.com/odds-api/events/get"
    return requests.post(url, json={"sports": sports}).json()["data"]


def get_event_odds(req: dict):
    url = "https://sportsbettingsandboxapi.com/odds-api/event-odds/get"
    response = requests.post(url, json=req)
    return response.json()["data"]


# =============================================================================
# Mongo query helpers
# =============================================================================

def get_nba_team_aggregated_game_stats_historical(season: int, season_type: str):
    return list(
        nba_team_aggregated_game_stats_historical_collection.find(
            {"season": season, "seasonType": season_type}
        )
    )


def get_nba_team_aggregated_game_stats_historical_before_date(
    season: int, season_type: str, cutoff_date: str
):
    pipeline_agg = [
        {"$match": {"season": season, "seasonType": season_type}},
        {"$set": {"_gs": {"$objectToArray": {"$ifNull": ["$gameStats", {}]}}}},
        {
            "$set": {
                "_gs": {
                    "$filter": {
                        "input": "$_gs",
                        "as": "gs",
                        "cond": {
                            "$and": [
                                {"$ne": ["$$gs.v.dateStart", None]},
                                {
                                    "$lt": [
                                        {"$toDate": "$$gs.v.dateStart"},
                                        {"$toDate": cutoff_date},
                                    ]
                                },
                            ]
                        },
                    }
                }
            }
        },
        {"$set": {"gameStats": {"$arrayToObject": "$_gs"}}},
        {"$unset": "_gs"},
    ]
    return list(nba_team_aggregated_game_stats_historical_collection.aggregate(pipeline_agg))


def get_historical_nba_game_objs_from_season(season: int):
    return list(nba_games_historical_collection.find({"season": season}))


def get_historical_nba_player_aggregated_game_stats_from_season(season: int, season_type: str):
    return list(
        nba_player_aggregated_game_stats_historical_collection.find(
            {"season": season, "seasonType": season_type}
        )
    )


def get_historical_nba_player_aggregated_game_stats_from_season_before_date(
    season: int, season_type: str, cutoff_date: str
):
    pipeline_agg = [
        {"$match": {"season": season, "seasonType": season_type}},
        {"$set": {"_ps": {"$objectToArray": {"$ifNull": ["$playerStats", {}]}}}},
        {
            "$set": {
                "_ps": {
                    "$filter": {
                        "input": "$_ps",
                        "as": "ps",
                        "cond": {
                            "$and": [
                                {"$ne": ["$$ps.v.dateStart", None]},
                                {
                                    "$lt": [
                                        {"$toDate": "$$ps.v.dateStart"},
                                        {"$toDate": cutoff_date},
                                    ]
                                },
                            ]
                        },
                    }
                }
            }
        },
        {"$set": {"playerStats": {"$arrayToObject": "$_ps"}}},
        {"$unset": "_ps"},
    ]
    return list(nba_player_aggregated_game_stats_historical_collection.aggregate(pipeline_agg))


def get_player_stats(season: int, season_type: str, player_id: int, team_id: int):
    return list(
        nba_player_aggregated_game_stats_historical_collection.find(
            {"season": season, "seasonType": season_type, "playerId": player_id, "teamId": team_id}
        )
    )


def get_nba_player_aggregated_odds_historical_from_season(season: int, season_type: str):
    return list(
        nba_player_aggregated_odds_historical_collection.find(
            {"season": season, "seasonType": season_type}
        )
    )


def get_nba_player_aggregated_odds_historical_from_season_before_date(
    season: int, season_type: str, cutoff_date: str
):
    pipeline_agg = [
        {"$match": {"season": season, "seasonType": season_type}},
        {"$set": {"_cutoff": {"$toDate": cutoff_date}}},
        {"$set": {"_po": {"$objectToArray": {"$ifNull": ["$playerOdds", {}]}}}},
        {
            "$set": {
                "_po": {
                    "$map": {
                        "input": "$_po",
                        "as": "g",
                        "in": {
                            "k": "$$g.k",
                            "v": {
                                "$filter": {
                                    "input": {"$objectToArray": {"$ifNull": ["$$g.v", {}]}},
                                    "as": "st",
                                    "cond": {
                                        "$and": [
                                            {"$ne": ["$$st.v.lastUpdate", None]},
                                            {
                                                "$ne": [
                                                    {
                                                        "$convert": {
                                                            "input": "$$st.v.lastUpdate",
                                                            "to": "date",
                                                            "onError": None,
                                                            "onNull": None,
                                                        }
                                                    },
                                                    None,
                                                ]
                                            },
                                            {
                                                "$lt": [
                                                    {
                                                        "$convert": {
                                                            "input": "$$st.v.lastUpdate",
                                                            "to": "date",
                                                            "onError": None,
                                                            "onNull": None,
                                                        }
                                                    },
                                                    "$_cutoff",
                                                ]
                                            },
                                        ]
                                    },
                                }
                            },
                        },
                    }
                }
            }
        },
        {"$set": {"_po": {"$filter": {"input": "$_po", "as": "g", "cond": {"$gt": [{"$size": "$$g.v"}, 0]}}}}},
        {"$set": {"_po": {"$map": {"input": "$_po", "as": "g", "in": {"k": "$$g.k", "v": {"$arrayToObject": "$$g.v"}}}}}},
        {"$set": {"playerOdds": {"$arrayToObject": "$_po"}}},
        {"$unset": ["_po", "_cutoff"]},
    ]
    return list(nba_player_aggregated_odds_historical_collection.aggregate(pipeline_agg))


def get_nba_odds_for_date(date_str: str):
    query = [
        {"$set": {"_ds": {"$toDate": "$dateStart"}, "_cutoff": {"$toDate": date_str}}},
        {"$match": {"sportKey": "basketball_nba", "$expr": {"$gt": ["$_ds", "$_cutoff"]}}},
        {"$set": {"_teams": ["$homeTeam", "$awayTeam"]}},
        {"$unwind": "$_teams"},
        {"$sort": {"_teams": 1, "_ds": 1}},
        {"$group": {"_id": "$_teams", "doc": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": {"$mergeObjects": ["$doc", {"team": "$_id"}]}}},
        {
            "$project": {
                "_id": 1,
                "team": 1,
                "homeTeam": 1,
                "awayTeam": 1,
                "dateStart": 1,
                "season": 1,
                "sportKey": 1,
                "nbaApiId": 1,
                "oddsApiId": 1,
                "bookmakerOdds": 1,
            }
        },
    ]
    return list(nba_odds_historical_collection.aggregate(query))


def get_season_from_date_str(date_str: str) -> Optional[int]:
    """date_str must be like '2025-04-22'."""
    target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    for season, dates in NBA_SEASON_DATES_MAP.items():
        start = datetime.strptime(dates["all_season_start"], "%Y-%m-%d").date()
        end = datetime.strptime(dates["all_season_end"], "%Y-%m-%d").date()
        if start <= target_date <= end:
            return season
    return None


# =============================================================================
# DataFrame transforms / generic helpers
# =============================================================================

def transform_player_game_stats_objs_to_df(player_game_stats_objs: list) -> pd.DataFrame:
    stats = [stat for player in player_game_stats_objs for stat in player["playerStats"].values()]
    return pd.DataFrame(stats)


def transform_player_odds_to_df(player_odds_objs: list) -> pd.DataFrame:
    full_rows = []
    for player_odds in player_odds_objs:
        player_id = player_odds["playerId"]

        for game_id, odds_for_game in player_odds["playerOdds"].items():
            for bet_type, line in odds_for_game.items():
                if line and line.get("outcomes"):
                    outcomes = line["outcomes"]
                    try:
                        over = next(x for x in outcomes if x["name"] == "Over")
                        under = next(x for x in outcomes if x["name"] == "Under")
                        full_rows.append(
                            {
                                "over_odds": over["price"],
                                "over_line": over["point"],
                                "under_odds": under["price"],
                                "under_line": under["point"],
                                "bet_type": bet_type,
                                "gameId": int(game_id),
                                "playerId": int(player_id),
                                "line_time": line["lastUpdate"],
                            }
                        )
                    except Exception:
                        print(f"failed to parse outcomes: {outcomes}")

    return pd.DataFrame(full_rows)


def get_date_range(from_date: str, end_date: str) -> List[str]:
    start = datetime.strptime(from_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    date_list = []
    current = start
    while current < end:
        date_list.append(current.strftime("%Y-%m-%d"))
        current += timedelta(days=1)

    return date_list


# =============================================================================
# Feature engineering (role clustering, DvP, rolling stats)
# =============================================================================

def enrich_player_stats_df_with_player_role(player_stats_df: pd.DataFrame) -> pd.DataFrame:
    player_stats_for_clustering = [
        "points", "assists", "totReb", "fgm", "fga",
        "tpm", "tpa", "ftm", "fta", "turnovers", "blocks", "steals",
    ]

    player_stats_df = player_stats_df.copy()
    player_stats_df["date"] = player_stats_df["dateStart"].str.split("T").str[0]
    unique_dates = sorted(player_stats_df["date"].unique())

    role_cluster_rows = []
    for date in unique_dates:
        df = player_stats_df[(player_stats_df["date"] < date) & (player_stats_df["min"] > 0)].copy()
        if df.empty:
            continue

        for stat in player_stats_for_clustering:
            df[stat] = df[stat] * (36 / df["min"])

        all_players_avg_stats = (
            df.sort_values("dateStart", ascending=False)
            .groupby("playerId")[player_stats_for_clustering]
            .mean()
            .reset_index()
            .dropna()
        )

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(all_players_avg_stats.drop("playerId", axis=1))

        kmeans = KMeans(n_clusters=5, random_state=42)
        all_players_avg_stats["roleCluster"] = kmeans.fit_predict(X_scaled)
        all_players_avg_stats["date"] = date

        role_cluster_rows.append(all_players_avg_stats[["playerId", "roleCluster", "date"]])

    full_role_cluster_df = pd.concat(role_cluster_rows, ignore_index=True)

    player_stats_df["playerId"] = player_stats_df["playerId"].astype("int64")
    full_role_cluster_df["playerId"] = full_role_cluster_df["playerId"].astype("int64")

    # keep consistent "date" semantics (same behavior as your notebook, but without double conversions)
    full_role_cluster_df["date"] = pd.to_datetime(full_role_cluster_df["date"]).dt.tz_localize(None)
    player_stats_df["date"] = pd.to_datetime(player_stats_df["date"]).dt.tz_localize(None)

    enriched_df = pd.merge_asof(
        player_stats_df.sort_values("date"),
        full_role_cluster_df.sort_values("date"),
        on="date",
        by=["playerId"],
        direction="backward",
    )
    return enriched_df[enriched_df["roleCluster"].notna()]


def enrich_player_stats_df_with_dvp_stats(player_stats_df: pd.DataFrame) -> pd.DataFrame:
    stats = ["points", "assists", "totReb", "fgm", "fga", "tpm", "tpa", "turnovers", "blocks", "steals"]
    rolling_windows = [10]

    df0 = player_stats_df.copy()
    df0["date"] = df0["dateStart"].str.split("T").str[0]
    df0 = df0.sort_values(["opponentTeamId", "roleCluster", "date"])

    dvp_rows = []
    unique_dates = sorted(df0["date"].unique())

    for date in unique_dates:
        df = df0[df0["date"] < date]
        if df.empty:
            continue

        rolling_dvp_for_date_rows = []

        for window in rolling_windows:
            dvp_team_cluster = (
                df.groupby(["opponentTeamId", "roleCluster"])[stats]
                .apply(lambda x: x.rolling(window=window, min_periods=1).mean().iloc[-1])
                .reset_index()
            ).rename(columns={stat: f"{window}_g_{stat}_team_dvp" for stat in stats})

            dvp_league_cluster = (
                df.groupby("roleCluster")[stats]
                .apply(lambda x: x.rolling(window=window, min_periods=1).mean().iloc[-1])
                .reset_index()
            ).rename(columns={stat: f"{window}_g_{stat}_league_dvp" for stat in stats})

            dvp_full = dvp_team_cluster.merge(dvp_league_cluster, on="roleCluster")
            for stat in stats:
                dvp_full[f"{window}_g_{stat}_dvp_pct_diff"] = (
                    (dvp_full[f"{window}_g_{stat}_team_dvp"] - dvp_full[f"{window}_g_{stat}_league_dvp"])
                    / dvp_full[f"{window}_g_{stat}_league_dvp"]
                )
            rolling_dvp_for_date_rows.append(dvp_full)

        dvp_team_cluster = (
            df.groupby(["opponentTeamId", "roleCluster"])[stats].mean().reset_index()
        ).rename(columns={stat: f"all_g_{stat}_team_dvp" for stat in stats})

        dvp_league_cluster = (
            df.groupby("roleCluster")[stats].mean().reset_index()
        ).rename(columns={stat: f"all_g_{stat}_league_dvp" for stat in stats})

        dvp_full = dvp_team_cluster.merge(dvp_league_cluster, on="roleCluster")
        for stat in stats:
            dvp_full[f"all_g_{stat}_dvp_pct_diff"] = (
                (dvp_full[f"all_g_{stat}_team_dvp"] - dvp_full[f"all_g_{stat}_league_dvp"])
                / dvp_full[f"all_g_{stat}_league_dvp"]
            )
        rolling_dvp_for_date_rows.append(dvp_full)

        rolling_dvp_for_date_df = reduce(
            lambda left, right: pd.merge(left, right, on=["opponentTeamId", "roleCluster"]),
            rolling_dvp_for_date_rows,
        )
        rolling_dvp_for_date_df["date"] = date
        dvp_rows.append(rolling_dvp_for_date_df)

    full_dvp_df = pd.concat(dvp_rows, ignore_index=True)

    df0 = df0.dropna(subset=["opponentTeamId", "roleCluster", "date"])
    full_dvp_df = full_dvp_df.dropna(subset=["opponentTeamId", "roleCluster", "date"])

    df0["date"] = pd.to_datetime(df0["date"]).dt.tz_localize(None)
    full_dvp_df["date"] = pd.to_datetime(full_dvp_df["date"]).dt.tz_localize(None)

    df0["opponentTeamId"] = df0["opponentTeamId"].astype("int64")
    df0["roleCluster"] = df0["roleCluster"].astype("int64")
    full_dvp_df["opponentTeamId"] = full_dvp_df["opponentTeamId"].astype("int64")
    full_dvp_df["roleCluster"] = full_dvp_df["roleCluster"].astype("int64")

    enriched_df = pd.merge_asof(
        df0.sort_values("date"),
        full_dvp_df.sort_values("date"),
        on="date",
        by=["opponentTeamId", "roleCluster"],
        direction="backward",
    )
    return enriched_df


def enrich_player_stats_df_with_rolling_stats(player_stats_df: pd.DataFrame) -> pd.DataFrame:
    stats = ["points", "assists", "totReb", "fgm", "fga", "tpm", "tpa", "turnovers", "blocks", "steals"]
    rolling_windows = [5, 10, 20]

    df0 = player_stats_df.copy()
    df0["date"] = df0["dateStart"].str.split("T").str[0]
    df0 = df0.sort_values(["playerId", "date"])

    rolling_stats_rows = []
    unique_dates = sorted(df0["date"].unique())

    for date in unique_dates:
        df = df0[df0["date"] < date]
        if df.empty:
            continue

        rolling_stats_for_date_rows = []

        for window in rolling_windows:
            rolling_avg_df = (
                df.groupby("playerId")[stats]
                .apply(lambda x: x.rolling(window=window, min_periods=1).mean().iloc[-1])
                .reset_index()
            ).rename(columns={stat: f"{window}_g_{stat}_roll_avg" for stat in stats})

            rolling_std_df = (
                df.groupby("playerId")[stats]
                .apply(lambda x: x.rolling(window=window, min_periods=2).std().iloc[-1])
                .reset_index()
            ).rename(columns={stat: f"{window}_g_{stat}_roll_std" for stat in stats})

            rolling_stats_for_date_rows.extend([rolling_avg_df, rolling_std_df])

        expanding_avg_df = (
            df.groupby("playerId")[stats].mean().reset_index()
        ).rename(columns={stat: f"all_g_{stat}_roll_avg" for stat in stats})
        rolling_stats_for_date_rows.append(expanding_avg_df)

        rolling_stats_for_date_df = reduce(
            lambda left, right: pd.merge(left, right, on="playerId"),
            rolling_stats_for_date_rows,
        )
        rolling_stats_for_date_df["date"] = date
        rolling_stats_rows.append(rolling_stats_for_date_df)

    full_rolling_stats_df = pd.concat(rolling_stats_rows, ignore_index=True)

    # Z-score relative to the 20-game rolling avg
    ref_w = rolling_windows[-1]
    for window in rolling_windows[:-1]:
        for stat in stats:
            z_score_col = f"{window}_g_{stat}_z_score"
            avg_col = f"{window}_g_{stat}_roll_avg"
            std_col = f"{window}_g_{stat}_roll_std"
            ref_avg_col = f"{ref_w}_g_{stat}_roll_avg"

            if ref_avg_col in full_rolling_stats_df.columns:
                full_rolling_stats_df[z_score_col] = (
                    (full_rolling_stats_df[avg_col] - full_rolling_stats_df[ref_avg_col])
                    / full_rolling_stats_df[std_col]
                ).fillna(0)

    df0["date"] = pd.to_datetime(df0["date"]).dt.tz_localize(None)
    full_rolling_stats_df["date"] = pd.to_datetime(full_rolling_stats_df["date"]).dt.tz_localize(None)

    df0["playerId"] = df0["playerId"].astype("int64")
    full_rolling_stats_df["playerId"] = full_rolling_stats_df["playerId"].astype("int64")

    enriched_df = pd.merge_asof(
        df0.sort_values("date"),
        full_rolling_stats_df.sort_values("date"),
        on="date",
        by="playerId",
        direction="backward",
    )
    return enriched_df


def enrich_feature_map_with_analytics(player_stats_df: pd.DataFrame) -> pd.DataFrame:
    df = enrich_player_stats_df_with_player_role(player_stats_df)
    df = enrich_player_stats_df_with_dvp_stats(df)
    df = enrich_player_stats_df_with_rolling_stats(df)
    return df


def enrich_feature_map_with_odds_data_for_bet_type(
    player_stats_df: pd.DataFrame, player_odds_df: pd.DataFrame, bet_type: str
) -> pd.DataFrame:
    filtered_player_odds_by_bet_type = player_odds_df[player_odds_df["bet_type"] == bet_type]
    return pd.merge(filtered_player_odds_by_bet_type, player_stats_df, on=["gameId", "playerId"])


# =============================================================================
# Encoding / feature selection helpers
# =============================================================================

def time_based_target_encode_smoothing(
    df: pd.DataFrame, col: str, target: str, date_col: str, smoothing: int = 10
):
    df = df.sort_values(by=date_col)
    global_mean = df[target].mean()

    encoded_col = np.zeros(len(df))
    encoding_mapping = {}

    for i in range(len(df)):
        train_data = df.iloc[:i]
        if len(train_data) == 0:
            encoded_value = global_mean
        else:
            agg = train_data.groupby(col)[target].agg(["mean", "count"])
            smooth = (agg["mean"] * agg["count"] + global_mean * smoothing) / (agg["count"] + smoothing)
            encoded_value = smooth.get(df.iloc[i][col], global_mean)

        encoded_col[i] = encoded_value
        encoding_mapping[(df.iloc[i][col], target)] = encoded_value

    return encoded_col, encoding_mapping


def apply_time_based_target_encoding(
    df: pd.DataFrame,
    categorical_features: List[str],
    target_cols: List[str],
    date_col: str,
    smoothing: int = 10,
):
    encoding_mappings = {}
    for col in categorical_features:
        for target in target_cols:
            encoded_col_name = f"{col}_{target}_time_enc"
            encoded_col, mapping = time_based_target_encode_smoothing(df, col, target, date_col, smoothing)
            df[encoded_col_name] = encoded_col
            encoding_mappings[(col, target)] = mapping

    return df, encoding_mappings


def remove_highly_correlated_features(df: pd.DataFrame, correlation_threshold: float = 0.9) -> pd.DataFrame:
    corr_matrix = df.corr().abs()
    upper_triangle = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
    to_drop = [column for column in upper_triangle.columns if any(upper_triangle[column] > correlation_threshold)]
    return df.drop(columns=to_drop)


def apply_pca(feature_map_df: pd.DataFrame, n_components: Optional[int] = None):
    numeric_cols = feature_map_df.select_dtypes(include=["float64", "int64"]).columns
    X = feature_map_df[numeric_cols]

    pca = PCA(n_components=n_components)
    pca_transformed = pca.fit_transform(X)

    pca_columns = [f"PC{i+1}" for i in range(pca_transformed.shape[1])]
    pca_df = pd.DataFrame(pca_transformed, columns=pca_columns)

    plt.figure(figsize=(10, 6))
    plt.plot(np.cumsum(pca.explained_variance_ratio_), marker="o")
    plt.xlabel("Number of Components")
    plt.ylabel("Cumulative Explained Variance")
    plt.title("PCA - Cumulative Explained Variance")
    plt.grid()
    plt.show()

    return pca_df, pca


# =============================================================================
# Training data assembly + processing
# =============================================================================

def process_nba_player_training_data_for_model(feature_map_df: pd.DataFrame, bet_type: str):
    feature_map_df = feature_map_df.copy()

    feature_map_df = feature_map_df[(feature_map_df["over_line"].notna()) & (feature_map_df["under_line"].notna())]
    feature_map_df.replace([np.inf, -np.inf], np.nan, inplace=True)
    feature_map_df.fillna(0, inplace=True)

    raw_stat = None
    if bet_type == "player_points":
        raw_stat = "points"
    elif bet_type == "player_assists":
        raw_stat = "assists"
    elif bet_type == "player_rebounds":
        raw_stat = "totReb"
    elif bet_type == "player_threes":
        raw_stat = "tpm"
    elif bet_type == "player_points_rebounds_assists":
        feature_map_df["PRA"] = feature_map_df["points"] + feature_map_df["totReb"] + feature_map_df["assists"]
        raw_stat = "PRA"
    elif bet_type == "player_points_rebounds":
        feature_map_df["PR"] = feature_map_df["points"] + feature_map_df["totReb"]
        raw_stat = "PR"
    elif bet_type == "player_points_assists":
        feature_map_df["PA"] = feature_map_df["points"] + feature_map_df["assists"]
        raw_stat = "PA"

    feature_map_df["prob_over"] = (feature_map_df[raw_stat] > feature_map_df["over_line"]).astype(int)
    feature_map_df["prob_under"] = 1 - feature_map_df["prob_over"]

    stats_for_feature_engineering = ["points", "assists", "totReb", "fgm", "fga", "tpm", "tpa", "turnovers", "blocks", "steals"]
    words = stats_for_feature_engineering.copy()

    if raw_stat in stats_for_feature_engineering:
        filtered_words = [w for w in words if w != raw_stat]
    else:
        if raw_stat == "PRA":
            filtered_words = [w for w in words if w not in ["points", "assists", "totReb"]]
        elif raw_stat == "PR":
            filtered_words = [w for w in words if w not in ["points", "totReb"]]
        elif raw_stat == "PA":
            filtered_words = [w for w in words if w not in ["points", "assists"]]
        else:
            filtered_words = words

    pattern = r"(" + r"|".join(map(re.escape, filtered_words)) + r")"
    to_drop = feature_map_df.filter(regex=pattern, axis=1).columns
    feature_map_df = feature_map_df.drop(columns=to_drop)

    cols_to_drop = [
        "points", "assists", "totReb", "fgm", "fga", "fgp", "ftm", "fta", "ftp",
        "tpm", "tpa", "tpp", "offReb", "defReb", "plusMinus", "pFouls", "steals",
        "turnovers", "blocks", "gameId", "line_time", "dateStart", "min", "win", raw_stat,
    ]
    for c in cols_to_drop:
        if c in feature_map_df.columns:
            feature_map_df.drop(c, axis=1, inplace=True)

    categorical_features = [
        "playerId",
        "teamId",
        "bet_type",
        "opponentTeamId",
        "date",
        "season",
        "season_type",
        "roleCluster",
        "isHome",
    ]
    date_col = "date"
    target_cols = ["prob_over", "prob_under"]

    numeric_cols = feature_map_df.select_dtypes(include=["float64", "int64"]).columns
    numeric_cols = [c for c in numeric_cols if c not in categorical_features and c not in target_cols]

    feature_map_df = feature_map_df.sort_values(by=date_col)
    date_col_df = feature_map_df[date_col]
    target_cols_df = feature_map_df[target_cols]

    scaler = StandardScaler()
    feature_map_df[numeric_cols] = scaler.fit_transform(feature_map_df[numeric_cols])

    scaler_params = {
        "bet_type": bet_type,
        "with_mean": scaler.with_mean,
        "with_std": scaler.with_std,
        "mean": scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
        "var": scaler.var_.tolist(),
        "fitted_at": datetime.utcnow().isoformat(),
    }

    feature_map_df.drop(target_cols, axis=1, inplace=True)

    feature_map_df_numeric_cols = remove_highly_correlated_features(feature_map_df[numeric_cols])
    feature_map_df = feature_map_df_numeric_cols.join(feature_map_df[categorical_features])

    feature_map_df["date"] = feature_map_df["date"].apply(lambda dt: dt.toordinal())
    return feature_map_df, date_col_df, target_cols_df, scaler_params


def get_raw_training_data_for_sbs_nba_ensemble_model_1_mapped_by_bet_type(
    season: int, season_type: str, end_date: Optional[str] = None
):
    if end_date is not None:
        player_stats_objs = get_historical_nba_player_aggregated_game_stats_from_season_before_date(season, season_type, end_date)
    else:
        player_stats_objs = get_historical_nba_player_aggregated_game_stats_from_season(season, season_type)

    player_stats_df = transform_player_game_stats_objs_to_df(player_stats_objs)
    enriched_player_stats_df = enrich_feature_map_with_analytics(player_stats_df)

    if end_date is not None:
        player_odds_objs = get_nba_player_aggregated_odds_historical_from_season_before_date(season, season_type, end_date)
    else:
        player_odds_objs = get_nba_player_aggregated_odds_historical_from_season(season, season_type)

    player_odds_df = transform_player_odds_to_df(player_odds_objs)

    feature_maps_by_bet_types = {}
    for bet_type in NBA_SUPPORTED_BET_TYPES:
        full_feature_map = enrich_feature_map_with_odds_data_for_bet_type(enriched_player_stats_df, player_odds_df, bet_type)
        full_feature_map["season"] = season
        full_feature_map["season_type"] = season_type
        feature_maps_by_bet_types[bet_type] = full_feature_map

    return feature_maps_by_bet_types


# =============================================================================
# Cached training data (raw + processed) in GridFS
# =============================================================================

def get_training_date_and_target_dfs_for_sbs_nba_ensemble_model_1(date_str: Optional[str] = None):
    if date_str is None:
        date_str = datetime.today().strftime("%Y-%m-%d")

    model_mongo_docs = list(ml_models_collection.find({"_id": f"sbs_nba_ensemble_model_1_{date_str}"}))
    sbs_ensemble_model_raw_training_data_full: Dict[str, Optional[pd.DataFrame]] = {}

    # Load raw from GridFS if present
    if len(model_mongo_docs) > 0:
        model_mongo_doc = model_mongo_docs[0]
        for bet_type in NBA_SUPPORTED_BET_TYPES:
            file_id = model_mongo_doc.get(f"sbs_ensemble_model_raw_training_data_full_{bet_type}")
            if file_id:
                try:
                    with fs.get(file_id) as file_data:
                        raw_data = file_data.read()
                    json_data = json.loads(raw_data.decode("utf-8"))
                    sbs_ensemble_model_raw_training_data_full[bet_type] = pd.DataFrame(json_data)
                except Exception:
                    sbs_ensemble_model_raw_training_data_full[bet_type] = None
            else:
                sbs_ensemble_model_raw_training_data_full[bet_type] = None
    else:
        sbs_ensemble_model_raw_training_data_2024 = get_raw_training_data_for_sbs_nba_ensemble_model_1_mapped_by_bet_type(2024, "ALL", date_str)
        sbs_ensemble_model_raw_training_data_2023 = get_raw_training_data_for_sbs_nba_ensemble_model_1_mapped_by_bet_type(2023, "ALL")

        latest_raw_training_data = sbs_ensemble_model_raw_training_data_2024
        all_historical_raw_training_data = [sbs_ensemble_model_raw_training_data_2023]

        for bet_type, df in latest_raw_training_data.items():
            all_dfs_for_bet_type = [df] + [hist[bet_type] for hist in all_historical_raw_training_data]
            combined_df = pd.concat(all_dfs_for_bet_type, ignore_index=True).sort_values(by="date")
            sbs_ensemble_model_raw_training_data_full[bet_type] = combined_df

            json_data = json.dumps(combined_df.to_dict(orient="records"), default=json_serial)
            file_id = fs.put(json_data.encode("utf-8"))

            ml_models_collection.update_one(
                {"_id": f"sbs_nba_ensemble_model_1_{date_str}"},
                {"$set": {f"sbs_ensemble_model_raw_training_data_full_{bet_type}": file_id}},
                upsert=True,
            )

    # Processed cache
    all_training_data_dfs = {}
    for bet_type in NBA_SUPPORTED_BET_TYPES:
        processed_feature_map = date_col = target_cols = scaler_params = None

        if len(model_mongo_docs) > 0:
            model_mongo_doc = model_mongo_docs[0]
            file_id = model_mongo_doc.get(f"sbs_ensemble_model_processed_training_data_{bet_type}")
            if file_id:
                try:
                    with fs.get(file_id) as file_data:
                        raw_data = file_data.read()
                    data = json.loads(raw_data.decode("utf-8"))
                    processed_feature_map = pd.DataFrame(data["processed_feature_map"])
                    date_col = pd.Series(data["date_col"])
                    target_cols = pd.DataFrame(data["target_cols"])
                    scaler_params = data["scaler_params"]
                except Exception:
                    processed_feature_map = date_col = target_cols = scaler_params = None

        if processed_feature_map is None or date_col is None or target_cols is None:
            raw_df = sbs_ensemble_model_raw_training_data_full.get(bet_type)
            if raw_df is not None and not raw_df.empty:
                try:
                    processed_feature_map, date_col, target_cols, scaler_params = process_nba_player_training_data_for_model(raw_df, bet_type)

                    json_data = json.dumps(
                        {
                            "processed_feature_map": processed_feature_map.to_dict(orient="records"),
                            "date_col": date_col.to_list(),
                            "target_cols": target_cols.to_dict(orient="records"),
                            "scaler_params": scaler_params,
                        },
                        default=json_serial,
                    )
                    file_id = fs.put(json_data.encode("utf-8"))

                    ml_models_collection.update_one(
                        {"_id": f"sbs_nba_ensemble_model_1_{date_str}"},
                        {"$set": {f"sbs_ensemble_model_processed_training_data_{bet_type}": file_id}},
                        upsert=True,
                    )
                except Exception:
                    processed_feature_map = date_col = target_cols = scaler_params = None

        all_training_data_dfs[bet_type] = {
            "processed_feature_map": processed_feature_map,
            "date_col": date_col,
            "target_cols": target_cols,
            "scaler_params": scaler_params,
        }

    return all_training_data_dfs


def get_cached_sbs_nba_ensemble_model_raw_training_data(date_str: Optional[str] = None):
    if date_str is None:
        date_str = datetime.today().strftime("%Y-%m-%d")

    model_mongo_docs = list(ml_models_collection.find({"_id": f"sbs_nba_ensemble_model_1_{date_str}"}))
    sbs_ensemble_model_raw_training_data_full = {}

    if len(model_mongo_docs) > 0:
        model_mongo_doc = model_mongo_docs[0]
        for bet_type in NBA_SUPPORTED_BET_TYPES:
            file_id = model_mongo_doc.get(f"sbs_ensemble_model_raw_training_data_full_{bet_type}")
            if file_id:
                try:
                    with fs.get(file_id) as file_data:
                        raw_data = file_data.read()
                    json_data = json.loads(raw_data.decode("utf-8"))
                    sbs_ensemble_model_raw_training_data_full[bet_type] = pd.DataFrame(json_data)
                except Exception:
                    sbs_ensemble_model_raw_training_data_full[bet_type] = None
            else:
                sbs_ensemble_model_raw_training_data_full[bet_type] = None

    return sbs_ensemble_model_raw_training_data_full


# =============================================================================
# Training models (logreg / xgb / catboost search+calibration)
# =============================================================================

def train_test_split_percentage(X: pd.DataFrame, dates: pd.Series, targets: pd.DataFrame, split_percentage: float):
    split_index = int(len(dates) * split_percentage)
    X_train, X_test = X.iloc[:split_index], X.iloc[split_index:]
    y_train, y_test = targets.iloc[:split_index], targets.iloc[split_index:]
    dates_train, dates_test = dates.iloc[:split_index], dates.iloc[split_index:]
    return X_train, X_test, y_train, y_test, dates_train, dates_test


def train_logistic_regression(X_train: pd.DataFrame, y_train: pd.DataFrame):
    model_over = LogisticRegression(max_iter=1000, random_state=42)
    model_under = LogisticRegression(max_iter=1000, random_state=42)
    model_over.fit(X_train, y_train["prob_over"])
    model_under.fit(X_train, y_train["prob_under"])
    return model_over, model_under


def evaluate_model(model_over, model_under, X_test: pd.DataFrame, y_test: pd.DataFrame):
    y_pred_probs_over = model_over.predict_proba(X_test)[:, 1]
    y_pred_probs_under = model_under.predict_proba(X_test)[:, 1]

    auc_score_over = roc_auc_score(y_test["prob_over"], y_pred_probs_over)
    auc_score_under = roc_auc_score(y_test["prob_under"], y_pred_probs_under)

    fpr_over, tpr_over, _ = roc_curve(y_test["prob_over"], y_pred_probs_over)
    fpr_under, tpr_under, _ = roc_curve(y_test["prob_under"], y_pred_probs_under)

    plt.figure(figsize=(10, 6))
    plt.plot(fpr_over, tpr_over, label=f"Prob Over (AUC = {auc_score_over:.2f})")
    plt.plot(fpr_under, tpr_under, label=f"Prob Under (AUC = {auc_score_under:.2f})")
    plt.plot([0, 1], [0, 1], linestyle="--", color="gray")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend()
    plt.grid(alpha=0.3)
    plt.show()


def run_logistic_regression_pipeline(X: pd.DataFrame, dates: pd.Series, targets: pd.DataFrame, split_percentage: float):
    X_train, X_test, y_train, y_test, _, _ = train_test_split_percentage(X, dates, targets, split_percentage)
    model_over, model_under = train_logistic_regression(X_train, y_train)
    evaluate_model(model_over, model_under, X_test, y_test)
    return model_over, model_under


def train_xgboost(X: pd.DataFrame, dates: pd.Series, targets: pd.DataFrame, split_percentage: float):
    X_train, X_test, y_train, y_test, _, dates_test = train_test_split_percentage(X, dates, targets, split_percentage)

    xgb_over = XGBClassifier(
        max_depth=5,
        learning_rate=0.1,
        n_estimators=200,
        random_state=42,
        use_label_encoder=False,
        eval_metric="logloss",
    )
    xgb_under = XGBClassifier(
        max_depth=5,
        learning_rate=0.1,
        n_estimators=200,
        random_state=42,
        use_label_encoder=False,
        eval_metric="logloss",
    )

    xgb_over.fit(X_train, y_train["prob_over"])
    xgb_under.fit(X_train, y_train["prob_under"])

    prob_over_preds = xgb_over.predict(X_test)
    prob_under_preds = xgb_under.predict(X_test)

    auc_over = roc_auc_score(y_test["prob_over"], prob_over_preds)
    auc_under = roc_auc_score(y_test["prob_under"], prob_under_preds)

    return xgb_over, xgb_under, dates_test, prob_over_preds, prob_under_preds, {"auc_over": auc_over, "auc_under": auc_under}


def build_and_train_pipelines(
    X: pd.DataFrame,
    dates: pd.Series,
    targets: pd.DataFrame,
    categorical_features: List[str],
    split_pct: float = 0.8,
    calib_pct: float = 0.2,
    param_grid: Optional[dict] = None,
    cv_splits: int = 3,
    n_iter: int = 10,
    calibration_method: str = "isotonic",
    early_stopping_rounds: int = 50,
    random_state: int = 42,
    verbose: int = 100,
):
    split_idx = int(len(dates) * split_pct)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = targets.iloc[:split_idx], targets.iloc[split_idx:]

    calib_split = int(len(X_train) * (1 - calib_pct))
    X_base, X_calib = X_train.iloc[:calib_split], X_train.iloc[calib_split:]
    y_base, y_calib = y_train.iloc[:calib_split], y_train.iloc[calib_split:]

    if param_grid is None:
        param_grid = {
            "clf__iterations": [200, 400, 800],
            "clf__learning_rate": [0.01, 0.05, 0.1],
            "clf__depth": [4, 6, 8],
            "clf__l2_leaf_reg": [1, 3, 5],
        }

    def _make_pipeline(target_col: str):
        cat = CatBoostClassifier(
            random_seed=random_state,
            verbose=verbose,
            eval_metric="AUC",
            early_stopping_rounds=early_stopping_rounds,
            use_best_model=True,
        )
        pipe = Pipeline([("clf", cat)])

        tscv = TimeSeriesSplit(n_splits=cv_splits)
        search = RandomizedSearchCV(
            pipe,
            param_distributions=param_grid,
            n_iter=n_iter,
            cv=tscv,
            scoring="roc_auc",
            n_jobs=-1,
            random_state=random_state,
            verbose=1,
        )

        search.fit(
            X_base,
            y_base[target_col],
            clf__cat_features=categorical_features,
            clf__eval_set=[(X_calib, y_calib[target_col])],
        )

        calibrator = CalibratedClassifierCV(search.best_estimator_, method=calibration_method, cv="prefit")
        calibrator.fit(X_calib, y_calib[target_col])
        return Pipeline([("calib", calibrator)])

    pipeline_over = _make_pipeline("prob_over")
    pipeline_under = _make_pipeline("prob_under")

    y_pred_over = pipeline_over.predict_proba(X_test)[:, 1]
    y_pred_under = pipeline_under.predict_proba(X_test)[:, 1]
    auc_over = roc_auc_score(y_test["prob_over"], y_pred_over)
    auc_under = roc_auc_score(y_test["prob_under"], y_pred_under)

    return pipeline_over, pipeline_under, {"auc_over": auc_over, "auc_under": auc_under}


# =============================================================================
# Persist trained pipelines to GridFS + rank bet types
# =============================================================================

def cache_sbs_nba_ensemble_model_1_trained_pipelines(training_data_by_bet_type: dict, date_str: Optional[str] = None):
    if date_str is None:
        date_str = datetime.today().strftime("%Y-%m-%d")

    categorical_features = [
        "playerId",
        "teamId",
        "bet_type",
        "opponentTeamId",
        "date",
        "season",
        "season_type",
        "roleCluster",
        "isHome",
    ]

    results = []

    for bet_type, info in training_data_by_bet_type.items():
        processed_feature_map = info.get("processed_feature_map")
        date_col = info.get("date_col")
        target_cols = info.get("target_cols")
        scaler_params = info.get("scaler_params")

        if (
            processed_feature_map is None
            or processed_feature_map.shape[0] == 0
            or date_col is None
            or len(date_col) == 0
            or target_cols is None
            or len(target_cols) == 0
        ):
            continue

        try:
            pipe_over, pipe_under, metrics = build_and_train_pipelines(
                X=processed_feature_map,
                dates=date_col,
                targets=target_cols,
                categorical_features=categorical_features,
                split_pct=0.8,
                calib_pct=0.2,
                cv_splits=3,
                n_iter=10,
                calibration_method="isotonic",
                early_stopping_rounds=50,
                random_state=42,
                verbose=100,
            )
        except Exception:
            continue

        scaler = StandardScaler(with_mean=scaler_params["with_mean"], with_std=scaler_params["with_std"])
        scaler.mean_ = np.array(scaler_params["mean"])
        scaler.scale_ = np.array(scaler_params["scale"])
        scaler.var_ = np.array(scaler_params["var"])

        feature_cols = processed_feature_map.columns.tolist()
        numeric_features = [c for c in feature_cols if c not in categorical_features]

        align_cols = FunctionTransformer(lambda df: df.reindex(columns=feature_cols, fill_value=0), validate=False)

        preprocessor = ColumnTransformer(
            transformers=[("num", scaler, numeric_features)],
            remainder="passthrough",
        )
        preprocessor.fit(processed_feature_map)

        full_pipe_over = Pipeline([("align", align_cols), ("preproc", preprocessor), ("model", pipe_over)])
        full_pipe_under = Pipeline([("align", align_cols), ("preproc", preprocessor), ("model", pipe_under)])

        for side, pipeline in (("over", full_pipe_over), ("under", full_pipe_under)):
            buf = io.BytesIO()
            cloudpickle.dump(pipeline, buf)
            buf.seek(0)

            fs.put(
                buf.read(),
                filename=f"sbs_nba_ensemble_model_1_{bet_type}_{side}_pipeline_{date_str}.joblib",
                bet_type=bet_type,
                side=side,
                created_at=datetime.utcnow(),
            )

        avg_auc = (metrics["auc_over"] + metrics["auc_under"]) / 2
        results.append(
            {"bet_type": bet_type, "auc_over": metrics["auc_over"], "auc_under": metrics["auc_under"], "avg_auc": avg_auc}
        )

    results_sorted = sorted(results, key=lambda x: x["avg_auc"], reverse=True)

    ml_models_collection.replace_one(
        {"_id": f"sbs_nba_ensemble_model_1_model_auc_results_{date_str}"},
        {"results": results_sorted},
        upsert=True,
    )

    return results_sorted


# =============================================================================
# Inference row building (realtime + backtest)
# =============================================================================

def convert_odds_team_name_to_nba_api_team_name(odds_name: str) -> str:
    if odds_name == "Los Angeles Clippers":
        return "LA Clippers"
    return odds_name


def get_inference_rows_for_sbs_nba_ensemble_model_1(
    player_data: list,
    team_data: list,
    raw_training_data_by_bet_type: Dict[str, pd.DataFrame],
):
    today = datetime.today()
    date_str = today.strftime("%Y-%m-%d")

    req = {
        "sports": "BasketballNba",
        "regions": "US",
        "markets": NBA_SUPPORTED_BET_TYPES,
        "oddsFormat": "American",
        "bookmakers": ["DraftKings"],
    }

    events = get_events("BasketballNba")

    player_data_mapped_by_name = {f"{p['firstname']} {p['lastname']}": p for p in player_data}
    team_name_map = {t["teamName"]: t["teamId"] for t in team_data}

    filtered_events = list(events)  # keep your current behavior (no date filtering)

    all_rows_for_inference = []

    for event in filtered_events:
        event_by_bet_type = {}
        line_time_by_bet_and_player = {}

        event_odds_req = dict(req)
        event_odds_req["eventId"] = event["id"]
        event_commence_time = event.get("commenceTime")

        home_team_id = team_name_map[convert_odds_team_name_to_nba_api_team_name(event["homeTeam"])]
        away_team_id = team_name_map[convert_odds_team_name_to_nba_api_team_name(event["awayTeam"])]

        odds = get_event_odds(event_odds_req)

        for e in odds.get("events", []):
            for b in e.get("bookmakers", []):
                for m in b.get("markets", []):
                    bet_type = m.get("key")
                    market_last_update = m.get("last_update") or b.get("last_update") or e.get("commenceTime")

                    if market_last_update is None:
                        market_last_update = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

                    for o in m.get("outcomes", []) or []:
                        curr_player_name = o.get("description")
                        if not curr_player_name:
                            continue

                        event_by_bet_type.setdefault(bet_type, {}).setdefault(curr_player_name, []).append(o)
                        line_time_by_bet_and_player[(bet_type, curr_player_name)] = market_last_update

        for bet_type, player_outcomes in event_by_bet_type.items():
            raw_training_data = raw_training_data_by_bet_type.get(bet_type)
            if raw_training_data is None or raw_training_data.empty:
                continue

            for player_name, outcomes in player_outcomes.items():
                try:
                    player_data_row = player_data_mapped_by_name[player_name]

                    player_raw_training_data = (
                        raw_training_data[raw_training_data["playerId"] == player_data_row["playerId"]]
                        .sort_values("date")
                        .tail(1)
                        .copy()
                    )
                    if player_raw_training_data.empty:
                        continue

                    if player_data_row["teamId"] == home_team_id:
                        player_raw_training_data["opponentTeamId"] = away_team_id
                        mask = (raw_training_data["opponentTeamId"] == away_team_id) & (
                            raw_training_data["roleCluster"] == player_raw_training_data["roleCluster"].iloc[-1]
                        )
                        opponent_team_id_raw_training_data = raw_training_data[mask].sort_values("date").tail(1).copy()
                        player_raw_training_data["isHome"] = True
                    else:
                        player_raw_training_data["opponentTeamId"] = home_team_id
                        mask = (raw_training_data["opponentTeamId"] == home_team_id) & (
                            raw_training_data["roleCluster"] == player_raw_training_data["roleCluster"].iloc[-1]
                        )
                        opponent_team_id_raw_training_data = raw_training_data[mask].sort_values("date").tail(1).copy()
                        player_raw_training_data["isHome"] = False

                    for outcome in outcomes:
                        if outcome.get("name") == "Over":
                            player_raw_training_data["over_odds"] = outcome.get("price")
                            player_raw_training_data["over_line"] = outcome.get("point")
                        elif outcome.get("name") == "Under":
                            player_raw_training_data["under_odds"] = outcome.get("price")
                            player_raw_training_data["under_line"] = outcome.get("point")

                    snapshot_line_time = line_time_by_bet_and_player.get(
                        (bet_type, player_name),
                        datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                    )

                    if "line_time" in player_raw_training_data.columns:
                        player_raw_training_data["line_time"] = snapshot_line_time
                    elif "lineTime" in player_raw_training_data.columns:
                        player_raw_training_data["lineTime"] = snapshot_line_time
                    else:
                        player_raw_training_data["line_time"] = snapshot_line_time

                    if event_commence_time is None:
                        event_commence_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

                    if "dateStart" in player_raw_training_data.columns:
                        player_raw_training_data["dateStart"] = event_commence_time
                    elif "date_start" in player_raw_training_data.columns:
                        player_raw_training_data["date_start"] = event_commence_time
                    else:
                        player_raw_training_data["dateStart"] = event_commence_time

                    dvp_cols = opponent_team_id_raw_training_data.columns[
                        opponent_team_id_raw_training_data.columns.str.contains("dvp")
                    ]
                    if not opponent_team_id_raw_training_data.empty and len(dvp_cols) > 0:
                        player_raw_training_data[dvp_cols] = opponent_team_id_raw_training_data[dvp_cols]

                    player_raw_training_data["date"] = pd.to_datetime(date_str).value // 1_000_000

                    all_rows_for_inference.append(player_raw_training_data)

                except Exception as e:
                    print(f"error processing inference row for {player_name}: {e}")

    return all_rows_for_inference


def get_inference_rows_for_sbs_nba_ensemble_model_backtest(
    player_data: list,
    team_data: list,
    raw_training_data_by_bet_type: Dict[str, pd.DataFrame],
    odds_for_date: list,
    date_str: str,
    nba_supported_bet_types: Optional[Iterable[str]] = None,
):
    """
    Build inference rows from historical odds snapshots (backtest).
    Output matches realtime shape but pulls event metadata from odds, not training rows.
    """
    player_data_mapped_by_name = {f"{p['firstname']} {p['lastname']}": p for p in player_data}
    team_name_map = {t["teamName"]: t["teamId"] for t in team_data}

    def _event_key(doc):
        return doc.get("nbaApiId") or (doc.get("homeTeam"), doc.get("awayTeam"), doc.get("dateStart"))

    event_index = {}
    for doc in odds_for_date:
        k = _event_key(doc)
        ds = pd.to_datetime(doc.get("dateStart"))
        if k not in event_index:
            event_index[k] = {
                "id": doc.get("nbaApiId") or k,
                "homeTeam": doc["homeTeam"],
                "awayTeam": doc["awayTeam"],
                "commenceTime": doc["dateStart"],
                "bookmakerOdds": doc.get("bookmakerOdds", []) or [],
            }
        else:
            existing_ds = pd.to_datetime(event_index[k]["commenceTime"])
            if ds > existing_ds:
                event_index[k] = {
                    "id": doc.get("nbaApiId") or k,
                    "homeTeam": doc["homeTeam"],
                    "awayTeam": doc["awayTeam"],
                    "commenceTime": doc["dateStart"],
                    "bookmakerOdds": doc.get("bookmakerOdds", []) or [],
                }

    def get_markets_from_event(ev):
        bms = ev.get("bookmakerOdds", []) or []
        if not bms:
            return []
        dk = next((b for b in bms if str(b.get("key")).lower() == "draftkings"), None)
        if dk is None:
            dk = bms[0]
        return dk.get("markets", []) or []

    def applicable_bet_type(key: str):
        if nba_supported_bet_types is None:
            return str(key).startswith("player_")
        return key in nba_supported_bet_types

    def market_last_update(markets, bet_type=None):
        selected = None
        if bet_type:
            selected = next((m for m in markets if m.get("key") == bet_type), None)
            if selected and selected.get("lastUpdate"):
                return selected["lastUpdate"]

        best_time = None
        for m in markets:
            if not str(m.get("key", "")).startswith("player_"):
                continue
            lu = m.get("lastUpdate")
            if lu:
                ts = pd.to_datetime(lu, errors="coerce")
                if ts is not None and (best_time is None or ts > best_time):
                    best_time = ts
        return best_time.isoformat().replace("+00:00", "Z") if best_time is not None else None

    date_ms = pd.to_datetime(date_str).value // 1_000_000

    STALE_META_COLS = {
        "gameId",
        "dateStart",
        "lineTime",
        "teamName",
        "opponentTeamName",
        "over_odds",
        "under_odds",
        "over_line",
        "under_line",
    }

    all_rows_for_inference = []

    for ev in event_index.values():
        markets = get_markets_from_event(ev)
        try:
            home_team_id = team_name_map[ev["homeTeam"]]
            away_team_id = team_name_map[ev["awayTeam"]]
        except KeyError:
            continue

        event_by_bet_type = {}
        for m in markets:
            bet_type = m.get("key")
            if not bet_type or not applicable_bet_type(bet_type):
                continue
            for o in m.get("outcomes", []) or []:
                player_name = o.get("description")
                if not player_name:
                    continue
                event_by_bet_type.setdefault(bet_type, {}).setdefault(player_name, []).append(o)

        for bet_type, player_outcomes in event_by_bet_type.items():
            raw_training_data = raw_training_data_by_bet_type.get(bet_type)
            if raw_training_data is None or raw_training_data.empty:
                continue

            dvp_mask = raw_training_data.columns.str.contains(r"\bdvp", case=False, regex=True)
            dvp_cols = list(raw_training_data.columns[dvp_mask])

            for player_name, outcomes in player_outcomes.items():
                p = player_data_mapped_by_name.get(player_name)
                if not p:
                    continue

                player_id = p["playerId"]
                player_team_id = p["teamId"]

                player_raw = (
                    raw_training_data[raw_training_data["playerId"] == player_id]
                    .sort_values("date")
                    .tail(1)
                    .copy()
                )
                if player_raw.empty:
                    continue

                role_cluster = player_raw["roleCluster"].iloc[-1]

                if player_team_id == home_team_id:
                    opp_id = away_team_id
                    is_home = True
                    team_name = ev["homeTeam"]
                    opp_team_name = ev["awayTeam"]
                else:
                    opp_id = home_team_id
                    is_home = False
                    team_name = ev["awayTeam"]
                    opp_team_name = ev["homeTeam"]

                player_raw["isHome"] = is_home
                player_raw["opponentTeamId"] = opp_id

                if dvp_cols:
                    mask = (raw_training_data["opponentTeamId"] == opp_id) & (raw_training_data["roleCluster"] == role_cluster)
                    opp_raw = raw_training_data[mask].sort_values("date").tail(1)
                    if not opp_raw.empty:
                        player_raw[dvp_cols] = opp_raw[dvp_cols].values

                to_drop = [c for c in STALE_META_COLS if c in player_raw.columns]
                if to_drop:
                    player_raw.drop(columns=to_drop, inplace=True, errors="ignore")

                over_odds = under_odds = over_line = under_line = None
                for o in outcomes:
                    name = o.get("name")
                    if name == "Over":
                        over_odds = o.get("price")
                        over_line = o.get("point")
                    elif name == "Under":
                        under_odds = o.get("price")
                        under_line = o.get("point")

                if over_odds is not None:
                    player_raw["over_odds"] = over_odds
                if under_odds is not None:
                    player_raw["under_odds"] = under_odds
                if over_line is not None:
                    player_raw["over_line"] = over_line
                if under_line is not None:
                    player_raw["under_line"] = under_line

                player_raw["date"] = date_ms
                player_raw["gameId"] = ev["id"]
                player_raw["dateStart"] = ev["commenceTime"]
                player_raw["teamName"] = team_name
                player_raw["opponentTeamName"] = opp_team_name
                player_raw["line_time"] = market_last_update(markets, bet_type=bet_type)

                all_rows_for_inference.append(player_raw)

    return all_rows_for_inference


# =============================================================================
# Pipeline loading
# =============================================================================

def load_pipelines(bet_type: str, side: str, model_name: str, date_str: Optional[str] = None):
    if date_str is None:
        date_str = datetime.today().strftime("%Y-%m-%d")
    file_doc = fs.get_last_version(filename=f"{model_name}_{bet_type}_{side}_pipeline_{date_str}.joblib")
    if not file_doc:
        raise ValueError(f"No pipeline found for {bet_type}/{side}")
    raw = fs.get(file_doc._id).read()
    return cloudpickle.loads(raw)


def get_all_pipelines_by_bet_type(sport: str, model_name: str, date_str: Optional[str] = None):
    all_pipelines = {}
    if sport == "NBA":
        for b in NBA_SUPPORTED_BET_TYPES:
            all_pipelines[b] = {
                "over": load_pipelines(b, "over", model_name, date_str),
                "under": load_pipelines(b, "under", model_name, date_str),
            }
    return all_pipelines


# =============================================================================
# Betting math (kelly / EV / AUC adjustment)
# =============================================================================

def kelly_fraction(p: float, b: float) -> float:
    q = 1.0 - p
    f = (b * p - q) / b
    return max(0.0, min(f, 1.0))


def american_to_b(american_odds: float) -> float:
    if american_odds > 0:
        return american_odds / 100.0
    return 100.0 / abs(american_odds)


def kelly_bet_size(bankroll: float, p: float, american_odds: float) -> float:
    b = american_to_b(american_odds)
    f = kelly_fraction(p, b)
    return f * bankroll


def expected_value(p: float, american_odds: float, stake: float = 1.0) -> float:
    b = american_to_b(american_odds)
    ev_per_unit = b * p - (1.0 - p)
    return ev_per_unit * stake


def get_auc_adj_prob(auc_val: float, p: float) -> float:
    factor = 2 * auc_val - 1
    return 0.5 + (p - 0.5) * factor


# =============================================================================
# EV bet analysis (inference + persistence)
# =============================================================================

def get_ev_bet_analysis(
    bank_roll: float,
    player_data: list,
    team_data: list,
    rows_for_inference: list,
    model_name: str,
    date_str: Optional[str] = None,
):
    if date_str is None:
        date_str = datetime.today().strftime("%Y-%m-%d")

    models = {}
    if model_name == "sbs_nba_ensemble_model_1":
        models = get_all_pipelines_by_bet_type("NBA", model_name, date_str)

    model_aucs = ml_models_collection.find_one({"_id": f"{model_name}_model_auc_results_{date_str}"})["results"]
    model_aucs_mapped = {a["bet_type"]: a["avg_auc"] for a in model_aucs}

    player_id_to_name_map = {p["playerId"]: f"{p['firstname']} {p['lastname']}" for p in player_data}
    team_name_map = {t["teamId"]: t["teamName"] for t in team_data}

    res_rows = []
    for inf_row in rows_for_inference:
        try:
            bet_type = inf_row["bet_type"].iloc[-1]
            model_over = models[bet_type]["over"]
            model_under = models[bet_type]["under"]

            player_id = inf_row["playerId"].iloc[-1]
            player_name = player_id_to_name_map[player_id]

            p_over = model_over.predict_proba(inf_row)[:, 1][0]
            p_under = model_under.predict_proba(inf_row)[:, 1][0]

            p_over_adj = get_auc_adj_prob(model_aucs_mapped[bet_type], p_over)
            p_under_adj = get_auc_adj_prob(model_aucs_mapped[bet_type], p_under)

            over_kelly_stake = kelly_bet_size(bank_roll, p_over_adj, inf_row["over_odds"].iloc[-1])
            under_kelly_stake = kelly_bet_size(bank_roll, p_under_adj, inf_row["under_odds"].iloc[-1])

            res_rows.append(
                {
                    "player_name": player_name,
                    "player_id": player_id,
                    "bet_type": bet_type,
                    "over_prob": p_over,
                    "under_prob": p_under,
                    "adj_over_prob": p_over_adj,
                    "adj_under_prob": p_under_adj,
                    "over_odds": inf_row["over_odds"].iloc[-1],
                    "under_odds": inf_row["under_odds"].iloc[-1],
                    "line": inf_row["over_line"].iloc[-1],
                    "teamName": team_name_map[inf_row["teamId"].iloc[-1]],
                    "teamId": inf_row["teamId"].iloc[-1],
                    "opponentTeamName": team_name_map[inf_row["opponentTeamId"].iloc[-1]],
                    "overKellyStake": over_kelly_stake,
                    "underKellyStake": under_kelly_stake,
                    "overEV": expected_value(p_over_adj, inf_row["over_odds"].iloc[-1], over_kelly_stake),
                    "underEV": expected_value(p_under_adj, inf_row["under_odds"].iloc[-1], under_kelly_stake),
                    "bankroll": bank_roll,
                    "gameId": inf_row["gameId"].iloc[-1],
                    "dateStart": inf_row["dateStart"].iloc[-1],
                    "lineTime": inf_row["line_time"].iloc[-1],
                    "calculatedAt": datetime.utcnow().isoformat(),
                }
            )
        except Exception as e:
            print(f"error creating inference row {e}")

    res_df = pd.DataFrame(res_rows)

    json_data = json.dumps(res_df.to_dict(orient="records"), default=json_serial)
    file_id = fs.put(json_data.encode("utf-8"))

    ml_models_collection.replace_one(
        {"_id": f"sbs_nba_ensemble_model_1_latest_ev_bet_analysis_{date_str}"},
        {"bets": file_id},
        upsert=True,
    )

    mask = res_df[["overKellyStake", "underKellyStake"]].gt(0).any(axis=1)
    return res_df[mask]


# =============================================================================
# Orchestration / entrypoints
# =============================================================================

def populate_training_data_and_trained_models_for_date(date_str: Optional[str] = None):
    training_data_by_bet_type = get_training_date_and_target_dfs_for_sbs_nba_ensemble_model_1(date_str)
    return cache_sbs_nba_ensemble_model_1_trained_pipelines(training_data_by_bet_type, date_str)


def infer_models(bank_roll: float):
    player_data = get_historical_nba_player_aggregated_game_stats_from_season(season, season_type)
    team_data = get_nba_team_aggregated_game_stats_historical(season, season_type)
    raw_training_data = get_cached_sbs_nba_ensemble_model_raw_training_data()
    rows_for_inference = get_inference_rows_for_sbs_nba_ensemble_model_1(player_data, team_data, raw_training_data)
    return get_ev_bet_analysis(bank_roll, player_data, team_data, rows_for_inference, "sbs_nba_ensemble_model_1")


def infer_models_before_date(end_date: str, bank_roll: float = 1000):
    player_data = get_historical_nba_player_aggregated_game_stats_from_season_before_date(season, season_type, end_date)
    team_data = get_nba_team_aggregated_game_stats_historical_before_date(season, season_type, end_date)
    raw_training_data = get_cached_sbs_nba_ensemble_model_raw_training_data(end_date)
    odds_data = get_nba_odds_for_date(end_date)
    rows_for_inference = get_inference_rows_for_sbs_nba_ensemble_model_backtest(
        player_data, team_data, raw_training_data, odds_data, end_date
    )
    return get_ev_bet_analysis(bank_roll, player_data, team_data, rows_for_inference, "sbs_nba_ensemble_model_1", end_date)


# =============================================================================
# Backtesting profit + CSV export
# =============================================================================

def american_profit(odds: float, stake: float, won: bool):
    profit = np.where(
        won & (odds > 0),
        stake * (odds / 100),
        np.where(
            won & (odds < 0),
            stake * (100 / abs(odds)),
            np.where(~won, -stake, 0),
        ),
    )
    return profit


def add_profit_column(results: pd.DataFrame, season: int, season_type: str):
    results = results.copy()
    results["profit"] = 0.0
    failed_indices = []

    for idx, row in results.iterrows():
        try:
            all_player_stats = get_player_stats(season, season_type, row["player_id"], row["teamId"])
            game_stats = all_player_stats[0]["playerStats"][f"{row['gameId']}"]
            bet_type = row["bet_type"]

            metric = {
                "player_points": game_stats["points"],
                "player_assists": game_stats["assists"],
                "player_rebounds": game_stats["totReb"],
                "player_threes": game_stats["tpm"],
                "player_points_rebounds_assists": game_stats["points"] + game_stats["totReb"] + game_stats["assists"],
                "player_points_rebounds": game_stats["points"] + game_stats["totReb"],
                "player_points_assists": game_stats["points"] + game_stats["assists"],
            }.get(bet_type, 0)

            if row["overKellyStake"] > 0:
                won_bet = metric > row["line"]
                stake = row["overKellyStake"]
                odds = row["over_odds"]
            else:
                won_bet = metric < row["line"]
                stake = row["underKellyStake"]
                odds = row["under_odds"]

            profit = american_profit(odds, stake, won_bet)
            results.at[idx, "profit"] = profit

        except Exception:
            failed_indices.append(idx)

    if failed_indices:
        results = results.drop(failed_indices).reset_index(drop=True)

    print(f"✅ Total profit: {results['profit'].sum():.2f}")
    return results


def save_results_to_csv(results: pd.DataFrame, date_str: Optional[str] = None):
    if date_str is None:
        date_str = datetime.today().strftime("%Y-%m-%d")

    folder = "backtest_results"
    file_name = f"{folder}/sbs_nba_ensemble_model_1_results_{date_str}.csv"
    os.makedirs(folder, exist_ok=True)

    results.to_csv(file_name, index=False, encoding="utf-8", float_format="%.2f")


def run_backtest(from_date: str, to_date: str):
    dates = get_date_range(from_date, to_date)
    for date in dates:
        try:
            print(f"running backtest for {date}")
            populate_training_data_and_trained_models_for_date(date)
            results = infer_models_before_date(date)
            results = add_profit_column(results, season, season_type)
            save_results_to_csv(results, date)
            print(f"completed backtest for {date}")
        except Exception as e:
            print(e)

# daily run pipeline
# Globals used by your original notebook entrypoints
season = 2025
season_type = "ALL"

# def get_ev_bet_report_and_persist_to_mongo():
    