import requests
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
import pandas as pd
from collections import defaultdict
from datetime import datetime, timedelta
import pytz

################ Shared Variables #################################################################################################
###################################################################################################################################
# Mongo URI
uri = os.getenv('SBS_V1_MONGO_URI')

# rapidApi headers
headers = {
    'X-RapidAPI-Key': os.getenv('RAPID_API_KEY'),
    'X-RapidAPI-Host': os.getenv('RAPID_API_HOST')
}

client = MongoClient(uri, server_api=ServerApi('1'))
db = client['SBSV1']

try:
    client.admin.command('ping')
    print('Pinged your deployment. You successfully connected to MongoDB!')
except Exception as e:
    print(e)

nba_games_historical_collection = db['nba_games_historical']
nba_team_aggregated_game_stats_historical_collection = db['nba_team_aggregated_game_stats_historical']
nba_game_player_stats_historical_collection = db['nba_game_player_stats_historical']
nba_player_aggregated_game_stats_historical_collection = db['nba_player_aggregated_game_stats_historical']
###################################################################################################################################



################## API FUNCTIONS ################################################################################################## 
###################################################################################################################################

#########################################################
# games by game ids #####################################
def get_team_nicknames_by_id():
    # team code by id
    url = 'https://api-nba-v1.p.rapidapi.com/teams'
    response = requests.get(url, headers=headers).json()['response']
    df = pd.DataFrame(response)
    df = df.loc[(df['nbaFranchise'] == True) & (df['allStar'] == False)]
    
    team_nickname_to_id_map = {}
    
    for index, row in df.iterrows():
        team_nickname_to_id_map.update({row['nickname']: row['id']})
    return team_nickname_to_id_map
#########################################################

#########################################################
# get player per team and season ########################  
def get_player_per_team_and_season(team, season):
    url = 'https://api-nba-v1.p.rapidapi.com/players'
    querystring = {'team': team,'season': season }
    
    df = pd.json_normalize(
        requests.get(url, headers=headers, params=querystring)
        .json()['response']
    )
    
    return df
#########################################################

#########################################################
# games by game ids #####################################
def get_games_by_game_ids(season, team_id):
    url = 'https://api-nba-v1.p.rapidapi.com/games'
    querystring = {'season':season,'team':team_id}

    response = requests.get(url, headers=headers, params=querystring)
    df = pd.json_normalize(
        requests.get(url, headers=headers, params=querystring)
        .json()['response']
    )
    df = df.loc[(df['status.long'] == 'Finished')]
    df = df.sort_values(by=['date.start'])
    
    return drop_cols(df, cols_to_drop_for_game_stats)
#########################################################

#########################################################
# games by date #########################################
def get_games_by_date(date):
    url = 'https://api-nba-v1.p.rapidapi.com/games'
    querystring = {'date': date}

    response = requests.get(url, headers=headers, params=querystring)
    df = pd.json_normalize(
        requests.get(url, headers=headers, params=querystring)
        .json()['response']
    )
    
    if df.empty:
        return df
        
    df = df.loc[(df['status.long'] == 'Finished')]
    df = df.sort_values(by=['date.start'])
    
    return drop_cols(df, cols_to_drop_for_game_stats)
#########################################################

#########################################################
# insert player stats for each game #####################
def get_players_per_game_df(game_id):    
    url = 'https://api-nba-v1.p.rapidapi.com/players/statistics'
    querystring = {'game': game_id }
    
    df = pd.json_normalize(
        requests.get(url, headers=headers, params=querystring)
        .json()['response']
    )
    return drop_cols(df, cols_to_drop_for_player_stats)
#########################################################
###################################################################################################################################



################## util functions #################################################################################################
###################################################################################################################################

#########################################################
# get_list_of_dates_between_dates_inclusive #############
def get_list_of_dates_between_dates_inclusive(from_date, to_date):
    # Convert the date strings to datetime objects
    from_date = datetime.strptime(from_date, "%Y-%m-%d")
    to_date = datetime.strptime(to_date, "%Y-%m-%d")
    
    # Create a list of dates between start_date and end_date (inclusive)
    date_list = [(from_date + timedelta(days=i)).strftime("%Y-%m-%d")
        for i in range((to_date - from_date).days + 1)]
    return date_list
#########################################################

########################################################
# get season type given season and date ################
# date as iso string format
def get_season_types_given_season_and_date(season, date):
    dates = nba_season_dates_map.get(season)

    regular_season_start = dates.get('regular_season_start')
    regular_season_end = dates.get('regular_season_end')
    playoff_season_start = dates.get('playoff_season_start')
    playoff_season_end = dates.get('playoff_season_end')
    all_season_start = dates.get('all_season_start')
    all_season_end = dates.get('all_season_end')

    applicable_seasons = []
    if regular_season_start <= date <= regular_season_end:
        applicable_seasons.append('REGULAR')
    if playoff_season_start <= date <= playoff_season_end:
        applicable_seasons.append('PLAYOFF')
    if all_season_start <= date <= all_season_end:
        applicable_seasons.append('ALL')

    return applicable_seasons
