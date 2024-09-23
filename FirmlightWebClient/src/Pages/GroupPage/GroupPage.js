import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {Navbar, LoadingSpinner} from '../../Components';
import {GroupHeader, AddGroupModal, Groups, GroupsAlertsFrame, Footer, Content} from '../../Containers';
import './GroupPage.css';
import {getAllGroups, validateToken, getUserGroupAlerts, deleteGroupAlert, clearAllGroupAlerts} from '../../Scripts';

const GroupPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentGroups, setCurrentGroups] = useState([]);
    const [groupAlerts, setGroupAlerts] = useState([]);
    const [search, setSearch] = useState('');
    const [showStarredGroups, setShowStarredGroups] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const isValid = await validateToken();
                if (!isValid) {
                    navigate('/login'); // Redirect to "login" if token is invalid
                } else {
                    const groups = await getAllGroups();
                    setCurrentGroups(groups);
                    const userGroupAlerts = await getUserGroupAlerts();
                    if (userGroupAlerts) {
                        setGroupAlerts(userGroupAlerts.sort((a, b) => b.id - a.id));
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error("Token validation or group fetching failed:", error);
                navigate('/login'); // Redirect to "login" on error
            }
        };
        checkToken().then();
    }, [navigate]);

    useEffect(() => {
        const reloadGroupAlerts = async () => {
            const userGroupAlerts = await getUserGroupAlerts();
            if (userGroupAlerts) {
                setGroupAlerts(userGroupAlerts.sort((a, b) => b.id - a.id));
            }
        }
        reloadGroupAlerts().then();
    }, [currentGroups]);

    if (loading) {
        return <LoadingSpinner/>;
    }

    const refreshGroups = async () => {
        try {
            setLoading(true);
            const groups = await getAllGroups();
            setCurrentGroups(groups);
            const userGroupAlerts = await getUserGroupAlerts();
            if (userGroupAlerts) {
                setGroupAlerts(userGroupAlerts.sort((a, b) => b.id - a.id));
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to refresh groups:", error);
        }

    }

    const updateGroupStarredStatus = async (groupID, newStatus) => {
        setCurrentGroups(prevGroups =>
            prevGroups.map(group =>
                group.groupID === groupID
                    ? {
                        ...group,
                        members: group.members.map(member =>
                            member.userID === Cookies.get('userID') ? {...member, starred: newStatus} : member
                        )
                    } : group
            ));
    };

    const filteredGroups = currentGroups.filter(group => {
        const isStarred = group.members.some(member => member.userID === Cookies.get('userID') && member.starred);
        return (showStarredGroups ? isStarred : true) && group.groupName.toLowerCase().includes(search.toLowerCase());
    });

    async function handleGroupAlertsClose(index) {
        const res = await deleteGroupAlert(groupAlerts[index].id);
        if (!res) {
            console.error("Failed to delete group alert");
        }
        console.log("Group alert deleted successfully");
        const newGroupAlerts = [...groupAlerts];
        newGroupAlerts.splice(index, 1);
        setGroupAlerts(newGroupAlerts);
    }

    const handleClearAllGroupAlerts = async () => {
        const res = await clearAllGroupAlerts();
        if (!res) {
            console.error("Failed to delete all group alerts");
            return;
        } else {
            console.log("All group alerts deleted successfully");
        }
        setGroupAlerts([])
    }

    const handleGroupCreation = async (groupDetails) => {
        // Add the new group to the current groups if it doesn't already exist.
        setCurrentGroups(prevGroups => {
            const groupExists = prevGroups.some(group => group.groupID === groupDetails.groupID);
            return groupExists ? prevGroups : [...prevGroups, groupDetails];
        });
        const userGroupAlerts = await getUserGroupAlerts();
        if (userGroupAlerts) {
            setGroupAlerts(userGroupAlerts.sort((a, b) => b.id - a.id));
        }
        setShowModal(false);
    }

    return (
        <>
            <Content>
                <Navbar
                    isGroups={true}
                    groups={currentGroups}
                    setGroups={setCurrentGroups}/>
                <GroupHeader
                    handleClearAllGroupAlerts={handleClearAllGroupAlerts}
                    refreshHandler={refreshGroups}
                    setShowModal={setShowModal}
                    breadcrumbs={['Groups']}
                    setSearch={setSearch}
                    setShowStarredGroups={setShowStarredGroups}
                    header={"My Groups"}/>
                <div className="group-page__content">
                    <Groups
                        groups={filteredGroups}
                        updateGroupStarredStatus={updateGroupStarredStatus}
                    />
                    <GroupsAlertsFrame
                        handleGroupAlertsClose={(index) => handleGroupAlertsClose(index)}
                        groupAlerts={groupAlerts}
                    />
                </div>
                {showModal && <AddGroupModal
                    handleGroupCreation={handleGroupCreation}
                    showModal={showModal}
                    setShow={setShowModal}/>}
            </Content>
            <Footer/>
        </>
    );
};

export default GroupPage;
