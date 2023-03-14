// Custom Fastify Http Exceptions
import { Logger } from "@nestjs/common"
import { FastifyReply } from "fastify"

// Options
export type DadoExOptions = {
    response: FastifyReply,
    status: 200 | 201 | 202 | 204 | 304 | 400 | 401 | 402 | 403 | 404 | 408 | 409 | 500 | 501 | 502 | 503 | 504,
    time?: string,
    message: string,
    data?: Object | Array<Object> | null | undefined
}

// Response type
export type DadoExResponse = {
    status: { code: number, message: string, time?: string },
    message: string,
    data?: Object | Array<Object> | null | undefined
}

// Http
const HttpErrorCodes = [
    { code: 200, message: 'OK' },
    { code: 201, message: 'Created' },
    { code: 202, message: 'Accepted' },
    { code: 204, message: 'No Content' },
    { code: 304, message: 'Not Modified' },
    { code: 400, message: 'Bad Request' },
    { code: 401, message: 'Unauthorized' },
    { code: 402, message: 'Payment Required' },
    { code: 403, message: 'Forbidden' },
    { code: 404, message: 'Not Found' },
    { code: 408, message: 'Request Timeout' },
    { code: 409, message: 'Conflict' },
    { code: 500, message: 'Internal Server Error' },
    { code: 501, message: 'Not Implemented' },
    { code: 502, message: 'Bad Gateway' },
    { code: 503, message: 'Service Unavailable' },
    { code: 504, message: 'Gateway Timeout' },
]

class DadoEx {
    constructor(private location: string) {
        this.location = location
    }

    throw(options: DadoExOptions) {
        const { response, status, time, message, data } = options
        const logger = new Logger(this.location)
        status >= 300 ? logger.error(message) : logger.verbose(message)
        return response.status(status).send(
            {
                status: {
                    code: status,
                    message: HttpErrorCodes.find((error) => error.code === status).message,
                    time: time,
                },
                message: message,
                data: data,
            }
        )
    }
}

export default DadoEx