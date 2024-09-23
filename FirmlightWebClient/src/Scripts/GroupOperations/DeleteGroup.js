import Cookies from 'js-cookie';
import { serverAddress } from "../../Strings";

/**
 * Delete a group by sending a DELETE request to the server.
 * @param {string} groupID - The ID of the group to delete.
 * @returns {Promise<boolean>} - Returns true if the group is successfully deleted, false otherwise.
 */
export const deleteGroup = async (groupID) => {
    try {
        const accessToken = Cookies.get('accessToken');
        const userID = Cookies.get('userID');

        // Dynamic server address for the request URL
        const url = `${serverAddress}/groups/${groupID}/${userID}`;

        const deleteGroupResponse = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!deleteGroupResponse.ok) {
            throw new Error('Failed to delete group');
        }

        return true;
    } catch (error) {
        console.error("Error deleting group:", error);
        return false;
    }
}
