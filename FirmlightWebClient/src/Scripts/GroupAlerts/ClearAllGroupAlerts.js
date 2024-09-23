import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

export async function clearAllGroupAlerts() {
    const userID = Cookies.get('userID');
    const accessToken = Cookies.get('accessToken');
    const url = `${serverAddress}/users/${userID}/alerts`;
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!res.ok) {
            throw new Error('Failed to delete all group alerts');
        }
        return true;
    } catch (error) {
        console.error("Error deleting all group alerts:", error);
        return false;
    }
}