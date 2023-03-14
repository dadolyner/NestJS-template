// TypeORM Configuration File
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import * as path from "path"

// Env Config
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, `../../env/.env.${process.env.ENVIROMENT}`) })

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST.toString(),
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER.toString(),
            password: process.env.DATABASE_PASSWORD.toString(),
            database: process.env.DATABASE_NAME.toString(),
            entities: [path.resolve(__dirname, '../entities/*.entity{.ts,.js}')],
            synchronize: true,
            autoLoadEntities: true,
            // logging: true,
            // logger: 'advanced-console',
        }),
    ],
    controllers: [],
    providers: [],
})
export class TypeOrmConfig { }