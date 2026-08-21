import { DEFAULT_PULSE_PACK } from './default';
import { matchPulsePackIntent } from './match';
import type { MatchedPulseIntent, PulseSitePack } from './types';

export type { MatchedPulseIntent, PulsePackIntent, PulseSitePack, PulseTypeLabels } from './types';
export { matchPulsePackIntent, normalizePulseQuestion } from './match';
export { DEFAULT_PULSE_PACK } from './default';

/** Registry of Pulse site packs. Add a new demo site = new pack file + entry here. */
export const PULSE_SITE_PACKS: Readonly<Record<string, PulseSitePack>> = {};

export function normalizePulseSiteName(siteName?: string | null): string {
  return (siteName || '').toLowerCase().trim();
}

/**
 * Resolve a Pulse pack for the current site.
 * Falls back to NEXT_PUBLIC_DEFAULT_SITE_NAME, then the empty default pack.
 */
export function getPulsePack(siteName?: string | null): PulseSitePack {
  const key = normalizePulseSiteName(siteName);
  if (key && PULSE_SITE_PACKS[key]) return PULSE_SITE_PACKS[key];

  const envDefault = normalizePulseSiteName(process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME);
  if (envDefault && PULSE_SITE_PACKS[envDefault]) return PULSE_SITE_PACKS[envDefault];

  return DEFAULT_PULSE_PACK;
}

export function listPulsePackSiteNames(): string[] {
  return Object.keys(PULSE_SITE_PACKS);
}

export function getPulseStarterPrompts(siteName?: string | null): readonly string[] {
  return getPulsePack(siteName).starterPrompts;
}

export function matchPulseIntentForSite(
  question: string,
  siteName?: string | null
): MatchedPulseIntent | null {
  return matchPulsePackIntent(question, getPulsePack(siteName));
}
