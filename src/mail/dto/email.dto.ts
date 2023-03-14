import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class EmailDto {
    @IsString({ message: 'First name must be a string.' })
    @IsNotEmpty({ message: 'First name is required.' })
    first_name: string
    
    @IsString({ message: 'First name must be a string.' })
    @IsNotEmpty({ message: 'First name is required.' })
    last_name: string
    
    @IsOptional()
    @IsString({ message: 'First name must be a string.' })
    @IsNotEmpty({ message: 'First name is required.' })
    link?: string
}