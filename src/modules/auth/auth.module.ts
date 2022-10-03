// Auth Module
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AccessTokenStrategy } from './jwt/accessToken.strategy'
import { RefreshTokenStrategy } from './jwt/refreshToken.strategy'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule { }
