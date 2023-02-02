// RefreshToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable, Logger } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { JwtPayload } from "./jwt.payload"

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractJwt as any]),
            secretOrKey: process.env.JWT_REFRESHTOKEN_SECRET,
        })
    }

    public static extractJwt(request: FastifyRequest): any {
        if(request.cookies && 'refresh_token' in request.cookies) return request.cookies.refresh_token
        const logger = new Logger(RefreshTokenStrategy.name)
        logger.error('User tried to access a protected route without a valid refresh token')
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}