import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

// Auth Register DTO 
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
    @IsEmail({ message: 'This is not an email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string

    @ApiProperty({ type: String, description: 'User password', example: 'janeznovak123' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password is too short' })
    @MaxLength(100, { message: 'Password is too long' })
    password: string
}

// Auth Login DTO
export class AuthLoginDto {
    @ApiProperty({ type: String, description: 'User email', example: 'janez.novak@gmail.com' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail({ message: 'This is not an email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string

    @ApiProperty({ type: String, description: 'User password', example: 'janeznovak123' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password is too short' })
    @MaxLength(100, { message: 'Password is too long' })
    password: string
}