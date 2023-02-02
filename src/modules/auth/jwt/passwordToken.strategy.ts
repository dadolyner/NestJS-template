// PasswordToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { JwtPayload } from "./jwt.payload"
import DadoEx from "src/helpers/exceptions"

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
        const dadoEx = new DadoEx(PasswordTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `Invalid password token.`, response: request['response'] })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}