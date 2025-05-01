import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrimaryNavbar from '../components/layout/primary-navbar/primary-navbar';
import { Routes as PageRoutes } from '../routes';
import Container from '../components/pages/container/container';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { UserInfo } from '../models/user-info';
import { clearUserInfo } from '../store/slices/user-info-slice';
import { convertUTCStringToESTString, EST_TIMEZONE } from '../utils/utils';
import { toZonedTime } from 'date-fns-tz';
import ProtectedRoute from '../components/pages/protected-routes/protected-route';
import './App.scss';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    const getHoursDifference = (date1: Date, date2: Date): number => {
      const diffInMs = Math.abs(date1.getTime() - date2.getTime()); // Difference in milliseconds
      return diffInMs / (1000 * 60 * 60); // Convert to hours
    };

    const isValidDateString = (dateString: string): boolean => {
      return dateString !== null && dateString !== undefined;
    }

    const interval = setInterval(() => {
      if (isValidDateString(userInfo.lastLogin || '')) {
        const lastLoginDate = new Date(convertUTCStringToESTString(userInfo.lastLogin!));
        const currentDate = toZonedTime(new Date(), EST_TIMEZONE);
        const hoursDiff = getHoursDifference(currentDate, lastLoginDate);
        if (hoursDiff >= 10) {
          dispatch(clearUserInfo());
          window.location.href = `${PageRoutes.root}${PageRoutes.login}`;
        }
      } else {
        dispatch(clearUserInfo());
      }
      
    }, 15 /* min */ * 60 /* sec */ * 1000 /* ms */);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className='main-container'>
      <BrowserRouter>
        <div className='nav-bar-container'>
          <PrimaryNavbar />
        </div>
        <div className='pages-container'>
          <Routes>
            {/* Public Routes */}
            <Route path={`${PageRoutes.root}${PageRoutes.about}`} element={<Container path={PageRoutes.about} />} />
            <Route path={`${PageRoutes.root}${PageRoutes.login}`} element={<Container path={PageRoutes.login} />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path={`${PageRoutes.root}${PageRoutes.dailyMatchups}${PageRoutes.nba}`} 
                element={<Container path={`${PageRoutes.dailyMatchups}${PageRoutes.nba}`} />} />
              <Route path={`${PageRoutes.root}${PageRoutes.backtest}`} 
                element={<Container path={PageRoutes.backtest} />} />
              <Route path={`${PageRoutes.root}${PageRoutes.analytics}`} 
                element={<Container path={PageRoutes.analytics} />} />
            </Route>
            <Route path="*" element={<Container path={PageRoutes.about} />} />
          </Routes>
        </div>
        <div className="footer-container">
          <div className="content">
            {
              `Sports Betting Sandbox does not own any team logos or images used herein.
              All team logos and images are trademarks of, and owned by, their respective leagues and teams, and this application is not affiliated with any of them.`
            }
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
