import {TasksAggregator} from "../Utils/tasks.aggregator";

export class CrawlerAggregator extends TasksAggregator {

    constructor() {
        // Pass the crawler results aggregation function to the base class.
        super(CrawlerAggregator.aggregateCrawlerResults);
    }

    /**
     * Adds a crawler task result to the task data and checks if all workers completed the task.
     * @param taskData - The task data.
     * @param taskId - The ID of the task.
     * @param result - The result to add.
     * @param tasks - The tasks map.
     */
    static async addCrawlerTaskResult(taskData: any, taskId: any, result: any, tasks: any) {
        const baseAggregator = new CrawlerAggregator();
        // Use the base class method to handle task aggregation
        return await baseAggregator.taskAggregator(taskData, taskId, result, tasks);
    }

    /**
     * Aggregates the results of the crawler tasks into a single result.
     * @param results - The results to aggregate.
     * @private - This method is private and should not be accessed directly.
     */
    private static aggregateCrawlerResults(results: any[]): any[] {
        // Initialize an empty map to hold the aggregated results by URL and a set of results.
        const resultMap: Map<string, Set<string>> = new Map();

        // Iterate through each array of results.
        results.forEach((resultArray) => {
            // Iterate through each result object in the array.
            resultArray.forEach((urlResult: { url: string; results: string[] }) => {
                // If there's already an entry for the URL, merge results.
                if (resultMap.has(urlResult.url)) {
                    const existingResults = resultMap.get(urlResult.url);
                    // Add new results to the existing set to avoid duplicates.
                    urlResult.results.forEach((res) => existingResults.add(res));
                } else {
                    // If no entry exists, create a new set of results.
                    resultMap.set(urlResult.url, new Set(urlResult.results));
                }
            });
        });

        // Convert the map to an array of objects with 'url' and 'results'.
        return Array.from(resultMap.entries()).map(([url, resultsSet]) => ({
            url: url,
            results: Array.from(resultsSet)
        }));
    }
}
