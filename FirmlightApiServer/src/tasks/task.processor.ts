import {Process, Processor} from '@nestjs/bull';
import {Job} from 'bull';
import {TasksGateway} from './tasks.gateway';
import {FactorizationProcessor} from "./Factorization/factorization.processor";
import {MeanProcessor} from "./Mean/mean.processor";
import {TasksService} from "./tasks.service";
import {CrawlerProcessor} from "./Crawling/crawler.processor";
import {GroupsService} from "../groups/groups.service";

@Processor('tasks')
export class TaskProcessor {
    constructor(
        private tasksService: TasksService,
        private tasksGateway: TasksGateway,
        private readonly groupsService: GroupsService,
    ) {
    }

    /**
     * Handles a task job from the queue and sends it to the appropriate processor.
     * @param job - The job data.
     */
    @Process('process_task')
    async handleTask(job: Job) {
        console.log('Processing task:', job.data);
        try {
            switch (job.data.type) {
                case "FACTORIZATION":
                    await this.processFactorizationTask(job);
                    break;
                case "CRAWLER":
                    await this.processCrawlerTask(job);
                    break;
                case "MEAN":
                    await this.processMeanTask(job);
                    break;
            }
            // Optionally remove the job after processing.
            await job.remove(); // This removes the job from Redis.
        } catch (error) {
            // Optionally remove the job after processing.
            await job.remove(); // This removes the job from Redis.
            await this.groupsService.updateTaskStatus(job.data.data.groupID, job.data.taskId, 'FAILED');
            console.error(`Error distributing task ${job.data.id}:`, error);
        }
    }

    /**
     * Processes a mean task.
     * @param job - The job data.
     */
    async processMeanTask(job: Job) {
        const connectedUsers = await this.tasksService.getConnectedUsersInGroup(job.data.groupID);
        console.log('Processing mean task:', job.data);
        const chunksWithPercentage = await MeanProcessor.processMeanTask(job, connectedUsers);
        if (chunksWithPercentage.length === 0) {
            console.log(`No workers available to process mean task ${job.data.id}.`);
            return;
        }

        // Prepare data to be sent to the distributor
        const chunks = chunksWithPercentage.map(({chunk, percentage}) => ({
            data: chunk,
            percentage
        }));

        await this.tasksGateway.distributeTask(chunks, job.data);
        console.log(`Mean task ${job.data.id} prepared and sent to the distributor for workers.`);
    }


    /**
     * Processes a factorization task.
     * @param job - The job data.
     */
    async processFactorizationTask(job: Job) {
        console.log('Processing factorization task:', job.data);
        const connectedUsers = await this.tasksService.getConnectedUsersInGroup(job.data.groupID);
        const chunksWithPercentage = await FactorizationProcessor.processFactorizationTask(job, connectedUsers);
        if (chunksWithPercentage.length === 0) {
            console.log(`No workers available to process factorization task ${job.data.id}.`);
            return;
        }
        // Distribute the task to the workers.
        await this.tasksGateway.distributeTask(chunksWithPercentage, job.data);
        console.log(`Factorization task ${job.data.id} prepared and sent to the distributor for workers.`);
    }


    /**
     * Processes a prime task.
     * @param job - The job data.
     */
    async processCrawlerTask(job: Job) {
        console.log('Processing crawler task:', job.data);
        const connectedUsers = await this.tasksService.getConnectedUsersInGroup(job.data.groupID);
        const chunksWithPercentage = await CrawlerProcessor.processCrawlerTask(job, connectedUsers);
        if (chunksWithPercentage.length === 0) {
            console.log(`No workers available to process crawler task ${job.data.id}.`);
            return;
        }
        await this.tasksService.updateTaskWorkers(job.data.id, chunksWithPercentage.length)
        // Distribute the task to the workers.
        await this.tasksGateway.distributeTask(chunksWithPercentage, job.data);
        console.log(`Crawler task ${job.data.id} prepared and sent to the distributor for workers.`);
    }
}
