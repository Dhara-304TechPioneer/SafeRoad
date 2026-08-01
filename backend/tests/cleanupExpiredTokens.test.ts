import prisma from '../src/config/db';
import { cleanupExpiredTokens } from '../src/scripts/cleanupExpiredTokens';

describe('Expired Token Cleanup Script', () => {
  let testUserId: string;

  beforeAll(async () => {
    await prisma.$connect();
    const user = await prisma.user.create({
      data: {
        fullName: 'Cleanup Test User',
        email: `cleanup_test_${Date.now()}@saferoad.test`,
        password: 'TestPassword123!',
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    try {
      if (testUserId) {
        await prisma.passwordReset.deleteMany({ where: { userId: testUserId } });
        await prisma.refreshToken.deleteMany({ where: { userId: testUserId } });
        await prisma.user.delete({ where: { id: testUserId } });
      }
    } catch (e) {
      console.warn('Cleanup error in test afterAll:', e);
    } finally {
      await prisma.$disconnect();
    }
  });

  it('should delete expired PasswordReset and RefreshToken rows and used tokens > 24h old, while leaving valid ones untouched', async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneHourFuture = new Date(now.getTime() + 60 * 60 * 1000);
    const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // 1. Password Resets
    const expiredReset = await prisma.passwordReset.create({
      data: {
        userId: testUserId,
        otpHash: 'expired_otp_hash',
        expiresAt: oneHourAgo,
      },
    });

    const validReset = await prisma.passwordReset.create({
      data: {
        userId: testUserId,
        otpHash: 'valid_otp_hash',
        expiresAt: oneHourFuture,
      },
    });

    // 2. Refresh Tokens
    const expiredToken = await prisma.refreshToken.create({
      data: {
        userId: testUserId,
        tokenHash: 'expired_token_hash',
        expiresAt: oneHourAgo,
      },
    });

    const validToken = await prisma.refreshToken.create({
      data: {
        userId: testUserId,
        tokenHash: 'valid_token_hash',
        expiresAt: oneHourFuture,
      },
    });

    const oldUsedToken = await prisma.refreshToken.create({
      data: {
        userId: testUserId,
        tokenHash: 'old_used_token_hash',
        expiresAt: oneHourFuture,
        usedAt: twentyFiveHoursAgo,
      },
    });

    const recentlyUsedToken = await prisma.refreshToken.create({
      data: {
        userId: testUserId,
        tokenHash: 'recently_used_token_hash',
        expiresAt: oneHourFuture,
        usedAt: twoHoursAgo,
      },
    });

    // Execute cleanup
    const result = await cleanupExpiredTokens();

    expect(result.totalDeleted).toBeGreaterThanOrEqual(3);

    // Assert PasswordReset status
    const checkedExpiredReset = await prisma.passwordReset.findUnique({ where: { id: expiredReset.id } });
    const checkedValidReset = await prisma.passwordReset.findUnique({ where: { id: validReset.id } });

    expect(checkedExpiredReset).toBeNull();
    expect(checkedValidReset).not.toBeNull();
    expect(checkedValidReset?.id).toBe(validReset.id);

    // Assert RefreshToken status
    const checkedExpiredToken = await prisma.refreshToken.findUnique({ where: { id: expiredToken.id } });
    const checkedValidToken = await prisma.refreshToken.findUnique({ where: { id: validToken.id } });
    const checkedOldUsedToken = await prisma.refreshToken.findUnique({ where: { id: oldUsedToken.id } });
    const checkedRecentlyUsedToken = await prisma.refreshToken.findUnique({ where: { id: recentlyUsedToken.id } });

    expect(checkedExpiredToken).toBeNull();
    expect(checkedValidToken).not.toBeNull();
    expect(checkedOldUsedToken).toBeNull();
    expect(checkedRecentlyUsedToken).not.toBeNull();
  });
});
