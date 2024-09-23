import {useRef, useEffect, useState} from "react";
import Cookies from "js-cookie";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import {Tooltip} from "@mui/material";
import {getUserNotifications, answerGroupRequest, answerAllGroupRequests} from "../../Scripts";
import './Navbar.css';
import Icon from "../../Assets/icons/icon.png";
import Logo from "../../Assets/Images/FullLogo.png";
import Info from "../../Assets/icons/info.png";
import Settings from "../../Assets/icons/settings.png";
import Avatar from "../../Assets/Images/profileAnomation.png";
import {NotificationCenter} from "../";
import "react-toastify/ReactToastify.min.css";
import {serverAddress} from "../../Strings";

/**
 * Navbar component for the application.
 * @param setGroups - Only used for the GroupPage.
 * @param groups - Only used for the GroupPage.
 * @param tasks - Used to update the notifications (TasksPage).
 * @param isGroups
 * @returns {JSX.Element} - Navbar component.
 * @constructor - Navbar
 */
const Navbar = ({setGroups, groups, tasks, isGroups}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [username, setUsername] = useState("");
    const notificationRef = useRef(null); // Ref for the NotificationCenter

    useEffect(() => {
        fetchNotifications().then();
        setUsername(Cookies.get("username"));
    }, []);

    useEffect(() => {
        fetchNotifications().then();
    }, [tasks]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    const fetchNotifications = async () => {
        const notifications = await getUserNotifications();
        setNotifications(notifications);
    };

    const handleNotificationAccept = async (notification) => {
        const response = await answerGroupRequest(notification.groupID, true);
        if (response !== null) {
            setNotifications(notifications.filter(n => n !== notification));
            if (isGroups) setGroups([...groups, response]);
        }
    };

    const handleNotificationDecline = async (notification) => {
        const response = await answerGroupRequest(notification.groupID, false);
        if (response !== null) {
            setNotifications(notifications.filter(n => n !== notification));
        }
    };

    const handleNotificationAcceptAll = async () => {
        if (!notifications || notifications.length === 0) return;
        const newGroups = await answerAllGroupRequests(true);
        if (newGroups !== null && isGroups) {
            setGroups([...groups, ...newGroups]);
            setNotifications([]);
        }
    };

    const handleNotificationDeclineAll = async () => {
        if (notifications.length === 0) return;
        const res = await answerAllGroupRequests(false);
        if (res !== null) {
            setNotifications([]);
        }
    };

    const toggleNotificationCenter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) fetchNotifications().then();
        setAnchorEl(event.currentTarget);
        setIsOpen(true);
    };

    const handleLogoClick = () => {
        window.location.href = "/";
    };

    const handleNavToInfo = () => {
        window.location.href = "/info";
    };

    return (
        <>
            <div className="navbar">
                <div className="navbar__links">
                    <div className="navbar__links_icon">
                        <img id="navicon" src={Icon} alt="icon"/>
                    </div>
                    <div className="navbar__links_container">
                        <p><a href="/groups">My Groups</a></p>
                        <p><a href={`${serverAddress}/api#`}>API</a></p>
                        <p><a href="/documentation">Documentation</a></p>
                        {/*<p><a href="#People">People</a></p>*/}
                    </div>
                </div>
                <div className="navbar__links_logo">
                    <img onClick={handleLogoClick} id="centerLogo" src={Logo} alt="logo"/>
                </div>
                <div className="navbar__left-icons">

                    <div ref={notificationRef}>
                        <Tooltip title="Notifications">
                            <Badge
                                onMouseUp={toggleNotificationCenter}
                                className="navbar__left-icons-badge"
                                badgeContent={notifications ? notifications.length : 0}
                                color="error"
                            >
                                <MailIcon color="action"/>
                            </Badge>
                        </Tooltip>
                    </div>

                    <NotificationCenter
                        handleNotificationAccept={handleNotificationAccept}
                        handleNotificationAcceptAll={handleNotificationAcceptAll}
                        handleNotificationDecline={handleNotificationDecline}
                        handleNotificationDeclineAll={handleNotificationDeclineAll}
                        notifications={notifications}
                        isOpen={isOpen}
                        anchorEl={anchorEl}
                    />

                    <Tooltip title="About">
                        <img onClick={handleNavToInfo} className="navicon" src={Info} alt="icon"/>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <img className="navicon" src={Settings} alt="icon"/>
                    </Tooltip>
                </div>
                <div className="navbar__left-avatar">
                    <Tooltip title={username}>
                        <img id="avatar" src={Avatar} alt="avatar"/>
                    </Tooltip>
                </div>
            </div>
        </>
    )
        ;
};

export default Navbar;
