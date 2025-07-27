
import {  IsOptional, IsEnum, } from 'class-validator';
import { Role } from '../role-enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuthRoleDto {
     @ApiPropertyOptional({ enum: Role, example: Role.SUPERADMIN })
    @IsOptional()
    @IsEnum(Role, { message: "Rol noto'g'ri formatda!" })
    role: Role
}