// Auth Service
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'
import { Repository } from 'typeorm'
import { AuthLoginDto, AuthRegisterDto, AuthRolesDto, PasswordDto, PasswordRequestDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import DadoEx, { DadoExResponse } from 'src/helpers/exceptions'
import transporter from 'src/mail/email.config'
import RequestPasswordReset, { ResetPasswordData } from 'src/mail/templates/RequestPasswordReset'
import PasswordResetConf from 'src/mail/templates/ResetPasswordConfirmation'
import VerifyEmail from 'src/mail/templates/VerifyEmail'
import uploadImageToS3 from 'src/helpers/awsUpload'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) { }

    private dadoEx = new DadoEx(AuthService.name)

    // Register new user
    async register(registerDto: AuthRegisterDto, response: FastifyReply): Promise<DadoExResponse> {
        const { first_name, last_name, email, password, avatar } = registerDto

        const userExists = await this.usersRepository.findOne({ where: { email } })
        if (userExists) return this.dadoEx.throw({ status: 409, message: 'User with this email already exists.', response })
        const awsResponse = await uploadImageToS3(avatar)
        if(!awsResponse) return this.dadoEx.throw({ status: 500, message: `Uploading image to S3 failed.`, response })
        const avatarUrl = awsResponse.Location

        const newUser = new Users()
        newUser.first_name = first_name
        newUser.last_name = last_name
        newUser.email = email
        newUser.salt = await newUser.generateSalt()
        newUser.password = await newUser.hashPassword(password, newUser.salt)
        newUser.settings = { roles: ['User'] }
        newUser.verified = false
        newUser.avatar = avatarUrl
        newUser.created_at = new Date()
        newUser.updated_at = new Date()

        let emailToken: string

        try {
            await this.usersRepository.save(newUser)

            emailToken = await this.jwtService.signAsync({ sub: newUser.id, email: newUser.email }, { secret: `${process.env.JWT_EMAILTOKEN_SECRET}`, expiresIn: '60m' })
            const emailTokenExp = new Date()
            emailTokenExp.setMinutes(emailTokenExp.getMinutes() + 60)
            response.setCookie('email_token', emailToken, { path: '/', httpOnly: false, expires: emailTokenExp })

            const mailData: ResetPasswordData = {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                link: `${process.env.FRONTEND_IP}:${process.env.FRONTEND_PORT}/verify-email`,
            }

            await transporter.sendMail({
                from: '"Company Support" <support@company.com>',
                to: newUser.email,
                subject: 'Verify your email',
                html: VerifyEmail(mailData),
            })
        }
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Adding a user failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 201, message: `Registration successfull.`, response, data: { emailToken } })
    }

    // Verify users email
    async verifyEmail(request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const user = request["user"].sub
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'User with this email does not exist.', response })

        userExists.verified = true
        userExists.updated_at = new Date()

        try {
            await this.usersRepository.save(userExists)
            response.setCookie('email_token', '', { expires: new Date(0) }).clearCookie('email_token')
        }
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Verifying user email failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `Email verified successfully.`, response })
    }

    // Login existing user, generate tokens and set cookies (user, access_token, refresh_token)
    async login(loginDto: AuthLoginDto, response: FastifyReply): Promise<DadoExResponse> {
        const { email, password } = loginDto

        const userExists = await this.usersRepository.findOne({ where: { email } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'User with this email does not exist.', response })
        const validatePassword = await userExists.validatePassword(password)
        if (!validatePassword) return this.dadoEx.throw({ status: 400, message: 'User entered invalid credentials.', response })
        const isUserVerified = userExists.verified
        if (isUserVerified === false) return this.dadoEx.throw({ status: 401, message: 'User email is not verified.', response })

        let accessToken: string, refreshToken: string

        try {
            accessToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_ACCESSTOKEN_SECRET}`, expiresIn: '5m' })
            refreshToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_REFRESHTOKEN_SECRET}`, expiresIn: '7d' })

            const accessTokenExp = new Date()
            accessTokenExp.setMinutes(accessTokenExp.getMinutes() + 15)
            const refreshTokenExp = new Date()
            refreshTokenExp.setDate(refreshTokenExp.getDate() + 7)

            response.setCookie('access_token', accessToken, { path: '/', httpOnly: false, expires: accessTokenExp })
            response.setCookie('refresh_token', refreshToken, { path: '/', httpOnly: false, expires: refreshTokenExp })
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Login failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `Login successfull.`, response, data: { accessToken, refreshToken } })
    }

    // Refresh access token with a valid refresh token
    async refreshToken(request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const user = request["user"].sub
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        let accessToken: string

        try { accessToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_ACCESSTOKEN_SECRET}`, expiresIn: '5m' }) } 
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Signing a new access token failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `Access token refreshed successfully.`, response, data: { accessToken } })
    }

    // Logout user, destroy refresh token and clear cookies
    async logout(request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const user = request["user"].sub
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        try {
            response.setCookie('access_token', '', { expires: new Date(0) }).clearCookie('access_token')
            response.setCookie('refresh_token', '', { expires: new Date(0) }).clearCookie('refresh_token')
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Logout failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `Logout successfull.`, response })
    }

    // Change password request
    async requestPasswordChange(emailDto: PasswordRequestDto, response: FastifyReply): Promise<DadoExResponse> {
        const { email } = emailDto
        const userExists = await this.usersRepository.findOne({ where: { email: email } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        let passwordToken: string

        try {
            passwordToken = await this.jwtService.signAsync({ sub: userExists.id, email: userExists.email }, { secret: `${process.env.JWT_PASSWORDTOKEN_SECRET}`, expiresIn: '60m' })

            const passwordTokenExp = new Date()
            passwordTokenExp.setMinutes(passwordTokenExp.getMinutes() + 60)
            response.setCookie('password_token', passwordToken, { path: '/', httpOnly: false, expires: passwordTokenExp })

            const mailData: ResetPasswordData = {
                first_name: userExists.first_name,
                last_name: userExists.last_name,
                link: `${process.env.FRONTEND_IP}:${process.env.FRONTEND_PORT}/change-password`,
            }

            await transporter.sendMail({
                from: '"Company Support" <support@company.com>',
                to: userExists.email,
                subject: 'Reset password request',
                html: RequestPasswordReset(mailData),
            })
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Password change request failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `Password change request sent successfully.`, response, data: { passwordToken } })
    }

    // Change users password
    async changePassword(passwordDto: PasswordDto, request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const { password } = passwordDto
        const user = request["user"].sub
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        try {
            userExists.password = password
            await this.usersRepository.save(userExists)
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
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Password change failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `Password changed successfully.`, response })
    }

    // Set users roles
    async setRoles(rolesDto: AuthRolesDto, request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const { userId, roles } = rolesDto
        const user = request["user"].sub
        const adminExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!adminExists) return this.dadoEx.throw({ status: 404, message: 'Provided admin does not exist.', response })
        const userExists = await this.usersRepository.findOne({ where: { id: userId } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exist.', response })

        try {
            userExists.settings.roles = roles
            await this.usersRepository.save(userExists)
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Setting users roles failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `Roles set successfully.`, response })
    }
}