// Guard classes that protects routes with Access or Refresh Token
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from "@nestjs/jwt"
import { HttpExc } from 'src/helpers/exceptions'

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const cookies = request.cookies
        const accessToken = cookies.access_token
        
        try { return this.jwtService.verify(accessToken, { secret: `${process.env.JWT_ACCESSTOKEN_SECRET}` }) }
        catch (error) { throw HttpExc.unauthorized(AccessGuard.name, `Access Token expired.`) }
    }
}

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const cookies = request.cookies
        const refreshToken = cookies.refresh_token
        
        try { return this.jwtService.verify(refreshToken, { secret: `${process.env.JWT_REFRESHTOKEN_SECRET}` }) }
        catch (error) { throw HttpExc.unauthorized(RefreshGuard.name, `Refresh Token expired.`) }
    }
}