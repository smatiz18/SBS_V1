import './about.scss';
import optimalOdds from "../../../assets/images/optimal-odds.png";
import chartAnalyzer from "../../../assets/images/chart-analyzer.png";
import nbaMatchups from "../../../assets/images/nba-matchups.png";
import sbs_logo from '../../../assets/sbs-branding/sandbox_v3_1.png';
const About = () => {
    return (
        <div className='about-page-container'>
            <div className="about-content">
                <div className='logo-wrapper'>
                    <img src={sbs_logo} alt="Sports Betting Sandbox"/>
                </div>
                <section className="motivation">
                    <h1>Welcome</h1>
                    <p>
                        Have you ever wondered how many times the Knicks have gone on to score +130 points, 
                        given that they have already scored 36 points in the first quarter? 
                        Could you not sleep at night because you were wondering how the Mavericks are trending in the first half 
                        in home games vs away games? Were you pulling teeth because you had to rotate between 
                        FanDuel, DraftKings, and BetMGM trying to find the best odds? If so, we've got you covered.
                    </p>
                </section>
                <div className='line-wrapper'>
                    <div className="line"></div>
                </div>
                <section className="features">
                    <h2>Features</h2>
                    <div className="feature-grid">
                        <div className="feature">
                            <img src={nbaMatchups} alt="Daily Matchups" />
                            <h3>Daily Matchups</h3>
                            <p>See how teams stack up in our daily matchups dashboard.</p>
                        </div>
                        <div className="feature">
                            <img src={optimalOdds} alt="Odds Tracking" />
                            <h3>Odds Tracking</h3>
                            <p>Compare real-time odds from multiple sportsbooks and get the best value.</p>
                        </div>
                        <div className="feature">
                            <img src={chartAnalyzer} alt="Advanced Analytics" />
                            <h3>Advanced Analytics</h3>
                            <p>Utilize in-depth metrics, trends, and historical insights.</p>
                        </div>
                    </div>
                </section>
                <div className='line-wrapper'>
                    <div className="line"></div>
                </div>
                <section className="timeline">
                    <h2>Development Roadmap</h2>
                    <div className="timeline-container">
                        <div className="timeline-item">
                            <div className="date">Q1 2025</div>
                            <div className="event">🚀 Include Player Props and Stats 🚀</div>
                        </div>
                        <div className="timeline-item">
                            <div className="date">Q2 2025</div>
                            <div className="event">🚀 Expanded Sport Coverage 🚀</div>
                        </div>
                        <div className="timeline-item">
                            <div className="date">Q3 2025</div>
                            <div className="event">🚀 Betting Strategy Backtesting 🚀</div>
                        </div>
                    </div>
                </section>
                <div className='line-wrapper'>
                    <div className="line"></div>
                </div>
                <section className="contact">
                    <div className="contact-container">
                        <p>Contact us @ sportsbettingsandbox.inquiries@gmail.com</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default About;