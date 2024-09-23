import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

/**
 * Fetches task data from the API.
 * @param taskID The ID of the task to fetch.
 * @param groupID The ID of the group the task belongs to.
 * @returns {Promise<null|{taskID: string, title: string, description: string, status: string, creatorID: string, assigneeID: string, dueDate: string}>}
 */
export const getTaskData = async (taskID, groupID) => {
    const userID = Cookies.get('userID');
    const accessToken = Cookies.get('accessToken');
    try {
        const response = await fetch(`${serverAddress}/groups/${groupID}/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                taskID: taskID,
                userID: userID
            })
        });
        if (!response.ok) {
            console.error("Failed to fetch task data.");
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching task data:", error);
        return null;
    }
}