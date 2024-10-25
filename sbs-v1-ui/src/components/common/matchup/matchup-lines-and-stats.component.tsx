const MatchupLinesAndStatsComponent: React.FC<{data: any}> = ({data}) => {
    console.log(data);

    
    return (
        <div className="matchup-lines-and-stats-component-container">
            <div className="header">Sportsbook Lines and Stats</div>
            <div className="content">
                <div className="sportsbook-lines-container">
                    <div className="team-lines">
                        
                    </div>
                </div>
                <div className="stats-container">
                    <div className="team-stats">
                    </div>
                    <div className="player-stats">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchupLinesAndStatsComponent;