'use client';

import { useCallback } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { identity } from '@sitecore-content-sdk/events';

import {
  getDemoPersonaIdentity,
  TAXONOMY_TO_PROFILE_KEY,
  type DemoUserTaxonomy,
} from '@/lib/demo-taxonomy';

/**
 * Sends an IDENTITY event to Sitecore CDP when a demo persona is selected in DemoUserSwitcher.
 */
export function useIdentifyDemoPersona() {
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;
  const route = page?.layout?.sitecore?.route;

  return useCallback(
    (taxonomy: DemoUserTaxonomy) => {
      if (process.env.NODE_ENV === 'development' || isEditing || isPreview) return;

      const profile = getDemoPersonaIdentity(taxonomy);
      const profileKey = TAXONOMY_TO_PROFILE_KEY[taxonomy];

      identity({
        channel: 'WEB',
        language: route?.itemLanguage,
        page: route?.name,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        title: profile.title,
        identifiers: [
          { id: profile.email, provider: 'email' },
          { id: profileKey, provider: 'microbiologics-demo' },
        ],
        extensionData: {
          persona: taxonomy,
          profileKey,
          authMethod: 'demo-user-switcher',
        },
      }).catch((e) => console.debug(e));
    },
    [route, isEditing, isPreview],
  );
}
