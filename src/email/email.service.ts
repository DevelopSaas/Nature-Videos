import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'


@Injectable()
export class EmailService {
    emailTransporter() {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        return transporter;
    }
    async sendEmailOtp(email: string, otp: string) {
        const mailOptions = {
            from: `"Nature Video" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: '🔐 Your One-Time Password (OTP)',
            text: `Your OTP code is: ${otp}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #2e7d32;">🔐 Nature Video Verification</h2>
            <p>Dear user,</p>
            <p>To complete your verification, please use the following <strong>One-Time Password (OTP)</strong>:</p>
            <div style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 10px; background-color: #f1f1f1; border-left: 4px solid #2e7d32; width: fit-content;">
                ${otp}
            </div>
            <p>This code is valid for only a few minutes. Do not share it with anyone.</p>
            <br/>
            <p style="font-size: 14px; color: #666;">Thank you,<br/>Nature Video Team</p>
        </div>
    `,
        }

        await this.emailTransporter().sendMail(mailOptions)
    }
}