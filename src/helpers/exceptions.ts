// Custom Exceptions class
import { HttpException, Logger } from "@nestjs/common"

export class HttpExc extends HttpException {
    constructor(message: string, status: number) {
        super(message, status)
    }

    static ok(location: string, message: string) {
        const logger = new Logger(location)
        logger.verbose(message)
        return new HttpExc(message, 200)
    }

    static created(location: string, message: string) {
        const logger = new Logger(location)
        logger.verbose(message)
        return new HttpExc(message, 201)
    }

    static accepted(location: string, message: string) {
        const logger = new Logger(location)
        logger.verbose(message)
        return new HttpExc(message, 202)
    }

    static noContent(location: string, message: string) {
        const logger = new Logger(location)
        logger.verbose(message)
        return new HttpExc(message, 204)
    }

    static notModified(location: string, message: string) {
        const logger = new Logger(location)
        logger.verbose(message)
        return new HttpExc(message, 304)
    }

    static badRequest(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 400)
    }

    static unauthorized(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 401)
    }

    static payment(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 402)
    }

    static forbiden(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 403)
    }

    static notFound(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 404)
    }

    static timeout(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 408)
    }

    static conflict(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 409)
    }

    static internalServerError(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 500)
    }

    static badGateway(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 502)
    }

    static gatewayTimeout(location: string, message: string) {
        const logger = new Logger(location)
        logger.error(message)
        return new HttpExc(message, 504)
    }
}