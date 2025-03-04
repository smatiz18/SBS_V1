import optimalOdds from "../../../assets/images/optimal-odds.png";
import chartAnalyzer from "../../../assets/images/chart-analyzer.png";
import nbaMatchups from "../../../assets/images/nba-matchups.png";
import sbs_logo from '../../../assets/sbs-branding/sandbox_v3_1.png';
import { useState } from 'react';
import { motion } from 'framer-motion';
import './about.scss';

const About = () => {
    const [isLogoLoaded, setIsLogoLoaded] = useState(false);

    return (
        <div className='about-page-container'>
            <motion.div
                className="logo-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isLogoLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <img
                    src={sbs_logo}
                    alt="Sports Betting Sandbox"
                    onLoad={() => setIsLogoLoaded(true)}
                    style={{ visibility: isLogoLoaded ? "visible" : "hidden" }}
                />
            </motion.div>
            {isLogoLoaded && (
                <motion.div
                    className="fade-in"
                    initial={{ opacity: 0, transform: "translateY(5px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                >
                    <div className="about-content">
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
                                    <p>Compare odds from multiple sportsbooks and get the best value.</p>
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
                                    <div className="event">🚀 Standalone Player/Team Stats Analysis Page 🚀</div>
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
                </motion.div>
            )}
        </div>
    );
};

export default About;
