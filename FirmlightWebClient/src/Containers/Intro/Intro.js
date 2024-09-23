import './Intro.css';
import IntroPic from "../../Assets/Images/intro.png";
import FullLogo from "../../Assets/Images/FullLogo.png";
import React from "react";

const Intro = ({inputs}) => {
    return (
        <>
            <div className="Intro">
                <div className="Intro__container">
                    <img src={IntroPic} alt="intro" className="Intro__intro-img"/>
                    <img src={FullLogo} alt="logo" className="Intro__logo-img"/>
                    <div className="Intro__form-container">
                        {inputs}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Intro;
