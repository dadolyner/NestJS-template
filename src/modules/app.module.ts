// Main App Module
import { AuthModule } from './auth/auth.module'
import { Module } from '@nestjs/common'
import { TypeOrmConfig } from 'src/config/config.typeorm'

@Module({
    imports: [
        TypeOrmConfig,
        AuthModule
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule { }
