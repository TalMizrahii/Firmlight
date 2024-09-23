import Cookies from "js-cookie";
import {serverAddress} from "../../Strings";


export const answerAllGroupRequests = async (answer) => {
    const accessToken = Cookies.get('accessToken');
    const userID = Cookies.get('userID');
    try {
        const response = await fetch(`${serverAddress}/groups/answerall`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                userID: userID,
                answer: answer
            })
        });
        if (!response.ok) {
            throw new Error('Failed answer all group requests');
        }
        return await response.json();
    } catch (error) {
        console.error('Error answer all group requests:', error);
        return null;
    }
}