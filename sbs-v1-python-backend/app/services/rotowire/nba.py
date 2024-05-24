url = "https://www.rotowire.com/basketball/nba-lineups.php" 

# TODO merge functions to get data from 1 scrape

def get_team_lineup_matchups():
    response = requests.get(url, verify=False)
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

            team_tuple = (home_team, away_team)
            matchups.add(team_tuple)
    return matchups

def get_projected_player_lineups_by_team():
    response = requests.get(url, verify=False)
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