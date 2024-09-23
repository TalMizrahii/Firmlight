import React from "react";
import "./Footer.css";
import Logo from "../../Assets/Images/FullLogo.png";
import Nest from "../../Assets/Images/nest.png";
import reactLogo from "../../Assets/Images/react.png";
import {Link} from "react-router-dom";
import {linkSite} from "../../Strings";
import {firmlightAddress} from "../../Strings";


const Footer = ({error = false}) => {

    /**
     * Scrolls to the top of the page.
     */
    function handleScrollToTop() {
        window.scrollTo(0, 0);
    }

    return (

        <div className="footer">
            <div className="footer-links">
                <div className="footer-links_logo">
                    <Link id="footer_logo" onClick={handleScrollToTop} to=".">
                        <img src={Logo} alt="logo"/>
                    </Link>
                    <p>look for us at {firmlightAddress}</p>
                </div>
                <div className="footer-links_div">
                    <h4>links</h4>
                    <Link to="/terms">Terms & conditions</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/cookies">Use of cookies</Link>
                </div>
                <div className="footer-links_div">
                    <h4>Stay in touch</h4>
                    <a href={linkSite}>firmlightx@gmail.com
                    </a>
                    <a href="https://linkedin.com/in/talmizrahii">Linkedin</a>
                    <a href="https://github.com/TalMizrahii">Github</a>
                </div>
                <div className="footer-links_div">
                    <h4>Behind the scenes</h4>
                    <a href="https://israelforever.org/interact/multimedia/Music/banu_choshech_legaresh/">Why
                        Firmlight?</a>
                    <a href="https://en.wikipedia.org/wiki/Cornu_(horn)">About the logo</a>
                    <div className="footer-links_div_social">
                        <a href="https://nestjs.com/"><img src={Nest} alt="nest.js"/></a>
                        <a href="https://react.dev/"><img src={reactLogo} alt="React"/></a>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <p>Created by Tal Mizrahi</p>
                <p>@2024 Firmlight. All rights reserved.</p>
            </div>
         </div>

    )
}
export default Footer;