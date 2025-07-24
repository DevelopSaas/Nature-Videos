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
let AuthService = class AuthService {
    authRepository;
    emailService;
    constructor(authRepository, emailService) {
        this.authRepository = authRepository;
        this.emailService = emailService;
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
    findAll() {
        console.log('--- AuthService.findAll() ishga tushdi (bu keshdan bo\'lmasa ko\'rinasiz) ---');
        return `This action returns all auth`;
    }
    findOne(id) {
        console.log(`--- AuthService.findOne(${id}) ishga tushdi (bu keshdan bo\'lmasa ko\'rinasiz) ---`);
        return `This action returns a #${id} auth`;
    }
    remove(id) {
        return `This action removes a #${id} auth`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map