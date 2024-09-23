import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksGateway } from './tasks.gateway';
import { BullModule } from "@nestjs/bull";
import { JwtService } from "@nestjs/jwt";
import { TasksController } from './tasks.controller';
import { GroupsModule } from "../groups/groups.module";
import {TaskProcessor} from "./task.processor";
import {GroupsService} from "../groups/groups.service";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'tasks',
        }),
        GroupsModule,
    ],
    controllers: [TasksController],
    providers: [TasksGateway, TasksService, JwtService, TaskProcessor,GroupsService],
})
export class TasksModule {}