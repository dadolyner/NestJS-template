// AccesToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"

type JwtPayload = { sub: string, email: string, iat: number, exp: number }

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
        const response = request['response']
        const url = request['url']
        const method = request['method']
        const dadoEx = new DadoEx(AccessTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to access protected route (@${method} -> ${url}) with a invalid access token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}