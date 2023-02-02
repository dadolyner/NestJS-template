// Quote Module
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { Module } from '@nestjs/common';
import { Quotes } from 'src/entities/quotes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({    
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Quotes]), 
        TypeOrmModule.forFeature([Users])
    ],
    controllers: [QuoteController],
    providers: [QuoteService],
})
export class QuoteModule { }
