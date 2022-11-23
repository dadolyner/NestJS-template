// Guard classes that protects routes with Access or Refresh Token
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from "@nestjs/jwt"
import DadoEx from 'src/helpers/exceptions'

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    private dadoEx = new DadoEx(AccessGuard.name)

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        const cookies = request.cookies
        const accessToken = cookies.access_token

        try { return this.jwtService.verify(accessToken, { secret: `${process.env.JWT_ACCESSTOKEN_SECRET}` }) }
        catch (error) { this.dadoEx.throw({ status: 401, message: `Access Token expired.`, response }) }
    }
}

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    private dadoEx = new DadoEx(RefreshGuard.name)

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        const cookies = request.cookies
        const refreshToken = cookies.refresh_token

        try { return this.jwtService.verify(refreshToken, { secret: `${process.env.JWT_REFRESHTOKEN_SECRET}` }) }
        catch (error) { this.dadoEx.throw({ status: 401, message: `Refresh Token expired.`, response }) }
    }
}

@Injectable()
export class PasswordGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    private dadoEx = new DadoEx(PasswordGuard.name)

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        const cookies = request.cookies
        const passwordToken = cookies.password_token

        try { return this.jwtService.verify(passwordToken, { secret: `${process.env.JWT_PASSWORDTOKEN_SECRET}` }) }
        catch (error) { this.dadoEx.throw({ status: 401, message: `Password Token expired.`, response }) }
    }
}