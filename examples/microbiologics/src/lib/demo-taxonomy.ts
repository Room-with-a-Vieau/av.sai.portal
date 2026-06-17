export const DEMO_TAXONOMY_STORAGE_KEY = 'demo-user-taxonomy';
export const DEMO_TAXONOMY_CHANGE_EVENT = 'demo-taxonomy-change';

/** Dispatched by HeaderST when the login persona changes — consumed by MicroPortal. */
export const PROFILE_CHANGE_EVENT = 'profile-change';

/** Select value when the user is not signed in (HeaderST dropdown). */
export const DEMO_AUTH_LOGIN_VALUE = '__demo-login__';

/** Select value to sign out and return to unauthenticated mode. */
export const DEMO_AUTH_LOGOUT_VALUE = '__demo-logout__';

export const DEMO_USER_TAXONOMIES = [
  'Laboratory Procurement Manager',
  'Distributor Rep',
  'Regulatory Professional',
  'Scientist',
] as const;

export type DemoUserTaxonomy = (typeof DEMO_USER_TAXONOMIES)[number];

/** CDP identity attributes for each demo persona (DemoUserSwitcher). */
export type DemoPersonaIdentity = {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
};

export const DEMO_PERSONA_IDENTITY: Record<DemoUserTaxonomy, DemoPersonaIdentity> = {
  'Laboratory Procurement Manager': {
    firstName: 'Linda',
    lastName: 'Brooks',
    email: 'lbm@geneticslab.com',
    title: 'Laboratory Procurement Manager',
  },
  'Distributor Rep': {
    firstName: 'Daniel',
    lastName: 'Reyes',
    email: 'dre@molecularsupply.com',
    title: 'Distributor Rep',
  },
  'Regulatory Professional': {
    firstName: 'Rebecca',
    lastName: 'Porter',
    email: 'rporter@compliancepartners.com',
    title: 'Regulatory Professional',
  },
  Scientist: {
    firstName: 'Julia',
    lastName: 'Hart',
    email: 'jhart@microbiologic-research.com',
    title: 'Scientist',
  },
};

export function getDemoPersonaIdentity(taxonomy: DemoUserTaxonomy): DemoPersonaIdentity {
  return DEMO_PERSONA_IDENTITY[taxonomy];
}

export const MICRO_PORTAL_PROFILE_KEYS = [
  'laboratory-procurement-manager',
  'distributor-rep',
  'regulatory-professional',
  'scientist',
] as const;

export type MicroPortalProfileKey = (typeof MICRO_PORTAL_PROFILE_KEYS)[number];

export const TAXONOMY_TO_PROFILE_KEY: Record<DemoUserTaxonomy, MicroPortalProfileKey> = {
  'Laboratory Procurement Manager': 'laboratory-procurement-manager',
  'Distributor Rep': 'distributor-rep',
  'Regulatory Professional': 'regulatory-professional',
  Scientist: 'scientist',
};

export const PROFILE_KEY_TO_TAXONOMY: Record<MicroPortalProfileKey, DemoUserTaxonomy> = {
  'laboratory-procurement-manager': 'Laboratory Procurement Manager',
  'distributor-rep': 'Distributor Rep',
  'regulatory-professional': 'Regulatory Professional',
  scientist: 'Scientist',
};

export const DEMO_USER_OPTIONS: { label: string; taxonomy: DemoUserTaxonomy; profileKey: MicroPortalProfileKey }[] = [
  {
    label: 'Laboratory Procurement Manager',
    taxonomy: 'Laboratory Procurement Manager',
    profileKey: 'laboratory-procurement-manager',
  },
  { label: 'Distributor Rep', taxonomy: 'Distributor Rep', profileKey: 'distributor-rep' },
  {
    label: 'Regulatory Professional',
    taxonomy: 'Regulatory Professional',
    profileKey: 'regulatory-professional',
  },
  { label: 'Scientist', taxonomy: 'Scientist', profileKey: 'scientist' },
];

export function parseDemoUserTaxonomy(raw: string | undefined | null): DemoUserTaxonomy | null {
  const t = raw?.trim();
  if (!t) return null;
  return DEMO_USER_TAXONOMIES.find((persona) => persona === t) ?? null;
}

export function taxonomyToProfileKey(raw: string | undefined | null): MicroPortalProfileKey | null {
  const taxonomy = parseDemoUserTaxonomy(raw);
  if (!taxonomy) return null;
  return TAXONOMY_TO_PROFILE_KEY[taxonomy];
}

export function isMicroPortalProfileKey(value: string): value is MicroPortalProfileKey {
  return (MICRO_PORTAL_PROFILE_KEYS as readonly string[]).includes(value);
}

export function dispatchProfileChange(profileKey: MicroPortalProfileKey, taxonomy: DemoUserTaxonomy) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(PROFILE_CHANGE_EVENT, {
      detail: { profileKey, taxonomy, authenticated: true },
    })
  );
}

/** Clears demo auth — SearchResults, MicroPortal, and other listeners return to anonymous mode. */
export function dispatchDemoLogout() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, {
      detail: { taxonomy: '', authenticated: false },
    })
  );
  window.dispatchEvent(
    new CustomEvent(PROFILE_CHANGE_EVENT, {
      detail: { profileKey: null, taxonomy: null, authenticated: false },
    })
  );
}
