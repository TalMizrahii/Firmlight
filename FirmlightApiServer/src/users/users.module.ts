import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from './Schemas/User.schema';
import {JwtService} from "@nestjs/jwt";

@Module({
    imports: [MongooseModule.forFeature(
        [
            {
                name: User.name,
                schema: UserSchema
            }
        ]
    )],
    controllers: [UsersController],
    providers: [UsersService, JwtService]
})
export class UsersModule {
}




