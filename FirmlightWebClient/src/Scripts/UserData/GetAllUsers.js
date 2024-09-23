import { serverAddress } from "../../Strings";

/**
 * Get all users from the server.
 * @returns {Promise<any|*[]>} - returns a promise that resolves to an array of users.
 */
export const getAllUsers = async () => {
    try {
        const response = await fetch(`${serverAddress}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
