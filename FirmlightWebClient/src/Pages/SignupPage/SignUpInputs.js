import React, {useState} from "react";
import {Alert} from "@mui/material";
import {serverAddress} from "../../Strings";
import {Link, useNavigate} from "react-router-dom";
import './SignUpInputs.css';

const SignUpInputs = () => {
    // Form data.
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    // Form errors.
    const [errors, setErrors] = useState({});
    // Server response.
    const [serverResponse, setServerResponse] = useState({status: false, message: '', show: false});
    // Navigation hook.
    const navigate = useNavigate();

    // Handle input change.
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    // Validate form data, show errors if any.
    const validate = () => {
        // Destructure form data.
        const {username, email, password, confirmPassword} = formData;
        let isValid = true;
        let errors = {};

        // Username validation
        if (!username || username.length < 6 || username.length > 20) {
            errors.username = "Invalid username";
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = "Invalid email format.";
            isValid = false;
        }

        // Password validation
        if (!password || password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
            errors.password = "Password must be at least 8 characters long and contain both letters and at least one number.";
            isValid = false;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }
        // Set errors if any.
        setErrors(errors);
        return isValid;
    };

    /**
     * Handle form submission.
     * @param e - event
     * @returns {Promise<void>} - returns nothing.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form data.
        if (!validate()) {
            return;
        }
        // Register user.
        const response = await registerUser();
        if (response) {  // Clear the form fields if registration is successful
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            console.log("Registration successful - redirecting to login page");
            // navigate('/login');
        }
    };

    /**
     * Register user.
     * @returns {Promise<any|boolean>} - returns response data or false.
     */
    const registerUser = async () => {
        try {
            // Send a POST request to the server.
            const url = `${serverAddress}/auth/register`;
            const response = await fetch(url, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            // Handle server response.
            if (response.status === 409) {
                const errorData = await response.json();
                setServerResponse({
                    message: errorData.message || "Username or email already exists.",
                    status: false,
                    show: true
                });
                return false;
            }

            // Handle server response.
            if (!response.ok) {
                const errorData = await response.json();
                setServerResponse({message: errorData.message || "An error occurred", status: false, show: true});
                return false;
            }
            // Registration successful.
            const result = await response.json();
            setServerResponse({message: "Registration successful", status: true, show: true});
            return result;
            // Handle errors.
        } catch (error) {
            console.error("Error:", error);
            setServerResponse({message: "An error occurred. Please try again later.", status: false, show: true});
            return false;
        }
    };

    return (
        <>
            <div className="Intro__input-container">
                <form onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <div className="inputWrapper">
                            <input
                                autoComplete="off"
                                required
                                type="text"
                                name="username"
                                placeholder="USERNAME"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="inputWrapper">
                            <input
                                autoComplete="off"
                                required
                                type="email"
                                name="email"
                                placeholder="E-MAIL"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="inputWrapper">
                            <input
                                autoComplete="off"
                                required
                                type="password"
                                name="password"
                                placeholder="PASSWORD"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="inputWrapper">
                            <input
                                autoComplete="off"
                                required
                                type="password"
                                name="confirmPassword"
                                placeholder="CONFIRM PASSWORD"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button className="Intro__submit-btn" type="submit">SIGN UP</button>
                </form>

                <p className="Intro__disclaimer">Already a member? <Link to="/login">log in</Link> here.</p>
            </div>
            <Alert className="signup-input-info" severity="info">
                <ul>
                    <li>Username must be between 6 and 20 characters.</li>
                    <li>Password must be at least 8 characters and contain letters and at least one number.</li>
                    {Object.keys(errors).map((key) => (
                        <li id="error-info" style={{color: 'red'}} key={key}>{errors[key]}</li>
                    ))}
                    {serverResponse.show &&
                        <li id="server-info"
                            style={{color: serverResponse.status ? 'darkgreen' : 'red'}}>
                            {serverResponse.message}</li>}
                </ul>
            </Alert>
        </>
    );
};

export default SignUpInputs;
