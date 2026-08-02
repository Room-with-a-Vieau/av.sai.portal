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
  DEMO_TAXONOMY_CHANGE_EVENT,
  DEMO_TAXONOMY_LOGOUT_VALUE,
  DEMO_USER_PERSONAS,
  clearStoredDemoTaxonomy,
  readStoredDemoTaxonomy,
  setStoredDemoTaxonomy,
  type DemoUserTaxonomy,
} from '@/lib/demo-taxonomy';
import {
  identifyDemoPersona,
  resetDemoPersonaAnalyticsSession,
} from '@/lib/demo-analytics-identity';

export function DemoUserSwitcher() {
  const [taxonomy, setTaxonomy] = useState<DemoUserTaxonomy | null>(null);
  const isLoggedIn = Boolean(taxonomy);

  useEffect(() => {
    const syncTaxonomy = () => {
      setTaxonomy(readStoredDemoTaxonomy());
    };

    syncTaxonomy();
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, syncTaxonomy);

    return () => {
      window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, syncTaxonomy);
    };
  }, []);

  const handleValueChange = (value: string) => {
    if (value === DEMO_TAXONOMY_LOGOUT_VALUE) {
      clearStoredDemoTaxonomy();
      setTaxonomy(null);
      void resetDemoPersonaAnalyticsSession();
      return;
    }

    const persona = value as DemoUserTaxonomy;
    setStoredDemoTaxonomy(persona);
    setTaxonomy(persona);
    void identifyDemoPersona(persona, { resetSession: true });
  };

  return (
    <Select value={taxonomy ?? undefined} onValueChange={handleValueChange}>
      <SelectTrigger
        className="h-10 w-[min(100%,18.5rem)]"
        aria-label={isLoggedIn ? 'Demo persona' : 'Login as demo persona'}
      >
        <SelectValue placeholder="Login / Logout" />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[18.5rem]">
        {isLoggedIn && (
          <>
            <SelectItem value={DEMO_TAXONOMY_LOGOUT_VALUE} className="font-medium text-primary">
              Logout
            </SelectItem>
            <SelectSeparator />
          </>
        )}
        {!isLoggedIn && (
          <SelectItem value="__demo_login_hint__" disabled className="text-muted-foreground">
            Login / Logout
          </SelectItem>
        )}
        {DEMO_USER_PERSONAS.map((persona) => (
          <SelectItem key={persona} value={persona}>
            {persona}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