#########################################################

########################################################
# parse linescore ######################################
def parse_linescore(linescore):
    int_linescore = [-1,-1,-1,-1]
    for idx, str_score in enumerate(linescore):
        try:
            int_score = int(str_score)
            int_linescore[idx] = int_score
        except Exception as e:
            print('failure to convert linescore', e)
        
    return int_linescore
#########################################################

#########################################################
# Function to convert dot-separated to camelCase ########
def to_camel_case(s, split):
    parts = s.split(split)
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])
#########################################################

#########################################################
# Function to recursively rename fields in a document and remove fields with periods
def rename_and_remove_fields(doc, split):
    if isinstance(doc, dict):
        new_doc = {}
        for key, value in doc.items():
            if split in key:
                new_key = to_camel_case(key, split)
                if isinstance(value, (dict, list)):
                    value = rename_and_remove_fields(value, split)
                new_doc[new_key] = value
            else:
                if isinstance(value, (dict, list)):
                    value = rename_and_remove_fields(value, split)
                new_doc[key] = value
        return new_doc
    elif isinstance(doc, list):
        return [rename_and_remove_fields(item, split) for item in doc]
    return doc
#########################################################

#########################################################
# drop cols from a df ###################################
def drop_cols(df, cols):
    for col in cols:
        filtered_df = df
        try:
            filtered_df = df.drop(col, axis=1)
        except Exception as e:
            print('unable to drop col: ', e)
        df = filtered_df
    return df
#########################################################

#########################################################
# get dot separated keys ################################
def get_dot_separated_keys(document):
    dot_keys = [key for key in document if '.' in key]
    return dot_keys
#########################################################

#########################################################
# get nested dict #######################################
def nest_dict(flat_dict, split):
    nested_dict = {}
    for key, value in flat_dict.items():
        parts = key.split(split)
        d = nested_dict
        for part in parts[:-1]:
            if part not in d:
                d[part] = {}
            d = d[part]
        d[parts[-1]] = value
    return nested_dict
# Example
# nested_json = [nest_dict(record, split) for record in df.to_dict(orient='records')]
#########################################################

#########################################################
## zero non numeric values #############################
def zero_non_numeric_values(df):
    return df.apply(pd.to_numeric, errors='coerce').fillna(0)
#########################################################

#########################################################
# rename player stats cols ##############################
def rename_col(col, new_prefix):
    l = col.split('.')
    if (len(l) > 1):
        return f"{new_prefix}.{l[1]}"
    return new_prefix
#########################################################

#########################################################
# remove prefix #########################################
def remove_prefix_from_col(col):
    l = col.split('.')
    if (len(l) > 1):
        return f"{l[1]}"
    return l[0]
#########################################################

#########################################################
# transform list of obj into a dict mapped by key in obj
def transform_list_to_dict(objs, key):
    d = { obj[key]: obj for obj in objs }
    return { str(key): value for key, value in d.items() }
#########################################################

#########################################################
# rename all fields in collection #######################
def rename_all_fields_in_collection(collection, split):
    # Retrieve all documents from the collection
    documents = collection.find()

    # Update each document
    for doc in documents:
        # Get the document ID
        doc_id = doc['_id']

        # Rename and remove fields
        updated_doc = rename_and_remove_fields(doc, split)

        # Remove old fields that contain periods
        update_operations = {
            '$set': updated_doc,
            '$unset': {key: '' for key in doc.keys() if split in key}
        }

        # Save the updated document back to the collection
        collection.update_one({'_id': doc_id}, update_operations)

    print('Fields containing periods renamed to camelCase or removed successfully.')
#########################################################

#########################################################
# remove all dot separated keys #########################
def remove_all_dot_separated_keys(collection):
    # Find all documents in the collection
    documents = collection.find()

    for document in documents:
        doc_id = document['_id']
        dot_keys = get_dot_separated_keys(document)

        if dot_keys:
            unset_query = {key: '' for key in dot_keys}
            # Remove the dot-separated keys from the document
            collection.update_one({'_id': doc_id}, {'$unset': unset_query})

    print('Dot-separated keys have been removed.')
#########################################################  

#########################################################
# update entire collection ##############################
def update_entire_collection(collection, update):
    result = collection.update_many({}, update)
    print(result)
# example: update_entire_collection(nba_player_aggregated_game_stats_historical_collection, { '$set': { 'season': 2023 }})
#########################################################

