import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';


export class CreateAuthDto {
    @IsString({ message: "Gmail stringda kiritilishi shart!" })
    @IsEmail()
    @MinLength(3, { message: "Kiritilgan gmail 3 ta belgidan kam bo'lmasligi shart!" })
    @MaxLength(70, { message: "Kiritlgan gmail 70 ta belgidan ko'p bo'lmasligi shart!" })
    gmail: string;

    @IsString()
    @MinLength(6, { message: "Kiritilgan password 6 ta belgidan kam bo'lmasligi shart!" })
    @MaxLength(100, { message: "Kiritlgan password 100 ta belgidan ko'p bo'lmasligi shart!" })
    password: string
}
