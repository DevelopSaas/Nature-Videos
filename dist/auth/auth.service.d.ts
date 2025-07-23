import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { VerifyOtpDto } from './dto/verify_otp.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UpdateAuthRoleDto } from './dto/update-authRole.dto';
import { SendResetDto } from './dto/ send-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private readonly authRepository;
    private readonly emailService;
    private readonly jwtService;
    constructor(authRepository: Repository<Auth>, emailService: EmailService, jwtService: JwtService);
    register(createAuthDto: CreateAuthDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    login(loginDto: CreateAuthDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            gmail: string;
            role: import("./role-enum").Role;
        };
    }>;
    refreshToken(req: Request): Promise<{
        accessToken: string;
    }>;
    getAllUsers(): Promise<{
        id: string;
        gmail: string;
        isVerified: boolean;
        role: import("./role-enum").Role;
    }[]>;
    updateUserRole(id: string, updateAuthDto: UpdateAuthRoleDto): Promise<{
        message: string;
        user: {
            id: string;
            gmail: string;
            role: import("./role-enum").Role;
        };
    }>;
    sendResetCode(sendResetDto: SendResetDto): Promise<{
        message: string;
    }>;
    resetPassword(resetDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
