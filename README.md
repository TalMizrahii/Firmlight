<h1 align="center">
<p align="center">
<a href="https://firmlight.onrender.com/"><img src="https://github.com/user-attachments/assets/174166b2-0c66-4dc1-ae38-50a2aab009c0" alt="HTML" width="300"></a>
</p>

<h2 align="center">
  Firmlight - Task Distribution System
</h2>
</h1> 
<h4 align="center">Tal Mizrahi's Final Project for Computer Science Bachelor's, Recognized as Outstanding for the Class of 2024</h4>
<p align="center">
  <a href="#description">Description</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#api">API</a> •
  <a href="#setup">Setup</a> •
  <a href="#author">Author</a>
</p>

## Description

I developed a distributed task management system designed to efficiently assign tasks within user groups. The system includes a React.js client where users can create and manage groups, and a NestJS backend connected to MongoDB for securely storing user data. A second client, built in Python, will allow users to download and connect to the system with their existing credentials. Tasks will be distributed across group members, with only metadata and task statistics stored on the server, ensuring minimal data storage while maintaining robust task coordination. 

<br>

You can browse to the web managment page [here](https://firmlight.onrender.com).

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/ZMJRnw3e54A/0.jpg)](https://www.youtube.com/watch?v=ZMJRnw3e54A)


## Architecture

The Firmlight system consists of the following components:

1. **[NestJS Server](https://nestjs.com/)**: Manages users, groups, and task distribution.
2. **[Reactjs Client](https://react.dev/)**: Web interface for users to manage groups and initiate tasks.
3. **[Python Worker Client](https://www.python.org/)**: Downloadable client for processing distributed tasks.
4. **[MongoDB](https://www.mongodb.com/)**: Database for storing user data, group information, and task metadata.
5. **[Redis](https://redis.io/)**: In-memory data structure store used for caching and as a message broker.
6. **[BullMQ](https://docs.bullmq.io/)**: Queue system for handling distributed job processing.
7. **[cron-jobs](https://cron-job.org/en/)**: Scheduled tasks for monitoring and maintenance.
8. **[JSON Web Tokens](https://jwt.io/)**: An authentication for representing claims securely between The server and clients.

<img src="https://github.com/user-attachments/assets/425f06fd-9e48-4946-9188-ca81f79cd688" alt="Final_arch drawio" width="500"/>


### Workflow

1. Users register/login via the React client, with credentials stored in MongoDB.
2. Users create or join groups through the React interface.
3. When a task is sent to a group, the server uses BullMQ to queue and distribute it among group members.
4. Python worker clients process the tasks and send results back to the server.
5. The server updates task status in real-time using WebSockets.
6. Task results are sent to the appropriate client (React or Python).
7. Only task metadata and statistics are stored on the server to maintain efficiency.
8. Cron jobs periodically monitor task progress and perform system maintenance.
   
<img src="https://github.com/user-attachments/assets/bbfce974-b0ff-4a7c-8ae0-523bf14cbb71" alt="Final_arch drawio" width="500"/>

## API

For detailed API documentation, please refer to our [API Docs](https://firmlight.onrender.com/api) in the Swagger interface.

  <img src="https://github.com/user-attachments/assets/e07eb55e-98f2-4fbb-9b73-2093fb14ab1b" alt="Final_arch drawio" width="500"/>
  
## Setup

```bash
# Clone the repository
git clone https://github.com/TalMizrahii/firmlight.git

# Navigate to the project directory
cd firmlight/FirmlightWorker

# Install dependencies
pip install

# Sign up using the web interface
Browse to https://firmlight.onrender.com

# Login to the worker and start to work!
Using the same credentials of the web managment page
```

## Author

* [@Tal Mizrahi](https://github.com/TalMizrahii)
