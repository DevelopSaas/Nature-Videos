export declare class EmailService {
    emailTransporter(): any;
    sendEmailOtp(email: string, otp: string): Promise<void>;
}
