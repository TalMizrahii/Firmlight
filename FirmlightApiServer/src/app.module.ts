import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { TasksModule } from './tasks/tasks.module';
import { BullModule } from '@nestjs/bull';
import * as process from 'node:process';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + process.env.DB_CONN),
        AuthModule,
        GroupsModule,
        UsersModule,
        TasksModule,
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT, 10),
                username: process.env.REDIS_USER,
                password: process.env.REDIS_PASS,
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
