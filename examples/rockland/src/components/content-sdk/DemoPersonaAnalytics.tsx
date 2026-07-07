'use client';

import { useEffect, JSX } from 'react';

import {
  DEMO_TAXONOMY_CHANGE_EVENT,
  parseDemoUserTaxonomy,
  readStoredDemoTaxonomy,
} from '@/lib/demo-taxonomy';
import {
  identifyDemoPersona,
  isDemoAnalyticsEnabled,
  resetDemoPersonaAnalyticsSession,
} from '@/lib/demo-analytics-identity';

/**
 * Keeps demo persona selection in sync with Sitecore analytics identity.
 * Logout and persona changes request a fresh profileId before sending IDENTITY events.
 */
const DemoPersonaAnalytics = (): JSX.Element => {
  useEffect(() => {
    if (!isDemoAnalyticsEnabled()) return;

    let active = true;

    const handleTaxonomyChange = (event: Event) => {
      const detail = (event as CustomEvent<{ taxonomy?: string }>).detail;
      const taxonomy = detail?.taxonomy?.trim();

      if (!taxonomy) {
        void resetDemoPersonaAnalyticsSession();
        return;
      }

      const persona = parseDemoUserTaxonomy(taxonomy);
      if (persona) {
        void identifyDemoPersona(persona, { resetSession: true });
      }
    };

    const syncStoredPersona = async () => {
      const storedPersona = readStoredDemoTaxonomy();
      if (!storedPersona || !active) return;

      await identifyDemoPersona(storedPersona, { resetSession: false });
    };

    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, handleTaxonomyChange);
    void syncStoredPersona();

    return () => {
      active = false;
      window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, handleTaxonomyChange);
    };
  }, []);

  return <></>;
};

export default DemoPersonaAnalytics;
