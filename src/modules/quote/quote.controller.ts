// Quote Controller
import { Body, Controller, Delete, Get, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QuoteDto } from './dto/quote.dto';
import { DadoExResponse } from 'src/helpers/exceptions';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '../auth/guard/auth.guard';

@ApiTags('Quotes')
@Controller('quote')
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) { }

    // Get quotes
    @ApiResponse({ status: 200, description: 'Retrieve all quotes or one specific quote' })
    @ApiParam({ name: 'id', description: 'Get a specific quote by its id', required: false, type: 'string' })
    @Get()
    async getQuotes(@Query('id') quoteId: string, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.getQuotes(quoteId, response)
    }

    // Create a new quote
    @ApiResponse({ status: 201, description: 'Create a new quote' })
    @ApiBody({ type: QuoteDto })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Post()
    async createQuote(@Body() quoteDto: QuoteDto, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.createQuote(quoteDto, request, response)
    }

    // Update a quote
    @ApiResponse({ status: 200, description: 'Update quote' })
    @ApiParam({ name: 'id', required: true })
    @ApiBody({ type: QuoteDto })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Patch()
    async updateQuote(@Query('id') quoteId: string, @Body() quoteDto: QuoteDto, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.updateQuote(quoteId, quoteDto, request, response)
    }

    // Delete a quote
    @ApiResponse({ status: 200, description: 'Delete quote' })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Delete()
    async deleteQuote(@Query('id') quoteId: string, @Req() request: FastifyRequest, @Res() response: FastifyReply): Promise<DadoExResponse> {
        return this.quoteService.deleteQuote(quoteId, request, response)
    }
}