import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const cookies = request.cookies
        const accessToken = cookies.access_token
        
        try { return this.jwtService.verify(accessToken, { secret: `${process.env.JWT_ACCESSTOKEN_SECRET}` }) } 
        catch (error) { return false } 
    }
}