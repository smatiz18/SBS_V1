import os
import requests
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta
import json
import copy

# odds api key
api_key = os.getenv('ODDS_API_KEY')
root = 'https://api.the-odds-api.com/v4/'

# Mongo 
uri = os.getenv('SBS_V1_MONGO_URI')

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['SBSV1']
nba_games_historical_collection = db['nba_games_historical']
nba_odds_historical_collection = db['nba_odds_historical']
nba_game_player_stats_historical_collection = db['nba_game_player_stats_historical']
nba_player_aggregated_game_stats_historical_collection = db['nba_player_aggregated_game_stats_historical']
nba_player_aggregated_odds_historical_collection = db['nba_player_aggregated_odds_historical']




################ markets reference ######################
#########################################################

nba_team_market = [
    'h2h',
    'spreads',
    'totals'
]

nba_team_market_str = ','.join(nba_team_market)

nba_player_markets = [
    'player_points',
    'player_rebounds',
    'player_assists',
    'player_threes',
    'player_points_rebounds_assists',
    'player_points_rebounds',
    'player_points_assists',
    'player_rebounds_assists',
]

nba_player_markets_str = ','.join(nba_player_markets)

basic_bookmakers = [
    'draftkings'
]
basic_bookmakers_str = ','.join(basic_bookmakers)

#########################################################




################## util functions #######################
#########################################################

#########################################################
# get date as ISO with offset ###########################
def get_ISO_date_with_offset(date, offset):
    # Parse the ISO date string to a datetime object
    date_time_obj = datetime.fromisoformat(date.replace('Z', '+00:00'))

    new_date_time_obj = None
    if (offset > 0):  
        new_date_time_obj = date_time_obj + timedelta(minutes=abs(offset))
    else:
        new_date_time_obj = date_time_obj - timedelta(minutes=abs(offset))

    # Convert the datetime object back to an ISO date string
    new_iso_date_str = new_date_time_obj.isoformat()
    
    # Ensure 'Z' is added for UTC time if the timezone info is UTC
    if new_iso_date_str.endswith('+00:00'):
        new_iso_date_str = new_iso_date_str[:-6] + 'Z'
    
    return new_iso_date_str
#########################################################

#########################################################
# get nba api date as iso ###########################
def get_nba_api_date_as_iso(date):
    # 2023-10-07T16:00:00.000Z -> 2023-10-07T16:00:00Z
    return date.split('.')[0] + 'Z'
#########################################################

#########################################################
# make list distinct by field ###########################
def make_distinct(list_of_objs, field):
    # Step 2: Use a dictionary to track unique objects by the 'id' field
    unique_objects_dict = {obj[field]: obj for obj in list_of_objs}

    # Step 3: Convert the dictionary back to a list
    unique_objects = list(unique_objects_dict.values())
    
    return unique_objects
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




################## Mongo Functions ######################
#########################################################

#########################################################
# get id and date by collection and season ##############
def get_nba_id_and_date_by_season(field_name, season):
    pipeline = [
        {
            '$match': {
                'season': season,
            }
        },
        {
            '$project': {
                f"{field_name}": 1,
            } 
        }
    ]
    return list(nba_games_historical_collection.aggregate(pipeline))
#########################################################

#########################################################
# get nba games historical objects by season ############
def get_nba_games_historical_objects_by_season(season):
    return list(nba_games_historical_collection.find({ 'season': season }))
#########################################################

#########################################################
# get nba games historical objects after date ###########
def get_nba_games_historical_objects_after_date(date):
    return list(nba_games_historical_collection.find({ 'dateStart': { '$gte': date } }))
#########################################################

#########################################################
# get latest date in historical odds collection #########
def get_latest_date_in_historical_odds_collection():
    latest_date_doc = list(nba_odds_historical_collection.find().sort({ 'dateStart': -1 }).limit(1))
    return None if len(latest_date_doc) == 0 else latest_date_doc[0]['dateStart']
#########################################################

#########################################################
# load nba historical odds by season ####################
def load_nba_historical_odds_by_season(season):
    historical_game_objs = get_nba_games_historical_objects_by_season(season)
    res = get_nba_odds_for_given_games(historical_game_objs)
    nba_odds_historical_collection.insert_many(res)
#########################################################

