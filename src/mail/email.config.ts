// Config setup for nodemailer
import * as nodemailer from 'nodemailer'

// Env Config
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, `../../env/.env.${process.env.ENVIROMENT}`) })

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.STMP_USER,
        pass: process.env.STMP_PASS,
    },
})

export default transporter