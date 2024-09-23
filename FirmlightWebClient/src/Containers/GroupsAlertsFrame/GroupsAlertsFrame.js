import React from 'react';
import './GroupsAlertsFrame.css';
import {GroupNotification} from '../../Components';

const GroupsAlertsFrame = ({
                               groupAlerts,
                               handleGroupAlertsClose,
                           }) => {
    // Sort alerts by ID in ascending order (earliest alerts first)
    const sortedGroupAlerts = [...groupAlerts].sort((a, b) => b.id - a.id);

    // Get at most 5 latest notifications (latest in terms of ID)
    const latestGroupAlerts = sortedGroupAlerts.slice(0, 5);

    return (
        <div className="GroupsNotifications">
            {latestGroupAlerts.map((alert, index) => (
                <GroupNotification
                    key={alert.id}
                    handleNotificationClose={() => handleGroupAlertsClose(index)}
                    groupName={alert.groupName}
                    description={alert.message}
                    status={alert.type}
                />
            ))}
        </div>
    );
};

export default GroupsAlertsFrame;
