// Quote Service
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Quotes } from 'src/entities/quotes.entity'
import { Users } from 'src/entities/users.entity'
import { FastifyReply, FastifyRequest } from 'fastify'
import DadoEx, { DadoExResponse } from 'src/helpers/exceptions'
import { QuoteDto } from './dto/quote.dto'
import { QuoteExportDto } from './dto/exports.dto'

@Injectable()
export class QuoteService {
    constructor(
        @InjectRepository(Quotes) private readonly quoteRepository: Repository<Quotes>,
        @InjectRepository(Users) private readonly userRepository: Repository<Users>
    ) { }

    private dadoEx = new DadoEx(QuoteService.name)

    // Get quotes
    async getQuotes(quoteId: string, limit: number, response: FastifyReply): Promise<DadoExResponse> {
        let remappedQuotes: QuoteExportDto[] = []
        try {
            const query = this.quoteRepository.createQueryBuilder('quotes')
                .select(['quotes.id', 'quotes.quote', 'quotes.created_at', 'quotes.updated_at', 'users.id', 'users.first_name', 'users.last_name', 'users.email'])
                .leftJoin('quotes.user', 'users')
            if (quoteId) query.where('quotes.id = :id', { id: quoteId }).getMany()
            if (limit) query.orderBy('quotes.created_at', 'DESC').limit(limit)
            const allQuotes = await query.orderBy('quotes.created_at', 'DESC').getMany()

            if (!allQuotes || allQuotes.length === 0) return this.dadoEx.throw({ status: 204, message: `No quotes found.`, response })
            remappedQuotes = allQuotes.map(quote => { return new QuoteExportDto(quote) })
        } catch (error) { return this.dadoEx.throw({ status: 500, message: `Retrieving all quotes failed. Reason: ${error.message}.`, response }) }

        if (quoteId) return this.dadoEx.throw({ status: 200, message: `Specific quote retrieved successfully.`, response, data: remappedQuotes })
        else if (limit) return this.dadoEx.throw({ status: 200, message: `${limit} quotes retrieved successfully.`, response, data: remappedQuotes })
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
        catch (error) { return this.dadoEx.throw({ status: 500, message: `Creating a quote failed. Reason: ${error.message}.`, response }) }

        return this.dadoEx.throw({ status: 201, message: `New quote created successfully.`, response })
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

        return this.dadoEx.throw({ status: 200, message: `Quote updated successfully.`, response })
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

        return this.dadoEx.throw({ status: 200, message: `Quote deleted successfully.`, response })
    }
}