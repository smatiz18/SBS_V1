import { TabParams } from "../../models/tab-params";
import { Routes } from "../../routes";
import About from "../about/about";
import Analytics from "../analytics/analytics";
import NBA from "../nba/nba";
import "./container.scss";

const Container = (props: { path: string }) => {
    const currentPage = () => {
        switch (props.path) {
            case `${Routes.about}`:
                return <About/>;
            case `${Routes.analytics}`:
                return <Analytics/>;
            case `${Routes.nba}`:
                return <NBA/>;
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