#########################################################
# load nba historical odds by season ####################
def load_nba_player_historical_odds_by_season(season, season_type):
    all_player_stats = list(
        nba_player_aggregated_game_stats_historical_collection.find(
            { 'season': season, 'seasonType': season_type }
        )
    )
    
    for player_stats in all_player_stats:
        player_full_name = f'{player_stats['firstname']} {player_stats['lastname']}' 
        game_ids = list(
            map(lambda x: int(x), list(player_stats['playerStats'].keys()))
        )
        odds_for_game = list(nba_odds_historical_collection.find({ 'nbaApiId': { '$in': game_ids }}))
        player_odds_per_game = dict()
        
        for odds in odds_for_game:
            dk_odds = list(filter(lambda x: x['key'] == 'draftkings' , odds['bookmakerOdds']))[0]
            player_odds = dict()
            
            for market in dk_odds['markets']:
                for outcome in market['outcomes']:
                    if 'description' in outcome and outcome['description'] == player_full_name: 
                        new_market_obj = copy.deepcopy(market)
                        del new_market_obj['outcomes']
                        new_market_obj['outcome'] = outcome
                        player_odds[market['key']] = new_market_obj
            
            player_odds_per_game[f'{odds['nbaApiId']}'] = player_odds
        
        player_agg_odds_hist_doc = copy.deepcopy(player_stats)
        del player_agg_odds_hist_doc['playerStats']
        player_agg_odds_hist_doc['playerOdds'] = player_odds_per_game
        
        try:
            nba_player_aggregated_odds_historical_collection.insert_one(player_agg_odds_hist_doc)
        except Exception as e:
            print(f'error inserting odds for player {player_full_name}, id = ${player_stats['_id']}', e)       
#########################################################

#########################################################
# load latest nba historical odds by last date ##########
def load_latest_nba_historical_odds_by_last_date():
    latest_date = get_latest_date_in_historical_odds_collection()
    game_objs = get_nba_games_historical_objects_after_date(latest_date)
    odds_objs = get_nba_odds_for_given_games(game_objs)
    game_ids = []
    for odds in odds_objs:
        try:
            print(f'Inserting nba api id {odds['nbaApiId']}')
            nba_odds_historical_collection.insert_one(odds)
            game_ids.append(odds['nbaApiId'])
        except Exception as e:
            print(f'Error inserting nba api id {odds['nbaApiId']}: ', e)
    return game_ids
#########################################################

#########################################################
# load latest nba player historical odds by last date ###
def load_latest_nba_player_historical_odds_by_game_ids(nbaApiIds):
    latest_odds = list(nba_odds_historical_collection.find({ 'nbaApiId': { '$in': nbaApiIds }}))
    game_player_objs = list(nba_game_player_stats_historical_collection.find({ '_id': { '$in': nbaApiIds }}))
    game_player_objs = { x['_id']: x for x in game_player_objs } 

    game_id_to_player_odds = []
    for odds in latest_odds:
        try:
            markets = odds['bookmakerOdds'][0]['markets']
            
            player_markets = list(filter(lambda x: x['key'] not in nba_team_market, markets))
            
            odds_for_player = dict()              
            for market in player_markets:
                outcomes = market['outcomes']
                
                for outcome in outcomes:
                    name = outcome['description']
                    if name in odds_for_player:
                        odds_for_player[name][market['key']] = outcome
                    else:
                        odds_for_player[name] = { market['key']: outcome }
            game_id_to_player_odds.append({ odds['nbaApiId']: odds_for_player })
            
        except Exception as e:
            print(f'error aggregating player odds for {odds['nbaApiId']}: {e}')


    for game_id_to_player_odds_obj in game_id_to_player_odds:

        for game_id, all_player_odds_for_game in game_id_to_player_odds_obj.items():      
            game_players_obj = game_player_objs[game_id]
            home_team_players = { f'{obj['playerFirstname']} {obj['playerLastname']}': obj for obj in game_players_obj['teamsHomePlayers'].values() }
            away_team_players = { f'{obj['playerFirstname']} {obj['playerLastname']}': obj for obj in game_players_obj['teamsVisitorsPlayers'].values() }
            
            for player_name, player_odds in all_player_odds_for_game.items():
                team_id = None
                player_id = None
                firstname = None
                lastname = None
                if player_name in home_team_players or player_name in home_team_players:
                    if player_name in home_team_players:
                        player_id = home_team_players[player_name]['playerId']
                        firstname = home_team_players[player_name]['playerFirstname']
                        lastname = home_team_players[player_name]['playerLastname']
                        team_id = game_players_obj['teamsHomeId']
                    elif player_name in away_team_players:
                        player_id = away_team_players[player_name]['playerId']
                        firstname = away_team_players[player_name]['playerFirstname']
                        lastname = away_team_players[player_name]['playerLastname']
                        team_id = game_players_obj['teamsVisitorsId']
                    
                    season_type = 'ALL'
                    season = game_players_obj['season']
                    doc_id = f'{player_id}_{team_id}_{season}_{season_type}'

                    try:
                        res = nba_player_aggregated_odds_historical_collection.update_one(
                            { '_id': doc_id },
                            {
                                '$set': {
                                    f"playerOdds.{game_id}": player_odds,
                                },
                                "$setOnInsert": {              # Fields to include if inserting a new document
                                    'playerId': player_id,
                                    'teamId': team_id,
                                    'season': season,
                                    'seasonType': season_type,
                                    'firstname': firstname,
                                    'lastname': lastname,
                                }
                            },
                            upsert=True
                        )
                        print(res)
                    except Exception as e:
                        print(f'error updating odds for player_id: {player_id}, game_id: {game_id}')    
