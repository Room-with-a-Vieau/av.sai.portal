export const DEMO_TAXONOMY_STORAGE_KEY = 'demo-user-taxonomy';
export const DEMO_TAXONOMY_CHANGE_EVENT = 'demo-taxonomy-change';

export const DEMO_USER_TAXONOMIES = [
  'Laboratory Procurement Manager',
  'Distributor Rep',
  'Regulatory Professional',
  'Scientist',
] as const;

export type DemoUserTaxonomy = (typeof DEMO_USER_TAXONOMIES)[number];

export const DEMO_USER_OPTIONS: { label: string; taxonomy: DemoUserTaxonomy }[] = [
  { label: 'Laboratory Procurement Manager', taxonomy: 'Laboratory Procurement Manager' },
  { label: 'Distributor Rep', taxonomy: 'Distributor Rep' },
  { label: 'Regulatory Professional', taxonomy: 'Regulatory Professional' },
  { label: 'Scientist', taxonomy: 'Scientist' },
];

export function parseDemoUserTaxonomy(raw: string | undefined | null): DemoUserTaxonomy | null {
  const t = raw?.trim();
  if (!t) return null;
  return DEMO_USER_TAXONOMIES.find((persona) => persona === t) ?? null;
}
