export const rotoWireDailyMatchupsMockResp = {
    "isError": false,
    "errorMessage": null,
    "data": {
        "isError": false,
        "errorMessage": null,
        "data": "{\"matchups\": [{\"away\": {\"teamNickname\": \"Kings\", \"projectedPlayers\": [\"Malik Monk\", \"Zach LaVine\", \"DeMar DeRozan\", \"Keegan Murray\", \"Domantas Sabonis\"]}, \"home\": {\"teamNickname\": \"Pelicans\", \"projectedPlayers\": [\"Jose Alvarado\", \"CJ McCollum\", \"Trey Murphy\", \"Karlo Matkovic\", \"Yves Missi\"]}}, {\"away\": {\"teamNickname\": \"Warriors\", \"projectedPlayers\": [\"Stephen Curry\", \"Buddy Hield\", \"Jimmy Butler\", \"Draymond Green\", \"Quinten Post\"]}, \"home\": {\"teamNickname\": \"Rockets\", \"projectedPlayers\": [\"Jalen Green\", \"Amen Thompson\", \"Dillon Brooks\", \"Jae'Sean Tate\", \"Alperen Sengun\"]}}, {\"away\": {\"teamNickname\": \"Heat\", \"projectedPlayers\": [\"Tyler Herro\", \"Duncan Robinson\", \"Andrew Wiggins\", \"Bam Adebayo\", \"Kel'el Ware\"]}, \"home\": {\"teamNickname\": \"Mavericks\", \"projectedPlayers\": [\"Kyrie Irving\", \"Max Christie\", \"Klay Thompson\", \"Kessler Edwards\", \"Olivier-Maxence Prosper\"]}}, {\"away\": {\"teamNickname\": \"Thunder\", \"projectedPlayers\": [\"Shai Gilgeous-Alexander\", \"Luguentz Dort\", \"Jalen Williams\", \"Chet Holmgren\", \"Isaiah Hartenstein\"]}, \"home\": {\"teamNickname\": \"Timberwolves\", \"projectedPlayers\": [\"Mike Conley\", \"Anthony Edwards\", \"Jaden McDaniels\", \"Naz Reid\", \"Rudy Gobert\"]}}, {\"away\": {\"teamNickname\": \"Clippers\", \"projectedPlayers\": [\"James Harden\", \"Norman Powell\", \"Amir Coffey\", \"Derrick Jones\", \"Ivica Zubac\"]}, \"home\": {\"teamNickname\": \"Jazz\", \"projectedPlayers\": [\"Isaiah Collier\", \"Collin Sexton\", \"Lauri Markkanen\", \"John Collins\", \"Walker Kessler\"]}}], \"isError\": false}"
    }
};

export const oddsEventsMockResp = {
    "isError": false,
    "errorMessage": null,
    "data": [
        {
            "id": "480e200e199564b43806ed98e8051a31",
            "sportKey": "basketball_nba",
            "sportTitle": "NBA",
            "commenceTime": "2025-02-14T01:00:00Z",
            "homeTeam": "New Orleans Pelicans",
            "awayTeam": "Sacramento Kings",
            "bookmakers": null
        },
        {
            "id": "3c6e47253e4108bf01641d455b2329e7",
            "sportKey": "basketball_nba",
            "sportTitle": "NBA",
            "commenceTime": "2025-02-14T01:10:00Z",
            "homeTeam": "Houston Rockets",
            "awayTeam": "Golden State Warriors",
            "bookmakers": null
        },
        {
            "id": "b6d76f4779b5315551f72f5cd478a46d",
            "sportKey": "basketball_nba",
            "sportTitle": "NBA",
            "commenceTime": "2025-02-14T01:40:00Z",
            "homeTeam": "Dallas Mavericks",
            "awayTeam": "Miami Heat",
            "bookmakers": null
        },
        {
            "id": "8718345dafcfcd6c965fb4b2737586a8",
            "sportKey": "basketball_nba",
            "sportTitle": "NBA",
            "commenceTime": "2025-02-14T01:40:00Z",
            "homeTeam": "Minnesota Timberwolves",
            "awayTeam": "Oklahoma City Thunder",
            "bookmakers": null
        },
        {
            "id": "59018cf2adc33bd07509cc282e25a0a5",
            "sportKey": "basketball_nba",
            "sportTitle": "NBA",
            "commenceTime": "2025-02-14T02:10:00Z",
            "homeTeam": "Utah Jazz",
            "awayTeam": "Los Angeles Clippers",
            "bookmakers": null
        },
        {
            "id": "8c5dfc09221b32ad1835ce0e5c426454",
            "sportKey": "basketball_nba",
            "sportTitle": "NBA",
            "commenceTime": "2025-02-26T03:00:00Z",
            "homeTeam": "Los Angeles Lakers",
            "awayTeam": "Dallas Mavericks",
            "bookmakers": null
        },
        {
            "id": "f880e059bbee7b5b9e4af4d17bcee511",
            "sportKey": "basketball_nba",
            "sportTitle": "NBA",
            "commenceTime": "2025-03-08T03:10:00Z",
            "homeTeam": "Sacramento Kings",
            "awayTeam": "San Antonio Spurs",
            "bookmakers": null
        }
    ]
};

