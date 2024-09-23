export type TaskMetadata = {
    taskId: string;
    title: string;
    description: string;
    status: 'FAILED' | 'PROGRESS' | 'SUCCESS';
    created?: string;
    statistics: {
        [userId: string]: {
            status: 'PROGRESS' | 'FINISHED' | 'FAILED';
            startTime: string;
            finishTime?: string;
            percentage: number;
            workerUsername: string;
        }
    };
    creatorID: string;
    creatorUsername: string;
}
