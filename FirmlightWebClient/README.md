<h1 align="center"> <br> <a href="https://firmlight.onrender.com/"><img src="https://github.com/user-attachments/assets/174166b2-0c66-4dc1-ae38-50a2aab009c0" alt="HTML" width="300"></a> <br> <br> <h2 align="center"> Firmlight React Client </h2> <br> </h1> <h4 align="center"> A React-based web application for managing and distributing tasks within groups of users in the Firmlight distributed system. <p align="center"> <a href="#description">Description</a> • <a href="#features">Features</a> • <a href="#architecture">Architecture</a> • <a href="#authors">Authors</a> </p>



## Description
The Firmlight React Client serves as the main interface for users to manage groups and distribute tasks. It connects to a NestJS backend to handle authentication, group management, and task distribution. Users can create or join groups, manage group members, and send tasks to group members for distributed processing.

This client interacts with the Firmlight Python Worker, which processes the tasks on the worker’s end. The React application itself acts as the control panel, giving users a visual and intuitive way to manage their tasks and group activity.  You can browse to the web managment page [here](https://firmlight.onrender.com).

<img src="https://github.com/user-attachments/assets/bbfce974-b0ff-4a7c-8ae0-523bf14cbb71" alt="Final_arch drawio" width="500"/>

## Features

* Group Management: Users can create groups, invite other users, and manage memberships.
* Task Distribution: Tasks can be sent to groups for distributed processing among group members.
* Real-Time Updates: Leverages WebSockets to provide real-time feedback on task progress and group activities.
* User Authentication: Users can sign up, log in, and manage their profiles, with data stored securely in MongoDB.
* Notification System: Users receive notifications when tasks are assigned, completed, or if any group changes occur.

<img src="https://github.com/user-attachments/assets/bfc04672-e47a-4709-afd3-75b3ab7079b1" alt="Final_arch drawio" width="500"/> 

## Architecture

The Firmlight React Client is part of a larger distributed task system, which consists of:

* React Frontend: The client-side application where users manage tasks and groups.
* NestJS Backend: The server-side API that handles user authentication, group management, and communication between the React client and the Python worker.
* MongoDB: A database for storing user credentials and metadata related to groups and tasks.
* Python Worker (Client): A downloadable client for users to process tasks assigned by the group in a distributed fashion.

  <img src="https://github.com/user-attachments/assets/e07eb55e-98f2-4fbb-9b73-2093fb14ab1b" alt="Final_arch drawio" width="500"/>

  
## Workflow

### 1. User Authentication
   - Users register/login via React client
   - User data stored in MongoDB (managed by NestJS API)

### 2. Group Creation and Management
   - Users create/join groups via React client
   - Group creators can invite other members

### 3. Task Distribution
   - Tasks created in groups via React client
   - NestJS API distributes tasks to group members
   - Python worker client executes tasks

### 4. Real-Time Task Monitoring
   - Users monitor progress via React client
   - Updates sent over WebSockets for real-time feedback

### 5. Task Results
   - Completed results sent to NestJS server
   - Results viewable in worker client
   - Only metadata/statistics stored in MongoDB
The Python worker requires the following dependencies:

- **aiohttp**: For making asynchronous HTTP requests to login and communicate with the backend server.
- **python-socketio**: For connecting to the WebSocket server and handling real-time task distribution.
- **asyncio**: To handle asynchronous task processing, especially useful in non-blocking operations.
- **maskpass**: Used for secure password input in the terminal.
- **requests**: For making HTTP requests in the crawler, used to retrieve HTML content from URLs.
- **beautifulsoup4**: For parsing HTML content to extract links from web pages in the crawler.
- **urllib3**: Handles URL parsing and connection management in the crawler.
- **urllib.robotparser**: For managing crawling permissions via `robots.txt`.

## Authors
* [@Tal Mizrahi](https://github.com/TalMizrahii)
