import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'owner@merchant.com', description: 'Registered email address' })
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: 'SecureP@ss123!', description: 'Account password' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
