<h1 align="center">
<p align="center">
<a href="https://firmlight.onrender.com/"><img src="https://github.com/TalMizrahii/firmlight-py-client/blob/main/Assets/FullLogo.png" alt="HTML" width="300"></a>
</p>
<h2 align="center">
  Firmlight - Task Distribution System
</h2>
  <br>
</h1> 
<h4 align="center">Tal Mizrahi's Final Project for Computer Science Bachelor's, Recognized as Outstanding for the Class of 2024</h4>

<p align="center">
  <a href="#description">Description</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#api">API</a> •
  <a href="#setup">Setup</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#authors">Authors</a>
</p>

## Description

I developed a distributed task management system designed to efficiently assign tasks within user groups. The system includes a React.js client where users can create and manage groups, and a NestJS backend connected to MongoDB for securely storing user data. A second client, built in Python, will allow users to download and connect to the system with their existing credentials. Tasks will be distributed across group members, with only metadata and task statistics stored on the server, ensuring minimal data storage while maintaining robust task coordination.

## Architecture

The Firmlight system consists of the following components:

1. **NestJS Server**: Manages users, groups, and task distribution.
2. **React Client**: Web interface for users to manage groups and initiate tasks.
3. **Python Worker Client**: Downloadable client for processing distributed tasks.
4. **MongoDB**: Database for storing user data, group information, and task metadata.
5. **Redis**: In-memory data structure store used for caching and as a message broker.
6. **BullMQ**: Queue system for handling distributed job processing.
7. **Cron Jobs**: Scheduled tasks for monitoring and maintenance.



### Workflow

1. Users register/login via the React client, with credentials stored in MongoDB.
2. Users create or join groups through the React interface.
3. When a task is sent to a group, the server uses BullMQ to queue and distribute it among group members.
4. Python worker clients process the tasks and send results back to the server.
5. The server updates task status in real-time using WebSockets.
6. Task results are sent to the appropriate client (React or Python).
7. Only task metadata and statistics are stored on the server to maintain efficiency.
8. Cron jobs periodically monitor task progress and perform system maintenance.

## API

For detailed API documentation, please refer to our [API Docs](https://firmlight.onrender.com/api) in the Swagger interface.

## Setup

```bash
# Clone the repository
git clone https://github.com/your-username/firmlight-nestjs-server.git

# Navigate to the project directory
cd firmlight-nestjs-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other configuration

# Start the server
npm run start:dev
```

## Technologies

- [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient and scalable server-side applications.
- [MongoDB](https://www.mongodb.com/): A document-based distributed database.
- [Redis](https://redis.io/): An open-source, in-memory data structure store used as a database, cache, and message broker.
- [BullMQ](https://docs.bullmq.io/): A Node.js library that implements a fast and robust queue system based on Redis.
- [cron-jobs](https://cron-job.org/en/): A simple cron-like job scheduler.

## Authors

* [@Tal Mizrahi](https://github.com/TalMizrahii)
