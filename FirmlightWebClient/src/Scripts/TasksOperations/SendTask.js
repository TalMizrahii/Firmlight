import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

/**
 * Sends a task to the server.
 * @param groupID - The ID of the group to which the task is being sent.
 * @param selectedTask - The selected task.
 * @param description - The description of the task.
 * @param userData - The data required for the task.
 * @param type - The type of the task.
 * @returns {Promise<any|boolean>} - The response from the server.
 */
export const sendTask = async (groupID, selectedTask, description, userData, type) => {
    // Get the access token, user ID, and username from cookies.
    const accessToken = Cookies.get('accessToken');
    const userID = Cookies.get('userID');
    const username = Cookies.get('username');
    const url = `${serverAddress}/tasks/create`;
    let data = {};
    // Check the type of task and set the data object accordingly, e.g. MEAN, FACTORIZATION, CRAWLER.
    if (type === 'MEAN') {
        data = {
            numbers: userData
        }
    } else if (type === 'FACTORIZATION') {
        data = {
            numberToFactor: userData
        }
    } else if (type === 'CRAWLER') {
        data = {
            urls: userData.urlsInput,
            limit: userData.crawlLimit
        }
    }
    // Create the body object for the POST request.
    const body = {
        type: type,
        title: selectedTask,
        description: description,
        groupID: groupID,
        creatorID: userID,
        creatorUsername: username,
        data: data
    };
    // Send the task to the server.
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            console.log('Failed to send task');
            return false;
        }
        return await response.json();
    } catch (error) {
        console.error('Error sending task:', error);
        return false;
    }
}
