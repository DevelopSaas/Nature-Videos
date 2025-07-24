import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto'
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity'
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>,
        private readonly emailService: EmailService,
    ) { }

    async register(createAuthDto: CreateAuthDto) {
        try {
            const { gmail, password } = createAuthDto;
            const existingUser = await this.authRepository.findOne({ where: { gmail } });

            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const now = new Date();

            if (existingUser && !existingUser.isVerified) {
                const diffMs = now.getTime() - new Date(existingUser.otpTime).getTime();
                const diffMinutes = diffMs / (1000 * 60);

                if (diffMinutes >= 2) {
                    existingUser.password = hashedPassword;
                    existingUser.otp = otp;
                    existingUser.otpTime = now;
                    await this.authRepository.save(existingUser);
                    await this.emailService.sendEmailOtp(gmail, otp);
                    return { message: "Yangi tasdiqlash kodingiz emailingizga yuborildi!" };
                }
                throw new ConflictException("Iltimos, 2 daqiqa kutib qayta urinib ko‘ring!");
            }
            if (existingUser && existingUser.isVerified) {
                throw new ConflictException("Bu email bilan foydalanuvchi mavjud!");
            }

            const newUser = this.authRepository.create({
                gmail,
                password: hashedPassword,
                isVerified: false,
                otp,
                otpTime: now,
            })
            
            await this.authRepository.save(newUser);
            await this.emailService.sendEmailOtp(gmail, otp);
            return { message: "Iltimos emailingizga yuborilgan kodni kiriting!" };
        } catch (error) {
            if (error instanceof ConflictException) throw error;
            throw new InternalServerErrorException('Serverda xato yuz berdi');
        }
    }

    findAll() {
        console.log('--- AuthService.findAll() ishga tushdi (bu keshdan bo\'lmasa ko\'rinasiz) ---');

        return `This action returns all auth`; 
    }

    findOne(id: number) {
        console.log(`--- AuthService.findOne(${id}) ishga tushdi (bu keshdan bo\'lmasa ko\'rinasiz) ---`);
       
        return `This action returns a #${id} auth`; 
    }


    remove(id: number) {
        return `This action removes a #${id} auth`;
    }
}