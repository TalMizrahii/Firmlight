import React from 'react';
import './Tasks.css';
import {TaskFrame} from '../../Components';

const Tasks = ({tasks, handleTaskClick}) => {

    return (
        <>
            <div className="tasks">
                <div className="tasks__container">
                    {tasks.map((task, index) => (
                        <TaskFrame
                            onClick={() => handleTaskClick(task)}
                            key={index}
                            taskName={task.title}
                            status={task.status}
                            creator={task.creatorUsername}
                            description={task.description}
                            statistics={task.statistics}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Tasks;
