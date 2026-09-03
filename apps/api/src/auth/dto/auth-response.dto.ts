import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: '3a3fb205-9939-43d8-a73c-fc472ce38dba' })
  id!: string;

  @ApiProperty({ example: 'owner@merchant.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'Rajesh' })
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Sharma' })
  lastName?: string | null;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({
    example: [{ merchantId: 'm-123', role: 'MERCHANT_OWNER' }],
    description: 'Assigned multi-tenant roles'
  })
  roles!: Array<{ merchantId: string; role: string }>;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token (valid for 15m)'
  })
  accessToken!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Refresh Token (valid for 7d)'
  })
  refreshToken!: string;

  @ApiProperty({ type: UserProfileDto, description: 'Authenticated user profile' })
  user!: UserProfileDto;
}
