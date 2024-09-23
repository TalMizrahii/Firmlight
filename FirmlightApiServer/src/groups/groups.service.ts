import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {CreateGroupDto} from './DTO';
import {Group} from './Schemas/Groups.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {GroupResponseType, TaskMetadata} from "./Types";
import {v4 as uuidv4} from 'uuid';
import {User} from 'src/users/Schemas/User.schema';


@Injectable()
export class GroupsService {
    /**
     * Groups service constructor.
     * @param groupModel The group model.
     * @param userModel The user model.
     */
    constructor(@InjectModel(Group.name) private groupModel: Model<Group>,
                @InjectModel(User.name) private userModel: Model<User>) {
    }

    /**
     * Finds all groups where the user is a member.
     * @param userId The user ID.
     */
    async findAllUserGroups(userId: string): Promise<GroupResponseType[]> {
        try {
            // Find groups where the user is a member.
            const groups = await this.groupModel.find({
                'members.userID': userId
            }).exec();

            return groups.map(group => {
                // Find the specific member entry for the requesting user.
                const userMembership = group.members.find(member => member.userID === userId);

                // Build the response including only the user's starred status.
                return {
                    ...this.buildGroupResponse(group, userId),
                    starred: userMembership?.starred || false // default to false if not found.
                };
            });

        } catch (err) {
            console.error('Error finding groups:', err);
            throw new InternalServerErrorException('Error finding groups');
        }

    }


    /**
     * Finds a group by group ID.
     * @param groupID The group ID.
     * @param userID The user ID.
     */
    async findOne(groupID: string, userID: string): Promise<GroupResponseType> {
        try {
            const group = await this.groupModel.findOne({groupID}).exec();

            // Check if the group was found.
            if (!group) {
                throw new NotFoundException('Group not found');
            }

            // Check if the user is a member of the group.
            const isMember = group.members.some(member => member.userID === userID);
            if (!isMember) {
                throw new UnauthorizedException('You do not have access to this group');
            }

            // Return the group response.
            return this.buildGroupResponse(group, userID);
        } catch (err) {
            // Handle specific exceptions and log any other errors.
            if (err instanceof NotFoundException || err instanceof UnauthorizedException) {
                throw err;
            }

            console.error('Error finding group:', err);
            throw new InternalServerErrorException('Error finding group');
        }
    }


    /**
     * Creates a new group.
     * @param createGroupDto The create group DTO.
     */
    async create(createGroupDto: CreateGroupDto): Promise<GroupResponseType> {
        // Validate the group name.
        if (createGroupDto.groupName.length < 3) {
            throw new ConflictException('Group name must be at least 3 characters long.');
        }
        // Check if the group name is already in use.
        const existingGroup = await this.groupModel.findOne(
            {groupName: createGroupDto.groupName}).exec();
        if (existingGroup) {
            throw new ConflictException('Group name already in use.');
        }
        // Check if the creator is already a member of the group.
        if (!createGroupDto.created) {
            createGroupDto.created = (this.formatDateToDDMMYYYY(new Date())).toString();
        }
        // Generate a unique group ID.
        const groupID = uuidv4();
        // Create the new group.
        try {
            const newGroup = new this.groupModel({
                creatorID: createGroupDto.userId,
                creatorUsername: createGroupDto.creatorUsername,
                groupID: groupID,
                groupName: createGroupDto.groupName,
                description: createGroupDto.description,
                created: createGroupDto.created,
                requests: [],
                tasks: [],
                members: [
                    {userID: createGroupDto.userId, username: createGroupDto.creatorUsername, starred: false},
                ],
            });
            // Save the new group.
            await newGroup.save();
            console.log('Group created:', newGroup.groupName + ' by ' + newGroup.creatorUsername);
            const alert = {
                groupName: newGroup.groupName,
                message: `Group "${newGroup.groupName}" has been created by ${newGroup.creatorUsername}`,
                type: 'info',
                id: Date.now(), // Unique ID using timestamp
            };
            // Add the alert to the creator.
            await this.userModel.updateOne(
                {id: createGroupDto.userId},
                {$push: {alerts: alert}},
                {new: true}
            ).exec();
            // Check if there are any requests to join the group.
            if (createGroupDto.requests !== null
                || createGroupDto.requests !== undefined
                || createGroupDto.requests.length > 0) {
                // Send requests to join the group.
                try {
                    const requests = await this.sendRequestGroup(groupID, createGroupDto.userId, createGroupDto.requests);

                } catch (err) {
                    console.error('Error sending requests:', err);
                }
            }

            // Return the group response.
            return this.buildGroupResponse(newGroup, createGroupDto.userId);
        } catch (err) {
            console.error('Error creating group:', err);
            if (err instanceof ConflictException) {
                throw err;
            }
            throw new InternalServerErrorException('Error creating group');
        }
    }

