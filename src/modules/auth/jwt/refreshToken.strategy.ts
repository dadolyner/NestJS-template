// RefreshToken JWT Strategy
import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { JwtService } from "@nestjs/jwt"
import { ExtractJwt, Strategy } from "passport-jwt"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"

// Refresh Token Payload
type JwtPayload = { sub: string, email: string, iat: number, exp: number }

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractJwtFromCookies as any]),
            secretOrKey: process.env.JWT_REFRESHTOKEN_SECRET,
        })
    }

    public static extractJwtFromCookies(request: FastifyRequest): any {
        const refresh_token_cookie = (request.cookies && 'refresh_token' in request.cookies) ? request.cookies.refresh_token : null
        const refresh_token_header = (request.headers && 'authorization' in request.headers) ? request.headers.authorization.replace('Bearer ', '').trim() : null
        const refresh_token = refresh_token_cookie || refresh_token_header

        // @ts-ignore
        const refresh_token_decoded = this.jwtService.decode(refresh_token)
        let refresh_token_valid = null
        if (refresh_token_decoded) {
            const currentDate = new Date()
            const expDate = new Date(refresh_token_decoded.exp * 1000)
            if (expDate > currentDate) refresh_token_valid = true
        }

        if (refresh_token_valid) return refresh_token

        // @ts-ignore
        const { response, url, method } = request
        const dadoEx = new DadoEx(RefreshTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to refresh protected route (@${method} -> ${url}) with a invalid refresh token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}