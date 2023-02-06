// Guard classes that protects routes with Access or Refresh Token
import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// Acces Token Guard
@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response
        return super.canActivate(context)
    }
}

// Refresh Token Guard
@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response
        return super.canActivate(context)
    }
}

// Password reset Token Guard
@Injectable()
export class PasswordGuard extends AuthGuard('jwt-password') {
    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response
        return super.canActivate(context)
    }
}

// Email verification Token Guard
@Injectable()
export class EmailGuard extends AuthGuard('jwt-email') {
    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        request.response = response
        return super.canActivate(context)
    }
}