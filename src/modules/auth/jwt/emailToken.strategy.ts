// EmailToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { JwtPayload } from "./jwt.payload"
import DadoEx from "src/helpers/exceptions"

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
        const dadoEx = new DadoEx(EmailTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `Invalid email token.`, response: request['response'] })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}