import { cookies, headers } from 'next/headers';
import { DEFAULT_THEME, isAppTheme, type AppTheme } from '@/lib/theme';

import './globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

/**
 * Root HTML shell. Nested `[site]/layout.tsx` cannot set `<html>` attributes.
 * Middleware sets `x-app-theme` from the URL/`sc_site`; cookie is a fallback.
 * ApplySiteTheme still updates `document.documentElement` when Sitecore page.siteName differs (Pages editor).
 *
 * Additional Google fonts are added by create-new-theme when a Skin needs them.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerTheme = (await headers()).get('x-app-theme');
  const cookieTheme = (await cookies()).get('app-theme')?.value;
  const theme: AppTheme = isAppTheme(headerTheme)
    ? headerTheme
    : isAppTheme(cookieTheme)
      ? cookieTheme
      : DEFAULT_THEME;

  return (
    <html lang="en" className={inter.variable} data-theme={theme} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://edge-platform.sitecorecloud.io" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
