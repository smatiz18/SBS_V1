import './about.scss';
const About = () => {
    return (
        <div className='about-container'>
            <div className="about-content">
                <section className="motivation">
                    <h1>Motivation</h1>
                    <p>
                        Our mission is to provide sports enthusiasts, bettors, and analysts with
                        real-time data, analytics, and insights to make informed decisions.
                        Whether you're backtesting strategies, tracking odds, or analyzing trends,
                        our platform is built to optimize your experience.
                    </p>
                </section>
                <div className='line-wrapper'>
                    <div className="line"></div>
                </div>
                <section className="features">
                    <h2>Features</h2>
                    <div className="feature-grid">
                        <div className="feature">
                            <img src="/assets/odds-tracking.png" alt="Odds Tracking" />
                            <h3>Odds Tracking</h3>
                            <p>Compare real-time odds from multiple sportsbooks and get the best value.</p>
                        </div>
                        <div className="feature">
                            <img src="/assets/backtesting.png" alt="Backtesting Strategies" />
                            <h3>Backtesting Strategies</h3>
                            <p>Test betting strategies using historical data to optimize decision-making.</p>
                        </div>
                        <div className="feature">
                            <img src="/assets/analytics.png" alt="Advanced Analytics" />
                            <h3>Advanced Analytics</h3>
                            <p>Utilize in-depth metrics, trends, and AI-driven insights.</p>
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
                            <div className="event">🔄 Live Bet Tracking Release</div>
                        </div>
                        <div className="timeline-item">
                            <div className="date">Q2 2025</div>
                            <div className="event">📊 AI-Driven Analysis Enhancement</div>
                        </div>
                        <div className="timeline-item">
                            <div className="date">Q3 2025</div>
                            <div className="event">📅 Expanded Sport Coverage</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
}

export default About;