import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import { Routes } from "../../../routes";
import { UserInfo } from "../../../models/user-info";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const ProtectedRoute = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <div>Loading...</div>; // Ensure context is available
  }

  if (auth.isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  return auth.isAuthenticated ? <Outlet /> : <Navigate to={`${Routes.root}${Routes.login}`} replace />;
};

export default ProtectedRoute;