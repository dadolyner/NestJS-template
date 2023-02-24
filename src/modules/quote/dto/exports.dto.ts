// Export DTO for Quote
import { Quotes } from "src/entities/quotes.entity"

export class QuoteExportDto {
    id: string
    quote: string
    user: {
        id: string
        first_name: string
        last_name: string
        email: string
        avatar: string
    }

    constructor(quote: Quotes) {
        this.id = quote.id
        this.quote = quote.quote
        this.user = {
            id: quote.user.id,
            first_name: quote.user.first_name,
            last_name: quote.user.last_name,
            email: quote.user.email,
            avatar: quote.user.avatar
        }
    }
}