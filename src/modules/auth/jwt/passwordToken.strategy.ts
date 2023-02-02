// PasswordToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable, Logger } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { JwtPayload } from "./jwt.payload"

@Injectable()
export class PasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-password') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([PasswordTokenStrategy.extractJwt as any]),
            secretOrKey: process.env.JWT_PASSWORDTOKEN_SECRET,
        })
    }

    public static extractJwt(request: FastifyRequest): any {
        if(request.cookies && 'password_token' in request.cookies) return request.cookies.password_token
        const logger = new Logger(PasswordTokenStrategy.name)
        logger.error('User tried to access a protected route without a valid password token')
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}