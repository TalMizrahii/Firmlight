import Cookies from 'js-cookie';
import {serverAddress} from "../../Strings";

/**
 * Star or unstar a group.
 * @param groupID - the ID of the group to star or unstar.
 * @param status - the new status of the group (true for starred, false for unstarred).
 * @returns {Promise<any>} - the response from the server.
 */
export const starGroup = async (groupID, status) => {
    // Get access token and user ID from cookies to send in the request.
    const accessToken = Cookies.get('accessToken');
    const userId = Cookies.get('userID');
    // POST request to star endpoint with dynamic server address
    const url = `${serverAddress}/groups/${groupID}/star`;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({userID: userId, status: status})
        });
        // Check if the request was successful.
        if (!response.ok) {
            throw new Error('Failed to star the group');
        }
        // Return the response from the server.
        return await response.json();
    } catch (error) {
        console.log('Error starring group:', error);
    }
};
