import Cookies from 'js-cookie';
import { serverAddress } from "../../Strings";

/**
 * Validate the access token by sending a request to the server.
 * @returns {Promise<boolean>} - returns true if the token is valid, false otherwise.
 */
export const validateToken = async (userCredentials) => {
    try {
        const userData = userCredentials || {
            accessToken: Cookies.get('accessToken'),
            refreshToken: Cookies.get('refreshToken'),
            id: Cookies.get('userID'),
            email: Cookies.get('email'),
            username: Cookies.get('username')
        };

        const validateResponse = await validateAccessToken(userData.accessToken, userData.id);
        if (validateResponse) {
            return true;
        }

        console.log("Access token validation failed! Trying to refresh the token...");
        const refreshResult = await refreshAccessToken(userData.refreshToken, userData.id);

        if (refreshResult) {
            console.log("Token refreshed! Trying to validate the new token...");
            return await validateAccessToken(refreshResult.accessToken, userData.id);
        }

        console.log("Token refresh failed!");
        return false;
    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
};

/**
 * Validate access token.
 * @param {string} accessToken - The access token to validate.
 * @param {string} userId - The user ID to validate against.
 * @returns {Promise<boolean>} - Returns true if the access token is valid, false otherwise.
 */
const validateAccessToken = async (accessToken, userId) => {
    try {
        const response = await fetch(`${serverAddress}/auth/autologin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ id: userId })
        });

        return response.ok;
    } catch (error) {
        console.error("Error validating access token:", error);
        return false;
    }
};

/**
 * Refresh access token.
 * @param {string} refreshToken - The refresh token to use.
 * @param {string} userId - The user ID to refresh the token for.
 * @returns {Promise<object|null>} - Returns new tokens if successful, null otherwise.
 */
const refreshAccessToken = async (refreshToken, userId) => {
    try {
        const response = await fetch(`${serverAddress}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
            body: JSON.stringify({ id: userId })
        });

        if (response.ok) {
            const refreshData = await response.json();
            Cookies.set('accessToken', refreshData.accessToken, { secure: true });
            Cookies.set('refreshToken', refreshData.refreshToken, { secure: true });
            return refreshData;
        }

        return null;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
};
