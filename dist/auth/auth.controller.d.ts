import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(createAuthDto: CreateAuthDto): Promise<{
        message: string;
    }>;
    verifyOtp(gmail: string, otp: string): Promise<{
        message: string;
    }>;
    findOne(id: string): string;
    remove(id: string): string;
}
