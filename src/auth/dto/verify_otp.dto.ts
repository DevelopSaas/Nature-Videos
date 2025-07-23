import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class VerifyOtpDto {
    @IsString({ message: "Gmail stringda kiritilishi shart!" })
    @IsEmail()
    @MinLength(3, { message: "Kiritilgan gmail 3 ta belgidan kam bo'lmasligi shart!" })
    @MaxLength(70, { message: "Kiritlgan gmail 70 ta belgidan ko'p bo'lmasligi shart!" })
    @IsNotEmpty({ message: "Gmail maydoni bo'sh bo'lmasligi kerak!" })
    gmail: string;

    @IsString({ message: "OTP noto'g'ri formatda!" })
    @IsNotEmpty({ message: "OTP maydoni bo'sh bo'lmasligi kerak!" })
    otp: string;
}