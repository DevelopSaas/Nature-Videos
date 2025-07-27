import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
  Put,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify_otp.dto';
import { Response } from 'express';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './role-enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateAuthRoleDto } from './dto/update-authRole.dto';
import { SendResetDto } from './dto/ send-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Foydalanuvchini roʻyxatdan oʻtkazish' })
  @ApiResponse({ status: 201, description: 'Tasdiqlash kodi yuborildi.' })
  @ApiResponse({ status: 409, description: 'Email mavjud yoki 2 daqiqa kutish kerak.' })
  @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi.' })
  async create(@Body() createAuthDto: CreateAuthDto) {
    await this.authService.register(createAuthDto);
    return { message: 'Iltimos emailingizga yuborilgan kodni kiriting!' };
  }

  @Post('verify_otp')
  @ApiOperation({ summary: 'Emailni OTP orqali tasdiqlash' })
  @ApiResponse({ status: 200, description: 'Email tasdiqlandi.' })
  @ApiResponse({ status: 409, description: 'Foydalanuvchi topilmadi, notoʻgʻri OTP yoki OTP muddati tugagan.' })
  @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi.' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyOtp(verifyOtpDto);
    return { message: 'Email manzilingiz tasdiqlandi!' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchi tizimga kiradi' })
  @ApiResponse({ status: 200, description: 'Kirish muvaffaqiyatli, JWT token qaytariladi.' })
  @ApiResponse({ status: 401, description: 'Email yoki parol notoʻgʻri, yoki tasdiqlanmagan.' })
  @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi.' })
  async login(@Body() loginDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(loginDto, res);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Yangi access token olish (refresh token orqali)' })
  @ApiResponse({ status: 200, description: 'Yangi access token qaytariladi.' })
  @ApiResponse({ status: 401, description: 'Refresh token topilmadi yoki yaroqsiz.' })
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Barcha foydalanuvchilar roʻyxatini olish (faqat SUPERADMIN)' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar roʻyxati' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchilar topilmadi.' })
  @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi.' })
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('logout')
  @ApiOperation({ summary: 'Tizimdan chiqish (cookiedagi refresh_token ni tozalash)' })
  @ApiResponse({ status: 200, description: 'Tizimdan chiqildi.' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
    return { message: 'Tizimdan chiqildi' };
  }

  @Put(':id/role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchi rolini o‘zgartirish (faqat SUPERADMIN)' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi roli yangilandi.' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi.' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateAuthDto: UpdateAuthRoleDto,
  ) {
    return this.authService.updateUserRole(id, updateAuthDto);
  }

  @Post('forgot_password')
  @ApiOperation({ summary: 'Parolni tiklash uchun OTP yuborish' })
  @ApiResponse({ status: 200, description: 'Emailga tiklash kodi yuborildi.' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi.' })
  async sendResetCode(@Body() dto: SendResetDto) {
    return this.authService.sendResetCode(dto);
  }

  @Post('reset_password')
  @ApiOperation({ summary: 'Parolni qayta o‘rnatish (OTP orqali)' })
  @ApiResponse({ status: 200, description: 'Parol muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  @ApiResponse({ status: 401, description: 'Noto‘g‘ri OTP yoki muddati tugagan.' })
  @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi.' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
