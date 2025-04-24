import { ReactElement } from "react";
import './status-circle.scss';

const StatusCircle: React.FC<{color?: string, size?: string}> = (color, size) => {
    const style = () => {
        let currStyle = {};
        if (color !== undefined) {
            currStyle = {
                ...currStyle,
                backgroundColor: color,
            };
        }

        if (size !== undefined) {
            currStyle = {
                ...currStyle,
                width: size,
                height: size,
            };
        }

        return currStyle;
    };

    return (
        <div className='status-circle' style={style()}>
        </div>
    );
}

export default StatusCircle;