    /**
     * Stars or unstars a group for a user.
     * @param groupID The group ID.
     * @param userID The user ID.
     * @param status The starred status.
     */
    async starGroup(groupID: string, userID: string, status: boolean): Promise<GroupResponseType> {
        try {
            // Find the group by ID
            const group = await this.groupModel.findOne({groupID}).exec();
            if (!group) {
                throw new NotFoundException('Group not found');
            }
            // Check if the user is a member of the group
            const member = group.members.find(
                member => member.userID === userID);
            if (!member) {
                throw new NotFoundException('User not a member of the group');
            }
            // Update the starred status for the user
            member.starred = status;
            // Save the updated group
            await group.save();
            console.log('Group starred:', group.groupName + ' by ' + member.username);
            return this.buildGroupResponse(group, userID);
        } catch (err) {
            console.error('Error starring group:', err);
            throw new InternalServerErrorException('Error starring group');
        }
    }

    /**
     * Exits a group.
     * @param groupID The group ID.
     * @param userID The user ID.
     */
    async exitGroup(groupID: string, userID: string): Promise<GroupResponseType> {
        try {
            // Find the group by ID.
            const group = await this.groupModel.findOne({groupID}).exec();
            if (!group) {
                throw new NotFoundException('Group not found');
            }

            // Check if the user is a member of the group
            const memberIndex = group.members.findIndex(
                member => member.userID === userID);
            if (memberIndex === -1) {
                throw new NotFoundException('User not a member of the group');
            }

            // Check if the user is the admin (creator)
            const isAdmin = group.creatorID === userID;

            if (isAdmin) {
                if (group.members.length === 1) {
                    // If the user is the only member (admin), delete the group
                    await this.groupModel.deleteOne({groupID}).exec();
                    console.log('Group deleted:', group.groupName);
                    return null;
                } else {
                    // Choose a new admin from the remaining members.
                    // For simplicity, we select the first member as the new admin.
                    const newAdmin = group.members.find(
                        member => member.userID !== userID);
                    if (newAdmin) {
                        group.creatorID = newAdmin.userID; // Assign new admin.
                        group.creatorUsername = newAdmin.username;
                        console.log('New admin:', newAdmin.username);
                    }
                }
            }
            const memberIds = group.members.map(member => member.userID);
            const memberLeft = group.members.find(
                member => member.userID === userID);
            // Remove the user from the group
            group.members.splice(memberIndex, 1);
            // Save the updated group
            await group.save();
            // Add an alert to all group members that the user has exited the group.
            const alert = {
                groupName: group.groupName,
                message: `${memberLeft.username} has left "${group.groupName}" group`,
                type: 'info',  // You can use 'error' since the group is deleted
                id: Date.now(), // Unique ID using timestamp
            };
            // Add the alert to all group members.
            await Promise.all(memberIds.map(async (memberID) => {
                await this.userModel.updateOne(
                    {id: memberID},
                    {$push: {alerts: alert}},
                    {new: true}
                ).exec();
            }));
            console.log('Alert sent to all group members:', memberIds);

            console.log('User exited the group:', group.groupName + ' by ' + userID);
            return this.buildGroupResponse(group, userID);
        } catch (err) {
            console.error('Error exiting group:', err);
            throw new InternalServerErrorException('Error exiting group');
        }
    }

