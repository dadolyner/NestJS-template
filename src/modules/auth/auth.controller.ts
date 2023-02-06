// Auth Controller
import { Controller, Post } from '@nestjs/common'
import { Body, Req, Res, UseGuards } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AuthLoginDto, AuthRegisterDto, AuthRolesDto, PasswordDto, PasswordRequestDto } from './dto/auth.dto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PasswordGuard, RefreshGuard, EmailGuard, AccessGuard } from './guard/auth.guard'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DadoExResponse } from 'src/helpers/exceptions'
import { RoleGuard, Roles } from './guard/role.guard'

@ApiTags('Authentication')
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

    // Verify users email
    @ApiResponse({ status: 200, description: 'Verify users email' })
    @ApiBearerAuth('Email JWT Token')
    @UseGuards(EmailGuard)
    @Post('verify-email')
    async verifyEmail(@Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.verifyEmail(request, response)
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
    @ApiBearerAuth('Refresh JWT Token')
    @UseGuards(RefreshGuard)
    @Post('refresh')
    async refreshToken(@Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.refreshToken(request, response)
    }

    // Logout user, destroy refresh token and clear cookies
    @ApiResponse({ status: 200, description: 'Logout user and clear its cookies' })
    @ApiBearerAuth('Refresh JWT Token')
    @UseGuards(RefreshGuard)
    @Post('logout')
    async logout(@Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.logout(request, response)
    }

    // Reset password request
    @ApiResponse({ status: 200, description: 'Send password reset email to user' })
    @ApiBody({ type: PasswordRequestDto })
    @Post('request-password-reset')
    async requestPasswordReset(@Body() email: PasswordRequestDto, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.requestPasswordReset(email, response)
    }

    // Reset users password
    @ApiResponse({ status: 200, description: 'Reset users password' })
    @ApiBody({ type: PasswordDto })
    @ApiBearerAuth('Password JWT Token')
    @UseGuards(PasswordGuard)
    @Post('reset-password')
    async resetPassword(@Body() password: PasswordDto, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.resetPassword(password, request, response)
    }

    // Set users roles
    @ApiResponse({ status: 200, description: 'Set users roles' })
    @ApiBody({ type: AuthRolesDto })
    @ApiBearerAuth('Access JWT Token and Admin Role')
    @UseGuards(AccessGuard, RoleGuard)
    @Roles(['Admin'])
    @Post('roles')
    async setRoles(@Body() rolesDto: AuthRolesDto, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return await this.authService.setRoles(rolesDto, request, response)
    }
}
