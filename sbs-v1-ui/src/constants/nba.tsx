export interface NbaTeamIdentifiers {
    teamName: string,
    teamNickname: string,
    nbaApiId: number
}

export const NbaTeams: NbaTeamIdentifiers[] = [
    { teamName: 'Atlanta Hawks', teamNickname: 'Hawks', nbaApiId: 1 },
    { teamName: 'Boston Celtics', teamNickname: 'Celtics', nbaApiId: 2 },
    { teamName: 'Brooklyn Nets', teamNickname: 'Nets', nbaApiId: 4 },
    { teamName: 'Charlotte Hornets', teamNickname: 'Hornets', nbaApiId: 5 },
    { teamName: 'Chicago Bulls', teamNickname: 'Bulls', nbaApiId: 6 },
    { teamName: 'Cleveland Cavaliers', teamNickname: 'Cavaliers', nbaApiId: 7 },
    { teamName: 'Dallas Mavericks', teamNickname: 'Mavericks', nbaApiId: 8 },
    { teamName: 'Denver Nuggets', teamNickname: 'Nuggets', nbaApiId: 9 },
    { teamName: 'Detroit Pistons', teamNickname: 'Pistons', nbaApiId: 10 },
    { teamName: 'Golden State Warriors', teamNickname: 'Warriors', nbaApiId: 11 },
    { teamName: 'Houston Rockets', teamNickname: 'Rockets', nbaApiId: 14 },
    { teamName: 'Indiana Pacers', teamNickname: 'Pacers', nbaApiId: 15 },
    { teamName: 'Los Angeles Clippers', teamNickname: 'Clippers', nbaApiId: 16 },
    { teamName: 'Los Angeles Lakers', teamNickname: 'Lakers', nbaApiId: 17 },
    { teamName: 'Memphis Grizzlies', teamNickname: 'Grizzlies', nbaApiId: 19 },
    { teamName: 'Miami Heat', teamNickname: 'Heat', nbaApiId: 20 },
    { teamName: 'Milwaukee Bucks', teamNickname: 'Bucks', nbaApiId: 21 },
    { teamName: 'Minnesota Timberwolves', teamNickname: 'Timberwolves', nbaApiId: 22 },
    { teamName: 'New Orleans Pelicans', teamNickname: 'Pelicans', nbaApiId: 23 },
    { teamName: 'New York Knicks', teamNickname: 'Knicks', nbaApiId: 24 },
    { teamName: 'Oklahoma City Thunder', teamNickname: 'Thunder', nbaApiId: 25 },
    { teamName: 'Orlando Magic', teamNickname: 'Magic', nbaApiId: 26 },
    { teamName: 'Philadelphia 76ers', teamNickname: '76ers', nbaApiId: 27 },
    { teamName: 'Phoenix Suns', teamNickname: 'Suns', nbaApiId: 28 },
    { teamName: 'Portland Trail Blazers', teamNickname: 'Trail Blazers', nbaApiId: 29},
    { teamName: 'Sacramento Kings', teamNickname: 'Kings', nbaApiId: 30 },
    { teamName: 'San Antonio Spurs', teamNickname: 'Spurs', nbaApiId: 31 },
    { teamName: 'Toronto Raptors', teamNickname: 'Raptors', nbaApiId: 38 },
    { teamName: 'Utah Jazz', teamNickname: 'Jazz', nbaApiId: 40 },
    { teamName: 'Washington Wizards', teamNickname: 'Wizards', nbaApiId: 41 }
];

export const NbaTeamsMappedByName: Record<string, NbaTeamIdentifiers> = NbaTeams.reduce((map: any, currTeam: any) => {
    map[currTeam.teamName] = currTeam;
    return map;
}, {});

export const NbaTeamsMappedByNickname: Record<string, NbaTeamIdentifiers> = NbaTeams.reduce((map: any, currTeam: any) => {
    map[currTeam.teamNickname] = currTeam;
    return map;
}, {});

export const NbaTeamsMappedByNbaApiId: Record<number, NbaTeamIdentifiers> = NbaTeams.reduce((map: any, currTeam: any) => {
    map[currTeam.nbaApiId] = currTeam;
    return map;
}, {});