    /**
     * Deletes a group only if the user is the admin (creator).
     * @param groupID The group ID.
     * @param userID The user ID.
     */
    async deleteGroup(groupID: string, userID: string): Promise<boolean> {
        try {
            // Find the group by ID.
            const group = await this.groupModel.findOne({groupID}).exec();
            if (!group) {
                throw new NotFoundException('Group not found');
            }
            // Check if the user is the admin (creator).
            if (group.creatorID !== userID) {
                throw new UnauthorizedException('You are not the creator of the group');
            }
            // Retrieve the list of users with pending requests for this group.
            const userRequests = group.requests;
            const memberIds = group.members.map(member => member.userID);
            // Delete the group.
            await this.groupModel.deleteOne({groupID}).exec();
            console.log('Group deleted:', group.groupName, 'by', group.creatorUsername);

            // Go through each user and delete the request for this group from their groupRequests.
            await Promise.all(userRequests.map(async (requestUserID) => {
                await this.userModel.findOneAndUpdate(
                    {id: requestUserID},  // Match the user by their ID
                    {$pull: {groupRequests: {groupID}}},  // Remove the group request for this group
                    {new: true}  // Return the updated document
                ).exec();
            }));
            console.log('Requests deleted for users:', userRequests);
            // Add an alert to all group members that the group has been deleted.
            const alert = {
                groupName: group.groupName,
                message: `Group "${group.groupName}" has been deleted by ${group.creatorUsername}`,
                type: 'error',  // You can use 'error' since the group is deleted
                id: Date.now(), // Unique ID using timestamp
            };
            // Add the alert to all group members.
            await Promise.all(memberIds.map(async (memberID) => {
                await this.userModel.updateOne(
                    {id: memberID},
                    {$push: {alerts: alert}},
                    {new: true}
                ).exec();
            }));
            console.log('Alert sent to all group members:', memberIds);
            return true;
        } catch (err) {
            console.log('Error deleting group', err);
            throw new InternalServerErrorException('Error while deleting group');
        }
    }

    /**
     * Sends a request to join a group.
     * @param groupID The group ID.
     * @param creatorID The user ID of the creator.
     * @param requests The user IDs to send requests to.
     */
    async sendRequestGroup(groupID: string, creatorID: string, requests: string[]): Promise<string[]> {
        // Filter out the creator ID from the requests.
        requests = requests.filter(request => request !== creatorID);
        if (!requests || requests.length === 0) {
            return [];
        }
        try {
            // Find the group by ID.
            const group = await this.groupModel.findOne({groupID}).exec();
            if (!group) {
                throw new NotFoundException('Group not found');
            }
            // Check if the creator is the user sending the request.
            if (group.creatorID !== creatorID) {
                throw new ConflictException('You are not allowed to send a request to this group');
            }
            // Check if any of the requests are already in the group or if a request already exists.
            const existingRequests = requests.filter(request =>
                group.members.some(member => member.userID !== request) ||
                group.requests.some(existingRequest => existingRequest !== request)
            );
            // no valid requests.
            if (existingRequests.length === 0) {
                return [];
            }
            // Find the users by ID and add the group request.
            const updatedUsers = await Promise.all(existingRequests.map(async userID => {
                return this.userModel.findOneAndUpdate(
                    {id: userID},
                    {
                        $addToSet: {
                            groupRequests: {
                                groupID,
                                senderID: creatorID,
                                senderUsername: group.creatorUsername,
                                groupName: group.groupName,
                            }
                        }
                    },
                    {new: true}  // return the updated document
                ).exec();
            }));
            // Get IDs of updated users.
            const newUserIds = updatedUsers.map(user => user.id);
            // Add these new requests to the group, ensuring no duplicates.
            group.requests = [...new Set([...group.requests, ...newUserIds])];
            await group.save();
            console.log('Requests sent to new users:', newUserIds);
            return newUserIds;
        } catch (err) {
            console.error('Error sending request to group:', err);
            return [];
        }
    }

    /**
     * Answers a request to join a group.
     * @param groupID The group ID.
     * @param userID The user ID.
     * @param answer The answer to the request.
     */
    async answerRequestGroup(groupID: string, userID: string, answer: boolean): Promise<GroupResponseType> {
        try {
            // Find the group by ID.
            const group = await this.groupModel.findOne({groupID});
            if (!group) {
                throw new NotFoundException('Group not found');
            }

            // Check if the request exists in the group's request array.
            const groupRequestIndex = group.requests?.indexOf(userID);
            if (groupRequestIndex === -1 || groupRequestIndex === undefined) {
                throw new BadRequestException('Request not found in group');
            }

            // Find the user by ID with groupRequests selected.
            const user = await this.userModel.findOne({id: userID}).select('+groupRequests').exec();
            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Check if the user's groupRequests array has the request related to this group.
            const userRequestIndex = user.groupRequests.findIndex(req => req.groupID === groupID);
            if (userRequestIndex === -1) {
                throw new BadRequestException('Request not found in user');
            }

            // Proceed to accept or reject the request.
            if (answer === true) {
                // Add user to the group's members list.
                group.members.push({
                    userID: user.id,
                    username: user.username,
                    starred: false // default to not starred
                });
                // Add an alert to all group members that the user has joined the group.
                const alert = {
                    groupName: group.groupName,
                    message: `${user.username} has joined "${group.groupName}" group`,
                    type: 'success',  // You can use 'error' since the group is deleted
                    id: Date.now(), // Unique ID using timestamp
                };
                // Add the alert to all group members.
                const memberIds = group.members.map(member => member.userID);
                await Promise.all(memberIds.map(async (memberID) => {
                    await this.userModel.updateOne(
                        {id: memberID},
                        {$push: {alerts: alert}},
                        {new: true}
                    ).exec();
                }));
                console.log('Alert sent to all group members:', memberIds);
            }

            // Remove the request from the group and user.
            group.requests.splice(groupRequestIndex, 1);
            user.groupRequests.splice(userRequestIndex, 1);

            // Ensure both group and user are valid before saving.
            const newGroup = await group.save();
            const newUser = await user.save(); // Validate this step for missing senderID.
            // Return the group response.
            return this.buildGroupResponse(newGroup, userID);
        } catch (err) {
            console.error('Error answering request to group:', err);
            throw new InternalServerErrorException('Error answering request to group');
        }
    }

