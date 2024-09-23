// src/utils/auth.utils.ts

import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export function extractToken(request: Request): string {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Token is missing');
    }
    return token;
}

export function decodeToken(jwtService: JwtService, token: string): any {
    try {
        return jwtService.decode(token) as any;
    } catch (err) {
        throw new UnauthorizedException('Invalid token');
    }
}

export function validateAccessTokenUserId(jwtService: JwtService, token: string, userID: string) {
    const decodedToken = decodeToken(jwtService, token);
    jwtService.verify(token, {secret: process.env.JWT_AT_SECRET});
    if (decodedToken.userID !== userID) {
        throw new UnauthorizedException('Token does not match the user ID');
    }
    return true;
}

export function validateRefreshTokenUserId(jwtService: JwtService, token: string, userID: string) {
    const decodedToken = decodeToken(jwtService, token);
    jwtService.verify(token, {secret: process.env.JWT_RT_SECRET});
    if (decodedToken.userID !== userID) {
        throw new UnauthorizedException('Token does not match the user ID');
    }
    return true;
}
