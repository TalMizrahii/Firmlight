import Cookies from 'js-cookie';
import { serverAddress } from "../../Strings";

/**
 * Log out user by sending a POST request to the server.
 * @returns {Promise<boolean>} - returns true if the user is logged out successfully, false otherwise.
 */
export const logout = async () => {
    try {
        // Get access token and user ID from cookies to send in the request.
        const accessToken = Cookies.get('accessToken');
        const userID = Cookies.get('userID');

        // POST request to logout endpoint with dynamic server address
        const logoutResponse = await fetch(`${serverAddress}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ id: userID })
        });

        // Check if the request was successful.
        if (!logoutResponse.ok) {
            throw new Error('Failed to log out');
        }

        // Clear all cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('userID');
        Cookies.remove('username');
        Cookies.remove('email');

        return true;
    } catch (error) {
        // Log error and return false if the request failed.
        console.error("Logout error:", error);
        return false;
    }
};
