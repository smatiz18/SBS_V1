import requests
from bs4 import BeautifulSoup 

url = "https://www.rotowire.com/basketball/nba-lineups.php" 

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

    sportsbook_lines = None
    try:
        sportsbook_lines = get_sportsbook_lines(rotowire_response)
    except Exception as e:
        is_error = True
        print('Failure to parse sportsbook lines:' + e)

    response = {}
    response['isError'] = is_error
    if team_matchups != None:
        response['teamMatchups'] = team_matchups
    if projected_player_lineups_by_team != None:
        response['projectedPlayerLineupsByTeam'] = projected_player_lineups_by_team   
    if sportsbook_lines != None:
        response['sportsbookLines'] = sportsbook_lines
    
    return response
#########################################################


#########################################################
def get_team_matchups(response):
    soup = BeautifulSoup(response.text, "html.parser")
    matchups = set()
    matchup_divs = soup.find_all("div", class_="lineup__matchup")
    filtered_matchup_divs = [div for div in matchup_divs if div.find('a', class_=lambda x: x and 'lineup__mteam' in x)]
    
    for matchup in filtered_matchup_divs:
        home_team_a_tag = matchup.find_all("a", class_=lambda x: x and 'is-home' in x)
        away_team_a_tag = matchup.find_all("a", class_=lambda x: x and 'is-visit' in x)

        if (len(home_team_a_tag) > 0 and len(away_team_a_tag) > 0):
            # Extract the team from the <a> tag without including the text from <span> tags
            home_team = ''.join([str(content) for content in home_team_a_tag[0] if not content.name == 'span']).strip()
            away_team = ''.join([str(content) for content in away_team_a_tag[0] if not content.name == 'span']).strip()
            matchups.add(str({
                'away': away_team,
                'home': home_team
            }))
    return list(matchups)
#########################################################

#########################################################
def get_projected_player_lineups_by_team(response):
    soup = BeautifulSoup(response.text, "html.parser")
    players_by_team = {}
    button_divs = soup.find_all("button", class_="see-court-on-off")

    for div in button_divs:
        nickname = div["data-nickname"]
        players_by_team.update({ nickname: [] })
        player_ids = div["data-lineup"].split(",")[:5]
        for player_id in player_ids:
            player_divs = soup.find_all("li", class_="lineup__player")
            for player_div in player_divs:
                a_tags = player_div.find_all("a", href=lambda href: href and player_id in href)
                for a_tag in a_tags:
                    if a_tag["title"] not in players_by_team.get(nickname):
                        players_by_team[nickname].append(a_tag["title"])
    return players_by_team
#########################################################

#########################################################
def get_sportsbook_lines(response):  
    soup = BeautifulSoup(response.text, "html.parser")
    
    nickname_by_team_map = {}
    button_divs = soup.find_all("button", class_="see-court-on-off")
    for div in button_divs:
        nickname_by_team_map[div["data-team"]] = div["data-nickname"]

    odds_resp_obj = {}
    odds_items = soup.find_all("div", class_="lineup__odds-item")
    for odds_item in odds_items:
        odds_type = odds_item.find("b").get_text().strip() 
        fanduel_odds = odds_item.find("span", class_=lambda x: x and 'fanduel' in x).get_text().split(" ")
        draftkings_odds = odds_item.find("span", class_=lambda x: x and 'draftkings' in x).get_text().split(" ")
        betmgm_odds = odds_item.find("span", class_=lambda x: x and 'betmgm' in x).get_text().split(" ")

        if odds_type == 'O/U':
            odds_type = 'OU'
            fanduel_odds_obj = fanduel_odds[0]
            draftkings_odds_obj = draftkings_odds[0]
            betmgm_odds_obj = betmgm_odds[0]
        else:
            fanduel_nickname = nickname_by_team_map.get(fanduel_odds[0])
            draftkings_nickname = nickname_by_team_map.get(draftkings_odds[0])
            betmgm_nickname = nickname_by_team_map.get(betmgm_odds[0])
            fanduel_odds_obj = { 
                "-" if fanduel_nickname == None else fanduel_nickname : "-" if len(fanduel_odds) < 2 else fanduel_odds[1] 
            }
            draftkings_odds_obj = { 
                "-" if draftkings_nickname == None else fanduel_nickname : "-" if len(draftkings_odds) < 2 else draftkings_odds[1] 
            }
            betmgm_odds_obj = { 
                "-" if betmgm_nickname == None else betmgm_nickname : "-" if len(betmgm_odds) < 2 else betmgm_odds[1] 
            }

        odds_resp_obj[odds_type] = { 
            "fanduel": fanduel_odds_obj, 
            "draftkings": draftkings_odds_obj, 
            "betmgm": betmgm_odds_obj 
        }
    
    return odds_resp_obj
#########################################################