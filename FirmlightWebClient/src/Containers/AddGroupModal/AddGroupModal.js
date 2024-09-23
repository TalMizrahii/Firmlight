import React, {useEffect, useState} from 'react';
import './AddGroupModal.css';
import Close from "../../Assets/icons/close.png";
import {Dropdown} from "../../Components";
import Modal from 'react-bootstrap/Modal';
import {createGroup, getAllUsers} from "../../Scripts";
import Cookies from 'js-cookie';

const AddGroupModal = ({showModal, setShow, handleGroupCreation}) => {
    const [groupDetails, setGroupDetails] = useState({
        groupName: '',
        groupDescription: '',
        selectedOptions: [],
    });
    const [availableMembers, setAvailableMembers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const currentUserId = Cookies.get('userID'); // Get the current user's ID from cookies.
                if (response) {
                    // Extract only username and id from each user, and filter out the current user.
                    const filteredMembers = response
                        .filter(({ id }) => id !== currentUserId)
                        .map(({ username, id }) => ({ username, id }));
                    setAvailableMembers(filteredMembers);
                } else {
                    setAvailableMembers([]);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setAvailableMembers([]);
            }
        };

        fetchUsers().then(r => r);
    }, []);

    function handleClose() {
        setShow(false);
        setError('');
        setGroupDetails({
            groupName: '',
            groupDescription: '',
            selectedOptions: [],
        });
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setGroupDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // Check if the group name is at least 3 characters long
        if (groupDetails.groupName.length < 3) {
            setError('Group name must be at least 3 characters long.');
            return;
        }

        try {
            const response = await createGroup(groupDetails);
            if (response.error) {
                setError(response.error); // Display error in the modal
            } else {
                setShow(false);
                handleGroupCreation(response);
            }
        } catch (err) {
            setError('Failed to create group. Please try again.');
        }
    }

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Body>
                <section className="container">
                    <header className="group__header">
                        <h1 className="groups__modal-header">Create New Group</h1>
                        <img onClick={handleClose} className="group__modal-close-btn" src={Close} alt="close"/>
                    </header>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input-box">
                            <label>Group Name</label>
                            <input
                                type="text"
                                name="groupName"
                                placeholder="Enter group name"
                                value={groupDetails.groupName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <label>Group Description</label>
                            <input
                                type="text"
                                name="groupDescription"
                                placeholder="Enter group description"
                                value={groupDetails.groupDescription}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="row add-member-section">
                            <div className="input-box">
                                <label>Add Member</label>
                                <div className="input-box-bottom">
                                    <Dropdown
                                        inputPlaceholder={"All Members"}
                                        availableOptions={availableMembers}
                                        setAvailableOptions={setAvailableMembers}
                                        selectedOptions={groupDetails.selectedOptions}
                                        setSelectedOptions={(newSelections) =>
                                            setGroupDetails(prevState => ({
                                                ...prevState,
                                                selectedOptions: newSelections,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {error && <p className="create-group__error">{error}</p>}
                        <button className="submit-btn" type="submit">
                            Create Group
                        </button>
                    </form>
                </section>
            </Modal.Body>
        </Modal>
    );
}

export default AddGroupModal;
