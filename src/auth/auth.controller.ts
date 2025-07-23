import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto'

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async create(@Body() createAuthDto: CreateAuthDto) {
        await this.authService.register(createAuthDto)
        return { message: "Iltimos emailingizga yuborilgan kodni kiriting!" };
    }

    @Post()
    async verifyOtp(@Body() gmail: string, otp: string) {
        await this.authService.verifyOtp(gmail, otp);
        return { message: "Email manzilingiz tasdiqlandi!" };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.authService.findOne(+id);
    }

    //   @Patch(':id')
    //   update(@Param('id') id: string, @Body() updateAuthDto: ) {
    //     return this.authService.update(+id, updateAuthDto);
    //   }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.authService.remove(+id);
    }
}
