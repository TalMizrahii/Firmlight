import {TaskMetadata} from "./task-metadata.type";

export type GroupResponseType = {
    creatorID: string;
    groupID: string;
    groupName: string;
    creatorUsername: string;
    description: string;
    created?: string;
    requests?: Array<string>;
    members: Array<{ userID: string; username: string; starred?: boolean }>;
    tasks: Array<TaskMetadata>;
};
