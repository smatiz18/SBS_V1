import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrimaryNavbar from '../components/layout/primary-navbar/primary-navbar';
import './App.scss';
import { Routes as PageRoutes } from '../routes';
import Container from '../components/pages/container/container';

function App() {
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
