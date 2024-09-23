import './TaskFrame.css';
import React from "react";
import Button from 'react-bootstrap/Button';
import {Tooltip} from "@mui/material";

const TaskFrame = ({taskName, description, creator, status, onClick, statistics}) => {
    console.log("Statistics:", statistics);

    // Function to truncate the line.
    const truncateLine = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <>
            <div id="task-frame" className="task-frame" onClick={onClick}>
                <div className="task-frame__head">
                    <h1>{truncateLine(taskName, 30)}</h1>
                </div>
                <div className="task-frame__description">
                    <p>{truncateLine(description, 80)}</p>
                </div>
                {status === "PROGRESS" && (
                    <Button id="tasks-status-btn-progress" variant="primary" disabled={true}>In Progress</Button>
                )}
                {status === "SUCCESS" && (
                    <Button id="tasks-status-btn-successful" variant="success" disabled={true}>Successful</Button>
                )}
                {status === "FAILED" && (
                    <Button id="tasks-status-btn-failed" variant="danger" disabled={true}>Failed</Button>
                )}
                <div className="task-frame__Bottom">
                    <div className="task-frame__avatars-creator">
                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar" title={creator}/>
                        <p>{creator}</p>
                    </div>
                    <div className="task-frame__avatars">
                        {Object.keys(statistics).map(workerID => (
                            <Tooltip title={statistics[workerID].workerUsername}>
                                <img
                                    key={workerID}
                                    src="https://www.w3schools.com/howto/img_avatar.png"
                                    alt="avatar" />
                            </Tooltip>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TaskFrame;
