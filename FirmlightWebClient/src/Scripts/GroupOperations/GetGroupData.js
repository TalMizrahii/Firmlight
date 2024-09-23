import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

/**
 * Get group data by sending a request to the server.
 * @param groupID {string} - the ID of the group to get data for.
 * @returns {Promise<any|null>} - returns the group data if successful, null otherwise.
 */
export const getGroupData = async (groupID) => {
    try {
        // Get access token and user ID from cookies to send in the request.
        const accessToken = Cookies.get('accessToken');
        const userID = Cookies.get('userID');
        // Send a request to the server to get group data.
        const groupResponse = await fetch(`${serverAddress}/groups/${groupID}/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        // Check if the request was successful.
        if (!groupResponse.ok) {
            throw new Error('Failed to get group data');
        }
        // Parse response
        return await groupResponse.json();
    } catch (error) {
        console.error("Get group data error:", error);
        return null;
    }
}