#########################################################
# get mongo pipeline to load player stats per season ####
def get_mongo_pipeline_for_player_stats_per_season(team_id, player_id, season, date_start, date_end):
    return [
        {
            '$match': {
                '$and': [
                    { 'dateStart': { '$gte': date_start } }, 
                    { 'dateStart': { '$lte': date_end } },
                ], 
                '$or': [
                    { 'teamsHomeId': team_id },
                    { 'teamsVisitorsId': team_id }
                ]
            }
        },
        {
            '$project': {
                'teamsHomePlayers': {
                    '$filter': {
                        'input': {'$objectToArray': '$teamsHomePlayers'},
                        'as': 'player',
                        'cond': {'$eq': ['$$player.k', str(player_id) ]}
                    }
                },
                'teamsVisitorsPlayers': {
                    '$filter': {
                        'input': {'$objectToArray': '$teamsVisitorsPlayers'},
                        'as': 'player',
                        'cond': {'$eq': ['$$player.k', str(player_id) ]}
                    }
                },
                'dateStart': 1
            }
        },
        {
            '$match': {
                '$or': [
                    {'teamsHomePlayers': {'$ne': []}},
                    {'teamsVisitorsPlayers': {'$ne': []}}
                ]
            }
        },
        {
            '$project': {
                '_id': 0,
                'playerStats': {
                    '$cond': {
                        'if': {'$gt': [{'$size': '$teamsHomePlayers'}, 0]},
                        'then': {'$arrayElemAt': ['$teamsHomePlayers.v', 0]},
                        'else': {'$arrayElemAt': ['$teamsVisitorsPlayers.v', 0]}
                    }
                },
                'dateStart': 1
            }
        }
    ]
#########################################################

#########################################################
# get mongo pipeline to load game stats per season ######
def get_mongo_pipeline_to_load_game_stats_per_team(team_id, season, start_date, end_date):
    return [
        {
            "$match": { 
                "season": season,
                "$and": [
                    { "dateStart": { "$gte": start_date } },
                    { "dateStart": { "$lte": end_date } }
                ],
                "$or": [
                    { "teamsVisitorsId": team_id }, 
                    { "teamsHomeId": team_id } 
                ]
            }
        },
        {
            "$sort": { "dateStart": 1 }
        }
    ]
#########################################################
###################################################################################################################################



#################### constants ####################################################################################################
###################################################################################################################################
nba_season_dates_map = {
    2022: {
        'regular_season_start': '2022-11-18',
        'regular_season_end': '2023-04-09', 
        'playoff_season_start': '2023-04-15',
        'playoff_season_end': '2023-06-18',
        'all_season_start': '2022-11-18',
        'all_season_end': '2023-06-18',
    },
    2023: {
        'regular_season_start': '2023-10-24',
        'regular_season_end': '2024-04-14', 
        'playoff_season_start': '2024-04-20',
        'playoff_season_end': '2024-06-20',
        'all_season_start': '2023-10-24',
        'all_season_end': '2024-06-20',
    },
    2024: {
        'regular_season_start': '2024-10-22',
        'regular_season_end': '2025-04-13', 
        'playoff_season_start': '2025-04-19',
        'playoff_season_end': '2025-06-30',
        'all_season_start': '2024-10-22',
        'all_season_end': '2025-06-30',
    },
    2025: {
        'regular_season_start': '2025-10-21',
        'regular_season_end': '2026-04-12', 
        'playoff_season_start': '2026-04-14',
        'playoff_season_end': '2026-06-30', # placeholder
        'all_season_start': '2025-10-21',
        'all_season_end': '2026-06-30', # placeholder
    }
}

cols_to_drop_for_game_stats = [
    'stage',
    'officials',
    'timesTied',
    'leadChanges',
    'nugget',
    'date.end',
    'date.duration',
    'status.clock',
    'status.halftime',
    'status.short',
    'status.long',
    'periods.current',
    'periods.total',
    'periods.endOfPeriod',
    'arena.name',
    'arena.city',
    'arena.state',
    'arena.country',
    'teams.home.logo',
    'scores.home.series.win',
    'scores.home.series.loss',
    'scores.home.win',
    'scores.home.loss',
    'teams.visitors.logo',
    'scores.visitors.series.win',
    'scores.visitors.series.loss',
    'scores.visitors.win',
    'scores.visitors.loss',
]

cols_to_drop_for_player_stats = [
    'comment',
    'team.nickname',
    'team.code',
    'team.name',
    'team.logo',
]

player_statistical_columns = [
    'playerStats.points',
    'playerStats.min', 
    'playerStats.fgm', 
    'playerStats.fga',
    'playerStats.fgp', 
    'playerStats.ftm', 
    'playerStats.fta',
    'playerStats.ftp', 
    'playerStats.tpm', 
    'playerStats.tpa',
    'playerStats.tpp', 
    'playerStats.offReb', 
    'playerStats.defReb',
    'playerStats.totReb', 
    'playerStats.assists', 
    'playerStats.pFouls',
    'playerStats.steals', 
    'playerStats.turnovers', 
    'playerStats.blocks',
    'playerStats.plusMinus'
]

game_statistical_columns = [
    'points', 
    'linescoreQ1', 
    'linescoreQ2', 
    'linescoreQ3', 
    'linescoreQ4'
]

#########################################################
###################################################################################################################################



############### nba_games_historical ##############################################################################################
###################################################################################################################################

