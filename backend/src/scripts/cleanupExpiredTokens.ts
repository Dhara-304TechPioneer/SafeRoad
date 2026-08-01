import prisma from '../config/db';

export interface CleanupResult {
  expiredPasswordResetsDeleted: number;
  expiredRefreshTokensDeleted: number;
  usedRefreshTokensDeleted: number;
  totalDeleted: number;
}

/**
 * Deletes:
 * 1. PasswordReset rows where expiresAt < now
 * 2. RefreshToken rows where expiresAt < now
 * 3. RefreshToken rows where usedAt < (now - 24 hours)
 */
export async function cleanupExpiredTokens(): Promise<CleanupResult> {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [passwordResetsRes, expiredRefreshRes, usedRefreshRes] = await prisma.$transaction([
    prisma.passwordReset.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    }),
    prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    }),
    prisma.refreshToken.deleteMany({
      where: {
        usedAt: {
          lt: twentyFourHoursAgo,
        },
      },
    }),
  ]);

  const result: CleanupResult = {
    expiredPasswordResetsDeleted: passwordResetsRes.count,
    expiredRefreshTokensDeleted: expiredRefreshRes.count,
    usedRefreshTokensDeleted: usedRefreshRes.count,
    totalDeleted: passwordResetsRes.count + expiredRefreshRes.count + usedRefreshRes.count,
  };

  console.log(
    `[Token Cleanup] Ran at ${now.toISOString()}. Deleted ${result.expiredPasswordResetsDeleted} expired password resets, ` +
      `${result.expiredRefreshTokensDeleted} expired refresh tokens, and ${result.usedRefreshTokensDeleted} used refresh tokens older than 24h ` +
      `(Total: ${result.totalDeleted})`
  );

  return result;
}

export function startCleanupJob(intervalMs: number = 60 * 60 * 1000): NodeJS.Timeout {
  cleanupExpiredTokens().catch((err) => {
    console.error('[Token Cleanup] Initial run error:', err);
  });

  const intervalId = setInterval(() => {
    cleanupExpiredTokens().catch((err) => {
      console.error('[Token Cleanup] Scheduled run error:', err);
    });
  }, intervalMs);

  return intervalId;
}

if (require.main === module) {
  cleanupExpiredTokens()
    .then((res) => {
      console.log('[Token Cleanup] Standalone execution finished:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Token Cleanup] Standalone execution failed:', err);
      process.exit(1);
    });
}
