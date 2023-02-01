// PasswordToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"

type JwtPayload = { sub: string, email: string, iat: number, exp: number }

@Injectable()
export class PasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-password') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_PASSWORDTOKEN_SECRET
        })
    }

    validate(payload: JwtPayload) { return payload }
}