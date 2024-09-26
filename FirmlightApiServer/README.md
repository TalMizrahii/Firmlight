<h1 align="center">
<p align="center">
<a href="https://firmlight.onrender.com/"><img src="https://github.com/TalMizrahii/firmlight-py-client/blob/main/Assets/FullLogo.png" alt="HTML" width="300"></a>
</p>
<h2 align="center">
  Firmlight Server Side
</h2>
  <br>
</h1> 
<h4 align="center">A powerful NestJS server for managing distributed task processing within user groups.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#description">Description</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#api-endpoints">API Endpoints</a> •
  <a href="#setup">Setup</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#author">Author</a>
</p>

## Key Features

* User Authentication and Management
* Group Creation and Management
* Task Distribution
* Real-time Updates via WebSockets
* MongoDB Integration for Data Storage
* Task Metadata and Statistics Tracking
* Task failover mechanisem

## Description

The Firmlight NestJS Server is the backbone of our distributed task processing system, managing user authentication, group coordination, and task distribution. It serves as the intermediary between the React client interface and the Python worker clients, ensuring seamless communication and efficient task allocation. Additionally, the server supports task failover, automatically reassigning tasks if a worker client disconnects or fails during processing, maintaining system reliability and performance.

## Architecture

The Firmlight system consists of the following components:

1. **NestJS Server** (this component): Manages users, groups, and task distribution.
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

## API Endpoints

For detailed API documentation, please refer to our [API Docs](https://firmlight.onrender.com/api).

## Setup

```bash
# Clone the repository
git clone https://github.com/TalMizrahii/Firmlight.git

# Navigate to the project directory
cd firmlight/FirmlightApiServer

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

## Author

* [@TalMizrahii](https://github.com/TalMizrahii)
