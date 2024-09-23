import './LandingPage.css';
import FullLogo from '../../Assets/Images/FullLogo.png';
import lampLight from '../../Assets/Images/LampLight.png';
import lampNoLight from '../../Assets/Images/LampNoLight.png';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

/**
 * LandingPage component
 * @returns {JSX.Element} - LandingPage component
 * @constructor - LandingPage
 */
const LandingPage = () => {
    let navigate = useNavigate();
    const [light, setLight] = useState(true);
    function onLight() {
        setLight(!light);
    }

    function goToSignUp() {
        navigate("/signin");
    }

    function goToLogin() {
        navigate("/login");
    }

    return (
        <>
            <div className="LandingPage">
                <div className="LandingPage__header-container">
                    <div className="LandingPage__text-container">
                        <img src={FullLogo} alt='landing-page' className="LogoImage"/>
                        <div className="LandingPage__headline-container">
                            <div className="LandingPage__headline-text"> Brings you to another level,</div>
                            <div className="LandingPage__headline-text-bold">together.</div>
                        </div>
                    </div>
                    {light && <img src={lampLight} alt='lamp' className="lamp-img" onMouseLeave={onLight}/>}
                    {!light && <img src={lampNoLight} alt='lamp' className="lamp-img" onMouseEnter={onLight}/>}
                </div>
                <div className="LandingPage__content-container">
                    <div className="LandingPage__content-button">
                        <button id="login-btn" onClick={goToLogin}>Log in</button>
                    </div>
                    <div className="LandingPage__content-button">
                        <button id="signup-btn" onClick={goToSignUp}>Sign up</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LandingPage;
