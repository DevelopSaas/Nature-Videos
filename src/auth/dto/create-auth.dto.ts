import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty } from 'class-validator';


export class CreateAuthDto {
     @ApiProperty({ example: 'example@gmail.com', description: 'Foydalanuvchining email manzili' })
    @IsString({ message: "Gmail stringda kiritilishi shart!" })
    @IsEmail()
    @MinLength(3, { message: "Kiritilgan gmail 3 ta belgidan kam bo'lmasligi shart!" })
    @MaxLength(70, { message: "Kiritlgan gmail 70 ta belgidan ko'p bo'lmasligi shart!" })
    @IsNotEmpty({ message: "Gmail maydoni bo'sh bo'lmasligi kerak!" })
    gmail: string;

     @ApiProperty({ example: 'StrongPassword123', description: 'Foydalanuvchining paroli' })
    @IsString()
    @MinLength(6, { message: "Kiritilgan password 6 ta belgidan kam bo'lmasligi shart!" })
    @MaxLength(100, { message: "Kiritlgan password 100 ta belgidan ko'p bo'lmasligi shart!" })
    @IsNotEmpty({ message: "Password maydoni bo'sh bo'lmasligi shart!" })
    password: string
}
