import nodemailer from 'nodemailer';


const isProduction = process.env.NODE_ENV === 'production';

export const transporter = nodemailer.createTransport({
    host: isProduction ? "smtp.gmail.com" : "sandbox.smtp.mailtrap.io",
    port: isProduction ? 587 : 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});