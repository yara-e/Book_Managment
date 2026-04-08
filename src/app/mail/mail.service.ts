import path from 'path';
import ejs from 'ejs';
import { transporter } from './mail.transport';

// src/app/mail/mail.service.ts

export const sendResetEmail = async (email: string, name: string, token: string) => {
    console.log("--- Starting Email Process ---");
    const templatePath = path.join(process.cwd(), 'src', 'app', 'mail', 'templates', 'reset-password.ejs');

    try {
        const html = await ejs.renderFile(templatePath, { name, resetUrl: "test" });
        console.log("--- Template Rendered Successfully ---");

        // This is the line that usually hangs if the connection is bad
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Test",
            html
        });

        console.log("--- Email Sent! ---");
    } catch (error) {
        console.error("--- MAIL ERROR ---", error);
        throw error; // This will trigger your next(error) in the controller
    }
};