import Cookies from 'js-cookie';
import { serverAddress } from "../../Strings";

/**
 * Exit a group by sending a PATCH request to the server.
 * @param {string} groupID - The ID of the group to exit.
 * @returns {Promise<boolean>} - Returns true if the user successfully exits the group, false otherwise.
 */
export const exitGroup = async (groupID) => {
    try {
        const accessToken = Cookies.get('accessToken');
        const userID = Cookies.get('userID');

        // Dynamic server address for the request URL
        const url = `${serverAddress}/groups/${groupID}/exit`;

        const exitGroupResponse = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ userID })
        });

        if (!exitGroupResponse.ok) {
            throw new Error('Failed to exit group');
        }

        return true;
    } catch (error) {
        console.error("Error exiting group:", error);
        return false;
    }
};
