import './GroupHeader.css';
import {AlertDialog, Breadcrumbs, DropMenu} from "../../Components";
import Star from "../../Assets/icons/star.png";
import Dots from "../../Assets/icons/dots.png";
import ClearAll from "../../Assets/icons/clearall.png";
import React from "react";
import {useNavigate} from "react-router-dom";
import {logout} from "../../Scripts";
import {Tooltip} from "@mui/material";

const GroupHeader = ({header, breadcrumbs, setSearch, setShowModal, setShowStarredGroups, refreshHandler, handleClearAllGroupAlerts}) => {
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function showModalNewGroupHandler() {
        setShowModal(true);
    }

    function searchHandler(e) {
        setSearch(e.target.value);
    }

    // Handler for confirming leave group action.
    const handleExit = () => {
        setOpenDialog(true);
        handleClose();
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
                                   onChange={searchHandler}/>
                        </div>
                        <button className="empty-btn btn-primary" type="button"
                                onClick={() => setShowStarredGroups(false)}>All Groups
                        </button>
                        <button className="empty-btn btn-primary" type="button"
                                onClick={() => setShowStarredGroups(true)}>Starred Groups
                        </button>
                    </form>
                    <div className="header__left-side">
                        <button onClick={refreshHandler} className="header__refresh btn btn-success">Refresh</button>
                        <button onClick={showModalNewGroupHandler} className="btn btn-primary" type="submit">New Group
                        </button>
                        <Tooltip title="Show starred groups">
                            <img className="action-icons" src={Star} alt="icon"
                                 onClick={() => setShowStarredGroups(true)}/>
                        </Tooltip>
                        <Tooltip title="Clear all alerts">
                            <img className="action-icons" src={ClearAll} alt="icon" onClick={handleClearAllGroupAlerts}/>
                        </Tooltip>
                        <img className="action-icons" src={Dots} onClick={handleMenuClick} alt="icon"/>
                        <DropMenu
                            handleClose={handleClose}
                            open={open}
                            anchorEl={anchorEl}
                            actions={[
                                {title: "Log Out", handler: handleExit}
                            ]}
                        />
                        <AlertDialog
                            open={openDialog}
                            setOpen={setOpenDialog}
                            headline={"Log out"}
                            description={"Are you sure you want to log out?"}
                            agreeText={"Log out"}
                            disagreeText={"Stay"}
                            handleAgree={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default GroupHeader;
