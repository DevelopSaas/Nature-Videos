import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify_otp.dto';
import { Response } from 'express';
import { Request } from 'express';
import { Role } from './role-enum';
import { UpdateAuthRoleDto } from './dto/update-authRole.dto';
import { SendResetDto } from './dto/ send-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(createAuthDto: CreateAuthDto): Promise<{
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
            role: Role;
        };
    }>;
    refresh(req: Request): Promise<{
        accessToken: string;
    }>;
    getAllUsers(): Promise<{
        id: string;
        gmail: string;
        isVerified: boolean;
        role: Role;
    }[]>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    updateUserRole(id: string, updateAuthDto: UpdateAuthRoleDto): Promise<{
        message: string;
        user: {
            id: string;
            gmail: string;
            role: Role;
        };
    }>;
    sendResetCode(dto: SendResetDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
