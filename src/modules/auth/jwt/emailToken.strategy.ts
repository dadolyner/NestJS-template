// EmailToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"

type JwtPayload = { sub: string, email: string, iat: number, exp: number }

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
        const response = request['response']
        const url = request['url']
        const method = request['method']
        const dadoEx = new DadoEx(EmailTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to access protected route (@${method} -> ${url}) with a invalid email token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}