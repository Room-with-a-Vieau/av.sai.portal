import { resolveLinkFieldHref } from '@/lib/auth/link-field';
import {
  isSafeInternalPath,
  resolvePostLoginRedirect,
  resolvePostLogoutRedirect,
} from '@/lib/auth-redirect';

describe('auth-redirect', () => {
  it('rejects unsafe redirect targets', () => {
    expect(isSafeInternalPath('/ok')).toBe(true);
    expect(isSafeInternalPath('//evil.com')).toBe(false);
    expect(isSafeInternalPath('https://evil.com')).toBe(false);
    expect(isSafeInternalPath('/x\\y')).toBe(false);
  });

  it('prefers query string over params for login', () => {
    const sp = new URLSearchParams();
    sp.set('callbackUrl', '/after-login');
    expect(resolvePostLoginRedirect(sp, '/from-param')).toBe('/after-login');
  });

  it('prefers datasource link over rendering param for login', () => {
    expect(resolvePostLoginRedirect(new URLSearchParams(), '/from-param', '/from-link')).toBe(
      '/from-link',
    );
  });

  it('falls back to param then default for login', () => {
    expect(resolvePostLoginRedirect(new URLSearchParams(), '/from-param')).toBe('/from-param');
    expect(resolvePostLoginRedirect(new URLSearchParams())).toBe('/');
  });

  it('prefers post_logout_redirect for logout', () => {
    const sp = new URLSearchParams();
    sp.set('post_logout_redirect', '/bye');
    expect(resolvePostLogoutRedirect(sp, '/param')).toBe('/bye');
  });
});

describe('resolveLinkFieldHref', () => {
  it('returns safe internal paths from General Link fields', () => {
    expect(
      resolveLinkFieldHref({
        value: { href: '/portal/dashboard', text: 'Dashboard', linktype: 'internal' },
      }),
    ).toBe('/portal/dashboard');
  });

  it('rejects external links', () => {
    expect(
      resolveLinkFieldHref({
        value: { href: 'https://example.com', text: 'External', linktype: 'external' },
      }),
    ).toBeUndefined();
  });
});