    /**
     * Answers all requests to join a group.
     * @param userID The user ID.
     * @param answer The answer to the requests (true/false).
     */
    async sendAnswerAllGroupDto(userID: string, answer: boolean): Promise<GroupResponseType[]> {
        try {
            // Find the user by ID with groupRequests selected.
            const user = await this.userModel.findOne({id: userID}).select('+groupRequests').exec();
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const groupRequests = user.groupRequests;
            // Check if there are any requests to answer.
            if (groupRequests.length === 0) {
                return [];
            }
            // Map the requests to async operations
            const groupPromises = groupRequests.map(async (request) => {
                const group = await this.groupModel.findOne({groupID: request.groupID}).exec();
                if (!group) return null;
                if (answer) {
                    group.members.push({
                        userID: user.id,
                        username: user.username,
                        starred: false
                    });
                }
                // Remove the request from the group and user.
                const groupRequestIndex = group.requests.indexOf(userID);
                const userRequestIndex = user.groupRequests.findIndex(req => req.groupID === request.groupID);
                if (groupRequestIndex > -1) group.requests.splice(groupRequestIndex, 1);
                if (userRequestIndex > -1) user.groupRequests.splice(userRequestIndex, 1);
                // Save the updated group.
                await group.save();
                return group;
            });
            // Resolve all promises concurrently.
            const updatedGroups = (await Promise.all(groupPromises)).filter(group => group !== null);
            // Save the updated user after requests are removed.
            await user.save();
            console.log('Requests answered for all groups');
            // Return the groups the user joined.
            return updatedGroups.map(group => this.buildGroupResponse(group, userID));
        } catch (err) {
            console.error('Error answering all requests:', err);
            throw new InternalServerErrorException('Error answering all requests');
        }
    }

    /**
     * Adds a task to a group.
     * @param groupID The group ID.
     * @param taskMetadata The task metadata.
     */
    async addTaskToGroup(groupID: string, taskMetadata: TaskMetadata): Promise<TaskMetadata> {
        const group = await this.groupModel.findOne({groupID}).exec();
        if (!group) {
            throw new NotFoundException('Group not found');
        }

        const newTask: TaskMetadata = {
            taskId: taskMetadata.taskId,
            title: taskMetadata.title,
            description: taskMetadata.description,
            created: taskMetadata.created,
            status: 'PROGRESS',  // Explicit assignment of a valid union type value
            statistics: {},
            creatorID: taskMetadata.creatorID,
            creatorUsername: group.members.find(member => member.userID === taskMetadata.creatorID)?.username,
        };

        group.tasks.push(newTask);
        await group.save();
        return newTask;
    }

    /**
     * Gets the metadata for a task in a group.
     * @param groupID The group ID.
     * @param taskId The task ID.
     * @param userID The user ID.
     */
    async getTaskMetadata(groupID: string, userID: string, taskId: string): Promise<TaskMetadata> {
        const group = await this.groupModel.findOne({groupID}).exec();
        // Check if the group was found.
        if (!group) {
            throw new NotFoundException('Group not found');
        }
        // Check if the user is a member of the group.
        const isMember = group.members.some(member => member.userID === userID);
        if (!isMember) {
            throw new UnauthorizedException('You do not have access to this group');
        }
        const task = group.tasks.find(task => task.taskId === taskId);
        if (!task) {
            throw new NotFoundException('Task not found in group');
        }
        return task;
    }

