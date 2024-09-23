import {Task} from "./task.type";

export type TaskDataType = {
    task: Task
    results: any[]
    totalWorkers: number
    completedWorkers: number
    status?: string
}