/**
 * David Weekley Homes buyer personas — shared across Login selector, search personalization, and other DWH components.
 */

export const DWH_BUYER_PERSONAS = [
  { label: 'First-time homebuyers', taxonomy: 'First-time homebuyers' },
  { label: 'Move-up Families', taxonomy: 'Move-up Families' },
  { label: 'Empty Nesters', taxonomy: 'Empty Nesters' },
] as const;

export type DemoUserTaxonomy = (typeof DWH_BUYER_PERSONAS)[number]['taxonomy'];

export const DWH_BUYER_PERSONA_LABELS = DWH_BUYER_PERSONAS.map((persona) => persona.label);

export function parseDemoUserTaxonomy(raw: string | undefined | null): DemoUserTaxonomy | null {
  const value = raw?.trim();
  if (!value) return null;

  const match = DWH_BUYER_PERSONAS.find((persona) => persona.taxonomy === value);
  return match?.taxonomy ?? null;
}
