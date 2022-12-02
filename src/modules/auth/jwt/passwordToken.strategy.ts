// PasswordToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from 'express'
import { Injectable } from "@nestjs/common"

@Injectable()
export class PasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-password') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_PASSWORDTOKEN_SECRET,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: any) {
        const passwordToken = req.get('authorization').replace('Bearer ', '').trim()
        return { ...payload, passwordToken }
    }
}