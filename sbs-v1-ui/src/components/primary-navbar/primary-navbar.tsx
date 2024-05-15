import React from 'react';
import './primary-navbar.scss';
import { Routes } from '../../routes';
import sbs_logo from '../../images/sbs_logo.png'

const PrimaryNavbar = () => {
    return (
        <nav className="primary-navbar">
            <div className="logo">
              <img src={sbs_logo} alt="Sports Betting Sandbox"/>
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