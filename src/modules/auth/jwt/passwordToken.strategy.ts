// PasswordToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"

type JwtPayload = { sub: string, email: string, iat: number, exp: number }

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
        const response = request['response']
        const url = request['url']
        const method = request['method']
        const dadoEx = new DadoEx(PasswordTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to access protected route (@${method} -> ${url}) with a invalid password token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}