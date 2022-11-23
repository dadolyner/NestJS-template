// Auth Controller
import { Controller, Post } from '@nestjs/common'
import { Body, Res, UseGuards } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AuthLoginDto, AuthRegisterDto, PasswordDto, PasswordRequestDto } from './dto/auth.dto'
import { FastifyReply } from 'fastify'
import { Cookie } from './decorator/cookie.decorator'
import { PasswordGuard, RefreshGuard } from './guard/auth.guard'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DadoExResponse } from 'src/helpers/exceptions'

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Register new user
    @ApiResponse({ status: 201, description: 'Create new user' })
    @ApiBody({ type: AuthRegisterDto })
    @Post('register')
    async register(@Body() registerDto: AuthRegisterDto, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.register(registerDto, response)
    }

    // Login existing user, generate tokens and set cookies (user, access_token, refresh_token)
    @ApiResponse({ status: 200, description: 'Login existing user' })
    @ApiBody({ type: AuthLoginDto })
    @Post('login')
    async login(@Body() loginDto: AuthLoginDto, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.login(loginDto, response)
    }

    // Refresh access token with a valid refresh token
    @ApiResponse({ status: 200, description: 'Refresh users access token' })
    @UseGuards(RefreshGuard)
    @Post('refresh')
    async refreshToken(@Cookie('user') user: string, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.refreshToken(user, response)
    }

    // Logout user, remove refresh token and clear cookies
    @ApiResponse({ status: 200, description: 'Logout user and clear its cookies' })
    @ApiBearerAuth()
    @UseGuards(RefreshGuard)
    @Post('logout')
    async logout(@Cookie('user') user: string, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.logout(user, response)
    }

    // Send a password reset email to the user
    @ApiResponse({ status: 200, description: 'Send password reset email to user' })
    @ApiBody({ type: PasswordRequestDto })
    @Post('request-password-reset')
    async requestPasswordReset(@Body() email: PasswordRequestDto, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.requestPasswordReset(email, response)
    }

    // Reset users password
    @ApiResponse({ status: 200, description: 'Reset users password' })
    @ApiBody({ type: PasswordDto })
    @ApiBearerAuth()
    @UseGuards(PasswordGuard)
    @Post('reset-password')
    async resetPassword(@Cookie('user') user: string, @Body() password: PasswordDto, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.resetPassword(user, password, response)
    }
}
