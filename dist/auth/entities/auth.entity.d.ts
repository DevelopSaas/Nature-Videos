import { Role } from '../role-enum';
export declare class Auth {
    id: string;
    gmail: string;
    password: string;
    isVerified: boolean;
    otp: string;
    otpTime: Date;
    role: Role;
}
