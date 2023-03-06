// Auth DTOs
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { AllowedRoles } from 'src/entities/users.entity'

// Register
export class AuthRegisterDto {
    @ApiProperty({ type: String, description: 'User first name', example: 'Janez' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    first_name: string

    @ApiProperty({ type: String, description: 'User last name', example: 'Novak' })
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    last_name: string

    @ApiProperty({ type: String, description: 'User email', example: 'janez.novak@gmail.com' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string

    @ApiProperty({ type: String, description: 'User password', example: 'janeznovak123' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password is too short' })
    @MaxLength(100, { message: 'Password is too long' })
    // @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password to weak' })
    password: string

    @ApiProperty({ type: String, description: 'User avatar', example: 'image/base64' })
    @IsOptional()
    @IsString({ message: 'Avatar must be a string' })
    @IsNotEmpty({ message: 'Avatar is required' })
    avatar: string
}

// Login
export class AuthLoginDto {
    @ApiProperty({ type: String, description: 'User email', example: 'janez.novak@gmail.com' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string

    @ApiProperty({ type: String, description: 'User password', example: 'janeznovak123' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password is too short' })
    @MaxLength(100, { message: 'Password is too long' })
    password: string
}

// Password request
export class PasswordRequestDto {
    @ApiProperty({ type: String, description: 'User email', example: 'janez.novak@gmail.com' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string
}

// Password change
export class PasswordDto {
    @ApiProperty({ type: String, description: 'User password', example: 'janeznovak123' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password is too short' })
    @MaxLength(100, { message: 'Password is too long' })
    password: string
}

// Roles
export class AuthRolesDto {
    @ApiProperty({ type: Array, description: 'User roles', example: '["Admin"]' })
    @IsArray({ message: 'Roles must be an array of strings' })
    @IsNotEmpty({ message: 'Roles are required' })
    roles: AllowedRoles[]
}