// PasswordToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"
import { JwtService } from "@nestjs/jwt"

type JwtPayload = { sub: string, password: string, iat: number, exp: number }

@Injectable()
export class PasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-password') {
    constructor(private readonly jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([PasswordTokenStrategy.extractJwtFromCookies as any]),
            secretOrKey: process.env.JWT_PASSWORDTOKEN_SECRET,
        })
    }

    public static extractJwtFromCookies(request: FastifyRequest): any {
        const password_token_cookie = (request.cookies && 'password_token' in request.cookies) ? request.cookies.password_token : null
        const password_token_header = (request.headers && 'authorization' in request.headers) ? request.headers.authorization.replace('Bearer ', '').trim() : null
        const password_token = password_token_cookie || password_token_header 

        // @ts-ignore
        const password_token_decoded = this.jwtService.decode(password_token)
        let password_token_valid = null
        if(password_token_decoded) {
            const currentDate = new Date()
            const expDate = new Date(password_token_decoded.exp * 1000)
            if(expDate > currentDate) password_token_valid = true
        }

        if(password_token_valid) return password_token
            
        // @ts-ignore
        const { response, url, method } = request
        const dadoEx = new DadoEx(PasswordTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to password protected route (@${method} -> ${url}) with a invalid password token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}