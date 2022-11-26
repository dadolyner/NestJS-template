// Email verification email
import { ResetPasswordData } from './RequestPasswordReset'

const BodyStyle = `margin: 0; padding: 0; font-family: sans-serif; background-color: #fff;`
const ContanerStyle = `width: fit-content; margin: 0 auto; border: 1px solid black; border-radius: 5px; padding: 10px; background-color: #fff;`
const TableStyle = `margin: auto; background-color: #fff;`
const HeaderStyle = `margin: 0; font-size: 24px; font-weight: 600; color: #4e5a65;`
const ParagraphStyle = `margin: 0; font-size: 16px; font-weight: 400; color: #8594a7;`
const ResetButtonStyle = `border-radius: 5px; text-decoration: none; color: #fff; background-color: #3b485a; padding: 10px 30px; font-size: 16px;`

const VerifyEmail = (data: ResetPasswordData) => {
    const { first_name, last_name, link } = data;
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset password</title>
        </head>
        <body style="${BodyStyle}">
            <div style="${ContanerStyle}">
                <table style="${TableStyle}">
                    <tr><td><h3 style="${HeaderStyle}">Dear ${first_name} ${last_name}<span>,</span></h3></td></tr>
                    <tr><td>&nbsp;</td></tr>

                    <tr><td><p style="${ParagraphStyle}">You are recieving this email because you have registered on our website and you have to verify your email.</p></td></tr>
                    <tr><td><p style="${ParagraphStyle}">This email verification link will expire in 60 minutes.</p></td></tr>
                    <tr><td>&nbsp;</td></tr>

                    <tr><td style="text-align: center;"><a href="${link}" style="${ResetButtonStyle}">Verify Email</a></td></tr>
                    <tr><td>&nbsp;</td></tr>

                    <tr><td><p style="${ParagraphStyle}">If this wasn't you, please let us know immediately by replying to this email.</p></td></tr>
                    <tr><td>&nbsp;</td></tr>

                    <tr><td><p style="${ParagraphStyle}">Best regards,</p></td></tr>
                    <tr><td><p style="${ParagraphStyle}">Company Team</p></td></tr>
                </table>
            </div>
        </body>
        </html>
    `
}

export default VerifyEmail