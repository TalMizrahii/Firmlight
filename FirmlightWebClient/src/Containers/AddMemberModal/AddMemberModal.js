import React, {useEffect, useState} from 'react';
import Close from "../../Assets/icons/close.png";
import Modal from 'react-bootstrap/Modal';
import Cookies from "js-cookie";
import {Dropdown} from "../../Components";
import './AddMemberModal.css';
import {getAllUsers, sendRequestsJoinGroup} from "../../Scripts";

const AddMemberModal = ({showModal, setShow, groupData}) => {
    const [availableMembers, setAvailableMembers] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [error, setError] = useState('');
    const [currentRequest, setCurrentRequest] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const currentUserId = Cookies.get('userID');
                if (response) {
                    // Get the user IDs of the group members and the user IDs of those who have pending requests.
                    const groupMemberIds = groupData.members.map(member => member.userID);
                    const requestIds = groupData.requests.map(request => request);
                    // Filter out the current user, group members, and users with pending requests.
                    const filteredMembers = response
                        .filter(({id}) =>
                            id !== currentUserId &&             // Exclude the current user
                            !groupMemberIds.includes(id) &&      // Exclude group members
                            !requestIds.includes(id)             // Exclude users with pending requests
                        )
                        .map(({username, id}) => ({username, id}));
                    // Set the available members to the filtered members.
                    setAvailableMembers(filteredMembers);
                    // Get the usernames for the current requests.
                    const requestUsernames = response
                        .filter(({id}) => requestIds.includes(id))  // Get users whose IDs match pending requests.
                        .map(({username}) => username);             // Extract usernames.

                    // Set currentRequest to the usernames of pending requests.
                    setCurrentRequest(requestUsernames);
                } else {
                    setAvailableMembers([]);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setAvailableMembers([]);
            }
        };

        fetchUsers().then(r => r);
    }, [groupData]);


    function handleClose() {
        setShow(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await sendRequestsJoinGroup(groupData.groupID, selectedOptions.map(option => option.id));
        if (response) {
            console.log('Request sent successfully');
            setError('');
            setShow(false);
        } else {
            setError('Failed to add members. Please try again.');
        }
    }

    return (

        <Modal show={showModal} onHide={handleClose}>
            <Modal.Body>
                <section className="container">
                    <header className="add-member-tasks__header">
                        <h4 className="tasks__modal-header">Add Group Member</h4>
                        <img onClick={handleClose} className="modal-close-btn" src={Close} alt="close"/>
                    </header>
                    <div className="GroupNotification__head-close">
                    </div>
                    <form action="#" className="form">
                        {currentRequest.length > 0 && (
                            <div className="input-box">
                                You already sent requests to: {
                                currentRequest
                                    .join(', ')
                                    .length > 100
                                    ? `${currentRequest.join(', ').substring(0, 60)}...`
                                    : currentRequest.join(', ')
                            }
                            </div>
                        )}

                        <div className="input-box-bottom">

                            <Dropdown
                                inputPlaceholder={"All Members"}
                                availableOptions={availableMembers}
                                setAvailableOptions={setAvailableMembers}
                                selectedOptions={selectedOptions}
                                setSelectedOptions={(newSelections) => setSelectedOptions(newSelections)}
                            />
                        </div>
                        {error && <p className="create-group__error">{error}</p>}
                        <button className="submit-btn" type="submit" onClick={handleSubmit}>
                            AddMember
                        </button>
                    </form>
                </section>
            </Modal.Body>
        </Modal>

    );
}

export default AddMemberModal;