    /**
     * Updates the statistics of a task worker.
     * @param groupID The group ID.
     * @param taskId The task ID.
     * @param workerID The worker ID.
     * @param status The status of the worker.
     * @param workerUsername The worker username.
     * @param percentage The percentage of the task completed.
     */
    async updateTaskWorkerStatistics(
        groupID: string,
        taskId: string,
        workerID: string,
        status: 'PROGRESS' | 'FINISHED' | 'FAILED',
        workerUsername?: string,
        percentage?: number,
        addition?: boolean
    ) {
        try {
            // Retrieve the current task data
            const group = await this.groupModel.findOne({ groupID, 'tasks.taskId': taskId }).exec();
            if (!group) {
                throw new NotFoundException('Group or task not found');
            }

            const task = group.tasks.find(task => task.taskId === taskId);
            if (!task) {
                throw new NotFoundException('Task not found');
            }

            // Check if the worker's statistics already exist
            let existingPercentage = task.statistics[workerID]?.percentage || 0;

            // If the worker's statistics already exist and addition is false, just update
            if (task.statistics[workerID] && !addition) {
                console.log(`Updating statistics for worker ${workerID}`);
                existingPercentage = percentage; // Set to new percentage for direct update
            } else {
                // If the worker's statistics don't exist or we need to add to the existing percentage
                console.log(`Adding to statistics for worker ${workerID}`);
                if (addition && percentage !== undefined) {
                    existingPercentage += percentage; // Add percentage
                } else {
                    existingPercentage = percentage || 0; // Set to the provided percentage
                }
            }

            const currentTime = new Date().toISOString();
            const updateFields: any = {
                [`tasks.$.statistics.${workerID}.status`]: status,
                [`tasks.$.statistics.${workerID}.percentage`]: status === 'PROGRESS' ? existingPercentage : (status === 'FAILED' ? 0 : existingPercentage),
                [`tasks.$.statistics.${workerID}.startTime`]: status === 'PROGRESS' ? currentTime : undefined,
                [`tasks.$.statistics.${workerID}.finishTime`]: status === 'PROGRESS' ? null : (status === 'FINISHED' || status === 'FAILED' ? currentTime : undefined)
            };

            // Add the worker's username if provided
            if (workerUsername) {
                updateFields[`tasks.$.statistics.${workerID}.workerUsername`] = workerUsername;
            }

            // Update the task with the worker's statistics
            const result = await this.groupModel.findOneAndUpdate(
                { groupID, 'tasks.taskId': taskId },
                { $set: updateFields },
                { new: true, runValidators: true }
            ).exec();

            // Check if the group or task was found
            if (!result) {
                throw new NotFoundException('Group or task not found');
            }

            // Return the updated task statistics
            return result.tasks.find(task => task.taskId === taskId);
        } catch (err) {
            console.error('Error updating task worker statistics:', err);
            return null;
        }
    }


    /**
     * Updates the status of a task in a group.
     * @param groupID The group ID.
     * @param taskId The task ID.
     * @param status The new status.
     */
    async updateTaskStatus(groupID: string, taskId: string, status: 'FAILED' | 'PROGRESS' | 'SUCCESS') {
        try {
            const result = await this.groupModel.findOneAndUpdate(
                {groupID, 'tasks.taskId': taskId},
                {$set: {'tasks.$.status': status}},
                {new: true, runValidators: true}
            ).exec();

            if (!result) {
                throw new NotFoundException('Group or task not found');
            }

            const updatedTask = result.tasks.find(task => task.taskId === taskId);
            console.log("Task status updated to: ", updatedTask.status);
            return updatedTask;
        } catch (err) {
            console.error('Error updating task status:', err);
            throw err;
        }
    }


    /**
     * Builds a group response object.
     * @param group The group object.
     * @param userId The user ID.
     * @private
     */
    private buildGroupResponse(group: Group, userId: string): GroupResponseType {
        // Check if the user is the creator of the group.
        const isCreator = group.creatorID === userId;
        return {
            creatorID: group.creatorID,
            groupID: group.groupID,
            groupName: group.groupName,
            description: group.description,
            created: group.created,
            creatorUsername: group.creatorUsername,
            requests: isCreator ? group.requests : undefined,
            members: group.members.map(member => {
                // Check if the member is the requesting user
                const isUser = member.userID === userId;
                return {
                    userID: member.userID,
                    username: member.username,
                    starred: isUser ? member.starred : undefined  // Include starred status only for the user.
                };
            }),
            tasks: group.tasks,
        };
    }


    /**
     * Formats a date object to a DD/MM/YYYY string.
     * @param date The date object.
     * @private
     */
    private formatDateToDDMMYYYY(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
