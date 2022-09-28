// RefreshToken Guard that require refreshtoken in header as bearer token
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}