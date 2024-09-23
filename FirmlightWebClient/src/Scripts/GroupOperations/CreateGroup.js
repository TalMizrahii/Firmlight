import Cookies from 'js-cookie';
import { serverAddress } from "../../Strings";

/**
 * Create a new group by sending a POST request to the server.
 * @param {Object} groupDetails - The details of the group to create.
 * @param {string} groupDetails.groupName - The name of the group.
 * @param {string} groupDetails.groupDescription - The description of the group.
 * @param {Array} groupDetails.selectedOptions - The selected users to invite, each with an `id` property.
 * @returns {Promise<Object>} - Returns the created group data or an error object.
 */
export const createGroup = async (groupDetails) => {
    const { groupName, groupDescription, selectedOptions } = groupDetails;

    const userId = Cookies.get('userID');
    const creatorUsername = Cookies.get('username');
    const accessToken = Cookies.get('accessToken');

    // Dynamic server address for the request URL.
    const url = `${serverAddress}/groups/create`;

    // Ensure selectedOptions is an array of strings (user IDs).
    const requestIds = selectedOptions.map(option => option.id.toString());

    console.log('Creating group:', groupDetails);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                userId: userId,
                creatorUsername: creatorUsername,
                groupName: groupName,
                description: groupDescription,
                requests: requestIds,  // Pass the array of string IDs.
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create group');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating group:', error);
        return { error: error.message };
    }
};
