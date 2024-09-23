import {Job} from "bull";

export class CrawlerProcessor {
    /**
     * Processes a crawler task.
     * @param job The job data.
     * @param connectedWorkers The connected workers.
     */
    static async processCrawlerTask(job: Job, connectedWorkers: string[]) {
        // Check if there are connected workers.
        if (connectedWorkers.length > 0) {
            const {urls, crawlLimit} = job.data.data;
            // Check if there are urls to process.
            if (!urls || urls.length === 0) {
                console.log(`No urls to process for crawler task ${job.id}.`);
                return [];
            }
            // Split the urls into chunks for the workers.
            return this.splitUrlsForWorkers(urls, crawlLimit, connectedWorkers.length);
        } else {
            console.log(`No workers available to process crawler task ${job.id}.`);
            return [];
        }
    }

    /**
     * Splits the urls into chunks for the workers.
     * @param urls The urls to split.
     * @param crawlLimit The crawl limit.
     * @param workerCount The number of workers.
     */
    static splitUrlsForWorkers(urls: string[], crawlLimit: number, workerCount: number) {
        // Ensure the number of chunks is not greater than the number of URLs.
        const actualWorkerCount = Math.min(workerCount, urls.length);

        // Calculate the chunk size and remainder based on the actual worker count.
        const chunkSize = Math.floor(urls.length / actualWorkerCount);
        const remainder = urls.length % actualWorkerCount;

        const chunks = [];
        let start = 0;

        // Split the URLs into chunks, only for actual workers needed.
        for (let i = 0; i < actualWorkerCount; i++) {
            const extra = i < remainder ? 1 : 0;
            const end = start + chunkSize + extra;
            const chunkUrls = urls.slice(start, end);

            // Calculate the percentage of the chunk.
            const percentage = ((chunkUrls.length / urls.length) * 100).toFixed(2);

            // Add the chunk to the list.
            chunks.push({
                data: {
                    urls: chunkUrls,
                    crawlLimit: crawlLimit
                },
                percentage: Number(percentage)
            });

            // Update the start index.
            start = end;
        }

        return chunks;
    }
}