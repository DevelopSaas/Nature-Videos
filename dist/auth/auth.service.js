"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const typeorm_1 = require("@nestjs/typeorm");
const auth_entity_1 = require("./entities/auth.entity");
const typeorm_2 = require("typeorm");
const email_service_1 = require("../email/email.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    authRepository;
    emailService;
    jwtService;
    constructor(authRepository, emailService, jwtService) {
        this.authRepository = authRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async register(createAuthDto) {
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
                throw new common_1.ConflictException("Iltimos, 2 daqiqa kutib qayta urinib ko‘ring!");
            }
            if (existingUser && existingUser.isVerified) {
                throw new common_1.ConflictException("Bu email bilan foydalanuvchi mavjud!");
            }
            const newUser = this.authRepository.create({
                gmail,
                password: hashedPassword,
                isVerified: false,
                otp,
                otpTime: now,
            });
            await this.authRepository.save(newUser);
            await this.emailService.sendEmailOtp(gmail, otp);
            return { message: "Iltimos emailingizga yuborilgan kodni kiriting!" };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException('Serverda xato yuz berdi');
        }
    }
    async verifyOtp(verifyOtpDto) {
        try {
            const { gmail, otp } = verifyOtpDto;
            const user = await this.authRepository.findOne({ where: { gmail } });
            if (!user)
                throw new common_1.ConflictException("Foydalanuvchi topilmadi!");
            if (user.otp !== otp)
                throw new common_1.ConflictException("Noto'g'ri OTP!");
            const otpTime = user.otpTime;
            const currentTime = new Date();
            const timeDifference = (currentTime.getTime() - otpTime.getTime());
            if (timeDifference > 2 * 60 * 1000) {
                throw new common_1.ConflictException("OTP muddati tugagan!");
            }
            user.isVerified = true;
            user.otp = '';
            user.otpTime = new Date(0);
            await this.authRepository.save(user);
            return { message: "Email manzilingiz tasdiqlandi!" };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException('Serverda xato yuz berdi');
        }
    }
    async login(loginDto, res) {
        try {
            const { gmail, password } = loginDto;
            const user = await this.authRepository.findOne({ where: { gmail } });
            if (!user) {
                throw new common_1.UnauthorizedException('Email yoki parol xato!');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Email yoki parol xato!');
            }
            if (!user.isVerified) {
                throw new common_1.UnauthorizedException('Email manzili tasdiqlanmagan!');
            }
            const payload = { id: user.id, gmail: user.gmail, role: user.role };
            const accessToken = this.jwtService.sign(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            });
            const refreshToken = this.jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            });
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });
            return {
                accessToken,
                user: {
                    id: user.id,
                    gmail: user.gmail,
                    role: user.role
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException('Serverda xato yuz berdi');
        }
    }
    async refreshToken(req) {
        const token = req.cookies['refresh_token'];
        if (!token)
            throw new common_1.UnauthorizedException('Refresh token topilmadi!');
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const newAccessToken = this.jwtService.sign({ id: payload.id, email: payload.email, role: payload.role }, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token yaroqsiz!');
        }
    }
    async getAllUsers() {
        try {
            const users = await this.authRepository.find();
            if (!users || users.length === 0) {
                throw new common_1.NotFoundException("Foydalanuvchilar topilmadi!");
            }
            return users.map(user => ({
                id: user.id,
                gmail: user.gmail,
                isVerified: user.isVerified,
                role: user.role
            }));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Serverda xato yuz berdi');
        }
    }
    async updateUserRole(id, updateAuthDto) {
        try {
            const user = await this.authRepository.findOne({ where: { id } });
            if (!user) {
                throw new common_1.NotFoundException("Foydalanuvchi topilmadi!");
            }
            const { role } = updateAuthDto;
            user.role = role;
            await this.authRepository.save(user);
            return {
                message: "Foydalanuvchi roli yangilandi!", user: {
                    id: user.id,
                    gmail: user.gmail,
                    role: user.role
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Serverda xato yuz berdi');
        }
    }
    async sendResetCode(sendResetDto) {
        try {
            const { gmail } = sendResetDto;
            const user = await this.authRepository.findOne({ where: { gmail } });
            if (!user) {
                throw new common_1.NotFoundException("Bunday gmail bilan foydalanuvchi topilmadi!");
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpTime = new Date();
            await this.authRepository.save(user);
            await this.emailService.sendEmailOtp(gmail, otp);
            return { message: 'Emailga tiklash kodi yuborildi.' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Serverda xato yuz berdi');
        }
    }
    async resetPassword(resetDto) {
        const { gmail, otp, newPassword } = resetDto;
        try {
            const user = await this.authRepository.findOne({ where: { gmail } });
            if (!user) {
                throw new common_1.NotFoundException("Foydalanuvchi topilmadi!");
            }
            if (user.otp !== otp) {
                throw new common_1.UnauthorizedException("Noto‘g‘ri OTP kiritildi!");
            }
            const otpTime = user.otpTime;
            const now = new Date();
            const diff = now.getTime() - otpTime.getTime();
            if (diff > 2 * 60 * 1000) {
                throw new common_1.UnauthorizedException("OTP kodi muddati tugagan!");
            }
            user.password = await bcrypt.hash(newPassword, 10);
            user.otp = '';
            user.otpTime = new Date(0);
            await this.authRepository.save(user);
            return { message: "Parol muvaffaqiyatli yangilandi!" };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Serverda xato yuz berdi');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map