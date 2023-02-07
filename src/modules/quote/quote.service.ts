// Quote Service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quotes } from 'src/entities/quotes.entity';
import { Repository } from 'typeorm';
import { QuoteDto } from './dto/quote.dto';
import DadoEx, { DadoExResponse } from 'src/helpers/exceptions';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class QuoteService {
    constructor(
        @InjectRepository(Quotes) private readonly quoteRepository: Repository<Quotes>,
        @InjectRepository(Users) private readonly userRepository: Repository<Users>
    ) { }

    private dadoEx = new DadoEx(QuoteService.name)

    // Get quotes
    async getQuotes(quoteId: string, response: FastifyReply): Promise<DadoExResponse> {
        let remappedQuotes: any = []
        try {
            const query = await this.quoteRepository.createQueryBuilder('quotes')
            .select([ 'quotes.id', 'quotes.quote', 'users.id', 'users.first_name', 'users.last_name', 'users.email' ])
            .leftJoin('quotes.user', 'users')
            if(quoteId) query.where('quotes.id = :id', { id: quoteId }).getMany()
            const allQuotes = await query.getMany()
            
            if (!allQuotes || allQuotes.length === 0) return this.dadoEx.throw({ status: 204, message: `No quotes found.`, response })
            remappedQuotes = allQuotes.map(quote => {
                return {
                    id: quote.id,
                    quote: quote.quote,
                    user: {
                        id: quote.user.id,
                        first_name: quote.user.first_name,
                        last_name: quote.user.last_name,
                        email: quote.user.email
                    }
                }
            })
        } catch(error) { return this.dadoEx.throw({ status: 500, message: `Retrieving all quotes failed. Reason: ${error.message}.`, response }) }

        if(quoteId) return this.dadoEx.throw({ status: 200, message: `Specific quote retrieved successfully.`, response, data: remappedQuotes })
        else return this.dadoEx.throw({ status: 200, message: `All quotes retrieved successfully.`, response, data: remappedQuotes })
    }

    // Create a new quote
    async createQuote(quoteDto: QuoteDto, request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const { quote } = quoteDto
        const user = request["user"].sub

        const userExists = await this.userRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exists.', response })

        const newQuote = new Quotes()
        newQuote.quote = quote
        newQuote.userId = userExists.id
        newQuote.created_at = new Date()
        newQuote.updated_at = new Date()

        try { await this.quoteRepository.save(newQuote) }
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Adding a quote failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 201, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully added a new quote.`, response })
    }

    // Update a quote
    async updateQuote(quoteId: string, quoteDto: QuoteDto, request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const { quote } = quoteDto
        const user = request["user"].sub
        
        const userExists = await this.userRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exists.', response })
        const quoteExists = await this.quoteRepository.findOne({ where: { id: quoteId } })
        if (!quoteExists) return this.dadoEx.throw({ status: 404, message: 'Provided quote does not exists.', response })
        const quoteBelongs = await this.quoteRepository.findOne({ where: { id: quoteExists.id, userId: userExists.id } })
        if (!quoteBelongs) return this.dadoEx.throw({ status: 404, message: 'Provided quote does not belong to provided user.', response })

        quoteExists.quote = quote
        quoteExists.updated_at = new Date()
        
        try { await this.quoteRepository.save(quoteExists) }
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Updating a quote failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully updated a quote.`, response })
    }

    // Delete a quote
    async deleteQuote(quoteId: string, request: FastifyRequest, response: FastifyReply): Promise<DadoExResponse> {
        const user = request["user"].sub

        const userExists = await this.userRepository.findOne({ where: { id: user } })
        if (!userExists) return this.dadoEx.throw({ status: 404, message: 'Provided user does not exists.', response })
        const quoteExists = await this.quoteRepository.findOne({ where: { id: quoteId } })
        if (!quoteExists) return this.dadoEx.throw({ status: 404, message: 'Provided quote does not exists.', response })
        const quoteBelongs = await this.quoteRepository.findOne({ where: { id: quoteExists.id, userId: userExists.id } })
        if (!quoteBelongs) return this.dadoEx.throw({ status: 404, message: 'Provided quote does not belong to provided user.', response })

        try { await this.quoteRepository.delete(quoteExists.id) }
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Deleting a quote failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 200, message: `User ${userExists.first_name} ${userExists.last_name} <${userExists.email}> successfully deleted a quote.`, response })
    }
}
