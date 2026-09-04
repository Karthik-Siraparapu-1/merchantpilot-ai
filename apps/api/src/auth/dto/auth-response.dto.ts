import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserRoleAssignmentDto {
  @ApiProperty({ type: String, example: 'm0000000-0000-0000-0000-000000000001' })
  merchantId!: string;

  @ApiProperty({ type: String, example: 'MERCHANT_OWNER' })
  role!: string;
}

export class UserProfileDto {
  @ApiProperty({ type: String, example: '3a3fb205-9939-43d8-a73c-fc472ce38dba' })
  id!: string;

  @ApiProperty({ type: String, example: 'owner@merchant.com' })
  email!: string;

  @ApiPropertyOptional({ type: String, example: 'Rajesh' })
  firstName?: string | null;

  @ApiPropertyOptional({ type: String, example: 'Sharma' })
  lastName?: string | null;

  @ApiProperty({ type: String, example: 'ACTIVE' })
  status!: string;

  @ApiProperty({
    type: () => [UserRoleAssignmentDto],
    description: 'Assigned multi-tenant roles'
  })
  roles!: UserRoleAssignmentDto[];
}

export class AuthResponseDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token (valid for 15m)'
  })
  accessToken!: string;

  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Refresh Token (valid for 7d)'
  })
  refreshToken!: string;

  @ApiProperty({ type: () => UserProfileDto, description: 'Authenticated user profile' })
  user!: UserProfileDto;
}
