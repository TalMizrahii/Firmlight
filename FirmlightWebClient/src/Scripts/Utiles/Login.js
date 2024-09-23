import {serverAddress} from "../../Strings";

/**
 * Log in user.
 * @returns {Promise<any|boolean>}
 */
export const login = async (formData) => {
    try {
        const url = `${serverAddress}/auth/login`;
        console.log("URL:", url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usernameOrEmail: formData.usernameOrEmail,
                password: formData.password
            })
        });
        if(!response.ok){
            return false;
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}