import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
     @ApiProperty({ example: 'example@gmail.com' })
    @IsString({ message: "Gmail stringda kiritilishi shart!" })
    @IsEmail()
    @MinLength(3, { message: "Kiritilgan gmail 3 ta belgidan kam bo'lmasligi shart!" })
    @MaxLength(70, { message: "Kiritlgan gmail 70 ta belgidan ko'p bo'lmasligi shart!" })
    @IsNotEmpty({ message: "Gmail maydoni bo'sh bo'lmasligi kerak!" })
    gmail: string;

     @ApiProperty({ example: 'NewStrongPassword123', description: 'Yangi parol' })
    @IsString()
    otp: string;
    @IsString()
    @MinLength(6, { message: "Kiritilgan password 6 ta belgidan kam bo'lmasligi shart!" })
    @MaxLength(100, { message: "Kiritlgan password 100 ta belgidan ko'p bo'lmasligi shart!" })
    @IsNotEmpty({ message: "Password maydoni bo'sh bo'lmasligi shart!" })
    newPassword: string;
}