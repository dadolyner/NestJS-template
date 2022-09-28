import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
export class AuthRegisterDto {
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    first_name: string

    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    last_name: string

    @IsString({ message: 'Email must be a string' })
    @IsEmail({ message: 'This is not an email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string

    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password is too short' })
    @MaxLength(100, { message: 'Password is too long' })
    password: string
}

export class AuthLoginDto {
    @IsString({ message: 'Email must be a string' })
    @IsEmail({ message: 'This is not an email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string

    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password is too short' })
    @MaxLength(100, { message: 'Password is too long' })
    password: string
}