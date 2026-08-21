import { APP_THEMES, DEFAULT_THEME, isAppTheme, resolveTheme, SITE_SKINS } from '@/lib/theme';

describe('resolveTheme', () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_THEME;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_APP_THEME;
    } else {
      process.env.NEXT_PUBLIC_APP_THEME = originalEnv;
    }
  });

  it('uses explicit skin when it is a registered theme', () => {
    expect(resolveTheme({ site: 'unknown', skin: 'bcbst' })).toBe('bcbst');
  });

  it('has an empty SITE_SKINS map until create-new-theme adds sites', () => {
    expect(Object.keys(SITE_SKINS)).toEqual([]);
  });

  it('falls back to NEXT_PUBLIC_APP_THEME when site has no skin', () => {
    process.env.NEXT_PUBLIC_APP_THEME = 'bcbst';
    expect(resolveTheme({ site: 'alaris' })).toBe('bcbst');
  });

  it('falls back to DEFAULT_THEME', () => {
    delete process.env.NEXT_PUBLIC_APP_THEME;
    expect(resolveTheme({ site: 'alaris' })).toBe(DEFAULT_THEME);
    expect(resolveTheme()).toBe(DEFAULT_THEME);
  });

  it('ignores unknown skin values', () => {
    delete process.env.NEXT_PUBLIC_APP_THEME;
    expect(resolveTheme({ skin: 'not-a-theme', site: 'alaris' })).toBe(DEFAULT_THEME);
  });
});

describe('theme registry', () => {
  it('lists the starter default theme only', () => {
    expect(APP_THEMES).toEqual(['bcbst']);
    expect(isAppTheme('bcbst')).toBe(true);
    expect(isAppTheme('rockland')).toBe(false);
    expect(isAppTheme('nope')).toBe(false);
  });
});
