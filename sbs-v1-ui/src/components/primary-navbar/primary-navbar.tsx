import React from 'react';
import './primary-navbar.scss';

const PrimaryNavbar = () => {
    return (
        <nav className="primary-navbar">
            <div className="logo">
              {/* <img src={liq_mask_1} alt="Liq v.Alpha"/> */}
              <strong>Sports Betting Sandbox</strong>
            </div>
            <ul className="nav-links">
                <li><a href="/nba">NBA </a></li>
                <li><a href="/analytics">Analytics</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    );
}

export default PrimaryNavbar;