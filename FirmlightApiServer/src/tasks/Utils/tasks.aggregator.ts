export class TasksAggregator {
    private aggregateResults: (results: any[]) => any;

    constructor(aggregateResults: (results: any[]) => any) {
        this.aggregateResults = aggregateResults;
        this.aggregateResults = this.aggregateResults.bind(this);
    }

    /**
     * Base method for adding a result to the task data and checking completion.
     * @param taskData - The task data.
     * @param taskId - The ID of the task.
     * @param result - The result to add.
     * @param tasks - The tasks map.
     */
    async taskAggregator(taskData: any, taskId: any, result: any, tasks: any) {
        // Add the result to the task data.
        taskData.results.push(result);
        // Increment the completed workers count.
        taskData.completedWorkers++;
        // Check if all workers have completed the task.
        if (taskData.completedWorkers === taskData.totalWorkers) {
            console.log(`All workers completed task, aggregating results...`);
            // Use the results and apply the aggregation function.
            const aggregatedResult = this.aggregateResults(taskData.results);
            // Return the aggregated result and task data.
            return { isComplete: true, aggregatedResult, taskData };
        }
        // Return that the task is not yet complete.
        return { isComplete: false, aggregatedResult: result, taskData };
    }
}
