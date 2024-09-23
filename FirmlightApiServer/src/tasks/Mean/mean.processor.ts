import {Job} from "bull";

export class MeanProcessor {

    /**
     * Processes a mean task.
     * @param job - The job data.
     * @param connectedWorkers - The connected workers.
     */
    static async processMeanTask(job: Job, connectedWorkers: string[]) {
        if (connectedWorkers.length > 0) {
            const numbers = job.data.data.numbers;
            if (!numbers || numbers.length === 0) {
                console.log(`No numbers to process for mean task ${job.id}.`);
                return [];
            }
            // Prepare task chunks to be sent to each worker
            return this.splitNumbersForWorkers(numbers, connectedWorkers.length);
        } else {
            console.log(`No workers available to process mean task ${job.id}.`);
            return [];
        }
    }

    /**
     * Splits an array of numbers into chunks for the workers and calculates percentage of total work for each chunk.
     * @param numbers - The numbers to split.
     * @param workerCount - The number of workers.
     */
    static splitNumbersForWorkers(numbers: number[], workerCount: number) {
        const chunkSize = Math.floor(numbers.length / workerCount);
        const remainder = numbers.length % workerCount;
        const chunks = [];
        let start = 0;

        for (let i = 0; i < workerCount; i++) {
            const extra = i < remainder ? 1 : 0;
            const end = start + chunkSize + extra;
            const chunk = numbers.slice(start, end);
            const percentage = ((chunk.length / numbers.length) * 100).toFixed(2); // Calculate percentage of total work
            chunks.push({ chunk, percentage });
            start = end;
        }

        return chunks;
    }
}