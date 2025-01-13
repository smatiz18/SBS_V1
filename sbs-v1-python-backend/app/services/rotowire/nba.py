import json
import requests
from bs4 import BeautifulSoup 

url = 'https://www.rotowire.com/basketball/nba-lineups.php' 

#########################################################
def get_rotowire_nba_lineups_response():
    rotowire_response = None
    is_error = False
    try:
        rotowire_response = requests.get(url, verify=False)
    except Exception as e:
        print('Failure to get response from rotowire:' + e)

    team_matchups = None
    try:
        team_matchups = get_team_matchups(rotowire_response)
    except Exception as e:
        is_error = True
        print('Failure to parse team matchups:' + e)

    projected_player_lineups_by_team = None
    try:
        projected_player_lineups_by_team = get_projected_player_lineups_by_team(rotowire_response)
    except Exception as e:
        is_error = True
        print('Failure to parse projected player lineups:' + e)

    # response construction
    response = {}
    response['matchups'] = []
    response['isError'] = is_error
    for matchup in team_matchups:
        matchup_obj = {
            'away': {
                'teamNickname': matchup.get('away'),
                'projectedPlayers': projected_player_lineups_by_team.get(matchup.get('away'))
            },
            'home': {
                'teamNickname': matchup.get('home'),
                'projectedPlayers': projected_player_lineups_by_team.get(matchup.get('home'))
            },
        }
        response.get('matchups').append(matchup_obj)
    return response
#########################################################


#########################################################
def get_team_matchups(response):
    soup = BeautifulSoup(response.text, 'html.parser')
    matchups = []
    matchup_divs = soup.find_all('div', class_='lineup__matchup')
    filtered_matchup_divs = [div for div in matchup_divs if div.find('a', class_=lambda x: x and 'lineup__mteam' in x)]
    
    for matchup in filtered_matchup_divs:
        home_team_a_tag = matchup.find_all('a', class_=lambda x: x and 'is-home' in x)
        away_team_a_tag = matchup.find_all('a', class_=lambda x: x and 'is-visit' in x)

        if (len(home_team_a_tag) > 0 and len(away_team_a_tag) > 0):
            # Extract the team from the <a> tag without including the text from <span> tags
            home_team = ''.join([str(content) for content in home_team_a_tag[0] if not content.name == 'span']).strip()
            away_team = ''.join([str(content) for content in away_team_a_tag[0] if not content.name == 'span']).strip()
            matchups.append({
                'away': away_team,
                'home': home_team
            })
    return matchups
#########################################################

#########################################################
def get_projected_player_lineups_by_team(response):
    soup = BeautifulSoup(response.text, 'html.parser')
    players_by_team = {}
    button_divs = soup.find_all('button', class_='see-court-on-off')

    for div in button_divs:
        nickname = div['data-nickname']
        players_by_team.update({ nickname: [] })
        player_ids = div['data-lineup'].split(',')[:5]
        for player_id in player_ids:
            player_divs = soup.find_all('li', class_='lineup__player')
            for player_div in player_divs:
                a_tags = player_div.find_all('a', href=lambda href: href and player_id in href)
                for a_tag in a_tags:
                    if a_tag['title'] not in players_by_team.get(nickname):
                        players_by_team[nickname].append(a_tag['title'])
    return players_by_team
#########################################################