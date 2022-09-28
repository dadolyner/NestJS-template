// AccesToken Guard that require accesstoken in header as bearer token
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}