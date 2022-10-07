// Auth Controller
import { Controller, Post } from '@nestjs/common'
import { Body, Res, UseGuards } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto'
import { FastifyReply } from 'fastify'
import { Cookie } from './decorator/cookie.decorator'
import { RefreshGuard } from './guard/auth.guard'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HttpExcResponse } from 'src/helpers/exceptions'

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Register new user
    @ApiResponse({ status: 201, description: 'Create new user' })
    @ApiBody({ type: AuthRegisterDto })
    @Post('register')
    async register(@Body() registerDto: AuthRegisterDto): Promise<HttpExcResponse> {
        return await this.authService.register(registerDto)
    }

    // Login existing user, generate tokens and set cookies (user, access_token, refresh_token)
    @ApiResponse({ status: 200, description: 'Login existing user' })
    @ApiBody({ type: AuthLoginDto })
    @Post('login')
    async login(@Body() loginDto: AuthLoginDto, @Res() response: FastifyReply): Promise<HttpExcResponse> {
        return await this.authService.login(loginDto, response)
    }

    // Refresh access token with a valid refresh token
    @ApiResponse({ status: 200, description: 'Refresh users access token' })
    @UseGuards(RefreshGuard)
    @Post('refresh')
    async refreshToken(@Cookie('user') user: string, @Res() response: FastifyReply): Promise<HttpExcResponse> {
        return await this.authService.refreshToken(user, response)
    }

    // Logout user, remove refresh token and clear cookies
    @ApiResponse({ status: 200, description: 'Logout user and clear its cookies' })
    @ApiBearerAuth()
    @UseGuards(RefreshGuard)
    @Post('logout')
    async logout(@Cookie('user') user: string, @Res() response: FastifyReply): Promise<HttpExcResponse> {
        return await this.authService.logout(user, response)
    }
}
