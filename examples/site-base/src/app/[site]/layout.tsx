import Bootstrap from 'src/Bootstrap';
import { ApplySiteTheme } from '@/components/theme/ApplySiteTheme';
import { resolveTheme } from '@/lib/theme';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const theme = resolveTheme({ site });

  return (
    <>
      <ApplySiteTheme theme={theme} />
      <Bootstrap siteName={site} />
      {children}
    </>
  );
}
