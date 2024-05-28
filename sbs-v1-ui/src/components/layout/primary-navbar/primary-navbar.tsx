import React, { useState } from 'react';
import './primary-navbar.scss';
import { Routes } from '../../../routes';
import sbs_logo from '../../../assets/images/basketball-sandbox-mask.png'

const PrimaryNavbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    };
    
    return (
        <nav className="primary-navbar">
            <div className="logo">
              <img src={sbs_logo} alt="Sports Betting Sandbox"/>
            </div>
            <ul className="nav-links">
                <li className="nav-link" onMouseEnter={toggleDropdown}
                    onMouseLeave={toggleDropdown}>
                    <a href={`${Routes.root}${Routes.sports_categories}`}>
                        Sports
                    </a>
                    {isDropdownOpen && (
                        <ul className="nav-links-dropdown">
                            <li className="nav-link-dropdown">
                                <a href={`${Routes.root}${Routes.sports_categories}${Routes.nba}`}>NBA</a>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="nav-link">
                    <a href={`${Routes.root}${Routes.analytics}`}>
                        Analytics
                    </a>
                </li>
                <li className="nav-link">
                    <a href={`${Routes.root}${Routes.about}`}>
                        About
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default PrimaryNavbar;