#########################################################
# parse nba games response from nba api #################
def get_games_mongo_objs_from_nba_games_raw_dict(raw_dict):
    flat_games_data_dict = []
    for row in raw_dict:
        flat_games_data_dict.extend(row)

    deduped_dict = {}
    for item in flat_games_data_dict:
        deduped_dict[item['_id']] = item
    flat_games_data_dict = list(deduped_dict.values())
    
    game_data_to_insert = []
    for d in flat_games_data_dict:
        game_data_to_insert.append(rename_and_remove_fields(d, '.'))

    for obj in game_data_to_insert:
        obj['scoresVisitorsLinescore'] = parse_linescore(obj.get('scoresVisitorsLinescore'))
        obj['scoresHomeLinescore'] = parse_linescore(obj.get('scoresHomeLinescore'))

    return game_data_to_insert
#########################################################

#########################################################
# load games data into nba_games_historical #############
def load_nba_games(season):    
    games_data_dict = []
    for team, team_id in get_team_nicknames_by_id().items():
        games_df = get_games_by_game_ids(season, team_id)
        games_df['_id'] = games_df['id']
        games_data_dict.append(games_df.to_dict('records'))

    game_data_to_insert = get_games_mongo_objs_from_nba_games_raw_dict(games_data_dict)

    # Insert the data into the MongoDB collection
    result = nba_games_historical_collection.insert_many(game_data_to_insert)

    # Print the inserted IDs
    print('Inserted IDs:', result.inserted_ids)
#########################################################

#########################################################
# populate nba games to date ############################
def populate_missing_nba_games_to_date():
    # get latest date game available
    try:
        latest_start_date_in_collection = list(
            nba_games_historical_collection.aggregate(
                [
                    { '$sort': { 'dateStart': -1 } },
                    { '$limit': 1 },
                    { '$project': { 'dateStart': 1, '_id': 0 } }
                ]
            )
        )[0]['dateStart'].split('T')[0] # gross syntax sorry 'dateStart' is in iso format '2023-10-10T23:30:00.000Z'
    except Exception as e:
        print(e)
        print('does not have a dateStart field!')
        return []

    # Define the EST timezone
    est = pytz.timezone('US/Eastern')
    # Get the current date and time in EST
    current_time_est = datetime.now(est)
    # Format the date as "YYYY-MM-DD"
    today_date = current_time_est.strftime("%Y-%m-%d")
    date_list = get_list_of_dates_between_dates_inclusive(latest_start_date_in_collection, today_date)

    games_data_dict = []
    for date in date_list:
        games_df = get_games_by_date(date)
        if not games_df.empty:
            games_df['_id'] = games_df['id']
            games_data_dict.append(games_df.to_dict('records'))

    objs = get_games_mongo_objs_from_nba_games_raw_dict(games_data_dict)

    game_ids_inserted = []
    for obj in objs:
        game_ids_inserted.append(obj.get('id'))
        try:
            result = nba_games_historical_collection.insert_one(obj)
            print(result)
        except Exception as e:
            print(e)

    return game_ids_inserted
#########################################################
###################################################################################################################################



###### nba_team_aggregated_game_stats_historical ##################################################################################
###################################################################################################################################

# DEPRECATED
#########################################################
# calculate game rolling stats averages #################
def calculate_game_rolling_averages(df, window):
    # Calculate the rolling average for the selected columns
    try:
        numerical_cols = zero_non_numeric_values(df[game_statistical_columns])
        rolling_avgs = numerical_cols.rolling(window=window, min_periods=1).mean()
    except Exception as e:
        print(e)
        print(df)

    rolling_avgs = pd.concat([rolling_avgs, df[['gameId', 'dateStart']]], axis=1)
    
    return rolling_avgs
#########################################################

# DEPRECATED
#########################################################
# calculate game expanding stats averages #############
def calculate_game_expanding_averages(df):
    # Calculate the rolling average for the selected columns
    try:
        numerical_cols = zero_non_numeric_values(df[game_statistical_columns])
        expanding_avgs = numerical_cols.expanding().mean()
    except Exception as e:
        print(e)
        print(df)

    expanding_avgs = pd.concat([expanding_avgs, df[['gameId', 'dateStart']]], axis=1)

    return expanding_avgs
#########################################################

#########################################################
# map nba_games_historical obj to team with team specific fields
def map_nba_games_historical_obj_to_game_stats_obj(obj, team_id):
    new_obj = {}
    if (obj['teamsHomeId'] == team_id):
        new_obj['teamId'] = obj['teamsHomeId']
        new_obj['teamName'] = obj['teamsHomeName']
        new_obj['teamNickname'] = obj['teamsHomeNickname']
        new_obj['linescore'] = obj['scoresHomeLinescore']
        new_obj['points'] = obj['scoresHomePoints']
        new_obj['win'] = obj['scoresHomePoints'] > obj['scoresVisitorsPoints']
        new_obj['isHome'] = True
        new_obj['opponentTeamId'] = obj['teamsVisitorsId']
    else: 
        new_obj['teamId'] = obj['teamsVisitorsId']
        new_obj['teamName'] = obj['teamsVisitorsName']
        new_obj['teamNickname'] = obj['teamsVisitorsNickname']
        new_obj['linescore'] = obj['scoresVisitorsLinescore']
        new_obj['points'] = obj['scoresVisitorsPoints']
        new_obj['win'] = obj['scoresVisitorsPoints'] > obj['scoresHomePoints']
        new_obj['isHome'] = False
        new_obj['opponentTeamId'] = obj['teamsHomeId']
    new_obj['dateStart'] = obj['dateStart']
    new_obj['gameId'] = obj['id']    
    return new_obj

