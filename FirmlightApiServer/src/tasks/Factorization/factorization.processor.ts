import { Job } from "bull";

export class FactorizationProcessor {
    /**
     * Processes a factorization task.
     * @param job - The job data.
     * @param connectedWorkers - The connected workers.
     */
    static async processFactorizationTask(job: Job, connectedWorkers: string[]) {
        if (connectedWorkers.length > 0) {
            const numberToFactor = job.data.data.numberToFactor;
            // Split the number for the workers (processor's job)
            return this.splitNumberForWorkers(numberToFactor, connectedWorkers.length);
        } else {
            console.log(`No workers available to process factorization task ${job.id}.`);
            return [];
        }
    }

    /**
     * Splits a number into chunks for the workers and calculates percentage of total work for each chunk.
     * @param number - The number to split.
     * @param workerCount - The number of workers.
     * @private - This method is private to the class.
     */
    static splitNumberForWorkers(number: number, workerCount: number) {
        const chunkSize = Math.floor(number / workerCount);
        const chunks = [];
        const totalRange = number - 1; // Excluding 1 as it's not a factor

        for (let i = 0; i < workerCount; i++) {
            const start = i * chunkSize + 2; // Start from 2 as 1 is not a factor
            const end = i === workerCount - 1 ? number : (i + 1) * chunkSize + 1;
            const chunkRange = end - start + 1;
            const percentage = ((chunkRange / totalRange) * 100).toFixed(2);

            chunks.push({
                data: { start, end },
                percentage: Number(percentage)
            });
        }
        return chunks;
    }
}