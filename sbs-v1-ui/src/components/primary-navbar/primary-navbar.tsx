import React from 'react';
import './primary-navbar.scss';
import { Routes } from '../../routes';

const PrimaryNavbar = () => {
    return (
        <nav className="primary-navbar">
            <div className="logo">
              {/* <img src={liq_mask_1} alt="Liq v.Alpha"/> */}
              <b>Sports Betting Sandbox</b>
            </div>
            <ul className="nav-links">
                <li><a href={`${Routes.root}${Routes.nba}`}>NBA</a></li>
                <li><a href={`${Routes.root}${Routes.analytics}`}>Analytics</a></li>
                <li><a href={`${Routes.root}${Routes.about}`}>About</a></li>
            </ul>
        </nav>
    );
}

export default PrimaryNavbar;