#########################################################
# aggregate game stats data into nba_team_aggregated_game_stats_historical
def aggregate_nba_game_stats_for_team(team_id, season, start_date, end_date, season_type):
    # getting all game objs for team
    nba_games_historical_objs = list(
        nba_games_historical_collection.aggregate(
            get_mongo_pipeline_to_load_game_stats_per_team(team_id, season, start_date, end_date)
        )
    )

    if (len(nba_games_historical_objs) == 0):
        return None

    # project and rename team specific fields
    mapped_objs = list(
        map(lambda obj: map_nba_games_historical_obj_to_game_stats_obj(obj, team_id), nba_games_historical_objs)
    )

    game_stats_df = pd.DataFrame(mapped_objs)

    aggregated_team_game_stats_doc = {}
    aggregated_team_game_stats_doc['_id'] = f'{team_id}-{season}-{season_type}'
    aggregated_team_game_stats_doc['teamId'] = team_id
    aggregated_team_game_stats_doc['season'] = season
    aggregated_team_game_stats_doc['seasonType'] = season_type
    aggregated_team_game_stats_doc['teamName'] = game_stats_df.iloc[0]['teamName']
    aggregated_team_game_stats_doc['teamNickname'] = game_stats_df.iloc[0]['teamNickname']
    game_stats_df = drop_cols(game_stats_df, ['teamName', 'teamNickname'])
    aggregated_team_game_stats_doc['gameStats'] = transform_list_to_dict(game_stats_df.to_dict(orient='records'), 'gameId')
    return aggregated_team_game_stats_doc
#########################################################       

#########################################################
# aggregate game stats data into nba_team_aggregated_game_stats_historical
def load_nba_team_aggregated_game_stats(season, start_date, end_date, season_type):
    # get all nba teams
    team_ids = nba_games_historical_collection.distinct("teamsHomeId")
    for team_id in team_ids:
        aggregated_team_game_stats = aggregate_nba_game_stats_for_team(team_id, season, start_date, end_date, season_type)
        if (aggregated_team_game_stats is not None):
            nba_team_aggregated_game_stats_historical_collection.update_one(
                {'_id': aggregated_team_game_stats['_id']},  # Filter by unique identifier
                {'$set': aggregated_team_game_stats},        # Replace the entire document or insert it if not found
                upsert=True
            )
#########################################################

#########################################################
# populate nba game stats avgs for game ids #############
def populate_nba_game_stats_for_game_ids(game_ids):
    games = list(nba_games_historical_collection.find({ 'id': { '$in': game_ids }}))

    # dicts 
    game_id_to_season_dict = { game.get('id'): game.get('season') for game in games }
    game_id_to_applicable_season_dict = {}
    team_id_to_game_stats_dict = {}

    # iterate through games and create the game stats object
    for game in games:
        game_id_to_applicable_season_dict[game.get('id')] = get_season_types_given_season_and_date(
            game.get('season'), 
            game.get('dateStart')
        )
        
        team_home_id = game.get('teamsHomeId')
        team_visitors_id = game.get('teamsVisitorsId')
        home_game_stats = map_nba_games_historical_obj_to_game_stats_obj(game, team_home_id)
        visitor_game_stats = map_nba_games_historical_obj_to_game_stats_obj(game, team_visitors_id)
        
        del home_game_stats['teamName']
        del home_game_stats['teamNickname']
        del visitor_game_stats['teamName']
        del visitor_game_stats['teamNickname']
        
        team_id_to_game_stats_dict[team_home_id] = home_game_stats
        team_id_to_game_stats_dict[team_visitors_id] = visitor_game_stats

    # find applicable season given game date and append games stats to existing object 
    inserted_game_ids = []
    for team_id, game_stats_obj in team_id_to_game_stats_dict.items():
        game_id = game_stats_obj.get('gameId')
        applicable_seasons = game_id_to_applicable_season_dict.get(game_id)    
        current_game_stats_list = list(nba_team_aggregated_game_stats_historical_collection.find({ 'teamId': team_id }))
        current_game_stats_mapped_by_season_type = { obj['seasonType']: obj for obj in current_game_stats_list }
        for season_type in applicable_seasons:
            current_game_stats_obj = current_game_stats_mapped_by_season_type.get(season_type)
            if current_game_stats_obj is not None:
                season = game_id_to_season_dict.get(game_id)
                res = nba_team_aggregated_game_stats_historical_collection.update_one(
                    { '_id': f"{team_id}-{season}-{season_type}" },
                    {
                        '$set': {
                            f"gameStats.{game_id}": game_stats_obj    
                        }
                    },
                    upsert=True
                )
                print(res) 
#########################################################
###################################################################################################################################



