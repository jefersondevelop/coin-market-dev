import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty({
      required: true,
      default: 'email@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
      required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

}
