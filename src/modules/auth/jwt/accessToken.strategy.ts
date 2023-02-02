// AccesToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable, Logger } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { JwtPayload } from "./jwt.payload"

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {  
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([AccessTokenStrategy.extractJwt as any]),
            secretOrKey: process.env.JWT_ACCESSTOKEN_SECRET,
        })
    }

    public static extractJwt(request: FastifyRequest): any {
        if(request.cookies && 'access_token' in request.cookies) return request.cookies.access_token
        const logger = new Logger(AccessTokenStrategy.name)
        logger.error('User tried to access a protected route without a valid access token')
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}