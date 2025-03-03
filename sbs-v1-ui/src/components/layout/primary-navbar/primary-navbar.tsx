import React, { useState, useRef, useEffect } from 'react';
import './primary-navbar.scss';
import { Routes } from '../../../routes';
import sbs_logo from '../../../assets/sbs-branding/sandbox_v3_3.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { UserInfo } from '../../../models/user-info';
import { clearUserInfo } from '../../../store/slices/user-info-slice';

const PrimaryNavbar: React.FC = () => {
    /* Store ****************************************/
    const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
    const dispatch = useDispatch<AppDispatch>();
    /************************************************/
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLUListElement | null>(null);

    // **Fix: Close the mobile menu when clicking outside**
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMobileMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setMobileMenuOpen(false);
            }
        };

        // Only add event listener when the menu is open
        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="primary-navbar">
            <div className="logo">
                <img src={sbs_logo} alt="Sports Betting Sandbox" />
                <div className='sbs-beta'>Beta</div>
            </div>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                ☰
            </button>

            <ul ref={mobileMenuRef} className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
                {userInfo.email && (
                    <li 
                        className="nav-link dropdown" 
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <a href={`${Routes.root}${Routes.dailyMatchups}${Routes.nba}`}>
                            {'Daily Matchups  ▼'}
                        </a>
                        {isDropdownOpen && (
                            <ul className="nav-links-dropdown">
                                <li className="nav-link-dropdown">
                                    <a href={`${Routes.root}${Routes.dailyMatchups}${Routes.nba}`}>NBA</a>
                                </li>
                            </ul>
                        )}
                    </li>
                )}

                <li className="nav-link">
                    <a href={`${Routes.root}${Routes.about}`}>About</a>
                </li>

                {!userInfo.email ? (
                    <li className="nav-link">
                        <a href={`${Routes.root}${Routes.login}`}>Login</a>
                    </li>
                ) : (
                    <li className="nav-link">
                        <a href={`${Routes.root}${Routes.login}`} onClick={() => dispatch(clearUserInfo())}>
                            Logout
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default PrimaryNavbar;
