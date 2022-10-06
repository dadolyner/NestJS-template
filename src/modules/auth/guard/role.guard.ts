// RoleGuard class that protects routes with proper user permissions
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'
import { HttpExc } from 'src/helpers/exceptions'
import { Repository } from 'typeorm'

export const Roles = (roles: string[]) => SetMetadata('roles', roles)

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<any> {
        const request = context.switchToHttp().getRequest()
        const cookies = request.cookies
        const user = cookies.user
        
        const userExists = await this.usersRepository.findOne({ where: { id: user } })
        if (!userExists) throw HttpExc.unauthorized(RoleGuard.name, `Access denied. Reason: User does not exist.`)
        
        const userRoles = userExists.settings.roles
        const serverRoles = this.reflector.get<string[]>('roles', context.getHandler())
        const hasRole = () => userRoles.some(role => serverRoles.includes(role))
        if (user && hasRole() || userRoles.includes("Admin")) return true
        else throw HttpExc.unauthorized(RoleGuard.name, `Access denied. Reason: User does not have the required permissions.`)
    }
}