export const rocketsWarriorsPlayersOdds = {
    "isError": false,
    "errorMessage": null,
    "data": {
        "events": [
            {
                "id": "3c6e47253e4108bf01641d455b2329e7",
                "sportKey": "basketball_nba",
                "sportTitle": "NBA",
                "commenceTime": "2025-02-14T01:10:00Z",
                "homeTeam": "Houston Rockets",
                "awayTeam": "Golden State Warriors",
                "bookmakers": [
                    {
                        "key": "fanduel",
                        "title": "FanDuel",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "player_assists",
                                "lastUpdate": "2025-02-13T19:56:01Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -156,
                                        "description": "Jimmy Butler",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 122,
                                        "description": "Jimmy Butler",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 126,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -162,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -142,
                                        "description": "Alperen Sengun",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 112,
                                        "description": "Alperen Sengun",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -136,
                                        "description": "Amen Thompson",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 106,
                                        "description": "Amen Thompson",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 106,
                                        "description": "Stephen Curry",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -136,
                                        "description": "Stephen Curry",
                                        "point": 5.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points",
                                "lastUpdate": "2025-02-13T19:56:01Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -128,
                                        "description": "Amen Thompson",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Amen Thompson",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Dillon Brooks",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Dillon Brooks",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "Alperen Sengun",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -122,
                                        "description": "Alperen Sengun",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -106,
                                        "description": "Jalen Green",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Jalen Green",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -106,
                                        "description": "Stephen Curry",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Stephen Curry",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Jimmy Butler",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -128,
                                        "description": "Jimmy Butler",
                                        "point": 19.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_assists",
                                "lastUpdate": "2025-02-13T19:56:01Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -122,
                                        "description": "Stephen Curry",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -104,
                                        "description": "Stephen Curry",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -108,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Amen Thompson",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -128,
                                        "description": "Amen Thompson",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -106,
                                        "description": "Alperen Sengun",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Alperen Sengun",
                                        "point": 24.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds",
                                "lastUpdate": "2025-02-13T19:56:01Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -111,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "Jalen Green",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -122,
                                        "description": "Jalen Green",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "Alperen Sengun",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -122,
                                        "description": "Alperen Sengun",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -106,
                                        "description": "Amen Thompson",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Amen Thompson",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "Stephen Curry",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Stephen Curry",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Dillon Brooks",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Dillon Brooks",
                                        "point": 17.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds_assists",
                                "lastUpdate": "2025-02-13T19:56:01Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "Alperen Sengun",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -122,
                                        "description": "Alperen Sengun",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "Amen Thompson",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Amen Thompson",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Jalen Green",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Jalen Green",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -102,
                                        "description": "Stephen Curry",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Stephen Curry",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -122,
                                        "description": "Jimmy Butler",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -104,
                                        "description": "Jimmy Butler",
                                        "point": 29.5
                                    }
                                ]
                            },
                            {
                                "key": "player_rebounds",
                                "lastUpdate": "2025-02-13T19:56:01Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -154,
                                        "description": "Stephen Curry",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 120,
                                        "description": "Stephen Curry",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -128,
                                        "description": "Alperen Sengun",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Alperen Sengun",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -102,
                                        "description": "Amen Thompson",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Amen Thompson",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 102,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -140,
                                        "description": "Dillon Brooks",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 110,
                                        "description": "Dillon Brooks",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 102,
                                        "description": "Jimmy Butler",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Jimmy Butler",
                                        "point": 5.5
                                    }
                                ]
                            },
                            {
                                "key": "player_threes",
                                "lastUpdate": "2025-02-13T19:56:01Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -154,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -174,
                                        "description": "Jalen Green",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 136,
                                        "description": "Jalen Green",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 104,
                                        "description": "Dillon Brooks",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -132,
                                        "description": "Dillon Brooks",
                                        "point": 2.5
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "draftkings",
                        "title": "DraftKings",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "player_assists",
                                "lastUpdate": "2025-02-13T19:54:13Z",
                                "outcomes": [
                                    {
                                        "name": "Under",
                                        "price": 105,
                                        "description": "Amen Thompson",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "Amen Thompson",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -135,
                                        "description": "Stephen Curry",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 105,
                                        "description": "Stephen Curry",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 114,
                                        "description": "Jimmy Butler",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -145,
                                        "description": "Jimmy Butler",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 110,
                                        "description": "Alperen Sengun",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -140,
                                        "description": "Alperen Sengun",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Draymond Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Draymond Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 124,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 105,
                                        "description": "Buddy Hield",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "Buddy Hield",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Dillon Brooks",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Dillon Brooks",
                                        "point": 1.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points",
                                "lastUpdate": "2025-02-13T19:54:13Z",
                                "outcomes": [
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Stephen Curry",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Stephen Curry",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jalen Green",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jalen Green",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jimmy Butler",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jimmy Butler",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Alperen Sengun",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Alperen Sengun",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Amen Thompson",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Amen Thompson",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Dillon Brooks",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Dillon Brooks",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Buddy Hield",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Buddy Hield",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Cam Whitmore",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Cam Whitmore",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Draymond Green",
                                        "point": 7.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Draymond Green",
                                        "point": 7.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_assists",
                                "lastUpdate": "2025-02-13T19:54:13Z",
                                "outcomes": [
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Stephen Curry",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Stephen Curry",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Alperen Sengun",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Alperen Sengun",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Amen Thompson",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Amen Thompson",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Dillon Brooks",
                                        "point": 15.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Dillon Brooks",
                                        "point": 15.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Buddy Hield",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Buddy Hield",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Draymond Green",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Draymond Green",
                                        "point": 12.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds",
                                "lastUpdate": "2025-02-13T19:54:13Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Alperen Sengun",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Alperen Sengun",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Stephen Curry",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Stephen Curry",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jalen Green",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jalen Green",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Amen Thompson",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Amen Thompson",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Dillon Brooks",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Dillon Brooks",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Buddy Hield",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Buddy Hield",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Cam Whitmore",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Cam Whitmore",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Draymond Green",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Draymond Green",
                                        "point": 13.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds_assists",
                                "lastUpdate": "2025-02-13T19:54:13Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Alperen Sengun",
                                        "point": 34.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Alperen Sengun",
                                        "point": 34.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Stephen Curry",
                                        "point": 34.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Stephen Curry",
                                        "point": 34.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jalen Green",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jalen Green",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Amen Thompson",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Amen Thompson",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jimmy Butler",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jimmy Butler",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Dillon Brooks",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Dillon Brooks",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Buddy Hield",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Buddy Hield",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Draymond Green",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Draymond Green",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Cam Whitmore",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Cam Whitmore",
                                        "point": 18.5
                                    }
                                ]
                            },
                            {
                                "key": "player_rebounds",
                                "lastUpdate": "2025-02-13T19:54:11Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Alperen Sengun",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Alperen Sengun",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Amen Thompson",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Amen Thompson",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -140,
                                        "description": "Draymond Green",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 110,
                                        "description": "Draymond Green",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Jimmy Butler",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Jimmy Butler",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -145,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 114,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Cam Whitmore",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -154,
                                        "description": "Cam Whitmore",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "Buddy Hield",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 105,
                                        "description": "Buddy Hield",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Dillon Brooks",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Dillon Brooks",
                                        "point": 3.5
                                    }
                                ]
                            },
                            {
                                "key": "player_threes",
                                "lastUpdate": "2025-02-13T19:54:13Z",
                                "outcomes": [
                                    {
                                        "name": "Under",
                                        "price": -166,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 130,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Jalen Green",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -154,
                                        "description": "Jalen Green",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Buddy Hield",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Buddy Hield",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Dillon Brooks",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Dillon Brooks",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -145,
                                        "description": "Cam Whitmore",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 114,
                                        "description": "Cam Whitmore",
                                        "point": 1.5
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "betmgm",
                        "title": "BetMGM",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "player_assists",
                                "lastUpdate": "2025-02-13T19:52:34Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Amen Thompson",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Amen Thompson",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 105,
                                        "description": "Stephen Curry",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -140,
                                        "description": "Stephen Curry",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "Alperen Sengun",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Alperen Sengun",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Dillon Brooks",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Dillon Brooks",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 175,
                                        "description": "Cam Whitmore",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -235,
                                        "description": "Cam Whitmore",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -155,
                                        "description": "Jimmy Butler",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 115,
                                        "description": "Jimmy Butler",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -160,
                                        "description": "Jalen Green",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 120,
                                        "description": "Jalen Green",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Draymond Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Draymond Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Buddy Hield",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Buddy Hield",
                                        "point": 1.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points",
                                "lastUpdate": "2025-02-13T19:52:34Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Amen Thompson",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Amen Thompson",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Alperen Sengun",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Alperen Sengun",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jalen Green",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jalen Green",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Dillon Brooks",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Dillon Brooks",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Cam Whitmore",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Cam Whitmore",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jimmy Butler",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jimmy Butler",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Stephen Curry",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Stephen Curry",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -140,
                                        "description": "Draymond Green",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 105,
                                        "description": "Draymond Green",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Buddy Hield",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Buddy Hield",
                                        "point": 12.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_assists",
                                "lastUpdate": "2025-02-13T19:52:34Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Amen Thompson",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Amen Thompson",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Alperen Sengun",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Alperen Sengun",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Dillon Brooks",
                                        "point": 15.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Dillon Brooks",
                                        "point": 15.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Stephen Curry",
                                        "point": 31.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Stephen Curry",
                                        "point": 31.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Cam Whitmore",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Cam Whitmore",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jimmy Butler",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jimmy Butler",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Draymond Green",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Draymond Green",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Buddy Hield",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Buddy Hield",
                                        "point": 14.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds",
                                "lastUpdate": "2025-02-13T19:52:34Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Alperen Sengun",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Alperen Sengun",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Cam Whitmore",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Cam Whitmore",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jimmy Butler",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Amen Thompson",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Amen Thompson",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Stephen Curry",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Stephen Curry",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Dillon Brooks",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Dillon Brooks",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Draymond Green",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Draymond Green",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Buddy Hield",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Buddy Hield",
                                        "point": 16.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jalen Green",
                                        "point": 27.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds_assists",
                                "lastUpdate": "2025-02-13T19:52:34Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Alperen Sengun",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Alperen Sengun",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jalen Green",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jalen Green",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Dillon Brooks",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Dillon Brooks",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Stephen Curry",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Stephen Curry",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jimmy Butler",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jimmy Butler",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Amen Thompson",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Amen Thompson",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Cam Whitmore",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Cam Whitmore",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Draymond Green",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Draymond Green",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Buddy Hield",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Buddy Hield",
                                        "point": 17.5
                                    }
                                ]
                            },
                            {
                                "key": "player_rebounds",
                                "lastUpdate": "2025-02-13T19:52:34Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jimmy Butler",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jimmy Butler",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -140,
                                        "description": "Stephen Curry",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 105,
                                        "description": "Stephen Curry",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Alperen Sengun",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Alperen Sengun",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Jalen Green",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -160,
                                        "description": "Dillon Brooks",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 120,
                                        "description": "Dillon Brooks",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "Cam Whitmore",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Cam Whitmore",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Amen Thompson",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Amen Thompson",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Draymond Green",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Draymond Green",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Buddy Hield",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Buddy Hield",
                                        "point": 3.5
                                    }
                                ]
                            },
                            {
                                "key": "player_threes",
                                "lastUpdate": "2025-02-13T19:52:34Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": 200,
                                        "description": "Amen Thompson",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -285,
                                        "description": "Amen Thompson",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 155,
                                        "description": "Jimmy Butler",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -210,
                                        "description": "Jimmy Butler",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -135,
                                        "description": "Stephen Curry",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 155,
                                        "description": "Alperen Sengun",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -210,
                                        "description": "Alperen Sengun",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Dillon Brooks",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -135,
                                        "description": "Dillon Brooks",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -175,
                                        "description": "Jalen Green",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 130,
                                        "description": "Jalen Green",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Cam Whitmore",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Cam Whitmore",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -155,
                                        "description": "Draymond Green",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 120,
                                        "description": "Draymond Green",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Buddy Hield",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Buddy Hield",
                                        "point": 2.5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "optimalOddsMap": {
            "3c6e47253e4108bf01641d455b2329e7": [
                {
                    "bookmaker": "DraftKings",
                    "name": "Over",
                    "price": 120,
                    "point": 4.5,
                    "betType": "player_rebounds"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Over",
                    "price": 200,
                    "point": 0.5,
                    "betType": "player_threes"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Over",
                    "price": -102,
                    "point": 35.5,
                    "betType": "player_points_rebounds_assists"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Over",
                    "price": 100,
                    "point": 23.5,
                    "betType": "player_points_assists"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Under",
                    "price": -105,
                    "point": 29.5,
                    "betType": "player_points_rebounds"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": -104,
                    "point": 29.5,
                    "betType": "player_points_rebounds_assists"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": 120,
                    "point": 3.5,
                    "betType": "player_rebounds"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": -104,
                    "point": 30.5,
                    "betType": "player_points_assists"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Over",
                    "price": 175,
                    "point": 1.5,
                    "betType": "player_assists"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Under",
                    "price": 105,
                    "point": 6.5,
                    "betType": "player_points"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": 122,
                    "point": 4.5,
                    "betType": "player_assists"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": 136,
                    "point": 2.5,
                    "betType": "player_threes"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Over",
                    "price": -104,
                    "point": 28.5,
                    "betType": "player_points_rebounds"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Over",
                    "price": 100,
                    "point": 19.5,
                    "betType": "player_points"
                }
            ]
        }
    }
};

