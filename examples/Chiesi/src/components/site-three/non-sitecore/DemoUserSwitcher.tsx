'use client';

import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DEMO_AUTH_LOGIN_VALUE,
  DEMO_AUTH_LOGOUT_VALUE,
  DEMO_TAXONOMY_CHANGE_EVENT,
  DEMO_TAXONOMY_STORAGE_KEY,
  DEMO_USER_OPTIONS,
  TAXONOMY_TO_PROFILE_KEY,
  dispatchDemoLogout,
  dispatchProfileChange,
} from '@/lib/demo-taxonomy';
import { cn } from '@/lib/utils';

export function DemoUserSwitcher({ triggerClassName }: { triggerClassName?: string } = {}) {
  const [taxonomy, setTaxonomy] = useState('');

  useEffect(() => {
    const readTaxonomy = () => {
      setTaxonomy(window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '');
    };
    readTaxonomy();
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, readTaxonomy);
    return () => window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, readTaxonomy);
  }, []);

  const isAuthenticated = Boolean(taxonomy);

  const handleValueChange = (value: string) => {
    if (value === DEMO_AUTH_LOGOUT_VALUE) {
      setTaxonomy('');
      window.localStorage.removeItem(DEMO_TAXONOMY_STORAGE_KEY);
      dispatchDemoLogout();
      return;
    }

    if (value === DEMO_AUTH_LOGIN_VALUE) {
      return;
    }

    setTaxonomy(value);
    window.localStorage.setItem(DEMO_TAXONOMY_STORAGE_KEY, value);
    window.dispatchEvent(
      new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, {
        detail: { taxonomy: value, authenticated: true },
      })
    );
    const profileKey = TAXONOMY_TO_PROFILE_KEY[value as keyof typeof TAXONOMY_TO_PROFILE_KEY];
    if (profileKey) {
      dispatchProfileChange(profileKey, value as (typeof DEMO_USER_OPTIONS)[number]['taxonomy']);
    }
  };

  return (
    <Select
      value={isAuthenticated ? taxonomy : DEMO_AUTH_LOGIN_VALUE}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={cn('h-10 min-w-[15rem] max-w-[22rem]', triggerClassName)}>
        <SelectValue placeholder="Login" />
      </SelectTrigger>
      <SelectContent align="end" className="z-[100]">
        {isAuthenticated ? (
          <SelectItem value={DEMO_AUTH_LOGOUT_VALUE}>Logout</SelectItem>
        ) : (
          <SelectItem value={DEMO_AUTH_LOGIN_VALUE}>Login</SelectItem>
        )}
        <SelectSeparator />
        {DEMO_USER_OPTIONS.map((user) => (
          <SelectItem key={user.taxonomy} value={user.taxonomy}>
            {user.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
