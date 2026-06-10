/**
 * Illumina user personas — shared across HeaderST login selector, search personalization, and related demo flows.
 */

export const ILLUMINA_USER_PERSONAS = [
  { label: 'Academic/Research Lab Scientists', taxonomy: 'Academic/Research Lab Scientists' },
  { label: 'Clinical Lab Directors', taxonomy: 'Clinical Lab Directors' },
  { label: 'Molecular Pathologists', taxonomy: 'Molecular Pathologists' },
  { label: 'Lab Directors', taxonomy: 'Lab Directors' },
  { label: 'Operations Managers', taxonomy: 'Operations Managers' },
  { label: 'Procurement', taxonomy: 'Procurement' },
] as const;

export type IlluminaUserTaxonomy = (typeof ILLUMINA_USER_PERSONAS)[number]['taxonomy'];

export const ILLUMINA_USER_PERSONA_LABELS = ILLUMINA_USER_PERSONAS.map((persona) => persona.label);

export function parseIlluminaUserTaxonomy(raw: string | undefined | null): IlluminaUserTaxonomy | null {
  const value = raw?.trim();
  if (!value) return null;

  const match = ILLUMINA_USER_PERSONAS.find((persona) => persona.taxonomy === value);
  return match?.taxonomy ?? null;
}
