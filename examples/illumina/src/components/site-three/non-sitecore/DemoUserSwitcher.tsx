'use client';

import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEMO_USER_PERSONAS } from '@/lib/demo-user-personas';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';
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
  };

  return (
    <Select value={taxonomy || undefined} onValueChange={handleValueChange}>
      <SelectTrigger className={cn('h-10 w-[min(100%,22rem)] min-w-[16rem]', triggerClassName)}>
        <SelectValue placeholder="Login" />
      </SelectTrigger>
      <SelectContent align="end" className="z-[100]">
        {DEMO_USER_PERSONAS.map((persona) => (
          <SelectItem key={persona.taxonomy} value={persona.taxonomy}>
            {persona.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
