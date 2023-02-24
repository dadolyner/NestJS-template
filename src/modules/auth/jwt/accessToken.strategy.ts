// AccessToken JWT Strategy
import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { JwtService } from "@nestjs/jwt"
import { ExtractJwt, Strategy } from "passport-jwt"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"

// Access Token Payload
type JwtPayload = { sub: string, email: string, iat: number, exp: number }

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([AccessTokenStrategy.extractJwt as any]),
            secretOrKey: process.env.JWT_ACCESSTOKEN_SECRET,
        })
    }

    public static extractJwt(request: FastifyRequest): any {
        const access_token_cookie = (request.cookies && 'access_token' in request.cookies) ? request.cookies.access_token : null
        const access_token_header = (request.headers && 'authorization' in request.headers) ? request.headers.authorization.replace('Bearer ', '').trim() : null
        const access_token = access_token_cookie || access_token_header

        // @ts-ignore
        const access_token_decoded = this.jwtService.decode(access_token)
        let access_token_valid = null
        if (access_token_decoded) {
            const currentDate = new Date()
            const expDate = new Date(access_token_decoded.exp * 1000)
            if (expDate > currentDate) access_token_valid = true
        }

        if (access_token_valid) return access_token

        // @ts-ignore
        const { response, url, method } = request
        const dadoEx = new DadoEx(AccessTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to access protected route (@${method} -> ${url}) with a invalid access token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}