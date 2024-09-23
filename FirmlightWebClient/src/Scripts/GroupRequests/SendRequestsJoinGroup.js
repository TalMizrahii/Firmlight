import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";

export const sendRequestsJoinGroup = async (groupID, requests) => {
    try{
        const userID = Cookies.get('userID');
        const url = `${serverAddress}/groups/request`;
        const accessToken = Cookies.get('accessToken');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                creatorID: userID,
                groupID: groupID,
                requests: requests
            }),
        });
        return response.ok;

    }catch (error){
        console.error('Failed to send requests:', error);
        return null;
    }

}