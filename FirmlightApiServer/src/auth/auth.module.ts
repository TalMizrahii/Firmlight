import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../users/Schemas/User.schema";
import {JwtModule} from "@nestjs/jwt";
import {AtStrategy, RtStrategy} from "./Strategies";

@Module({
    imports: [MongooseModule.forFeature(
        [
            {
                name: User.name,
                schema: UserSchema
            }
        ]
    ),
        JwtModule.register({})],
    providers: [AuthService, AtStrategy, RtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
