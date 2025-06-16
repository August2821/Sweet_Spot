import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import MyPage from '../pages/MyPage/MyPage';
import MyMapPage from '../pages/MyMap/MyMapPage'
import Mapcommunity from '../pages/Mapcommunity/Mapcommunity';
import MapPage from '../pages/Map/MapPage'

const AppRouter = ({ isLoggedIn, user, setIsLoggedIn, setUser }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} user={user} />} />
      <Route path="/signin" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/mypage" element={<MyPage user={user} />} />      <Route path="/map" element={<MapPage user={user} />}/>
      <Route path="/MyMap" element={<MyMapPage user={user} />}/>
      <Route path="/mapcommunity" element={<Mapcommunity user={user} />}/>
    </Routes>
  );
};

export default AppRouter;
