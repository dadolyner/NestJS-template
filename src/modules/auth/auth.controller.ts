// Auth Controller
import { Controller, Post } from '@nestjs/common'
import { Body, Delete, Param, Patch, Res, SetMetadata, UseGuards } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AuthLoginDto, AuthRegisterDto, AuthRolesDto } from './dto/auth.dto'
import { FastifyReply } from 'fastify'
import { Cookie } from './decorator/cookie.decorator'
import { AuthGuard } from './guard/auth.guard'
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoleGuard, Roles } from './guard/role.guard'

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Register new user
    @ApiResponse({ status: 201, description: 'Create new user' })
    @ApiBody({ type: AuthRegisterDto })
    @Post('register')
    async register(@Body() registerDto: AuthRegisterDto): Promise<void> {
        await this.authService.register(registerDto)
    }

    // Login existing user, generate tokens and set cookies (user, access_token, refresh_token)
    @ApiResponse({ status: 200, description: 'Login existing user' })
    @ApiBody({ type: AuthLoginDto })
    @Post('login')
    async login(@Body() loginDto: AuthLoginDto, @Res() response: FastifyReply): Promise<void> {
        await this.authService.login(loginDto, response)
    }

    // Refresh access token with a valid refresh token
    @ApiResponse({ status: 200, description: 'Refresh users access token' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('refresh')
    async refreshToken(@Cookie('user') user: string, @Cookie('refresh_token') refreshToken: string, @Res({ passthrough: true }) response: FastifyReply): Promise<void> {
        await this.authService.refreshToken(user, refreshToken, response)
    }

    // Logout user, remove refresh token and clear cookies
    @ApiResponse({ status: 200, description: 'Logout user and clear its cookies' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Cookie('user') user: string, @Cookie('refresh_token') refreshToken: string, @Res({ passthrough: true }) response: FastifyReply): Promise<void> {
        await this.authService.logout(user, refreshToken, response)
    }

    // Set users roles - Admin only
    @ApiResponse({ status: 200, description: 'Add roles to user' })
    @ApiBasicAuth()
    @Roles(['Admin'])
    @UseGuards(RoleGuard)
    @Patch('roles/:id')
    async setRoles(@Param('id') user: string, @Body() roles: AuthRolesDto): Promise<void> {
        await this.authService.setRoles(user, roles)
    }

    // Set users roles - Admin only
    @ApiResponse({ status: 200, description: 'Reset roles for user' })
    @ApiBasicAuth()
    @Roles(['Admin'])
    @UseGuards(RoleGuard)
    @Delete('roles/:id')
    async resetRoles(@Param('id') user: string): Promise<void> {
        await this.authService.resetRoles(user)
    }
}
