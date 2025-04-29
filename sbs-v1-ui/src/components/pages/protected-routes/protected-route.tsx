import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import { Routes } from "../../../routes";
import { waveform } from 'ldrs'
import './protected-route.scss';

const ProtectedRoute = () => {
  waveform.register();

  const auth = useContext(AuthContext);

  if (!auth) {
    return <div className='loader-wrapper'>
      <l-waveform
        size="30"
        stroke="3.25"
        speed="1" 
        color="rgb(71 85 105 / 1)" 
      ></l-waveform> 
    </div>;
  }

  if (auth.isAuthenticated === null) {
    return <div className='loader-wrapper'>
      <l-waveform
        size="30"
        stroke="3.25"
        speed="1" 
        color="rgb(71 85 105 / 1)" 
      ></l-waveform>
    </div>;
  }

  return auth.isAuthenticated ? <Outlet /> : <Navigate to={`${Routes.root}${Routes.login}`} replace />;
};

export default ProtectedRoute;