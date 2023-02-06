// Main App Module
import { Module } from '@nestjs/common'
import { TypeOrmConfig } from 'src/config/config.typeorm'
import ActiveModules from '../config/config.modules'
import * as modules from 'src/modules'

@Module({
    imports: [
        TypeOrmConfig, 
        ...ActiveModules.map((module) => modules[module])
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
