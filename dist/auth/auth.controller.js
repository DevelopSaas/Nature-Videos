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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_auth_dto_1 = require("./dto/create-auth.dto");
const verify_otp_dto_1 = require("./dto/verify_otp.dto");
const passport_1 = require("@nestjs/passport");
const role_enum_1 = require("./role-enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const update_authRole_dto_1 = require("./dto/update-authRole.dto");
const _send_reset_dto_1 = require("./dto/ send-reset.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async create(createAuthDto) {
        await this.authService.register(createAuthDto);
        return { message: 'Iltimos emailingizga yuborilgan kodni kiriting!' };
    }
    async verifyOtp(verifyOtpDto) {
        await this.authService.verifyOtp(verifyOtpDto);
        return { message: 'Email manzilingiz tasdiqlandi!' };
    }
    async login(loginDto, res) {
        return await this.authService.login(loginDto, res);
    }
    async refresh(req) {
        return this.authService.refreshToken(req);
    }
    async getAllUsers() {
        return this.authService.getAllUsers();
    }
    async logout(res) {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        return { message: 'Tizimdan chiqildi' };
    }
    async updateUserRole(id, updateAuthDto) {
        return this.authService.updateUserRole(id, updateAuthDto);
    }
    async sendResetCode(dto) {
        return this.authService.sendResetCode(dto);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Foydalanuvchini roʻyxatdan oʻtkazish' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tasdiqlash kodi yuborildi.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email mavjud yoki 2 daqiqa kutish kerak.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Serverda xato yuz berdi.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.CreateAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('verify_otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Emailni OTP orqali tasdiqlash' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email tasdiqlandi.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Foydalanuvchi topilmadi, notoʻgʻri OTP yoki OTP muddati tugagan.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Serverda xato yuz berdi.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Foydalanuvchi tizimga kiradi' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kirish muvaffaqiyatli, JWT token qaytariladi.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Email yoki parol notoʻgʻri, yoki tasdiqlanmagan.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Serverda xato yuz berdi.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.CreateAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi access token olish (refresh token orqali)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Yangi access token qaytariladi.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Refresh token topilmadi yoki yaroqsiz.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha foydalanuvchilar roʻyxatini olish (faqat SUPERADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Foydalanuvchilar roʻyxati' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Foydalanuvchilar topilmadi.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Serverda xato yuz berdi.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Tizimdan chiqish (cookiedagi refresh_token ni tozalash)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tizimdan chiqildi.' }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Put)(':id/role'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Foydalanuvchi rolini o‘zgartirish (faqat SUPERADMIN)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Foydalanuvchi roli yangilandi.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Foydalanuvchi topilmadi.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Serverda xato yuz berdi.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_authRole_dto_1.UpdateAuthRoleDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Post)('forgot_password'),
    (0, swagger_1.ApiOperation)({ summary: 'Parolni tiklash uchun OTP yuborish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emailga tiklash kodi yuborildi.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Foydalanuvchi topilmadi.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Serverda xato yuz berdi.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_send_reset_dto_1.SendResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendResetCode", null);
__decorate([
    (0, common_1.Post)('reset_password'),
    (0, swagger_1.ApiOperation)({ summary: 'Parolni qayta o‘rnatish (OTP orqali)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parol muvaffaqiyatli yangilandi.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Foydalanuvchi topilmadi.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Noto‘g‘ri OTP yoki muddati tugagan.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Serverda xato yuz berdi.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map