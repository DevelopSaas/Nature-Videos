import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async create(@Body() createAuthDto: CreateAuthDto) {
        await this.authService.register(createAuthDto)
        return { message: "Iltimos emailingizga yuborilgan kodni kiriting!" };
    }

    @SkipThrottle()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all_auth_users')
    @CacheTTL(60)
    @Get()
    findAll() {
        return this.authService.findAll();
    }

    @SkipThrottle()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60)
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