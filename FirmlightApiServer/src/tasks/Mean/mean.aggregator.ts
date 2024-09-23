import {TaskDataType} from "../Types/task-data.type";
import {TasksAggregator} from "../Utils/tasks.aggregator";

export class MeanAggregator extends TasksAggregator{
    constructor() {
        // Pass the mean aggregation function to the base class
        super(MeanAggregator.aggregateMeanResults);
    }

    /**
     * Adds a mean result to the task data.
     * @param taskData - The task data.
     * @param taskId - The ID of the task.
     * @param result - The result to add.
     * @param tasks - The tasks map.
     */
    static async addMeanResult(taskData: TaskDataType, taskId: string, result: any, tasks: Map<string, TaskDataType>) {
        const baseAggregator = new MeanAggregator();
        return await baseAggregator.taskAggregator(taskData, taskId, result, tasks);
    }


    /**
     * Aggregates the results into a single result.
     * @param results - The results to aggregate.
     */
    static aggregateMeanResults(results: any[]): any {
        // if (results.every(result => typeof result === 'number')) {
        //     return results.reduce((sum, num) => sum + num, 0) / results.length;
        // }
        return results;
    }
}