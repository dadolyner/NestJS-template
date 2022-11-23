// Auth Service
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'
import { Repository } from 'typeorm'
import { AuthLoginDto, AuthRegisterDto, PasswordDto, PasswordRequestDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply } from 'fastify'
import DadoEx, { DadoExResponse } from 'src/helpers/exceptions'
import transporter from 'src/mail/email.config'
import RequestPasswordReset, { ResetPasswordData } from 'src/mail/templates/RequestPasswordReset'
import PasswordResetConf from 'src/mail/templates/ResetPasswordConfirmation'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) { }

    private dadoEx = new DadoEx(AuthService.name)

    // Register new user
    async register(registerDto: AuthRegisterDto, response: FastifyReply): Promise<DadoExResponse> {
        const { first_name, last_name, email, password } = registerDto

        const userExists = await this.usersRepository.findOne({ where: { email } })
        if (userExists) return this.dadoEx.throw({ status: 409, message: 'User with this email already exists.', response })

        const newUser = new Users()
        newUser.first_name = first_name
        newUser.last_name = last_name
        newUser.email = email
        newUser.salt = await newUser.generateSalt()
        newUser.password = await newUser.hashPassword(password, newUser.salt)
        newUser.settings = { roles: ['User'] }
        newUser.created_at = new Date()
        newUser.updated_at = new Date()

        try { await this.usersRepository.save(newUser) }
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Adding a user failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 201, message: `New user ${first_name} ${last_name} <${email}> successfully registered.`, response })
    }

    // Login existing user, generate tokens and set cookies (user, access_token, refresh_token)
    async login(loginDto: AuthLoginDto, response: FastifyReply): Promise<DadoExResponse> {
        const { email, password } = loginDto

        const userExists = await this.usersRepository.findOne({ where: { email } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'User with this email does not exist.', response })
        const validatePassword = await userExists.validatePassword(password)
        if (!validatePassword) return this.dadoEx.throw({ status: 400, message: 'User entered invalid credentials.', response })

        try {
            const accessToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_ACCESSTOKEN_SECRET}`, expiresIn: '15m' })
            const refreshToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_REFRESHTOKEN_SECRET}`, expiresIn: '7d' })

            const accessTokenExp = new Date()
            accessTokenExp.setMinutes(accessTokenExp.getMinutes() + 15)
            const cookiesExp = new Date()
            cookiesExp.setDate(cookiesExp.getDate() + 7)

            response.cookie('user', userExists.id, { httpOnly: true, expires: cookiesExp })
            response.cookie('access_token', accessToken, { httpOnly: true, expires: accessTokenExp })
            response.cookie('refresh_token', refreshToken, { httpOnly: true, expires: cookiesExp })
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Login failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully logged in.`, response })
    }

    // Refresh access token with a valid refresh token
    async refreshToken(user: string, response: FastifyReply): Promise<DadoExResponse> {
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        try {
            const accessTokenExp = new Date()
            accessTokenExp.setMinutes(accessTokenExp.getMinutes() + 15)

            const accessToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_ACCESSTOKEN_SECRET}`, expiresIn: '15m' })
            response.cookie('access_token', accessToken, { httpOnly: true, expires: accessTokenExp })
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Signing a new access token failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully updated its access token.`, response })
    }

    // Logout user, remove refresh token and clear cookies
    async logout(user: string, response: FastifyReply): Promise<DadoExResponse> {
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        try {
            response.setCookie('user', '', { expires: new Date(0) }).clearCookie('user')
            response.setCookie('access_token', '', { expires: new Date(0) }).clearCookie('access_token')
            response.setCookie('refresh_token', '', { expires: new Date(0) }).clearCookie('refresh_token')
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Logout failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully logged out.`, response })
    }

    // Reset password request
    async requestPasswordReset(emailDto: PasswordRequestDto, response: FastifyReply): Promise<DadoExResponse> {
        const userExists = await this.usersRepository.findOne({ where: { email: emailDto.email } })
        if (!userExists) this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        try {
            const passwordToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_PASSWORDTOKEN_SECRET}`, expiresIn: '60m' })

            const passwordTokenExp = new Date()
            passwordTokenExp.setMinutes(passwordTokenExp.getMinutes() + 60)

            response.cookie('user', userExists.id, { httpOnly: true, expires: passwordTokenExp })
            response.cookie('password_token', passwordToken, { httpOnly: true, expires: passwordTokenExp })

            const mailData: ResetPasswordData = {
                first_name: userExists.first_name,
                last_name: userExists.last_name,
                reset_link: `${process.env.FRONTEND_IP}:${process.env.FRONTEND_PORT}/change-password`,
            }

            await transporter.sendMail({
                from: '"Company Support" <support@company.com>',
                to: userExists.email,
                subject: 'Reset password request',
                html: RequestPasswordReset(mailData),
            })
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Password reset request failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully sent password reset request.`, response })
    }

    // Reset password
    async resetPassword(user: string, passwordDto: PasswordDto, response: FastifyReply): Promise<DadoExResponse> {
        const { password } = passwordDto
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        try {
            userExists.password = password
            await this.usersRepository.save(userExists)

            response.setCookie('user', '', { expires: new Date(0) }).clearCookie('user')
            response.setCookie('password_token', '', { expires: new Date(0) }).clearCookie('password_token')

            const mailData: ResetPasswordData = {
                first_name: userExists.first_name,
                last_name: userExists.last_name,
            }

            await transporter.sendMail({
                from: '"Company Support" <support@company.com>',
                to: userExists.email,
                subject: 'Password changed',
                html: PasswordResetConf(mailData),
            })
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Password reset failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully reset password.`, response })
    }
}