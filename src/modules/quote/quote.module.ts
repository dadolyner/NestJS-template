// Quote Module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotes } from 'src/entities/quotes.entity';
import { Users } from 'src/entities/users.entity';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Quotes]),
        TypeOrmModule.forFeature([Users])
    ],
    controllers: [QuoteController],
    providers: [QuoteService],
})
export class QuoteModule { }