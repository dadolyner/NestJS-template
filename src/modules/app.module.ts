import { Module } from '@nestjs/common'
import { TypeOrmConfig } from 'src/config/config.typeorm'

@Module({
    imports: [TypeOrmConfig],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule { }
