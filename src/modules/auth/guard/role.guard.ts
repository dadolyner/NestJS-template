// RoleGuard class that protects routes with proper user permissions
import { SetMetadata, Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from 'src/entities/users.entity'
import { Reflector } from '@nestjs/core'
import DadoEx from 'src/helpers/exceptions'

// Required roles decorator
export const Roles = (roles: string[]) => SetMetadata('roles', roles)

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        private readonly reflector: Reflector
    ) { }

    private dadoEx = new DadoEx(RoleGuard.name)

    async canActivate(context: ExecutionContext): Promise<any> {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        const cookies = request.cookies
        const user = cookies.user

        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 401, message: `Access denied. Reason: User does not exist.`, response })

        const userRoles = userExists.roles
        const serverRoles = this.reflector.get<string[]>('roles', context.getHandler())
        const hasRole = () => { return userRoles.some(role => serverRoles.includes(role)) }

        if (userRoles.includes("Admin")) return true
        else if (hasRole()) return true
        else return this.dadoEx.throw({ status: 401, message: `Access denied. Reason: User does not have the required permissions.`, response })
    }
}