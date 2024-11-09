import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import './matchup-quick-stats.component.scss';

const MatchupQuickStats: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    return (
        <div className="matchup-quick-stats-component-container">
            <div className="quick-stats-container">
                <div className="header-container">
                    <h3>Quick Stats</h3>
                    <div className="line"></div>
                </div>
            </div>
        </div>
    )
}

export default MatchupQuickStats;