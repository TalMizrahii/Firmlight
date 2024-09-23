import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import {hash} from 'bcrypt';
import {Document} from 'mongoose';

@Schema()
export class GroupRequest {
    @Prop({required: true})
    groupID: string;

    @Prop({required: true})
    senderID: string;

    @Prop({required: true})
    senderUsername: string;

    @Prop({required: true})
    groupName: string;
}

const GroupRequestSchema = SchemaFactory.createForClass(GroupRequest);

@Schema()
export class User extends Document {
    @Prop({unique: true, required: true})
    id: string;

    @Prop({unique: true, required: true})
    username: string;

    @Prop({unique: true, required: true})
    email: string;

    @Prop({select: false, required: true})
    password: string;

    @Prop({select: true, required: true})
    accessToken: string;

    @Prop({select: true, required: true})
    refreshToken: string;

    // Updated to store an array of group request objects
    @Prop({select: false, type: [GroupRequestSchema], default: []})
    groupRequests: GroupRequest[];

    @Prop({
        type: [{
            groupName: { type: String, required: true },
            message: { type: String, required: true },
            type: { type: String, required: true },
            id: { type: Number, required: true }
        }],
        default: []
    })
    alerts: Array<{ groupName: string, message: string, type: string, id: number }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<User>('save', async function (next) {
    if (this.isModified('password')) {  // This works now
        this.password = await hash(this.password, 10);
    }
    next();
});