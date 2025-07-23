import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
export declare class AuthService {
    private readonly authRepository;
    private readonly emailService;
    constructor(authRepository: Repository<Auth>, emailService: EmailService);
    register(createAuthDto: CreateAuthDto): Promise<{
        message: string;
    }>;
    verifyOtp(gmail: string, otp: string): Promise<{
        message: string;
    }>;
    findOne(id: number): string;
    remove(id: number): string;
}
