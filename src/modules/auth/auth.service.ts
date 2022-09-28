// Auth Service
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'
import { Repository } from 'typeorm'
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply } from 'fastify'
import { HttpExc } from 'src/helpers/exceptions'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) { }

    // Register new user
    async register(registerDto: AuthRegisterDto): Promise<void> {
        const { first_name, last_name, email, password } = registerDto

        const userExists = await this.usersRepository.findOne({ where: { email } })
        if (userExists) throw HttpExc.conflict(AuthService.name, 'User with this email already exists.')

        const newUser = new Users()
        newUser.first_name = first_name
        newUser.last_name = last_name
        newUser.email = email
        newUser.salt = await newUser.generateSalt()
        newUser.password = await newUser.hashPassword(password, newUser.salt)
        newUser.created_at = new Date()
        newUser.updated_at = new Date()

        try { await this.usersRepository.save(newUser) }
        catch (error) { throw HttpExc.internalServerError(AuthService.name, `Adding a user failed. Reason: ${error.message}.`) }

        throw HttpExc.created(AuthService.name, `New user ${first_name} ${last_name} <${email}> successfully registered.`)
    }

    // Login existing user, generate tokens and set cookies (user, access_token, refresh_token)
    async login(loginDto: AuthLoginDto, response: FastifyReply): Promise<void> {
        const { email, password } = loginDto

        const userExists = await this.usersRepository.findOne({ where: { email } })
        if (!userExists) throw HttpExc.badRequest(AuthService.name, 'User with this email does not exist.')
        const validatePassword = await userExists.validatePassword(password)
        if (!validatePassword) throw HttpExc.badRequest(AuthService.name, 'User entered invalid credentials.')

        try {
            const accessToken = this.jwtService.sign({ sub: userExists.id, email: userExists.email }, { secret: 'accessToken-secret', expiresIn: '15m' })
            const refreshToken = this.jwtService.sign({ sub: userExists.id, email: userExists.email }, { secret: 'accessToken-secret', expiresIn: '7d' })

            userExists.refreshToken = refreshToken
            userExists.updated_at = new Date()

            await this.usersRepository.save(userExists)

            response.cookie('user', userExists.id, { httpOnly: true })
            response.cookie('access_token', accessToken, { httpOnly: true })
            response.cookie('refresh_token', refreshToken, { httpOnly: true })
        } catch (error) { throw HttpExc.internalServerError(AuthService.name, `Login failed. Reason: ${error.message}.`) }

        throw HttpExc.ok(AuthService.name, `New user ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully logged in.`)
    }

    // Refresh access token with a valid refresh token
    async refreshToken(user: string, refreshToken: string, response: FastifyReply): Promise<void> {
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) throw HttpExc.badRequest(AuthService.name, 'Provided user does not exist.')
        if (userExists.refreshToken !== refreshToken) throw HttpExc.badRequest(AuthService.name, 'Provided refresh token is invalid.')

        try {
            const accessToken = this.jwtService.sign({ sub: userExists.id, email: userExists.email }, { secret: 'accessToken-secret', expiresIn: '15m' })
            response.cookie('access_token', accessToken, { httpOnly: true })
        } catch (error) { throw HttpExc.internalServerError(AuthService.name, `Signing a new access token failed. Reason: ${error.message}.`) }

        throw HttpExc.ok(AuthService.name, `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully updated its access token.`)
    }

    // Logout user, remove refresh token and clear cookies
    async logout(user: string, response: FastifyReply): Promise<void> {
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) throw HttpExc.badRequest(AuthService.name, 'Provided user does not exist.')

        try {
            userExists.refreshToken = null
            userExists.updated_at = new Date()

            await this.usersRepository.save(userExists)

            response.clearCookie('user')
            response.clearCookie('access_token')
            response.clearCookie('refresh_token')
        } catch (error) { throw HttpExc.internalServerError(AuthService.name, `Logout failed. Reason: ${error.message}.`) }

        throw HttpExc.ok(AuthService.name, `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully logged out.`)
    }
}
