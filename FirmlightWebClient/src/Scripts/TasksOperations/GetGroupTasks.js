import {getGroupData} from "../GroupOperations/GetGroupData";

/**
 * Get group tasks by sending a request to the server.
 * @param groupID {string} - the ID of the group to get tasks for.
 * @returns {Promise<*|null>} - returns the group tasks if successful, null otherwise.
 */
export const getGroupTasks = async (groupID) => {
    try {
        const group = await getGroupData(groupID);
        if (!group) {
            console.error("Failed to fetch group data or user is not authorized.");
            return null;
        }
        return group.tasks;
    } catch (error) {
        console.error("Error fetching group data:", error);
        return null;
    }
}