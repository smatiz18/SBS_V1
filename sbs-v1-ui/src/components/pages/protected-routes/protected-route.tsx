import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import { Routes } from "../../../routes";
import { ring2 } from 'ldrs'
import './protected-route.scss';

const ProtectedRoute = () => {
  ring2.register();

  const auth = useContext(AuthContext);

  if (!auth) {
    return <div className='loader-wrapper'>
      <l-ring-2
        size="30"
        stroke="5"
        stroke-length="0.25"
        bg-opacity="0.1"
        speed="0.8" 
        color="rgb(71 85 105 / 1)" 
      ></l-ring-2> 
    </div>;
  }

  if (auth.isAuthenticated === null) {
    return <div className='loader-wrapper'>
      <l-ring-2
        size="30"
        stroke="5"
        stroke-length="0.25"
        bg-opacity="0.1"
        speed="0.8" 
        color="rgb(71 85 105 / 1)" 
      ></l-ring-2> 
    </div>;
  }

  return auth.isAuthenticated ? <Outlet /> : <Navigate to={`${Routes.root}${Routes.login}`} replace />;
};

export default ProtectedRoute;