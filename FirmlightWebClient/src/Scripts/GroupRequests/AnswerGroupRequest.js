import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";


export const answerGroupRequest = async (groupID, answer) => {
    const accessToken = Cookies.get('accessToken');
    const userID = Cookies.get('userID');
    try {
        const response = await fetch(`${serverAddress}/groups/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                userID: userID,
                groupID: groupID,
                answer: answer
            })
        });
        if (!response.ok) {
            throw new Error('Failed to answer group request');
        }
        return await response.json();
    } catch (error) {
        console.error('Error answering group request:', error);
        return null;
    }
}