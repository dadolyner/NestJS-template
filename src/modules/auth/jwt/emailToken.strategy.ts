// EmailToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import DadoEx from "src/helpers/exceptions"
import { JwtService } from "@nestjs/jwt"

// Email Token Payload
type JwtPayload = { sub: string, email: string, iat: number, exp: number }

@Injectable()
export class EmailTokenStrategy extends PassportStrategy(Strategy, 'jwt-email') {
    constructor(private readonly jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([EmailTokenStrategy.extractJwtFromCookies as any]),
            secretOrKey: process.env.JWT_EMAILTOKEN_SECRET,
        })
    }

    public static extractJwtFromCookies(request: FastifyRequest): any {
        const email_token_cookie = (request.cookies && 'email_token' in request.cookies) ? request.cookies.email_token : null
        const email_token_header = (request.headers && 'authorization' in request.headers) ? request.headers.authorization.replace('Bearer ', '').trim() : null
        const email_token = email_token_cookie || email_token_header 

        // @ts-ignore
        const email_token_decoded = this.jwtService.decode(email_token)
        let email_token_valid = null
        if(email_token_decoded) {
            const currentDate = new Date()
            const expDate = new Date(email_token_decoded.exp * 1000)
            if(expDate > currentDate) email_token_valid = true
        }

        if(email_token_valid) return email_token
            
        // @ts-ignore
        const { response, url, method } = request
        const dadoEx = new DadoEx(EmailTokenStrategy.name)
        dadoEx.throw({ status: 401, message: `User tried to email protected route (@${method} -> ${url}) with a invalid email token.`, response })
        return null
    }

    async validate(payload: JwtPayload) { return payload }
}