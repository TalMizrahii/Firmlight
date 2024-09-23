import { TaskDataType } from "../Types/task-data.type";

export class FactorizationAggregator {
    /**
     * Adds a factorization task result to the task data.
     * @param taskData - The task data.
     * @param taskId - The task ID.
     * @param result - The result to add.
     * @param tasks - The tasks map.
     **/
    static async addFactorizationTaskResult(taskData: TaskDataType, taskId: string, result: any, tasks: Map<string, TaskDataType>) {
        // Add the result to the task data.
        taskData.results.push(result);
        // Increment the number of completed workers.
        taskData.completedWorkers++;
        // Check if all workers have completed the task.
        if (taskData.completedWorkers === taskData.totalWorkers) {
            // Merge and sort all results.
            const aggregatedResult = this.aggregateResults(taskData.results);
            // Return the aggregated (and sorted) result as completed.
            return { isComplete: true, aggregatedResult, taskData };
        }
        // If not all workers have completed the task, return the partial results.
        return { isComplete: false, aggregatedResult: taskData.results, taskData };
    }

    /**
     * Aggregates the results by merging arrays of factorized results and sorting them.
     * @param results - The factorization results to aggregate.
     */
    static aggregateResults(results: any[]): any {
        // Check if all results are arrays (e.g., arrays of factors).
        if (results.every(result => Array.isArray(result))) {
            // Merge all arrays into a single array and sort them.
            const merged = results.reduce((merged, array) => merged.concat(array), []);
            // Sort the merged array.
            return merged.sort((a: number, b: number) => a - b);
        }
        // If results are not arrays, return them as they are.
        return results;
    }
}
