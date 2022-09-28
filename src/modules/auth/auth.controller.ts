// Auth Controller
import { Controller, Post } from '@nestjs/common'
import { Body, Res } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto'
import { FastifyReply } from 'fastify'
import { Cookie } from './decorator/cookie.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    // Register new user
    @Post('register')
    async register(@Body() registerDto: AuthRegisterDto): Promise<void> {
        await this.authService.register(registerDto)
    }
    
    // Login existing user, generate tokens and set cookies (user, access_token, refresh_token)
    @Post('login')
    async login(@Body() loginDto: AuthLoginDto, @Res() response: FastifyReply): Promise<void> {
        await this.authService.login(loginDto, response)
    }
    
    // Refresh access token with a valid refresh token
    @Post('refresh')
    async refreshToken(@Cookie('user') user: string, @Cookie('refresh_token') refreshToken: string, @Res() response: FastifyReply): Promise<void> {
        await this.authService.refreshToken(user, refreshToken, response)
    }
    
    // Logout user, remove refresh token and clear cookies
    @Post('logout')
    async logout(@Cookie('user') user: string, @Res() response: FastifyReply): Promise<void> {
        await this.authService.logout(user, response)
    }
}