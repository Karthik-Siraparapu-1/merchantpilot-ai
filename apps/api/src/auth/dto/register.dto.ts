import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'owner@merchant.com', description: 'User account email address' })
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    example: 'SecureP@ss123!',
    description: 'Strong account password (min 8 characters)'
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @ApiPropertyOptional({ example: 'Rajesh', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'Bharat Crafts & Apparel', description: 'Merchant enterprise name' })
  @IsString()
  @IsNotEmpty({ message: 'Merchant name is required' })
  merchantName!: string;

  @ApiProperty({ example: 'bharat-crafts', description: 'Unique merchant slug handle' })
  @IsString()
  @IsNotEmpty({ message: 'Merchant slug is required' })
  merchantSlug!: string;
}