##### nba_player_aggregated_game_stats_historical #################################################################################
###################################################################################################################################

#########################################################
# populate_missing_nba_player_aggregated_game_stats_historical
def populate_missing_nba_player_aggregated_game_stats_historical(game_ids):
    game_player_stats = list(nba_game_player_stats_historical_collection.find({ '_id': { '$in': game_ids }}))

    for obj in game_player_stats:
        player_stats_list = [obj.get('teamsHomePlayers').values(), obj.get('teamsVisitorsPlayers').values()]
        player_stats_list_flat = [player for player_list in player_stats_list for player in player_list]
        for player_stats in player_stats_list_flat:
            player_id = player_stats.get('playerId')
            game_id = player_stats.get('gameId')
            team_id = player_stats.get('teamId')
            opponent_team_id = player_stats.get('opponentTeamId')
            is_home = player_stats.get('isHome')
            pos = player_stats.get('pos')
            win = player_stats.get('win')
            date_start = obj.get('dateStart')
            season = obj.get('season')

            player_stats_df = pd.DataFrame(player_stats, index=[0])
            non_prefaced_player_statistical_columns = [clean_col.split('.')[1] for clean_col in player_statistical_columns]
            player_stats_df = zero_non_numeric_values(player_stats_df[non_prefaced_player_statistical_columns])
            
            player_stats_to_upsert = player_stats_df.to_dict(orient='records')[0]
            player_stats_to_upsert['gameId'] = game_id
            player_stats_to_upsert['dateStart'] = date_start
            player_stats_to_upsert['isHome'] = is_home
            player_stats_to_upsert['win'] = win
            player_stats_to_upsert['playerId'] = player_id 
            player_stats_to_upsert['teamId'] = team_id
            player_stats_to_upsert['opponentTeamId'] = opponent_team_id
            applicable_season_types = get_season_types_given_season_and_date(season, date_start)
            
            for season_type in applicable_season_types:
                res = nba_player_aggregated_game_stats_historical_collection.update_one(
                    { '_id': f"{player_id}_{team_id}_{season}_{season_type}" },
                    {
                        '$set': {
                            f"playerStats.{game_id}": player_stats_to_upsert, 
                            'pos': pos
                        },
                        "$setOnInsert": {              # Fields to include if inserting a new document
                            'playerId': player_stats['playerId'],
                            'teamId': team_id,
                            'season': season,
                            'seasonType': season_type,
                            'firstname': player_stats['playerFirstname'],
                            'lastname': player_stats['playerLastname'],
                        }
                    },
                    upsert=True
                )
                print(res)        
#########################################################

# DEPRECATED
#########################################################
# calculate player rolling stats averages ###############
def calculate_player_rolling_averages(df, window):
    # Calculate the rolling average for the selected columns
    try:
        numerical_cols = zero_non_numeric_values(df[player_statistical_columns])
        rolling_avgs = numerical_cols.rolling(window=window, min_periods=1).mean()
    except Exception as e:
        print(e)
        print(df)

    rolling_avgs = pd.concat([rolling_avgs, df[['playerStats.gameId', 'dateStart']]], axis=1)
    
    # Rename the columns to indicate they are rolling averages
    rolling_avgs = rolling_avgs.rename(columns=lambda x: remove_prefix_from_col(x))
    
    return rolling_avgs
#########################################################

# DEPRECATED
#########################################################
# calculate player expanding stats averages #############
def calculate_player_expanding_averages(df):
    # Calculate the rolling average for the selected columns
    try:
        numerical_cols = zero_non_numeric_values(df[player_statistical_columns])
        expanding_avgs = numerical_cols.expanding().mean()
    except Exception as e:
        print(e)
        print(df)

    expanding_avgs = pd.concat([expanding_avgs, df[['playerStats.gameId', 'dateStart']]], axis=1)
    expanding_avgs = expanding_avgs.rename(columns=lambda x: remove_prefix_from_col(x))

    return expanding_avgs
#########################################################

#########################################################
# aggregate game stats for player #######################
def aggregate_player_stats_for_player(player_obj, team_id, season, start_date, end_date, season_type):
    player_doc = { 
        '_id': f"{player_obj['id']}_{team_id}_{season}_{season_type}", 
        'playerId': player_obj['id'],
        'teamId': team_id,
        'season': season,
        'seasonType': season_type,
        'firstname': player_obj['firstname'],
        'lastname': player_obj['lastname'],
        'birthday': player_obj['birth.date'],
        'countryOfBirth': player_obj['birth.country']
    }
    
    pipeline = get_mongo_pipeline_for_player_stats_per_season(team_id, player_obj['id'], season, start_date, end_date)
    player_games = list(nba_game_player_stats_historical_collection.aggregate(pipeline))

    # short circuit for when season hasn't started i.e. playoffs
    if len(player_games) == 0:
        return None
        
    normalized_df = pd.json_normalize(player_games) 
    
    try:
        player_stats_numerical_cols = zero_non_numeric_values(normalized_df[player_statistical_columns])
        player_stats = pd.concat([player_stats_numerical_cols, normalized_df[['playerStats.gameId', 'dateStart', 'playerStats.win','playerStats.isHome', 'playerStats.teamId', 'playerStats.opponentTeamId', 'playerStats.playerId']]], axis=1)
        player_stats = player_stats.rename(columns=lambda x: remove_prefix_from_col(x))
    except Exception as e:
        print(f"ERROR Parsing Player Data for: {player_obj['firstname']} {player_obj['lastname']}")
        print('Error: ', e)
        return None
    player_doc['pos'] = normalized_df.iloc[0]['pos'] if not normalized_df.empty else None    
    player_doc['playerStats'] = transform_list_to_dict(player_stats.to_dict(orient='records'), 'gameId')
    return player_doc
