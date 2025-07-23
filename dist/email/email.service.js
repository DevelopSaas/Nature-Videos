"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
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
    async sendEmailOtp(email, otp) {
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
        };
        await this.emailTransporter().sendMail(mailOptions);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map