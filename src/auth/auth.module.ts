
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { EmailModule } from 'src/email/email.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth]),
        EmailModule,
        CacheModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}