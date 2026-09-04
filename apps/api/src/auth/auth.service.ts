import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Inject
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole, StoreStatus } from '@merchantpilot/database';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingMerchant = await this.prisma.merchant.findUnique({
      where: { slug: dto.merchantSlug.toLowerCase() }
    });

    if (existingMerchant) {
      throw new ConflictException('Merchant slug already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const { user, merchant } = await this.prisma.$transaction(async (tx) => {
      const merchantRecord = await tx.merchant.create({
        data: {
          name: dto.merchantName,
          slug: dto.merchantSlug.toLowerCase(),
          status: 'ACTIVE'
        }
      });

      const userRecord = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName: dto.firstName ?? null,
          lastName: dto.lastName ?? null,
          status: 'ACTIVE'
        }
      });

      await tx.role.create({
        data: {
          merchantId: merchantRecord.id,
          userId: userRecord.id,
          role: UserRole.MERCHANT_OWNER
        }
      });

      const storeRecord = await tx.store.create({
        data: {
          merchantId: merchantRecord.id,
          name: `${dto.merchantName} Primary Store`,
          slug: `${dto.merchantSlug.toLowerCase()}-main`,
          status: StoreStatus.ACTIVE
        }
      });

      await tx.catalog.create({
        data: {
          storeId: storeRecord.id,
          name: 'Main Catalog'
        }
      });

      return { user: userRecord, merchant: merchantRecord };
    });

    return this.generateTokensAndUpdateRefreshHash(user.id, user.email, [
      { merchantId: merchant.id, role: UserRole.MERCHANT_OWNER }
    ]);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        roles: {
          select: {
            merchantId: true,
            role: true
          }
        }
      }
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is inactive');
    }

    return this.generateTokensAndUpdateRefreshHash(user.id, user.email, user.roles);
  }

  async refresh(dto: RefreshDto): Promise<AuthResponseDto> {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'merchantpilot-jwt-refresh-secret-2026'
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          select: {
            merchantId: true,
            role: true
          }
        }
      }
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh session');
    }

    const isRefreshTokenValid = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokensAndUpdateRefreshHash(user.id, user.email, user.roles);
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });

    return { success: true };
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: {
            merchantId: true,
            role: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      roles: user.roles
    };
  }

  private async generateTokensAndUpdateRefreshHash(
    userId: string,
    email: string,
    roles: Array<{ merchantId: string; role: string }>
  ): Promise<AuthResponseDto> {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: process.env.JWT_SECRET || 'merchantpilot-jwt-super-secret-key-2026',
        expiresIn: '15m'
      }
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'merchantpilot-jwt-refresh-secret-2026',
        expiresIn: '7d'
      }
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash }
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        status: updatedUser.status,
        roles
      }
    };
  }
}
