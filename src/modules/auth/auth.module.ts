// Auth Module
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenStrategy } from './jwt/accessToken.strategy'
import { RefreshTokenStrategy } from './jwt/refreshToken.strategy'
import { PasswordTokenStrategy } from './jwt/passwordToken.strategy'
import { EmailTokenStrategy } from './jwt/emailToken.strategy'

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forFeature([Users]),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, PasswordTokenStrategy, EmailTokenStrategy],
    exports: [JwtModule],
})
export class AuthModule { }