#########################################################

#########################################################
# aggregate player stats for team #######################
def aggregate_player_stats_per_team(team_id, season, start_date, end_date, season_type):
    player_data = get_player_per_team_and_season(team_id, season)
    all_players = []   
    for index, player in player_data.iterrows():
        player_stats = aggregate_player_stats_for_player(player, team_id, season, start_date, end_date, season_type)
        if player_stats is not None:      
            all_players.append(player_stats)
    return all_players
#########################################################

#########################################################
# load player agg stats per game ########################
def load_player_agg_game_stats_for_season(season, start_date, end_date, season_type):
    teams = get_team_nicknames_by_id()
    for team_nickname, team_id in teams.items():
        aggregated_player_stats = aggregate_player_stats_per_team(team_id, season, start_date, end_date, season_type)
        if len(aggregated_player_stats) > 0: 
            nba_player_aggregated_game_stats_historical_collection.insert_many(aggregated_player_stats)
########################################################
###################################################################################################################################

########### nba_game_player_stats_historical ######################################################################################
###################################################################################################################################

#########################################################
# populate_missing_nba_game_player_stats_historical #####
def populate_missing_nba_game_player_stats_historical_to_date():
    # get latest date available from nba_game_player_historical collection
    try:
        latest_start_date_in_collection = list(
            nba_game_player_stats_historical_collection.aggregate(
                [
                    { '$sort': { 'dateStart': -1 } },
                    { '$limit': 1 },
                    { '$project': { 'dateStart': 1, '_id': 0 } }
                ]
            )
        )[0]['dateStart'].split('T')[0] # gross syntax sorry 'dateStart' is in iso format '2023-10-10T23:30:00.000Z'
    except Exception as e:
        print(e)
        print('does not have a dateStart field!')
        return []
    
    # then get all the gameIds available from nba_games_historical 
    games = list(nba_games_historical_collection.find({
        'dateStart': { '$gte': latest_start_date_in_collection } 
    }))

    game_player_stats = map_nba_games_objs_to_nba_game_player_stats_objs(games)
    
    for stats in game_player_stats:
        nba_game_player_stats_historical_collection.update_one(
            { '_id': stats.get('_id') },
            { '$set': stats },
            upsert=True
        )

    # return inserted id's so we for the daily nba_player_aggregated_game_stats_historical_loader
    return [ stats.get('_id') for stats in game_player_stats ]
#########################################################

#########################################################
# get game ids for season ###############################
def get_games_for_season(season):
    return nba_games_historical_collection.find({ 'season': season })
#########################################################

#########################################################
# map_nba_games_objs_to_nba_game_player_stats_objs
def map_nba_games_objs_to_nba_game_player_stats_objs(games):
    all_player_stats_per_game = []
    for game in games:
        game_id = game['_id']
        try:
            home_team_id = game['teamsHomeId']
            visitors_team_id = game['teamsVisitorsId']
            did_home_team_win = game['scoresHomePoints'] > game['scoresVisitorsPoints']
            players_dict_list = get_players_per_game_df(game_id).to_dict('records')
    
            # Initialize a defaultdict
            players_grouped_by_team = defaultdict(list)
            # Group the data
            for item in players_dict_list:
                players_grouped_by_team[item['team.id']].append(item)
            players_grouped_by_team['teamsHomePlayers'] = players_grouped_by_team.pop(home_team_id)
            for player in players_grouped_by_team['teamsHomePlayers']:
                player['isHome'] = True
                player['win'] = did_home_team_win
                player['opponentTeamId'] = visitors_team_id
            players_grouped_by_team['teamsHomePlayers'] = transform_list_to_dict(players_grouped_by_team['teamsHomePlayers'], 'player.id')
            players_grouped_by_team['teamsVisitorsPlayers'] = players_grouped_by_team.pop(visitors_team_id)
            for player in players_grouped_by_team['teamsVisitorsPlayers']:
                player['isHome'] = False
                player['win'] = not did_home_team_win
                player['opponentTeamId'] = home_team_id
            players_grouped_by_team['teamsVisitorsPlayers'] = transform_list_to_dict(players_grouped_by_team['teamsVisitorsPlayers'], 'player.id')
            players_grouped_by_team['teamsHomeId'] = home_team_id
            players_grouped_by_team['teamsVisitorsId'] = visitors_team_id
            players_grouped_by_team['season'] = game['season']
            players_grouped_by_team['dateStart'] = game['dateStart']
            players_grouped_by_team['_id'] = game_id
            all_player_stats_per_game.append(rename_and_remove_fields(players_grouped_by_team, '.'))
        except Exception as e:
            print(f'unable to get players stats for game: {game_id}')
        
    return all_player_stats_per_game
