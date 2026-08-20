import { prisma } from '@/lib/auth/db';
import { verifyPassword } from '@/lib/auth/password';

export type AuthenticatedPortalUser = {
  id: string;
  email: string;
  customerSlug: string;
  customerName: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function logAuthFailure(reason: string, detail?: string): void {
  if (detail) {
    console.error(`[auth] Portal login failed: ${reason}. ${detail}`);
    return;
  }
  console.error(`[auth] Portal login failed: ${reason}.`);
}

export async function authenticatePortalUser(input: {
  email: string;
  password: string;
}): Promise<AuthenticatedPortalUser | null> {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!email || !password) {
    logAuthFailure('missing email or password');
    return null;
  }

  let user: Awaited<ReturnType<typeof findUserByEmail>>;
  try {
    user = await findUserByEmail(email);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/Environment variable not found:\s*DATABASE_URL/i.test(message)) {
      logAuthFailure(
        'DATABASE_URL missing in Prisma runtime',
        'Restart `npm run dev` after setting DATABASE_URL; PrismaClient must receive an explicit datasources url.',
      );
    } else if (/no such table|does not exist/i.test(message)) {
      logAuthFailure('User table missing', 'Run `npm run db:push && npm run db:seed`.');
    } else {
      logAuthFailure('database lookup error', message);
    }
    throw error;
  }

  if (!user) {
    logAuthFailure('user not found', `email=${email}`);
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    logAuthFailure('password mismatch', `email=${email}`);
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    customerSlug: user.customer.slug,
    customerName: user.customer.name,
  };
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
    include: { customer: true },
  });
}
