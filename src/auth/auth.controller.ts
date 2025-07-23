import { Controller, Post, Body, Res, Req, Get, UseGuards, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto'
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

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async create(@Body() createAuthDto: CreateAuthDto) {
        await this.authService.register(createAuthDto)
        return { message: "Iltimos emailingizga yuborilgan kodni kiriting!" };
    }

    @Post('verify_otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        await this.authService.verifyOtp(verifyOtpDto);
        return { message: "Email manzilingiz tasdiqlandi!" }
    }


    @Post('login')
    async login(@Body() loginDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
        return await this.authService.login(loginDto, res);
    }

    @Post("refresh")
    async refresh(@Req() req: Request) {
        return this.authService.refreshToken(req);
    }



    @Get('all')
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles(Role.SUPERADMIN)
    async getAllUsers() {
        return this.authService.getAllUsers()
    }


    @Post('logout')
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
    async updateUserRole(
        @Param('id') id: string,
        @Body() updateAuthDto: UpdateAuthRoleDto,
    ) {
        return this.authService.updateUserRole(id, updateAuthDto);
    }


    @Post('forgot_password')
    async sendResetCode(@Body() dto: SendResetDto) {
        return this.authService.sendResetCode(dto)
    }

    @Post('reset_password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto)
    }
}
