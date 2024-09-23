import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {BasicTable, LoadingSpinner, Navbar} from '../../Components';
import {TasksHeader, Tasks, NewTaskModal, Footer, Content} from '../../Containers';
import './TasksPage.css';
import AddMemberModal from "../../Containers/AddMemberModal/AddMemberModal";
import {getGroupData, getGroupTasks, getTaskData} from "../../Scripts";
import Cookies from "js-cookie";

const TasksPage = () => {
    const {groupId} = useParams();
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [groupData, setGroupData] = useState({});
    const [isCreator, setIsCreator] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Fetch group data and tasks on mount.
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const data = await getGroupData(groupId);
                if (!data) {
                    console.error("Failed to fetch group data or user is not authorized.");
                    navigate("/groups");
                    return;
                }
                setGroupData(data);
                setTasks(data.tasks.sort((a, b) => b.taskId.localeCompare(a.taskId))); // Sort tasks in reverse order
                setIsCreator(data.creatorID === Cookies.get('userID'));
                setSelectedTask(data.tasks[0] ? data.tasks[0] : null);
                console.log("Group data fetched:", data);
            } catch (error) {
                console.error("Error fetching group data:", error);
                navigate("/groups");
            }
            setLoading(false);
        };

        fetchGroupData().then();
    }, [groupId, navigate]);

    // Refresh tasks data.
    useEffect(() => {
        filterTasks().then();
    }, [tasks, search, statusFilter]);


    // Refresh tasks data.
    const filterTasks = async () => {
        const filtered = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
            const descriptionMatches = task.description.toLowerCase().includes(search.toLowerCase());
            const totalMatches = matchesSearch || descriptionMatches;
            const matchesStatus = !statusFilter || task.status === statusFilter;
            return totalMatches && matchesStatus;
        });
        // Sort tasks in reverse order.
        const filteredTasks = filtered.sort((a, b) => b.taskId.localeCompare(a.taskId));
        setFilteredTasks(filteredTasks);
    }


    // Refresh tasks data.
    const refreshTasks = async () => {
        try {
            console.log('Refreshing tasks...');
            const newTasks = await getGroupTasks(groupId);
            if (!newTasks) {
                return;
            }
            const sortedTasks = newTasks.sort((a, b) => b.taskId.localeCompare(a.taskId));
            setTasks(sortedTasks);
            setSelectedTask(sortedTasks[0] ? sortedTasks[0] : null);
        } catch (error) {
            console.error('Failed to refresh tasks:', error);
        }
    };

    const addTask = (task) => {
        refreshTasks();
        setSelectedTask(task);
    }

    const handleTaskClick = async (task) => {
        try {
            // Fetch the task data.
            const newTask = await getTaskData(task.taskId, groupId);
            if (!newTask) {
                console.error("Failed to fetch task data.");
                return;
            }
            // Update the task in the tasks state array
            setTasks(prevTasks => {
                // Find the index of the task to update
                const taskIndex = prevTasks.findIndex(t => t.taskId === task.taskId);
                // If task exists in the array, update it.
                if (taskIndex !== -1) {
                    // Create a new array with the updated task.
                    const updatedTasks = [...prevTasks];
                    updatedTasks[taskIndex] = newTask;
                    return updatedTasks;
                }
                // If task doesn't exist, return the previous tasks.
                return prevTasks;
            });
            // Update the selected task
            setSelectedTask(newTask);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <>
            <Content>
                <Navbar
                    isGroups={false}
                    groups={[]}
                    tasks={tasks} // Pass tasks to Navbar to update notifications.
                />
                <TasksHeader
                    isCreator={isCreator}
                    setShowAddMemberModal={setShowAddMemberModal}
                    refreshHandler={refreshTasks}
                    groupData={groupData}
                    setShowTaskModal={setShowTaskModal}
                    breadcrumbs={['Groups', 'Tasks']}
                    setSearch={setSearch}
                    setFilter={setStatusFilter}
                    header={groupData ? groupData.groupName : ''}
                />
                <div className="tasks-page__content">
                    <div className="tasks-page__content-tasks">
                        <Tasks handleTaskClick={handleTaskClick} tasks={filteredTasks}/>
                    </div>
                    <div className="tasks-page__content-statistics">
                        {selectedTask ? <BasicTable taskData={selectedTask}/> : null}
                    </div>
                </div>
                {showAddMemberModal && <AddMemberModal
                    showModal={showAddMemberModal}
                    setShow={setShowAddMemberModal}
                    groupData={groupData}
                />}
                {showTaskModal && <NewTaskModal
                    groupID={groupId}
                    setShowTaskModal={setShowTaskModal}
                    addTask={addTask}
                />}
            </Content>
            <Footer/>
        </>
    );
};

export default TasksPage;
