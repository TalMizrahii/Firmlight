import React, {useState} from 'react';
import './NewTaskModal.css';
import '../AddGroupModal/AddGroupModal.css';
import Close from "../../Assets/icons/close.png";
import Modal from 'react-bootstrap/Modal';
import {SelectForm} from "../../Components";
import FactorizationInputs from "../../Components/SelectForm/TasksInputs/FactorizationInputs";
import WebCrawlingInputs from "../../Components/SelectForm/TasksInputs/WebCrawlingInputs";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import MeanInputs from "../../Components/SelectForm/TasksInputs/MeanInputs";
import {sendTask} from "../../Scripts/TasksOperations/SendTask";

const NewTaskModal = ({groupID, setShowTaskModal, addTask}) => {
    const [selectedTask, setSelectedTask] = useState('');
    const [taskFailedError, setTaskFailedError] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // State for FactorizationInputs
    const [factorizationValue, setFactorizationValue] = useState('');
    const [factorizationError, setFactorizationError] = useState('');

    // State for WebCrawlingInputs
    const [urlsInput, setUrlsInput] = useState('');
    const [crawlLimit, setCrawlLimit] = useState('');
    const [webCrawlingError, setWebCrawlingError] = useState('');

    // State for the MeanInputs
    const [fileError, setFileError] = useState('');
    const [meanArray, setMeanArray] = useState([]);

    function handleClose() {
        setShowTaskModal(false);
    }

    async function handleSubmit(e) {
        console.log('Submitting task...');
        e.preventDefault();

        // Validate description
        if (description.length < 5 || description.length > 80) {
            setDescriptionError('Description must be between 5 and 80 characters.');
            return;
        }
        setDescriptionError('');

        // Validate task-specific inputs, first check if the task is selected.
        if (selectedTask === 'Mean Task') {
            // Validate mean array.
            console.log('Mean task input:', meanArray);
            if (meanArray.length === 0 && !fileError) {
                console.log('No input provided');
                setFileError("Please provide input via text field or file upload.");
                return;
            }
            const invalidMeanArray = meanArray.filter(value => isNaN(value) || value === '');
            if (invalidMeanArray.length) {
                console.log('Invalid mean array:', invalidMeanArray);
                setFileError('Please enter valid numbers.');
                return;
            }
            // Send the task if the mean array is valid.
            const response = await sendTask(groupID, selectedTask, description, meanArray, "MEAN");
            if (!response) {
                console.log('Failed to send task');
                setFileError('Failed to send task.');
                setTaskFailedError('Failed to send task.');
                return;
            }
            // Handle the success response and reset the form.
            successHandler(response);
        }
        // Validate factorization input.
        if (selectedTask === 'Factorization Task') {
            if (!validateFactorization(factorizationValue)) {
                setFactorizationError('Please enter a valid natural number.');
                return;
            }
            const intVal = parseInt(factorizationValue, 10);
            const response = await sendTask(groupID, selectedTask, description, intVal, "FACTORIZATION");
            if (!response) {
                console.log('Failed to send task');
                setFactorizationError('Failed to send task.');
                setTaskFailedError('Failed to send task.');
                return;
            }
            // Handle the success response and reset the form.
            successHandler(response);
            console.log('Valid factorization input:', intVal);
        }
        // Validate web crawling input.
        if (selectedTask === 'Web Crawling Task') {
            // Validate the URLs and crawl limit.
            const {urlsError, limitError, validUrls} = validateWebCrawlingInputs(urlsInput, crawlLimit);
            // Check if there are any errors in the input.
            if (urlsError || limitError) {
                setWebCrawlingError(`${urlsError} ${limitError}`.trim());
                return;
            }
            // Now validUrls is an array of valid URLs.
            const response = await sendTask(groupID,
                selectedTask,
                description,
                {urlsInput: validUrls, crawlLimit},
                "CRAWLER");

            if (!response) {
                console.log('Failed to send task');
                setTaskFailedError('Failed to send task.');
                return;
            }

            // Handle the success response and reset the form.
            successHandler(response);
            console.log('Valid web crawling input:', validUrls, crawlLimit);
        }
        // Handle the form submission logic
        setShowTaskModal(false);
        // Add task submission logic here
    }

    const successHandler = (response) => {
        console.log('Task sent:', response);
        addTask(response);
        setFileError('');
        setDescription('');
        setMeanArray([]);
        setDescriptionError('');
        setFactorizationValue('');
        setFactorizationError('');
        setUrlsInput('');
        setCrawlLimit('');
        setWebCrawlingError('');
        setTaskFailedError('');
        setShowTaskModal(false);
    }


    // Validation function for factorization input
    const validateFactorization = (value) => {
        const number = parseInt(value, 10);
        return !isNaN(number) && number > 0 && Number.isInteger(number);
    };

    const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i; // URL validation pattern
    // Function to split and validate the URLs
    const validateWebCrawlingInputs = (urlsInput, crawlLimit) => {
        // Split the input by newlines or spaces, filter out empty entries
        const urlsArray = urlsInput.split(/\s+/).filter(url => url.trim() !== '');
        console.log('URLs:', urlsArray);
        // Validate each URL in the array
        const invalidUrls = urlsArray.filter(url => !urlPattern.test(url));
        const urlsError = invalidUrls.length ? `Invalid URLs: ${invalidUrls.join(', ')}` : '';

        // Validate the crawl limit
        const limitError = !Number.isInteger(parseInt(crawlLimit, 10)) || parseInt(crawlLimit, 10) <= 0
            ? 'Crawl limit must be a positive integer.'
            : '';

        // Return both errors and the valid URLs array
        return {urlsError, limitError, validUrls: urlsArray};
    };


    const handleTaskSelection = (e) => {
        setTaskFailedError('');
        setSelectedTask(e.target.value);
    };

    return (
        <Modal show={setShowTaskModal} onHide={handleClose}>
            <Modal.Body>
                <section className="new-task__container">
                    <header className="new-tasks__header">
                        <h4 className="new-tasks__modal-header">Create New Task</h4>
                        <img onClick={handleClose} className="new-tasks__modal-close-btn" src={Close} alt="close"/>
                    </header>
                    <div className="new-task__head-close"></div>

                    <form action="#" className="new-task__form form">
                        <div className="input-box">
                            <SelectForm
                                selectedTask={selectedTask}
                                options={['Factorization Task', 'Mean Task', 'Web Crawling Task']}
                                onSelect={handleTaskSelection}
                            />
                        </div>

                        <div className="input-box">
                            <label>Task Description</label>
                            <input
                                className="new-task__description"
                                type="text"
                                name="taskDescription"
                                placeholder="Enter task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            {descriptionError && <p className="error-text">{descriptionError}</p>}
                        </div>

                        {selectedTask === 'Factorization Task' && (
                            <FactorizationInputs
                                factorization={factorizationValue}
                                setFactorization={setFactorizationValue}
                                setError={setFactorizationError}
                                error={factorizationError}
                            />
                        )}
                        {selectedTask === 'Web Crawling Task' && (
                            <WebCrawlingInputs
                                urlsInput={urlsInput}
                                setUrlsInput={setUrlsInput}
                                crawlLimit={crawlLimit}
                                setCrawlLimit={setCrawlLimit}
                                setError={setWebCrawlingError}
                                error={webCrawlingError}
                            />
                        )}
                        {selectedTask === 'Mean Task' && (
                            <MeanInputs setMeanArray={setMeanArray}/>
                        )}
                        {taskFailedError && <p className="error-text">{taskFailedError}</p>}
                        <Button
                            className="new-task__submit-btn"
                            variant="contained"
                            onClick={handleSubmit}
                            endIcon={<SendIcon/>}
                        >
                            Send Task
                        </Button>
                    </form>
                </section>
            </Modal.Body>
        </Modal>
    );
};

export default NewTaskModal;
