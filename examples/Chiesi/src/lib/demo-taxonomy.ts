export const DEMO_TAXONOMY_STORAGE_KEY = 'demo-user-taxonomy';
export const DEMO_TAXONOMY_CHANGE_EVENT = 'demo-taxonomy-change';

/** Dispatched by HeaderST when the login persona changes — consumed by MicroPortal. */
export const PROFILE_CHANGE_EVENT = 'profile-change';

/** Select value when the user is not signed in (HeaderST dropdown). */
export const DEMO_AUTH_LOGIN_VALUE = '__demo-login__';

/** Select value to sign out and return to unauthenticated mode. */
export const DEMO_AUTH_LOGOUT_VALUE = '__demo-logout__';

export const DEMO_USER_TAXONOMIES = [
  'Healthcare Professional',
  'Patient Advocate',
  'Caregiver',
  'Rare disease Patient',
] as const;

export type DemoUserTaxonomy = (typeof DEMO_USER_TAXONOMIES)[number];

export const MICRO_PORTAL_PROFILE_KEYS = [
  'healthcare-professional',
  'patient-advocate',
  'caregiver',
  'rare-disease-patient',
] as const;

export type MicroPortalProfileKey = (typeof MICRO_PORTAL_PROFILE_KEYS)[number];

export const TAXONOMY_TO_PROFILE_KEY: Record<DemoUserTaxonomy, MicroPortalProfileKey> = {
  'Healthcare Professional': 'healthcare-professional',
  'Patient Advocate': 'patient-advocate',
  Caregiver: 'caregiver',
  'Rare disease Patient': 'rare-disease-patient',
};

export const PROFILE_KEY_TO_TAXONOMY: Record<MicroPortalProfileKey, DemoUserTaxonomy> = {
  'healthcare-professional': 'Healthcare Professional',
  'patient-advocate': 'Patient Advocate',
  caregiver: 'Caregiver',
  'rare-disease-patient': 'Rare disease Patient',
};

export const DEMO_USER_OPTIONS: {
  label: string;
  taxonomy: DemoUserTaxonomy;
  profileKey: MicroPortalProfileKey;
}[] = [
  {
    label: 'Healthcare Professional',
    taxonomy: 'Healthcare Professional',
    profileKey: 'healthcare-professional',
  },
  { label: 'Patient Advocate', taxonomy: 'Patient Advocate', profileKey: 'patient-advocate' },
  { label: 'Caregiver', taxonomy: 'Caregiver', profileKey: 'caregiver' },
  {
    label: 'Rare disease Patient',
    taxonomy: 'Rare disease Patient',
    profileKey: 'rare-disease-patient',
  },
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
