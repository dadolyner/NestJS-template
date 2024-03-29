// Main NestJS File
import { AppModule } from './modules/app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

// Env Config
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, `../env/.env.${process.env.ENVIROMENT}`) })

// Application
const Application = async () => {
    const logger = new Logger('Application')

    try {
        logger.log(`Starting the application in ${process.env.ENVIROMENT} mode ...`)

        const Application = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
        Application.enableCors({ origin: true, credentials: true })
        await Application.register(fastifyCookie, { secret: process.env.COOKIE_SECRET })
        Application.useGlobalPipes(new ValidationPipe())
        
        const swaggerConfig = new DocumentBuilder().setTitle('Application').setDescription('API Documentation for Application.').setVersion('1.0').build()
        const swaggerDocument = SwaggerModule.createDocument(Application, swaggerConfig)
        SwaggerModule.setup('documentation', Application, swaggerDocument)
        
        await Application.listen(process.env.BACKEND_PORT, '0.0.0.0')
        
        logger.log(`Application is running on ${process.env.BACKEND_IP}:${process.env.BACKEND_PORT} in ${process.env.ENVIROMENT} mode.`)
        logger.log(`Documentation is available on ${process.env.BACKEND_IP}:${process.env.BACKEND_PORT}/documentation.`)
    } catch (error) { logger.error(error) }
}
Application()