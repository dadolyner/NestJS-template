// Quote DTO
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class QuoteDto {
    @ApiProperty({ type: String, description: 'Users quote', example: 'You are what you eat.' })
    @IsString({ message: 'Quote must be a string' })
    @IsNotEmpty({ message: 'Quote is required' })
    quote: string
}