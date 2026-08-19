'use client';

import type React from 'react';
import { useCallback, useMemo } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link as ContentSdkLink, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { User } from 'lucide-react';
import { resolvePostLogoutRedirect } from '@/lib/auth-redirect';
import { cn } from '@/lib/utils';

const utilityLinkClass =
  'block p-4 font-[family-name:var(--font-body)] text-foreground font-normal hover:text-primary';

type HeaderSTAuthControlsProps = {
  loginLink?: LinkField;
  postLogoutRedirect?: string;
  className?: string;
};

function hasLinkHref(field?: LinkField): boolean {
  return Boolean(field?.value?.href?.trim());
}

function getSessionDisplayName(user: { name?: string | null; email?: string | null }): string {
  const name = user.name?.trim();
  if (name) {
    return name;
  }
  return user.email?.trim() ?? 'Account';
}

export const HeaderSTAuthControls: React.FC<HeaderSTAuthControlsProps> = ({
  loginLink,
  postLogoutRedirect,
  className,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { page } = useSitecore();

  const postLogoutTarget = useMemo(
    () => resolvePostLogoutRedirect(searchParams, postLogoutRedirect),
    [postLogoutRedirect, searchParams],
  );

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push(postLogoutTarget);
    router.refresh();
  }, [postLogoutTarget, router]);

  if (status === 'loading') {
    return (
      <li className={cn('hidden lg:block', className)} aria-hidden="true">
        <span className="block p-4 text-sm text-muted-foreground">…</span>
      </li>
    );
  }

  const isAuthenticated = status === 'authenticated' && session?.user;
  const showLoginLink = hasLinkHref(loginLink) && !isAuthenticated;

  if (page.mode.isEditing && !isAuthenticated && loginLink && hasLinkHref(loginLink)) {
    return (
      <li className={cn('hidden lg:block', className)}>
        <ContentSdkLink field={loginLink} prefetch={false} className={utilityLinkClass}>
          <User className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">{loginLink?.value?.text || 'Login'}</span>
        </ContentSdkLink>
      </li>
    );
  }

  if (isAuthenticated) {
    const displayName = getSessionDisplayName(session.user);

    return (
      <li className={cn('hidden items-center gap-2 lg:flex', className)}>
        <span className="max-w-[12rem] truncate px-2 text-sm font-medium text-foreground" title={displayName}>
          {displayName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(utilityLinkClass, 'text-sm')}
        >
          Log out
        </button>
      </li>
    );
  }

  if (!showLoginLink || !loginLink) {
    return null;
  }

  return (
    <li className={cn('hidden lg:block', className)}>
      <ContentSdkLink field={loginLink} prefetch={false} className={utilityLinkClass}>
        <User className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">{loginLink?.value?.text || 'Login'}</span>
      </ContentSdkLink>
    </li>
  );
};

export function useHeaderSTNavigationVisibility(requireAuthForNav: boolean): boolean {
  const { data: session, status } = useSession();
  const { page } = useSitecore();

  if (!requireAuthForNav) {
    return true;
  }

  if (page.mode.isEditing) {
    return true;
  }

  if (status === 'loading') {
    return false;
  }

  return status === 'authenticated' && Boolean(session?.user);
}
