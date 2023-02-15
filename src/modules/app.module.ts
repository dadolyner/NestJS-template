// Main App Module
import { Module } from '@nestjs/common'
import { TypeOrmConfig } from 'src/config/config.typeorm'
import { AuthModule } from './auth/auth.module'
import { QuoteModule } from './quote/quote.module'

@Module({
    imports: [TypeOrmConfig, AuthModule, QuoteModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