#########################################################
            
#########################################################




################## API functions ########################
#########################################################

#########################################################
# get historical odds data ##############################
def get_historical_odds_data(event_id, date, region, markets, bookmakers):
    # draftkings,fanduel,betmgm bookmaker examples
    url = f"{root}historical/sports/basketball_nba/events/{event_id}/odds?apiKey={api_key}&date={date}&regions={region}&markets={markets}&oddsFormat=american&bookmakers={bookmakers}"
    response = requests.get(url).json()
    try:
        data = response['data']
        res = { 'bookmakerOdds': data['bookmakers'] }
        res = rename_and_remove_fields(res, '_')
        return res['bookmakerOdds']
    except Exception as e:
        print(f"ERROR no data for url: {url}, response: {response}")
        return [] 
#########################################################

#########################################################
# map nba api event to odds api event ###################
def get_nba_odds_for_given_games(game_objs):
    res = []
    for doc in game_objs:
        url = f"{root}historical/sports/basketball_nba/events?apiKey={api_key}&date={get_nba_api_date_as_iso(doc['dateStart'])}"
        response = requests.get(url).json()
        data_list = response['data']

        # find event with corresponding event
        event_obj = next((obj for obj in data_list if obj['home_team'] == doc['teamsHomeName'] and obj['away_team'] == doc['teamsVisitorsName']), None)

        # construct odds obj
        if (event_obj is not None):
            data = event_obj
            data['nbaApiId'] = doc['_id']
            data['oddsApiId'] = data.pop('id')
            data['dateStart'] = data.pop('commence_time')
            data['season'] = doc['season']
            data = rename_and_remove_fields(data, '_')
            data['_id'] = data['oddsApiId']
            data['bookmakerOdds'] = get_historical_odds_data(
                data['oddsApiId'], 
                data['dateStart'], 
                'us', 
                f"{nba_team_market_str},{nba_player_markets_str}",
                basic_bookmakers_str
            )
            res.append(data)
    return make_distinct(res, '_id')
#########################################################

#########################################################




################## Runner Functions #####################
#########################################################

# Historical Loader
def run_nba_historical_odds_loader(season):  
    load_nba_historical_odds_by_season(season)
    load_nba_player_historical_odds_by_season(season, 'ALL')

# Daily Loader
def run_nba_odds_daily_loader():
    print('running nba odds daily loader!')
    game_ids = load_latest_nba_historical_odds_by_last_date()
    if len(game_ids) > 0:
        print('running nba player agg odds daily loader!')
        load_latest_nba_player_historical_odds_by_game_ids(game_ids)
    print('complete')

#########################################################




###################### Sandbox ##########################
#########################################################
# id_date_objs = get_nba_id_and_date_by_season('dateStart', 2023)
# for d in id_date_objs:
#     nba_game_id = d['_id']
#     res = nba_odds_historical_collection.find({ 'nbaApiId': nba_game_id })
#     if (len(list(res)) == 0):
#         print(f"{nba_game_id} not found!")

# f"{nba_team_market_str},{nba_player_markets_str}"
# get_historical_odds_data('be1ee8db7ba20de87a087e8851f9b2f5', '2023-10-25T23:00:00Z', 'us', f"{nba_team_market_str},{nba_player_markets_str}", basic_bookmakers_str) 

#########################################################