// RefreshToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"

type JwtPayload = { sub: string, email: string, iat: number, exp: number }

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
        const response = request['response']
        const url = request['url']
        const method = request['method']
        const dadoEx = new DadoEx(RefreshTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to access protected route (@${method} -> ${url}) with a invalid refresh token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}