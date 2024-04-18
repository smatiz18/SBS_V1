import { TabParams } from "../../models/tab-params";
import { Routes } from "../../routes";
import About from "../about/about";
import Analytics from "../analytics/analytics";
import NBA from "../nba/nba";

const Container = (props: { path: string }) => {
    const about = {
        path: Routes.about,
        label: 'Portfolio Manager'
    } as TabParams;

    const analytics = {
        path: Routes.analytics,
        label: 'Analytics'
    } as TabParams;

    const nba = {
        path: Routes.nba,
        label: 'Research & Development'
    } as TabParams;

    const tabLinks = [
       about,
       analytics,
       nba,
    ] as TabParams[];

    const currentPage = () => {
        switch (props.path) {
            case Routes.about:
                return <About/>;
            case Routes.analytics:
                return <Analytics/>;
            case Routes.nba:
                return <NBA/>;
            default: 
                return <div className="default"></div>;
        }
    };

    return (
        <div className="container">
            {currentPage()}
        </div>
    );
}

export default Container;