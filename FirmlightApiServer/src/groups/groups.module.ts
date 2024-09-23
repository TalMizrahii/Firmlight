import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import {MongooseModule} from "@nestjs/mongoose";
import { Group, GroupSchema } from './Schemas/Groups.schema';
import { User, UserSchema } from '../users/Schemas/User.schema';
import {AtStrategy} from "../auth/Strategies";
import {JwtService} from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    controllers: [GroupsController],
    providers: [AtStrategy, GroupsService, JwtService],
    exports: [MongooseModule]
})
export class GroupsModule {}
