import {Navbar} from "../../Components";
import {Content, Footer, Info} from "../../Containers";

const DocumentationPage = () => {

    const sections = [
        {
            title: "Overview",
            content: `Welcome to the documentation for our distributed task management system. 
        This application allows users to create groups, distribute tasks among members, 
        and manage task results efficiently. It includes a React client, a NestJS backend, 
        and uses WebSockets and Redis for real-time communication and in-memory storage.`
        },
        {
            title: "Worker",
            content: `• **IMPORTANT**: 
        - The Worker is a separate application that runs on your local computer.
        - It is required to run tasks on your machine.
        - You can download the Worker from https://github.com/TalMizrahii/Firmlight-Worker Github page.`
        },
        {
            title: "Features",
            content: `• **User Management**: 
        - Sign Up: Register new users with email and username.
        - Login: Authenticate users using username or email.
        - User Profiles: View and edit user information.

        • **Group Management**: 
        - Create Groups: Users can create new groups.
        - Manage Members: Add or remove members from groups.
        - Star Groups: Users can star or un-star groups.

        • **Task Management**: 
        - Create Tasks: Users can create new tasks and assign them to groups.
        - Distribute Tasks: Tasks are distributed among group members.
        - Task Results: Collect and review results from completed tasks.

        • **Real-Time Communication**: 
        - WebSockets: Real-time updates for task status and group activities.
        - Redis: Used for task data storage and management.`
        },
        {
            title: "Validation",
            content: `• **Text Input**: 
        - Validates that numbers are entered correctly and checks for valid integer values.
        - Provides feedback on errors if no valid integers are present.

        • **File Upload**: 
        - Handles file uploads for Excel/CSV files.
        - Parses numbers from files and provides error feedback if the file contains no valid integers.`
        },
        {
            title: "Usage Examples",
            content: `• **Creating a Group**: 
        - Go to the 'Create Group' page.
        - Enter the group name and description.
        - Add members to the group.
        - Click 'Create Group' to finalize.

        • **Creating a Task**: 
        - Open the 'New Task' modal.
        - Select the task type (Factorization, Mean, Web Crawling).
        - Provide the necessary inputs.
        - Submit the task to be distributed among group members.`
        }
    ];


    return (
        <>
            <Content>
                <Navbar/>
                <Info error={false} sections={sections} headline={"Firmlight Documentation"}/>
            </Content>
            <Footer error={true}/>
        </>
    )
}

export default DocumentationPage;