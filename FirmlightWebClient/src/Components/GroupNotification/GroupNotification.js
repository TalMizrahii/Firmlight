import React from 'react';
import './GroupNotification.css';
import GroupNotificationInfo from './GroupNotificationInfo/GroupNotificationInfo';
import GroupNotificationSuccess from './GroupNotificationSuccess/GroupNotificationSuccess';
import GroupNotificationError from './GroupNotificationError/GroupNotificationError';

const GroupNotification = ({ groupName, description, status, handleNotificationClose}) => {

    // Function to truncate the line.
    const truncateLine = (text, maxLength) => {
        if (!text) return text;
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <>
            {status === "info" && (
                <GroupNotificationInfo
                    handleNotificationClose={handleNotificationClose}
                    groupName={truncateLine(groupName, 30)}
                    description={truncateLine(description, 80)}
                />
            )}
            {status === "success" && (
                <GroupNotificationSuccess
                    handleNotificationClose={handleNotificationClose}
                    groupName={truncateLine(groupName, 30)}
                    description={truncateLine(description, 80)}
                />
            )}
            {status !== "info" && status !== "success" && (
                <GroupNotificationError
                    handleNotificationClose={handleNotificationClose}
                    groupName={truncateLine(groupName, 30)}
                    description={truncateLine(description, 80)}
                />
            )}
        </>
    );
};

export default GroupNotification;