export const rocketsWarriorsTeamOdds = {
    "isError": false,
    "errorMessage": null,
    "data": {
        "events": [
            {
                "id": "3c6e47253e4108bf01641d455b2329e7",
                "sportKey": "basketball_nba",
                "sportTitle": "NBA",
                "commenceTime": "2025-02-14T01:10:00Z",
                "homeTeam": "Houston Rockets",
                "awayTeam": "Golden State Warriors",
                "bookmakers": [
                    {
                        "key": "fanduel",
                        "title": "FanDuel",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "h2h",
                                "lastUpdate": "2025-02-13T19:58:55Z",
                                "outcomes": [
                                    {
                                        "name": "Golden State Warriors",
                                        "price": 108,
                                        "description": null,
                                        "point": null
                                    },
                                    {
                                        "name": "Houston Rockets",
                                        "price": -126,
                                        "description": null,
                                        "point": null
                                    }
                                ]
                            },
                            {
                                "key": "spreads",
                                "lastUpdate": "2025-02-13T19:58:55Z",
                                "outcomes": [
                                    {
                                        "name": "Golden State Warriors",
                                        "price": -108,
                                        "description": null,
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Houston Rockets",
                                        "price": -112,
                                        "description": null,
                                        "point": -1.5
                                    }
                                ]
                            },
                            {
                                "key": "totals",
                                "lastUpdate": "2025-02-13T19:58:55Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -112,
                                        "description": null,
                                        "point": 222
                                    },
                                    {
                                        "name": "Under",
                                        "price": -108,
                                        "description": null,
                                        "point": 222
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "draftkings",
                        "title": "DraftKings",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "h2h",
                                "lastUpdate": "2025-02-13T19:58:54Z",
                                "outcomes": [
                                    {
                                        "name": "Golden State Warriors",
                                        "price": 105,
                                        "description": null,
                                        "point": null
                                    },
                                    {
                                        "name": "Houston Rockets",
                                        "price": -125,
                                        "description": null,
                                        "point": null
                                    }
                                ]
                            },
                            {
                                "key": "spreads",
                                "lastUpdate": "2025-02-13T19:58:54Z",
                                "outcomes": [
                                    {
                                        "name": "Golden State Warriors",
                                        "price": -108,
                                        "description": null,
                                        "point": 2
                                    },
                                    {
                                        "name": "Houston Rockets",
                                        "price": -112,
                                        "description": null,
                                        "point": -2
                                    }
                                ]
                            },
                            {
                                "key": "totals",
                                "lastUpdate": "2025-02-13T19:58:54Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -108,
                                        "description": null,
                                        "point": 222
                                    },
                                    {
                                        "name": "Under",
                                        "price": -112,
                                        "description": null,
                                        "point": 222
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "betmgm",
                        "title": "BetMGM",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "h2h",
                                "lastUpdate": "2025-02-13T19:58:54Z",
                                "outcomes": [
                                    {
                                        "name": "Golden State Warriors",
                                        "price": 105,
                                        "description": null,
                                        "point": null
                                    },
                                    {
                                        "name": "Houston Rockets",
                                        "price": -130,
                                        "description": null,
                                        "point": null
                                    }
                                ]
                            },
                            {
                                "key": "spreads",
                                "lastUpdate": "2025-02-13T19:58:54Z",
                                "outcomes": [
                                    {
                                        "name": "Golden State Warriors",
                                        "price": -110,
                                        "description": null,
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Houston Rockets",
                                        "price": -110,
                                        "description": null,
                                        "point": -1.5
                                    }
                                ]
                            },
                            {
                                "key": "totals",
                                "lastUpdate": "2025-02-13T19:58:54Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": null,
                                        "point": 221.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": null,
                                        "point": 221.5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "optimalOddsMap": {
            "3c6e47253e4108bf01641d455b2329e7": [
                {
                    "bookmaker": "FanDuel",
                    "name": "Golden State Warriors",
                    "price": 108,
                    "point": null,
                    "betType": "h2h"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Golden State Warriors",
                    "price": -108,
                    "point": 1.5,
                    "betType": "spreads"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Houston Rockets",
                    "price": -110,
                    "point": -1.5,
                    "betType": "spreads"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Over",
                    "price": -108,
                    "point": 222,
                    "betType": "totals"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Houston Rockets",
                    "price": -125,
                    "point": null,
                    "betType": "h2h"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Under",
                    "price": -105,
                    "point": 221.5,
                    "betType": "totals"
                }
            ]
        }
    }
};

export const pelicansKingsTeamOdds = {
    "isError": false,
    "errorMessage": null,
    "data": {
        "events": [
            {
                "id": "480e200e199564b43806ed98e8051a31",
                "sportKey": "basketball_nba",
                "sportTitle": "NBA",
                "commenceTime": "2025-02-14T01:00:00Z",
                "homeTeam": "New Orleans Pelicans",
                "awayTeam": "Sacramento Kings",
                "bookmakers": [
                    {
                        "key": "fanduel",
                        "title": "FanDuel",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "h2h",
                                "lastUpdate": "2025-02-13T19:56:10Z",
                                "outcomes": [
                                    {
                                        "name": "New Orleans Pelicans",
                                        "price": 300,
                                        "description": null,
                                        "point": null
                                    },
                                    {
                                        "name": "Sacramento Kings",
                                        "price": -375,
                                        "description": null,
                                        "point": null
                                    }
                                ]
                            },
                            {
                                "key": "spreads",
                                "lastUpdate": "2025-02-13T19:56:10Z",
                                "outcomes": [
                                    {
                                        "name": "New Orleans Pelicans",
                                        "price": -108,
                                        "description": null,
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Sacramento Kings",
                                        "price": -112,
                                        "description": null,
                                        "point": -8.5
                                    }
                                ]
                            },
                            {
                                "key": "totals",
                                "lastUpdate": "2025-02-13T19:56:10Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": null,
                                        "point": 233.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": null,
                                        "point": 233.5
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "draftkings",
                        "title": "DraftKings",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "h2h",
                                "lastUpdate": "2025-02-13T19:56:09Z",
                                "outcomes": [
                                    {
                                        "name": "New Orleans Pelicans",
                                        "price": 280,
                                        "description": null,
                                        "point": null
                                    },
                                    {
                                        "name": "Sacramento Kings",
                                        "price": -355,
                                        "description": null,
                                        "point": null
                                    }
                                ]
                            },
                            {
                                "key": "spreads",
                                "lastUpdate": "2025-02-13T19:56:09Z",
                                "outcomes": [
                                    {
                                        "name": "New Orleans Pelicans",
                                        "price": -110,
                                        "description": null,
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Sacramento Kings",
                                        "price": -110,
                                        "description": null,
                                        "point": -8.5
                                    }
                                ]
                            },
                            {
                                "key": "totals",
                                "lastUpdate": "2025-02-13T19:56:09Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -112,
                                        "description": null,
                                        "point": 233.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -108,
                                        "description": null,
                                        "point": 233.5
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "betmgm",
                        "title": "BetMGM",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "h2h",
                                "lastUpdate": "2025-02-13T19:54:46Z",
                                "outcomes": [
                                    {
                                        "name": "New Orleans Pelicans",
                                        "price": 290,
                                        "description": null,
                                        "point": null
                                    },
                                    {
                                        "name": "Sacramento Kings",
                                        "price": -375,
                                        "description": null,
                                        "point": null
                                    }
                                ]
                            },
                            {
                                "key": "spreads",
                                "lastUpdate": "2025-02-13T19:54:46Z",
                                "outcomes": [
                                    {
                                        "name": "New Orleans Pelicans",
                                        "price": -110,
                                        "description": null,
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Sacramento Kings",
                                        "price": -110,
                                        "description": null,
                                        "point": -8.5
                                    }
                                ]
                            },
                            {
                                "key": "totals",
                                "lastUpdate": "2025-02-13T19:54:46Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": null,
                                        "point": 233.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": null,
                                        "point": 233.5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "optimalOddsMap": {
            "480e200e199564b43806ed98e8051a31": [
                {
                    "bookmaker": "DraftKings",
                    "name": "Sacramento Kings",
                    "price": -355,
                    "point": null,
                    "betType": "h2h"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Over",
                    "price": -110,
                    "point": 233.5,
                    "betType": "totals"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Under",
                    "price": -108,
                    "point": 233.5,
                    "betType": "totals"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "New Orleans Pelicans",
                    "price": -108,
                    "point": 8.5,
                    "betType": "spreads"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "New Orleans Pelicans",
                    "price": 300,
                    "point": null,
                    "betType": "h2h"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Sacramento Kings",
                    "price": -110,
                    "point": -8.5,
                    "betType": "spreads"
                }
            ]
        }
    }
};



export const pelicansKingsPlayerOdds = {
    "isError": false,
    "errorMessage": null,
    "data": {
        "events": [
            {
                "id": "480e200e199564b43806ed98e8051a31",
                "sportKey": "basketball_nba",
                "sportTitle": "NBA",
                "commenceTime": "2025-02-14T01:00:00Z",
                "homeTeam": "New Orleans Pelicans",
                "awayTeam": "Sacramento Kings",
                "bookmakers": [
                    {
                        "key": "fanduel",
                        "title": "FanDuel",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "player_assists",
                                "lastUpdate": "2025-02-13T20:20:47Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -108,
                                        "description": "Malik Monk",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Malik Monk",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 112,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -142,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 124,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -148,
                                        "description": "Domantas Sabonis",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 116,
                                        "description": "Domantas Sabonis",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 114,
                                        "description": "C.J. McCollum",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -146,
                                        "description": "C.J. McCollum",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 102,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -108,
                                        "description": "Jose Alvarado",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Jose Alvarado",
                                        "point": 6.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points",
                                "lastUpdate": "2025-02-13T20:20:47Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Keegan Murray",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -111,
                                        "description": "Keegan Murray",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Zach LaVine",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Zach LaVine",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -128,
                                        "description": "Trey Murphy III",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Trey Murphy III",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -102,
                                        "description": "Domantas Sabonis",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -128,
                                        "description": "Domantas Sabonis",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "Yves Missi",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Yves Missi",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "DeMar DeRozan",
                                        "point": 21.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -122,
                                        "description": "DeMar DeRozan",
                                        "point": 21.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -102,
                                        "description": "C.J. McCollum",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "C.J. McCollum",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -102,
                                        "description": "Malik Monk",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Malik Monk",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Jose Alvarado",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -111,
                                        "description": "Jose Alvarado",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "Keon Ellis",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Keon Ellis",
                                        "point": 9.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_assists",
                                "lastUpdate": "2025-02-13T20:20:47Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "Domantas Sabonis",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Domantas Sabonis",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -108,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Trey Murphy III",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Trey Murphy III",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "C.J. McCollum",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "C.J. McCollum",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -102,
                                        "description": "DeMar DeRozan",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "DeMar DeRozan",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "Jose Alvarado",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Jose Alvarado",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Malik Monk",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -106,
                                        "description": "Malik Monk",
                                        "point": 25.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds",
                                "lastUpdate": "2025-02-13T20:20:47Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -102,
                                        "description": "Domantas Sabonis",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Domantas Sabonis",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -106,
                                        "description": "Yves Missi",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Yves Missi",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Trey Murphy III",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -111,
                                        "description": "Trey Murphy III",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "Keegan Murray",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Keegan Murray",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -122,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -104,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "Malik Monk",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -122,
                                        "description": "Malik Monk",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -122,
                                        "description": "C.J. McCollum",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -104,
                                        "description": "C.J. McCollum",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -128,
                                        "description": "Keon Ellis",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Keon Ellis",
                                        "point": 12.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds_assists",
                                "lastUpdate": "2025-02-13T20:20:47Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Malik Monk",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -108,
                                        "description": "Malik Monk",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Zach LaVine",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Zach LaVine",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -106,
                                        "description": "Trey Murphy III",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Trey Murphy III",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -108,
                                        "description": "Domantas Sabonis",
                                        "point": 39.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Domantas Sabonis",
                                        "point": 39.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -111,
                                        "description": "C.J. McCollum",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "C.J. McCollum",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "DeMar DeRozan",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -108,
                                        "description": "DeMar DeRozan",
                                        "point": 28.5
                                    }
                                ]
                            },
                            {
                                "key": "player_rebounds",
                                "lastUpdate": "2025-02-13T20:20:47Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -146,
                                        "description": "Malik Monk",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 114,
                                        "description": "Malik Monk",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -104,
                                        "description": "Keegan Murray",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -122,
                                        "description": "Keegan Murray",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -132,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 104,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -113,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -113,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -108,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 112,
                                        "description": "Keon Ellis",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -142,
                                        "description": "Keon Ellis",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Domantas Sabonis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -102,
                                        "description": "Domantas Sabonis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -132,
                                        "description": "Zach LaVine",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 104,
                                        "description": "Zach LaVine",
                                        "point": 3.5
                                    }
                                ]
                            },
                            {
                                "key": "player_threes",
                                "lastUpdate": "2025-02-13T20:20:47Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": 116,
                                        "description": "Trey Murphy III",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -148,
                                        "description": "Trey Murphy III",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -148,
                                        "description": "Zach LaVine",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 116,
                                        "description": "Zach LaVine",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 136,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -174,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 148,
                                        "description": "DeMar DeRozan",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -192,
                                        "description": "DeMar DeRozan",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 124,
                                        "description": "Keon Ellis",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Keon Ellis",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -184,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 142,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Malik Monk",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -154,
                                        "description": "Malik Monk",
                                        "point": 2.5
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "draftkings",
                        "title": "DraftKings",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "player_assists",
                                "lastUpdate": "2025-02-13T20:20:33Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jose Alvarado",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jose Alvarado",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Malik Monk",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Malik Monk",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 114,
                                        "description": "Domantas Sabonis",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -145,
                                        "description": "Domantas Sabonis",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -145,
                                        "description": "Trey Murphy III",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 114,
                                        "description": "Trey Murphy III",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -140,
                                        "description": "C.J. McCollum",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 110,
                                        "description": "C.J. McCollum",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -154,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Yves Missi",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Yves Missi",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -135,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 105,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -145,
                                        "description": "Keon Ellis",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 114,
                                        "description": "Keon Ellis",
                                        "point": 1.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points",
                                "lastUpdate": "2025-02-13T20:20:33Z",
                                "outcomes": [
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "C.J. McCollum",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "C.J. McCollum",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Trey Murphy III",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Trey Murphy III",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Zach LaVine",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Zach LaVine",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "DeMar DeRozan",
                                        "point": 20.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "DeMar DeRozan",
                                        "point": 20.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Malik Monk",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Malik Monk",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Domantas Sabonis",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Domantas Sabonis",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Jose Alvarado",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Jose Alvarado",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Keegan Murray",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Keegan Murray",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Keon Ellis",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Keon Ellis",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jordan Hawkins",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jordan Hawkins",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Jonas Valanciunas",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Jonas Valanciunas",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Jake LaRavia",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Jake LaRavia",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 114,
                                        "description": "Trey Lyles",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -145,
                                        "description": "Trey Lyles",
                                        "point": 4.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_assists",
                                "lastUpdate": "2025-02-13T20:20:33Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Trey Murphy III",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Trey Murphy III",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "C.J. McCollum",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "C.J. McCollum",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Malik Monk",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Malik Monk",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Domantas Sabonis",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Domantas Sabonis",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jose Alvarado",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jose Alvarado",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Keegan Murray",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Keegan Murray",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Keon Ellis",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Keon Ellis",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Yves Missi",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Yves Missi",
                                        "point": 10.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds",
                                "lastUpdate": "2025-02-13T20:20:33Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Domantas Sabonis",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Domantas Sabonis",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Trey Murphy III",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Trey Murphy III",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "C.J. McCollum",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "C.J. McCollum",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Zach LaVine",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Malik Monk",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Malik Monk",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Keegan Murray",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Keegan Murray",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Yves Missi",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Yves Missi",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Jose Alvarado",
                                        "point": 15.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Jose Alvarado",
                                        "point": 15.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Keon Ellis",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Keon Ellis",
                                        "point": 13.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds_assists",
                                "lastUpdate": "2025-02-13T20:20:33Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Domantas Sabonis",
                                        "point": 39.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Domantas Sabonis",
                                        "point": 39.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Trey Murphy III",
                                        "point": 34.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Trey Murphy III",
                                        "point": 34.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "C.J. McCollum",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "C.J. McCollum",
                                        "point": 32.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Zach LaVine",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Zach LaVine",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Malik Monk",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Malik Monk",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "DeMar DeRozan",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "DeMar DeRozan",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Jose Alvarado",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Jose Alvarado",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Keegan Murray",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Keegan Murray",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Yves Missi",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Yves Missi",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Keon Ellis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Keon Ellis",
                                        "point": 14.5
                                    }
                                ]
                            },
                            {
                                "key": "player_rebounds",
                                "lastUpdate": "2025-02-13T20:20:33Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Domantas Sabonis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Domantas Sabonis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Keegan Murray",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Keegan Murray",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 130,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -166,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -145,
                                        "description": "Malik Monk",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 114,
                                        "description": "Malik Monk",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 105,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Keon Ellis",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Keon Ellis",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Jose Alvarado",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 124,
                                        "description": "Jose Alvarado",
                                        "point": 3.5
                                    }
                                ]
                            },
                            {
                                "key": "player_threes",
                                "lastUpdate": "2025-02-13T20:20:33Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": 110,
                                        "description": "Trey Murphy III",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -140,
                                        "description": "Trey Murphy III",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 130,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -166,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -140,
                                        "description": "Zach LaVine",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 110,
                                        "description": "Zach LaVine",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jose Alvarado",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jose Alvarado",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Keon Ellis",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 124,
                                        "description": "Keon Ellis",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 124,
                                        "description": "Malik Monk",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Malik Monk",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 130,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -166,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Jordan Hawkins",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jordan Hawkins",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -200,
                                        "description": "DeMar DeRozan",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 154,
                                        "description": "DeMar DeRozan",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Domantas Sabonis",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Domantas Sabonis",
                                        "point": 0.5
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "betmgm",
                        "title": "BetMGM",
                        "lastUpdate": null,
                        "markets": [
                            {
                                "key": "player_assists",
                                "lastUpdate": "2025-02-13T20:20:02Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": 115,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -150,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 115,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -155,
                                        "description": "Keegan Murray",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Yves Missi",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Yves Missi",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Malik Monk",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Malik Monk",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 105,
                                        "description": "Domantas Sabonis",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -140,
                                        "description": "Domantas Sabonis",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 125,
                                        "description": "C.J. McCollum",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -165,
                                        "description": "C.J. McCollum",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 115,
                                        "description": "Keon Ellis",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -155,
                                        "description": "Keon Ellis",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 150,
                                        "description": "Jonas Valanciunas",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -200,
                                        "description": "Jonas Valanciunas",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 110,
                                        "description": "Trey Lyles",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -150,
                                        "description": "Trey Lyles",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 155,
                                        "description": "Jordan Hawkins",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -210,
                                        "description": "Jordan Hawkins",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 165,
                                        "description": "Jake LaRavia",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -220,
                                        "description": "Jake LaRavia",
                                        "point": 1.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points",
                                "lastUpdate": "2025-02-13T20:20:02Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Zach LaVine",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Zach LaVine",
                                        "point": 22.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Keegan Murray",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Keegan Murray",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Malik Monk",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Malik Monk",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "DeMar DeRozan",
                                        "point": 20.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "DeMar DeRozan",
                                        "point": 20.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Domantas Sabonis",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Domantas Sabonis",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 105,
                                        "description": "Trey Murphy III",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -140,
                                        "description": "Trey Murphy III",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Keon Ellis",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Keon Ellis",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Jonas Valanciunas",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Jonas Valanciunas",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Trey Lyles",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Trey Lyles",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "C.J. McCollum",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "C.J. McCollum",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jordan Hawkins",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jordan Hawkins",
                                        "point": 9.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jake LaRavia",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Jake LaRavia",
                                        "point": 3.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_assists",
                                "lastUpdate": "2025-02-13T20:20:02Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Zach LaVine",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Zach LaVine",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Malik Monk",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Malik Monk",
                                        "point": 26.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Keegan Murray",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Keegan Murray",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Jonas Valanciunas",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -135,
                                        "description": "Jonas Valanciunas",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Keon Ellis",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Keon Ellis",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Domantas Sabonis",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Domantas Sabonis",
                                        "point": 25.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Trey Lyles",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Trey Lyles",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "C.J. McCollum",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "C.J. McCollum",
                                        "point": 29.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Yves Missi",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Yves Missi",
                                        "point": 10.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Trey Murphy III",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Trey Murphy III",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Jordan Hawkins",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Jordan Hawkins",
                                        "point": 11.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Jake LaRavia",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jake LaRavia",
                                        "point": 4.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds",
                                "lastUpdate": "2025-02-13T20:20:02Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Keegan Murray",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Keegan Murray",
                                        "point": 18.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Malik Monk",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Malik Monk",
                                        "point": 23.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "DeMar DeRozan",
                                        "point": 24.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Trey Murphy III",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Trey Murphy III",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Domantas Sabonis",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Domantas Sabonis",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Zach LaVine",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Zach LaVine",
                                        "point": 27.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Yves Missi",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Yves Missi",
                                        "point": 17.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Jonas Valanciunas",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Jonas Valanciunas",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Keon Ellis",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Keon Ellis",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Trey Lyles",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Trey Lyles",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "C.J. McCollum",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "C.J. McCollum",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Jordan Hawkins",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Jordan Hawkins",
                                        "point": 12.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Jake LaRavia",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jake LaRavia",
                                        "point": 5.5
                                    }
                                ]
                            },
                            {
                                "key": "player_points_rebounds_assists",
                                "lastUpdate": "2025-02-13T20:20:02Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Zach LaVine",
                                        "point": 31.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Zach LaVine",
                                        "point": 31.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "Malik Monk",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "Malik Monk",
                                        "point": 30.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Trey Murphy III",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Trey Murphy III",
                                        "point": 35.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 105,
                                        "description": "Keon Ellis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -145,
                                        "description": "Keon Ellis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Keegan Murray",
                                        "point": 20.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Keegan Murray",
                                        "point": 20.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "DeMar DeRozan",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "DeMar DeRozan",
                                        "point": 28.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Domantas Sabonis",
                                        "point": 40.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Domantas Sabonis",
                                        "point": 40.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "Jake LaRavia",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Jake LaRavia",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -105,
                                        "description": "C.J. McCollum",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -125,
                                        "description": "C.J. McCollum",
                                        "point": 33.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Yves Missi",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Yves Missi",
                                        "point": 19.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Jordan Hawkins",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Jordan Hawkins",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -130,
                                        "description": "Jonas Valanciunas",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jonas Valanciunas",
                                        "point": 13.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -135,
                                        "description": "Trey Lyles",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 100,
                                        "description": "Trey Lyles",
                                        "point": 5.5
                                    }
                                ]
                            },
                            {
                                "key": "player_rebounds",
                                "lastUpdate": "2025-02-13T20:20:02Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Trey Murphy III",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "Keegan Murray",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "Keegan Murray",
                                        "point": 6.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Yves Missi",
                                        "point": 8.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -115,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -115,
                                        "description": "C.J. McCollum",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -118,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "DeMar DeRozan",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 100,
                                        "description": "Domantas Sabonis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -130,
                                        "description": "Domantas Sabonis",
                                        "point": 14.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 115,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -150,
                                        "description": "Zach LaVine",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Keon Ellis",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -120,
                                        "description": "Keon Ellis",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jonas Valanciunas",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Jonas Valanciunas",
                                        "point": 5.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Jake LaRavia",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Jake LaRavia",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 130,
                                        "description": "Malik Monk",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -175,
                                        "description": "Malik Monk",
                                        "point": 4.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 120,
                                        "description": "Jordan Hawkins",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -160,
                                        "description": "Jordan Hawkins",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -175,
                                        "description": "Trey Lyles",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 135,
                                        "description": "Trey Lyles",
                                        "point": 1.5
                                    }
                                ]
                            },
                            {
                                "key": "player_threes",
                                "lastUpdate": "2025-02-13T20:20:02Z",
                                "outcomes": [
                                    {
                                        "name": "Over",
                                        "price": 105,
                                        "description": "Trey Murphy III",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -140,
                                        "description": "Trey Murphy III",
                                        "point": 3.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -155,
                                        "description": "Zach LaVine",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 115,
                                        "description": "Zach LaVine",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -185,
                                        "description": "C.J. McCollum",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": 135,
                                        "description": "C.J. McCollum",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 110,
                                        "description": "Malik Monk",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -150,
                                        "description": "Malik Monk",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 145,
                                        "description": "DeMar DeRozan",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -200,
                                        "description": "DeMar DeRozan",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -120,
                                        "description": "Domantas Sabonis",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -110,
                                        "description": "Domantas Sabonis",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 130,
                                        "description": "Keon Ellis",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -175,
                                        "description": "Keon Ellis",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 170,
                                        "description": "Keegan Murray",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -225,
                                        "description": "Keegan Murray",
                                        "point": 2.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -110,
                                        "description": "Trey Lyles",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -118,
                                        "description": "Trey Lyles",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": 145,
                                        "description": "Jake LaRavia",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -200,
                                        "description": "Jake LaRavia",
                                        "point": 0.5
                                    },
                                    {
                                        "name": "Over",
                                        "price": -125,
                                        "description": "Jordan Hawkins",
                                        "point": 1.5
                                    },
                                    {
                                        "name": "Under",
                                        "price": -105,
                                        "description": "Jordan Hawkins",
                                        "point": 1.5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "optimalOddsMap": {
            "480e200e199564b43806ed98e8051a31": [
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": 100,
                    "point": 12.5,
                    "betType": "player_points_rebounds"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Under",
                    "price": 100,
                    "point": 6.5,
                    "betType": "player_points_rebounds_assists"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": 142,
                    "point": 1.5,
                    "betType": "player_threes"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Over",
                    "price": 170,
                    "point": 2.5,
                    "betType": "player_threes"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Over",
                    "price": 100,
                    "point": 13.5,
                    "betType": "player_points_assists"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Under",
                    "price": 135,
                    "point": 1.5,
                    "betType": "player_rebounds"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Under",
                    "price": -105,
                    "point": 25.5,
                    "betType": "player_points_assists"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Over",
                    "price": -102,
                    "point": 33.5,
                    "betType": "player_points_rebounds"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": 100,
                    "point": 23.5,
                    "betType": "player_points"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Over",
                    "price": 120,
                    "point": 3.5,
                    "betType": "player_points"
                },
                {
                    "bookmaker": "FanDuel",
                    "name": "Under",
                    "price": 116,
                    "point": 5.5,
                    "betType": "player_assists"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Over",
                    "price": 105,
                    "point": 14.5,
                    "betType": "player_points_rebounds_assists"
                },
                {
                    "bookmaker": "DraftKings",
                    "name": "Over",
                    "price": 130,
                    "point": 4.5,
                    "betType": "player_rebounds"
                },
                {
                    "bookmaker": "BetMGM",
                    "name": "Over",
                    "price": 165,
                    "point": 1.5,
                    "betType": "player_assists"
                }
            ]
        }
    }
};