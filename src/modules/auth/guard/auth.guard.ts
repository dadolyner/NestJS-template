// Guard classes that protects routes with Access or Refresh Token
import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import DadoEx from 'src/helpers/exceptions'

// Acces Token Guard
@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
    private dadoEx = new DadoEx(AccessGuard.name)

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response

        try { return super.canActivate(context) }
        catch (error) { this.dadoEx.throw({ status: 401, message: `Access Token expired.`, response }) }
    }
}

// Refresh Token Guard
@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
    private dadoEx = new DadoEx(RefreshGuard.name)

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response

        try { return super.canActivate(context) }
        catch (error) { this.dadoEx.throw({ status: 401, message: `Refresh Token expired.`, response }) }
    }
}

// Password reset Token Guard
@Injectable()
export class PasswordGuard extends AuthGuard('jwt-password') {
    private dadoEx = new DadoEx(PasswordGuard.name)

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response

        try { return super.canActivate(context) }
        catch (error) { this.dadoEx.throw({ status: 401, message: `Password Token expired.`, response }) }
    }
}

// Email verification Token Guard
@Injectable()
export class EmailGuard extends AuthGuard('jwt-email') {
    private dadoEx = new DadoEx(EmailGuard.name)

    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response

        try { return super.canActivate(context) }
        catch (error) { this.dadoEx.throw({ status: 401, message: `Email Token expired.`, response }) }
    }
}