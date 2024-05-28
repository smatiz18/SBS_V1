import BasketballGame from "../../../common/game-overview/game-overview";
import "./nba.scss";

const NBA = () => {

    const homeTeam = {
        name: 'Lakers',
        logo: 'path/to/lakers-logo.png',
        lineup: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5']
      };
      
    const awayTeam = {
        name: 'Warriors',
        logo: 'path/to/warriors-logo.png',
        lineup: ['Player A', 'Player B', 'Player C', 'Player D', 'Player E']
    };

    return (
        <div className="page-container">
            <div className="header">
                <h1 className="header-title">NBA Matchups</h1>
            </div>
            <div className="content">
                <div className="main-content">
                    <BasketballGame homeTeam={homeTeam} awayTeam={awayTeam}/>
                </div>
            </div>
            <div className="footer">

            </div>
       </div>
    );
}

export default NBA;