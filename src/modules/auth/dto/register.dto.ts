import { IsNotEmpty, IsString, IsEmail, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    required: true,
    default: 'email@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    default: '2'
  })
  @IsNotEmpty()
  @IsInt()
  roleId: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
  
}
