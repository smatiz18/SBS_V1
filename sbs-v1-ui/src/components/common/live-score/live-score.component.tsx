import { useEffect, useState } from "react";
import { Matchup } from "../../../models/matchup";
import { Game } from "../../../models/services/get-nba-live-scores-response";
import StatusCircle from "../status-circle/status-circle";
import { ring2 } from 'ldrs';
import './live-score.component.scss';

const LiveScoreComponent: React.FC<{matchup: Matchup, liveScores: Game}> = ({matchup, liveScores}) => {
    const [areLiveScoresLoading, setAreLiveScoresLoading] = useState(true);
    
    useEffect(() => {
        setAreLiveScoresLoading(true);
    
        const timer = setTimeout(() => {
          setAreLiveScoresLoading(false);
        }, 300); // 0.3 seconds
    
        return () => clearTimeout(timer)
    }, [liveScores]);

    const getGameStatus = () => {
        if (liveScores.status.halftime) {
            return 'Halftime';
        }
        return `Q${liveScores.periods.current} | ${liveScores.status.clock}`;
    };
    
    if (matchup.dateStart < new Date().toISOString() && liveScores) {
        const visitorsPoints = liveScores?.scores?.visitors?.points !== undefined ? liveScores.scores.visitors.points : '-';
        const homePoints = liveScores?.scores?.home?.points !== undefined ? liveScores.scores.home.points : '-';
        
        return (
            <div className="live-score-container">
                <div className="status-circle-wrapper">
                    <StatusCircle />
                </div>
                { 
                    areLiveScoresLoading && 
                    <div className="loading-spinner">spinning</div> 
                }
                { 
                    !areLiveScoresLoading &&
                    <div className='content'>
                        <div className="score-row">
                        <div className="team-score">
                            <div className="team-nickname">{(liveScores?.teams?.visitors?.code || 'AWAY').toUpperCase()}</div>
                            <div className="live-score">{visitorsPoints}</div>
                        </div>
                
                        <span className="score-divider">–</span>
                
                        <div className="team-score">
                            <div className="team-nickname">{(liveScores?.teams?.home?.code || 'HOME').toUpperCase()}</div>
                            <div className="live-score">{homePoints}</div>
                        </div>
                        </div>
                        <div className="game-status">{getGameStatus()}</div>
                    </div>
                }
            </div>
        );
    }
    return (
        <div>
            {/* empty empty */}
        </div>
    );
}

export default LiveScoreComponent;