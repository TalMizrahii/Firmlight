import React, {useState} from 'react';
import './GroupFrame.css';
import Star from "../../Assets/icons/star.png";
import Starshine from "../../Assets/icons/starshine.png";
import {Tooltip} from "@mui/material";
import {starGroup} from "../../Scripts";

const GroupFrame = ({GroupName, Description, created, stared, members, creator, groupID, updateGroupStarredStatus}) => {
    const [isStared, setIsStared] = useState(stared);

    const truncateLine = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    const handleStar = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            const newStaredStatus = !isStared;
            const success = await starGroup(groupID, newStaredStatus);
            if (success) {
                setIsStared(newStaredStatus);
                updateGroupStarredStatus(groupID, newStaredStatus); // Notify parent to update state
            } else {
                console.error("Failed to star group");
            }
        } catch (error) {
            console.error("Error starring group:", error);
        }
    };

    return (
        <div id="Group-frame" className="Group-frame">
            <div className="Group-frame__head">
                <h1>{truncateLine(GroupName, 30)}</h1>
                {isStared ? <img className="star" src={Starshine} alt="star" onClick={handleStar}/>
                    : <img className="star" src={Star} alt="starshine" onClick={handleStar}/>}
            </div>
            <div className="Group-frame__description">
                <p>{truncateLine(Description, 80)}</p>
            </div>
            <div className="Group-frame__Bottom">
                <div className="Group-frame-date">
                    <p className="Group-frame__date-text">{created}</p>
                    <div id="Group-frame__creator" className="Group-frame__avatars">
                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar"/>
                        <p className="Group-frame__creator-username">Admin: {creator}</p>
                    </div>
                </div>
                <div className="Group-frame__avatars">
                    {members && members.map((member, index) => (
                        <Tooltip key={member.id || index} title={member.username}>
                            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar"/>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupFrame;
