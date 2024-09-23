import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

export const getUserGroupAlerts = async () => {
    const accessToken = Cookies.get('accessToken');
    const userID = Cookies.get('userID');
    const url = `${serverAddress}/users/${userID}/alerts`
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            return [];
        }
        const alertsJson = await response.json();
        return alertsJson.alerts;
    }
    catch (error) {
        console.error("Get notifications error:", error);
        return null;
    }
}