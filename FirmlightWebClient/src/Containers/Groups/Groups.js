import React from 'react';
import { Link } from 'react-router-dom';
import './Groups.css';
import { GroupFrame } from '../../Components';
import Cookies from 'js-cookie';

const Groups = ({ groups, updateGroupStarredStatus }) => {
    return (
        <div className="Groups">
            <div className="Groups__container">
                {groups.map((group, index) => (
                    <Link key={index} to={`/tasks/${group.groupID}`}>
                        <GroupFrame
                            creator={group.creatorUsername}
                            GroupName={group.groupName}
                            created={group.created}
                            Description={group.description}
                            stared={group.members.some(member => member.userID === Cookies.get('userID') && member.starred)} // Determine if the group is starred for the current user
                            members={group.members}
                            groupID={group.groupID}
                            updateGroupStarredStatus={updateGroupStarredStatus}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Groups;
