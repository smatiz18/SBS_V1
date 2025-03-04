import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Use Link instead of <a>
import { Routes } from '../../../routes';
import sbs_logo from '../../../assets/sbs-branding/sandbox_v3_3.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { UserInfo } from '../../../models/user-info';
import { clearUserInfo } from '../../../store/slices/user-info-slice';
import './primary-navbar.scss';

const PrimaryNavbar: React.FC = () => {
    const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
    const dispatch = useDispatch<AppDispatch>();

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLUListElement | null>(null);

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
                        <Link to={`${Routes.root}${Routes.dailyMatchups}${Routes.nba}`}>
                            {'Daily Matchups  ▼'}
                        </Link>
                        {isDropdownOpen && (
                            <ul className="nav-links-dropdown">
                                <li className="nav-link-dropdown">
                                    <Link to={`${Routes.root}${Routes.dailyMatchups}${Routes.nba}`}>NBA</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                )}

                <li className="nav-link">
                    <Link to={`${Routes.root}${Routes.about}`}>About</Link> {/* ✅ Fix */}
                </li>

                {!userInfo.email ? (
                    <li className="nav-link">
                        <Link to={`${Routes.root}${Routes.login}`}>Login</Link> {/* ✅ Fix */}
                    </li>
                ) : (
                    <li className="nav-link">
                        <Link to={`${Routes.root}${Routes.login}`} onClick={() => dispatch(clearUserInfo())}>
                            Logout
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default PrimaryNavbar;
