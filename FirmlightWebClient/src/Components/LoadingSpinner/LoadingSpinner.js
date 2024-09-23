import {RotatingLines} from "react-loader-spinner";
import "./LoadingSpinner.css";

function LoadingSpinner() {
    return (
        <div id="loading-spinner">
            <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
            />
            <p className="loading-spinner_text">loading...</p>
        </div>
    )
}

export default LoadingSpinner;