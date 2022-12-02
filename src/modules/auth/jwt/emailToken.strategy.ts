// EmailToken JWT Strategy
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from 'express'
import { Injectable } from "@nestjs/common"

@Injectable()
export class EmailTokenStrategy extends PassportStrategy(Strategy, 'jwt-email') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_EMAILTOKEN_SECRET,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: any) {
        const emailToken = req.get('authorization').replace('Bearer ', '').trim()
        return { ...payload, emailToken }
    }
}