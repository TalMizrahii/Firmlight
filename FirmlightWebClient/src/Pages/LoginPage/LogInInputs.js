import {Link, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import './LogInInputs.css';
import Cookies from 'js-cookie';
import {login, validateToken} from "../../Scripts";

const LogInInputs = () => {
    // Form data.
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    });
    // Use navigate hook to redirect user after login.
    const navigate = useNavigate();
    // Show error message if login fails.
    const [showMessageError, setShowMessageError] = useState(false);


    useEffect(() => {


        async function checkUser() {
            try {
                const accessToken = Cookies.get('accessToken');
                const refreshToken = Cookies.get('refreshToken');
                const userID = Cookies.get('userID');
                const email = Cookies.get('email');
                const username = Cookies.get('username');
                if (!accessToken || !refreshToken || !userID || !email || !username) {
                    console.log("Incomplete user data in cookies to autologin.");
                    return;
                }
                const userCredentials = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    id: userID,
                    email: email,
                    username: username
                };

                const isValid = await validateToken(userCredentials);
                console.log("Token validation result:", isValid);

                if (isValid) {
                    console.log("User is already logged in.");
                    navigate('/groups');
                } else {
                    console.log("User is not logged in.");
                }
            } catch (error) {
                console.log("Token validation failed:", error);
            } finally {
            }
        }

        checkUser().then();
    }, [navigate]);

    // Handle input change.
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Handle form submission.
     * @param e - event
     * @returns {Promise<void>} - returns nothing.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowMessageError(false); // Reset error message before attempting login
        try {
            const response = await login(formData);
            if (!response || !response.status === 200) {
                setShowMessageError(true);
                return;
            }
            console.log("Login response111111111:", response);
            // Reset error message and log in user.
            Cookies.set('userID', response.id);
            Cookies.set('email', response.email);
            Cookies.set('username', response.username);
            Cookies.set('accessToken', response.accessToken);
            Cookies.set('refreshToken', response.refreshToken);
            navigate('/groups');
        } catch (error) {
            console.log("Error:", error);
            setShowMessageError(true);
        }
        // Reset form data.
        setFormData({
            usernameOrEmail: '',
            password: '',
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="Intro__input-container">
                    <div className="inputGroup">
                        <input
                            autoComplete="off"
                            required type="text"
                            name="usernameOrEmail"
                            placeholder="USERNAME / EMAIL"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                        />
                        <input
                            autoComplete="off"
                            required type="password"
                            name="password"
                            placeholder="PASSWORD"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    {showMessageError &&
                        <p className="invalid-creds-error" style={{color: 'red'}}>Username or password are invalid.</p>}
                    <button type="submit" className="Intro__submit-btn">LOG IN</button>
                    <p className="Intro__disclaimer">Haven't registered yet? <Link to="/signin">Sign up</Link> here.</p>
                </div>
            </form>
        </>
    )
}

export default LogInInputs;
