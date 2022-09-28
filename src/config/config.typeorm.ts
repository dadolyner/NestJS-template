// TypeORM Configuration File
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import * as path from "path"

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: path.resolve(__dirname, `../env/.env.${process.env.ENVIROMENT}`) }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: +configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [ path.resolve(__dirname, '../entities/*.entity{.ts,.js}') ],
                synchronize: true,
                // logging: true,
                // logger: 'advanced-console',
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [],
})
export class TypeOrmConfig { }