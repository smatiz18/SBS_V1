import { useContext } from "react";
import { Routes } from "../../../routes";
import About from "../about/about";
import Analytics from "../analytics/analytics";
import BacktestPage from "../backtest/backtest";
import NbaDailyMatchups from "../daily-matchups/nba/nba-daily-matchups";
import Login from "../login/login";
import { AuthContext } from "../../../context/auth-context";
import "./container.scss";

const Container = (props: { path: string }) => {
    const auth = useContext(AuthContext);
    
    const currentPage = () => {
        switch (props.path) {
            case `${Routes.about}`:
                return <About/>;
            case `${Routes.analytics}`:
                return <Analytics/>;
            case `${Routes.dailyMatchups}${Routes.nba}`:
                return <NbaDailyMatchups/>;
            case `${Routes.backtest}`:
                return <BacktestPage/>;
            case `${Routes.login}`:
                if (auth && auth.isAuthenticated) {
                    window.location.href = `${Routes.root}${Routes.about}`;
                    break;
                }
                return <Login/>;
            default: 
                return <div className="default"></div>;
        }
    };

    return (
        <div className="container">
            <div className="content">
                {currentPage()}
            </div>
        </div>
    );
}

export default Container;