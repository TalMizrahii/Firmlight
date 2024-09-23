import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

export const deleteGroupAlert = (alertID) => {
    const userID =  Cookies.get('userID');
    const accessToken = Cookies.get('accessToken');
    const url = `${serverAddress}/users/${userID}/alerts/${alertID}`;
    try {
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        console.error("Error deleting group alert:", error);
    }
}