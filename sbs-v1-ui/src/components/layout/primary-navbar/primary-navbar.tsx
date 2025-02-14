import React, { useEffect, useState } from 'react';
import './primary-navbar.scss';
import { Routes } from '../../../routes';
import sbs_logo from '../../../assets/sbs-branding/sandbox_v3_3.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { UserInfo } from '../../../models/user-info';
import { clearUserInfo } from '../../../store/slices/user-info-slice';

const PrimaryNavbar: React.FC<{}> = () => {
    /* Store ****************************************/
    const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
    const dispatch = useDispatch<AppDispatch>();
    /************************************************/
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="primary-navbar">
            <div className="logo">
              <img src={sbs_logo} alt="Sports Betting Sandbox"/>
              <div className='sbs-beta'>Beta</div>
            </div>
            <ul className="nav-links">
                { 
                    userInfo.email &&
                    <li className="nav-link" onMouseEnter={toggleDropdown}
                        onMouseLeave={toggleDropdown}>
                        <a href={`${Routes.root}${Routes.dailyMatchups}${Routes.nba}`}>
                            Daily Matchups
                        </a>
                        {isDropdownOpen && (
                            <ul className="nav-links-dropdown">
                                <li className="nav-link-dropdown">
                                    <a href={`${Routes.root}${Routes.dailyMatchups}${Routes.nba}`}>NBA</a>
                                </li>
                            </ul>
                        )}
                    </li>
                }
                
                {/* <li className="nav-link">
                    <a href={`${Routes.root}${Routes.backtest}`}>
                        Backtest
                    </a>
                </li>
                <li className="nav-link">
                    <a href={`${Routes.root}${Routes.analytics}`}>
                        Analytics
                    </a>
                </li> */}
                <li className="nav-link">
                    <a href={`${Routes.root}${Routes.about}`}>
                        About
                    </a>
                </li>
                { 
                    !userInfo.email && 
                    <li className="nav-link">
                        <a href={`${Routes.root}${Routes.login}`}>
                            Login
                        </a>
                    </li>
                }
                { 
                    userInfo.email && 
                    <li className="nav-link">
                        <a href={`${Routes.root}${Routes.login}`} onClick={() => dispatch(clearUserInfo())}>
                            Logout
                        </a>
                    </li>
                }
            </ul>
        </nav>
    );
}

export default PrimaryNavbar;