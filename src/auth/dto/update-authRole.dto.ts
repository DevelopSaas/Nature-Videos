
import {  IsOptional, IsEnum, } from 'class-validator';
import { Role } from '../role-enum';

export class UpdateAuthRoleDto {
    @IsOptional()
    @IsEnum(Role, { message: "Rol noto'g'ri formatda!" })
    role: Role
}