import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@merchantpilot/database';
import type { PrismaService } from '../common/prisma.service';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

interface MockPrismaUser {
  findUnique: Mock;
  create: Mock;
  update: Mock;
}

interface MockPrismaMerchant {
  findUnique: Mock;
  create: Mock;
}

interface MockPrismaEntity {
  create: Mock;
}

interface MockPrismaService {
  user: MockPrismaUser;
  merchant: MockPrismaMerchant;
  role: MockPrismaEntity;
  store: MockPrismaEntity;
  catalog: MockPrismaEntity;
  $transaction: Mock;
}

interface MockJwtService {
  sign: Mock;
  verify: Mock;
}

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrisma: MockPrismaService;
  let mockJwtService: MockJwtService;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn()
      },
      merchant: {
        findUnique: vi.fn(),
        create: vi.fn()
      },
      role: {
        create: vi.fn()
      },
      store: {
        create: vi.fn()
      },
      catalog: {
        create: vi.fn()
      },
      $transaction: vi.fn((callback: (tx: MockPrismaService) => Promise<unknown>) =>
        callback(mockPrisma)
      )
    };

    mockJwtService = {
      sign: vi.fn(
        (payload: { sub: string }, options?: { expiresIn?: string }) =>
          `mock_token_${payload.sub}_${options?.expiresIn ?? 'default'}`
      ),
      verify: vi.fn()
    };

    authService = new AuthService(
      mockPrisma as unknown as PrismaService,
      mockJwtService as unknown as JwtService
    );
  });

  describe('register', () => {
    it('should throw ConflictException if user email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'u-1',
        email: 'existing@merchant.com'
      });

      await expect(
        authService.register({
          email: 'existing@merchant.com',
          password: 'Password123!',
          merchantName: 'Test Merchant',
          merchantSlug: 'test-merchant'
        })
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if merchant slug already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.merchant.findUnique.mockResolvedValueOnce({ id: 'm-1', slug: 'test-merchant' });

      await expect(
        authService.register({
          email: 'new@merchant.com',
          password: 'Password123!',
          merchantName: 'Test Merchant',
          merchantSlug: 'test-merchant'
        })
      ).rejects.toThrow(ConflictException);
    });

    it('should register new user and merchant successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.merchant.findUnique.mockResolvedValueOnce(null);
      mockPrisma.merchant.create.mockResolvedValueOnce({
        id: 'm-123',
        name: 'Bharat Crafts',
        slug: 'bharat-crafts'
      });
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'u-123',
        email: 'owner@bharatcrafts.com',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        status: 'ACTIVE'
      });
      mockPrisma.role.create.mockResolvedValueOnce({});
      mockPrisma.store.create.mockResolvedValueOnce({ id: 's-123' });
      mockPrisma.catalog.create.mockResolvedValueOnce({ id: 'c-123' });
      mockPrisma.user.update.mockResolvedValueOnce({
        id: 'u-123',
        email: 'owner@bharatcrafts.com',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        status: 'ACTIVE'
      });

      const result = await authService.register({
        email: 'owner@bharatcrafts.com',
        password: 'Password123!',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        merchantName: 'Bharat Crafts',
        merchantSlug: 'bharat-crafts'
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('owner@bharatcrafts.com');
      expect(result.user.roles[0]?.role).toBe(UserRole.MERCHANT_OWNER);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.login({ email: 'unknown@merchant.com', password: 'Password123!' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'u-1',
        email: 'owner@merchant.com',
        passwordHash,
        status: 'ACTIVE',
        roles: [{ merchantId: 'm-1', role: 'MERCHANT_OWNER' }]
      });

      await expect(
        authService.login({ email: 'owner@merchant.com', password: 'WrongPassword!' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return token pair and user profile for valid credentials', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'u-1',
        email: 'owner@merchant.com',
        passwordHash,
        firstName: 'Rajesh',
        lastName: 'Sharma',
        status: 'ACTIVE',
        roles: [{ merchantId: 'm-1', role: 'MERCHANT_OWNER' }]
      });
      mockPrisma.user.update.mockResolvedValueOnce({
        id: 'u-1',
        email: 'owner@merchant.com',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        status: 'ACTIVE'
      });

      const result = await authService.login({
        email: 'owner@merchant.com',
        password: 'CorrectPassword123!'
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.id).toBe('u-1');
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        throw new Error('jwt expired');
      });

      await expect(authService.refresh({ refreshToken: 'invalid_token' })).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should rotate tokens when refresh token is valid', async () => {
      mockJwtService.verify.mockReturnValueOnce({ sub: 'u-1', email: 'owner@merchant.com' });
      const currentRefreshToken = 'valid_refresh_token';
      const refreshTokenHash = await bcrypt.hash(currentRefreshToken, 10);

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'u-1',
        email: 'owner@merchant.com',
        refreshTokenHash,
        status: 'ACTIVE',
        roles: [{ merchantId: 'm-1', role: 'MERCHANT_OWNER' }]
      });
      mockPrisma.user.update.mockResolvedValueOnce({
        id: 'u-1',
        email: 'owner@merchant.com',
        status: 'ACTIVE'
      });

      const result = await authService.refresh({ refreshToken: currentRefreshToken });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout', () => {
    it('should clear refresh token hash on logout', async () => {
      mockPrisma.user.update.mockResolvedValueOnce({ id: 'u-1', refreshTokenHash: null });

      const result = await authService.logout('u-1');

      expect(result).toEqual({ success: true });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: { refreshTokenHash: null }
      });
    });
  });

  describe('getProfile', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(authService.getProfile('non_existent_id')).rejects.toThrow(NotFoundException);
    });

    it('should return user profile without password hash', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'u-1',
        email: 'owner@merchant.com',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        status: 'ACTIVE',
        roles: [{ merchantId: 'm-1', role: 'MERCHANT_OWNER' }]
      });

      const profile = await authService.getProfile('u-1');

      expect(profile).toEqual({
        id: 'u-1',
        email: 'owner@merchant.com',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        status: 'ACTIVE',
        roles: [{ merchantId: 'm-1', role: 'MERCHANT_OWNER' }]
      });
    });
  });
});
