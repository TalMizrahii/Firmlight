import Cookies from 'js-cookie';
import {serverAddress} from "../../Strings";

/**
 * Fetches all groups for the current user, using the access token stored in cookies.
 * @returns {Promise<any|*[]>} The groups for the current user, or an empty array if the request fails.
 */
export const getAllGroups = async () => {
    const accessToken = Cookies.get('accessToken');
    const userId = Cookies.get('userID');
    // Define the URL for the request to the server.
    const url = `${serverAddress}/groups/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        // If the request fails, throw an error.
        if (!response.ok) {
            throw new Error('Failed to fetch groups');
        }
        // Return the JSON response.
        return await response.json();
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
};
