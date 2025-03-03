import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrimaryNavbar from '../components/layout/primary-navbar/primary-navbar';
import './App.scss';
import { Routes as PageRoutes } from '../routes';
import Container from '../components/pages/container/container';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { UserInfo } from '../models/user-info';
import { clearUserInfo } from '../store/slices/user-info-slice';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    const getHoursDifference = (date1: Date, date2: Date): number => {
      const diffInMs = Math.abs(date1.getTime() - date2.getTime()); // Difference in milliseconds
      return diffInMs / (1000 * 60 * 60); // Convert to hours
    };

    const getMinutesDifference = (date1: Date, date2: Date): number => {
      const diffInMs = Math.abs(date1.getTime() - date2.getTime()); // Difference in milliseconds
      return diffInMs / (1000 * 60); // Convert to minutes
    };

    const isValidDateString = (dateString: string): boolean => {
      console.log("validating date string...");
      return dateString !== null && dateString !== undefined && dateString.length >= 23;
    }

    const interval = setInterval(() => {
      if (isValidDateString(userInfo.lastLogin || '')) {
        const lastLoginDate = new Date(userInfo.lastLogin!.substring(0, 23));
        const hoursDiff = getHoursDifference(new Date(), lastLoginDate);
        const minsDiff = getMinutesDifference(new Date(), lastLoginDate);
        console.log("checking user login status...");
        console.log(`user has been logged in for ${minsDiff} minutes`);
        console.log(userInfo);
        if (minsDiff >= 2) {
          // Log out the user
          dispatch(clearUserInfo());
          // window.location.href = `${PageRoutes.root}${PageRoutes.login}`;
        }
      } else {
        dispatch(clearUserInfo());
      }
      
    },  /* min */  30 /* sec */ * 1000 /* ms */);
    
    return () => clearInterval(interval);


  }, []);
  return (
    <div className='main-container'>
      <BrowserRouter>
        <div className='nav-bar-container'>
          <PrimaryNavbar/>
        </div>
        <div className='pages-container'>
          {/* define new routes in Routes.tsx */}
          <Routes>
            <Route path={`${PageRoutes.root}${PageRoutes.about}`} 
              element={<Container path={PageRoutes.about}/>}/>
            <Route path={`${PageRoutes.root}${PageRoutes.analytics}`} 
              element={<Container path={PageRoutes.analytics}/>}/>
            <Route path={`${PageRoutes.root}${PageRoutes.dailyMatchups}${PageRoutes.nba}`} 
              element={<Container path={`${PageRoutes.dailyMatchups}${PageRoutes.nba}`}/>}/>
            <Route path={`${PageRoutes.root}${PageRoutes.backtest}`} 
              element={<Container path={`${PageRoutes.backtest}`}/>}/>
            <Route path={`${PageRoutes.root}${PageRoutes.login}`} 
              element={<Container path={`${PageRoutes.login}`}/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

