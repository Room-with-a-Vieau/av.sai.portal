jest.mock('@/lib/auth/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth/password', () => ({
  verifyPassword: jest.fn(),
}));

import { prisma } from '@/lib/auth/db';
import { verifyPassword } from '@/lib/auth/password';
import { authenticatePortalUser, findUserByEmail } from '@/lib/auth/users';

const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockVerifyPassword = verifyPassword as jest.Mock;

describe('auth/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('normalizes email before lookup', async () => {
      mockFindUnique.mockResolvedValue(null);

      await findUserByEmail('  User@Example.COM  ');

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
        include: { customer: true },
      });
    });
  });

  describe('authenticatePortalUser', () => {
    it('returns null when email or password is missing', async () => {
      await expect(authenticatePortalUser({ email: '', password: 'x' })).resolves.toBeNull();
      await expect(authenticatePortalUser({ email: 'a@b.com', password: '' })).resolves.toBeNull();
      expect(mockFindUnique).not.toHaveBeenCalled();
    });

    it('returns null when user is not found', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await authenticatePortalUser({
        email: 'missing@example.com',
        password: 'password123',
      });

      expect(result).toBeNull();
    });

    it('returns null when password is invalid', async () => {
      mockFindUnique.mockResolvedValue({
        id: 'user-1',
        email: 'chipotle@example.com',
        passwordHash: 'hash',
        customer: { slug: 'chipotle', name: 'Chipotle' },
      });
      mockVerifyPassword.mockResolvedValue(false);

      const result = await authenticatePortalUser({
        email: 'chipotle@example.com',
        password: 'wrong',
      });

      expect(result).toBeNull();
    });

    it('returns user with customerSlug from database record', async () => {
      mockFindUnique.mockResolvedValue({
        id: 'user-1',
        email: 'chipotle@example.com',
        passwordHash: 'hash',
        customer: { slug: 'chipotle', name: 'Chipotle' },
      });
      mockVerifyPassword.mockResolvedValue(true);

      const result = await authenticatePortalUser({
        email: 'chipotle@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        id: 'user-1',
        email: 'chipotle@example.com',
        customerSlug: 'chipotle',
        customerName: 'Chipotle',
      });
    });
  });
});
