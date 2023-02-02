// EmailToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable, Logger } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { JwtPayload } from "./jwt.payload"

@Injectable()
export class EmailTokenStrategy extends PassportStrategy(Strategy, 'jwt-email') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([EmailTokenStrategy.extractJwt as any]),
            secretOrKey: process.env.JWT_EMAILTOKEN_SECRET,
        })
    }

    public static extractJwt(request: FastifyRequest): any {
        if(request.cookies && 'email_token' in request.cookies) return request.cookies.email_token
        const logger = new Logger(EmailTokenStrategy.name)
        logger.error('User tried to access a protected route without a valid email token')
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}