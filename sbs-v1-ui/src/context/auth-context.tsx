import { createContext, useState, useEffect, ReactNode } from "react";
import { UserInfo } from "../models/user-info";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface AuthContextType {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);

    useEffect(() => {
        if (userInfo && userInfo.email) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [userInfo]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};