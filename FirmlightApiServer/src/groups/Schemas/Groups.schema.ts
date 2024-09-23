import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

// import { TaskMetadata } from '../Types';

@Schema()
export class TaskMetadataSchema {
    @Prop({required: true})
    taskId: string;
    @Prop({required: true})
    title: string;
    @Prop({required: true})
    description: string;
    @Prop({enum: ['FAILED', 'PROGRESS', 'SUCCESS'], default: 'PROGRESS'})
    status: 'FAILED' | 'PROGRESS' | 'SUCCESS';
    @Prop({required: false})
    created?: string;
    @Prop({
        type: Map,
        of: {
            status: {type: String, enum: ['PROGRESS', 'FINISHED', 'FAILED'], default: 'PROGRESS'},
            startTime: {type: String, required: true},
            finishTime: {type: String},
            percentage: {type: Number, required: true},
            workerUsername: {type: String, required: true}
        }
    })
    statistics: {
        [userId: string]: {
            status: 'PROGRESS' | 'FINISHED' | 'FAILED';
            startTime: string;
            finishTime?: string;
            percentage: number;
            workerUsername: string;
        }
    };
    @Prop({required: true})
    creatorID: string;
    @Prop({required: true})
    creatorUsername: string;
}



@Schema()
export class Group extends Document {
    @Prop({required: true})
    creatorID: string;

    @Prop({required: true})
    creatorUsername: string;

    @Prop({unique: true, required: true})
    groupID: string;

    @Prop({required: true})
    groupName: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    created: string;

    @Prop({required: false})
    requests?: Array<string>;

    @Prop({type: [{userID: String, username: String, starred: Boolean}]})
    members: Array<{ userID: string; username: string; starred: boolean }>;

    @Prop({type: [Object], default: []})
    tasks: Array<TaskMetadataSchema>;
}

export const GroupSchema = SchemaFactory.createForClass(Group);