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

export async function authenticatePortalUser(input: {
  email: string;
  password: string;
}): Promise<AuthenticatedPortalUser | null> {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!email || !password) {
    return null;
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
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
