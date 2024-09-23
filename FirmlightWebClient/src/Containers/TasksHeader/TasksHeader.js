import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {DropMenu, Breadcrumbs, AlertDialog} from "../../Components";
import Dots from "../../Assets/icons/dots.png";
import "../GroupHeader/GroupHeader.css";
import {deleteGroup, exitGroup, logout} from "../../Scripts";

const TasksHeader = ({
                         setShowTaskModal,
                         setShowAddMemberModal,
                         setSearch,
                         setFilter,
                         breadcrumbs,
                         header,
                         groupData,
                         refreshHandler,
                         isCreator,
                     }) => {
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openDialogToGroups, setOpenDialogToGroups] = useState(false);
    const [openDialogToLanding, setOpenDialogToLanding] = useState(false);
    const [openDialogToDeleteGroup, setOpenDialogToDeleteGroup] = useState(false);

    /**
     * Fetches the group data when the component mounts.
     */

        // Handler for menu click.
    const handleMenuClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

    // Handler for menu close.
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handler for search input change.
    const searchHandler = (e) => {
        setSearch(e.target.value);
    };

    // Handler for filter button click.
    const filterTasks = (status) => {
        setFilter(status);
    };

    /**
     * Sets the dialog open to exit to the groups page.
     */
    const handleExitToGroup = () => {
        setOpenDialogToGroups(true);
        handleMenuClose();
    };

    /**
     * Sets the dialog open to exit to the landing page.
     */
    const handleExitToLanding = () => {
        setOpenDialogToLanding(true);
    };

    /**
     * Sets the dialog open to deletes the group.
     */
    const handleDeleteGroup = () => {
        setOpenDialogToDeleteGroup(true);
    }

    /**
     * Leaves the group and redirects to the groups page.
     */
    const handleLeaveGroup = () => {
        const response = exitGroup(groupData.groupID);
        if (!response) {
            console.log("Failed to exit group. ");
        } else {
            navigate("/groups");
        }
    };

    /**
     * Logs out the user and redirects to the login page.
     */
    const handleLogout = () => {
        const response = logout();
        if (!response) {
            console.error("Failed to log out");
        }
        navigate("/");
    };

    /**
     * Deletes the group.
     */
    const deleteGroupHandler = () => {
        const response = deleteGroup(groupData.groupID);
        if (!response) {
            console.error("Failed to delete group");
        } else {
            navigate("/groups");
        }
    }

    /**
     * Shows the new group modal.
     */
    const showModalNewTaskHandler = () => {
        setShowTaskModal(true);
    };

    const showModalAddMemberHandler = () => {
        setShowAddMemberModal(true);
    }

    // Determine menu actions based on groupData.
    const menuActions = [
        {title: "Log Out", handler: handleExitToLanding},
        {title: "Exit Group", handler: handleExitToGroup}
    ];
    // Add delete group action if the user is the creator of the group.
    if (isCreator) {
        menuActions.push({title: "Delete Group", handler: handleDeleteGroup});
    }


    return (
        <>
            <div className="header">
                <Breadcrumbs breadcrumbs={breadcrumbs}/>
                <div className="header__padding">
                    <div className="header__head">
                        <h1>{header}</h1>
                    </div>
                </div>
                <div className="header-content">
                    <form className="header-rightside">
                        <div className="header__search">
                            <span className="header__search-icon material-symbols-outlined">search</span>
                            <input className="header__search-input"
                                   type="search"
                                   placeholder="Search"
                                   onChange={searchHandler}
                            />
                        </div>
                        <button className="empty-btn btn-primary" type="button" onClick={() => filterTasks(null)}>
                            All Tasks
                        </button>
                        <button className="empty-btn btn-primary" type="button"
                                onClick={() => filterTasks('SUCCESS')}>
                            Successful
                        </button>
                        <button className="empty-btn btn-primary" type="button"
                                onClick={() => filterTasks('PROGRESS')}>
                            In Progress
                        </button>
                        <button
                            className="empty-btn btn-primary" type="button" onClick={() => filterTasks('FAILED')}>
                            Failed
                        </button>
                    </form>
                    <div className="header__left-side">
                        <button className="header__refresh btn btn-success" onClick={refreshHandler}>
                            Refresh
                        </button>
                        {isCreator &&
                            <button className="btn btn-primary" type="submit" onClick={showModalAddMemberHandler}>
                                Add Member
                            </button>}
                        <button className="btn btn-primary" type="submit" onClick={showModalNewTaskHandler}>
                            New Task
                        </button>
                        <img className="action-icons action-icons__single" src={Dots} alt="icon" onClick={handleMenuClick}/>
                        <DropMenu
                            open={open}
                            handleClose={handleMenuClose}
                            anchorEl={anchorEl}
                            actions={menuActions}
                        />
                    </div>
                </div>
                <AlertDialog
                    open={openDialogToLanding}
                    setOpen={setOpenDialogToLanding}
                    headline={"Log out"}
                    description={"Are you sure you want to log out?"}
                    agreeText={"Log out"}
                    disagreeText={"Stay"}
                    handleAgree={handleLogout}
                />
                <AlertDialog
                    open={openDialogToGroups}
                    setOpen={setOpenDialogToGroups}
                    headline="Are you sure you want to leave this group?"
                    description="You will no longer have access to the group's content."
                    agreeText="Leave Group"
                    disagreeText="Cancel"
                    handleAgree={handleLeaveGroup}
                />

                <AlertDialog
                    open={openDialogToDeleteGroup}
                    setOpen={setOpenDialogToDeleteGroup}
                    headline="Are you sure you want to delete this group?"
                    description="This action cannot be undone."
                    agreeText="Delete Group"
                    disagreeText="Cancel"
                    handleAgree={deleteGroupHandler}
                />
            </div>
        </>
    )
};

export default TasksHeader;
