/**
 * Compatibility shim — prefer `@/lib/pulse-packs` for new code.
 */
import {
  getPulsePack,
  getPulseStarterPrompts,
  matchPulseIntentForSite,
} from '@/lib/pulse-packs';
import type { PulseSource } from '@/lib/pulse-types';

export function matchPulseDemoIntent(question: string, siteName?: string | null) {
  return matchPulseIntentForSite(question, siteName);
}

/**
 * Build high-confidence sources for a matched demo intent.
 * Prefer Edge hydration via retrievePulseSources; this path uses citationFallbacks only.
 */
export function buildDemoPlaybookSources(question: string, siteName?: string | null): PulseSource[] {
  const intent = matchPulseIntentForSite(question, siteName);
  if (!intent) return [];

  const pack = getPulsePack(siteName);
  const fallbacks = pack.citationFallbacks || {};

  return intent.citationItemIds
    .map((id, index) => {
      const fallback = fallbacks[id] || fallbacks[id.toUpperCase()];
      if (!fallback) return null;
      return { ...fallback, id, score: 1000 - index * 50 } as PulseSource;
    })
    .filter((s): s is PulseSource => Boolean(s));
}

export const PULSE_DEMO_STARTER_PROMPTS = getPulseStarterPrompts();
