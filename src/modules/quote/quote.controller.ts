// Quote Controller
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { QuoteService } from './quote.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { QuoteDto } from './dto/quote.dto'
import { AccessGuard } from '../auth/guard/auth.guard'
import { DadoExResponse } from 'src/helpers/exceptions'

@ApiTags('Quotes')
@Controller('quote')
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) { }

    // Get quotes
    @ApiResponse({ status: 200, description: 'Retrieve all quotes or one specific quote' })
    @ApiQuery({ name: 'id', description: 'Get a specific quote by its id', required: false, type: 'string' })
    @ApiQuery({ name: 'limit', description: 'Get a specified ammount of quotes', required: false, type: 'number' })
    @Get()
    async getQuotes(@Query('id') quoteId: string, @Query('limit') limit: number, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.getQuotes(quoteId, limit, response)
    }

    // Create a new quote
    @ApiResponse({ status: 201, description: 'Create a new quote' })
    @ApiBody({ type: QuoteDto })
    @ApiBearerAuth('Access JWT Token')
    @UseGuards(AccessGuard)
    @Post()
    async createQuote(@Body() quoteDto: QuoteDto, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.createQuote(quoteDto, request, response)
    }

    // Update a quote
    @ApiResponse({ status: 200, description: 'Update quote' })
    @ApiParam({ name: 'id', description: 'Update users defined quote', required: true, type: 'string' })
    @ApiBody({ type: QuoteDto })
    @ApiBearerAuth('Access JWT Token')
    @UseGuards(AccessGuard)
    @Patch(':id')
    async updateQuote(@Param('id') quoteId: string, @Body() quoteDto: QuoteDto, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.updateQuote(quoteId, quoteDto, request, response)
    }

    // Delete a quote
    @ApiResponse({ status: 200, description: 'Delete quote' })
    @ApiParam({ name: 'id', description: 'Delete users defined quote', required: true, type: 'string' })
    @ApiBearerAuth('Access JWT Token')
    @UseGuards(AccessGuard)
    @Delete(':id')
    async deleteQuote(@Param('id') quoteId: string, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.deleteQuote(quoteId, request, response)
    }
}