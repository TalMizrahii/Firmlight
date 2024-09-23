import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import * as process from "node:process";
import {Injectable} from "@nestjs/common";

type JwtPayload = {
    sub: string;
    username: string;
};


@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_AT_SECRET
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
} 