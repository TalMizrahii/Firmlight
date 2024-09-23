import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

/**
 * Get user notifications by sending a request to the server.
 * @returns {Promise<any|null>} - returns the user notifications if successful, null otherwise.
 */
export const getUserNotifications = async () => {
    const accessToken = Cookies.get('accessToken');
    const userID = Cookies.get('userID');
    try {
        const notificationsResponse = await fetch(`${serverAddress}/users/${userID}/notifications`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!notificationsResponse.ok) {
            throw new Error('Failed to get notifications');
        }
        console.log("Got notifications response:", notificationsResponse);
        const data = await notificationsResponse.json();
        return await data.map(notification => {
            return {
                groupID: notification.groupID,
                sender: notification.sender,
                senderUsername: notification.senderUsername,
                groupName: notification.groupName,
                type: "joinGroup",
                content: notification.senderUsername + " has invited you to join " + notification.groupName,
            };
        })
    } catch (error) {
        console.error("Get notifications error:", error);
        return null;
    }
}