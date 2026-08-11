/**
 * Applies `data-theme` on `<html>` for the current Sitecore site.
 *
 * Root layout cannot see `/[site]` params, so we set the attribute here:
 * - Inline script runs before paint (avoids wrong-theme flash)
 * - useEffect keeps the attribute correct on client navigations between sites
 */
'use client';

import { useEffect } from 'react';
import type { AppTheme } from '@/lib/theme';

export function ApplySiteTheme({ theme }: { theme: AppTheme }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute('data-theme',${JSON.stringify(theme)});`,
      }}
    />
  );
}