#########################################################

#########################################################
# load player game data into nba_game_player_stats_historical
def load_nba_game_player_stats_for_season(season):
    games = get_games_for_season(season)
    all_player_stats_per_game = map_nba_games_objs_to_nba_game_player_stats_objs(games)
    result = nba_game_player_stats_historical_collection.insert_many(all_player_stats_per_game)
    
    # Print the inserted IDs
    print('Inserted IDs:', result.inserted_ids)
#########################################################
###################################################################################################################################



#########################################################
# init_nba_games_historical #############################
def init_nba_games_historical(season):
    load_nba_games(season)
#########################################################

#########################################################
# init_nba_team_aggregated_game_stats_historical ########
def init_nba_team_aggregated_game_stats_historical(season, start_date, end_date, season_type):
    load_nba_team_aggregated_game_stats(season, start_date, end_date, season_type)
#########################################################

#########################################################
# init_nba_player_aggregated_game_stats_historical ######
def init_nba_player_aggregated_game_stats_historical(season, start_date, end_date, season_type):
    load_player_agg_game_stats_for_season(season, start_date, end_date, season_type)
#########################################################

#########################################################
# init_nba_game_player_stats ############################
def init_nba_game_player_stats(season):
    load_nba_game_player_stats_for_season(season)
#########################################################


#########################################################
# load all nba team aggregated game stats for season ####
def init_all_nba_team_aggregated_game_stats_for_season(season):
    season_dates = nba_season_dates_map.get(season)
    regular_season_start = season_dates.get('regular_season_start')
    regular_season_end = season_dates.get('regular_season_end')
    playoff_season_start = season_dates.get('playoff_season_start')
    playoff_season_end = season_dates.get('playoff_season_end')
    all_season_start = season_dates.get('all_season_start')
    all_season_end = season_dates.get('all_season_end')
    
    # regular season
    init_nba_team_aggregated_game_stats_historical(season, regular_season_start, regular_season_end, 'REGULAR')
    
    # playoffs
    init_nba_team_aggregated_game_stats_historical(season, playoff_season_start, playoff_season_end, 'PLAYOFF')
    
    # all
    init_nba_team_aggregated_game_stats_historical(season, all_season_start, all_season_end, 'ALL')
#########################################################

#########################################################
# load all nba team aggregated game stats for season ####
def init_all_nba_player_aggregated_game_stats_for_season(season):
    season_dates = nba_season_dates_map.get(season)
    regular_season_start = season_dates.get('regular_season_start')
    regular_season_end = season_dates.get('regular_season_end')
    playoff_season_start = season_dates.get('playoff_season_start')
    playoff_season_end = season_dates.get('playoff_season_end')
    all_season_start = season_dates.get('all_season_start')
    all_season_end = season_dates.get('all_season_end')
    
    # regular season
    init_nba_player_aggregated_game_stats_historical(season, regular_season_start, regular_season_end, 'REGULAR')
    
    # playoffs
    init_nba_player_aggregated_game_stats_historical(season, playoff_season_start, playoff_season_end, 'PLAYOFF')
    
    # all
    init_nba_player_aggregated_game_stats_historical(season, all_season_start, all_season_end, 'ALL')
#########################################################



###################################################################################################################################
# historical and daily loaders to be used for AWS Lambda ##########################################################################

# NOTE: game stats loaders must be loaded before player stats loaders as
# player stats loaders depend on game stats collections 

def run_nba_historical_games_data_loader(season):
    print('running NBA historical data loader') 
    init_nba_games_historical(season)
    print('completed NBA game data load') 
    print('running NBA team aggregated game stats historical data loader') 
    init_all_nba_team_aggregated_game_stats_for_season(season)
    print('completed NBA game data load') 
    
def run_nba_daily_games_data_loader():
    print('running NBA daily game data loader')
    game_ids = populate_missing_nba_games_to_date()
    print(f"loaded games with ids: {game_ids}") 
    if len(game_ids) > 0:
        populate_nba_game_stats_for_game_ids(game_ids)
    print("complete")

def run_nba_historical_player_data_loader(season):
    print('running NBA historical player data loader') 
    init_nba_game_player_stats(season)
    print('completed NBA player data load') 
    print('running NBA aggregated player stats historical data loader') 
    init_all_nba_player_aggregated_game_stats_for_season(season)
    print('completed NBA player data load') 

def run_nba_daily_player_data_loader():
    print('running NBA daily player data loader')
    game_ids = populate_missing_nba_game_player_stats_historical_to_date()
    print(f"loaded game player stats with game ids: {game_ids}") 
    if len(game_ids) > 0:
        populate_missing_nba_player_aggregated_game_stats_historical(game_ids)
    print("complete")
###################################################################################################################################