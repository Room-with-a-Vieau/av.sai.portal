'use client';

import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DEMO_TAXONOMY_CHANGE_EVENT,
  DEMO_TAXONOMY_STORAGE_KEY,
  DEMO_USER_OPTIONS,
  TAXONOMY_TO_PROFILE_KEY,
  dispatchProfileChange,
} from '@/lib/demo-taxonomy';
import { cn } from '@/lib/utils';

export function DemoUserSwitcher({ triggerClassName }: { triggerClassName?: string } = {}) {
  const [taxonomy, setTaxonomy] = useState('');

  useEffect(() => {
    const storedTaxonomy = window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '';
    setTaxonomy(storedTaxonomy);
  }, []);

  const handleValueChange = (value: string) => {
    setTaxonomy(value);
    window.localStorage.setItem(DEMO_TAXONOMY_STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, { detail: { taxonomy: value } }));
    const profileKey = TAXONOMY_TO_PROFILE_KEY[value as keyof typeof TAXONOMY_TO_PROFILE_KEY];
    if (profileKey) {
      dispatchProfileChange(profileKey, value as (typeof DEMO_USER_OPTIONS)[number]['taxonomy']);
    }
  };

  return (
    <Select value={taxonomy || undefined} onValueChange={handleValueChange}>
      <SelectTrigger className={cn('h-10 min-w-[15rem] max-w-[22rem]', triggerClassName)}>
        <SelectValue placeholder="Login" />
      </SelectTrigger>
      <SelectContent align="end" className="z-[100]">
        {DEMO_USER_OPTIONS.map((user) => (
          <SelectItem key={user.taxonomy} value={user.taxonomy}>
            {user.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
