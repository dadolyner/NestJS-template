// RefreshToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { JwtPayload } from "./jwt.payload"
import DadoEx from "src/helpers/exceptions"

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
        const dadoEx = new DadoEx(RefreshTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `Invalid refresh token.`, response: request['response'] })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}