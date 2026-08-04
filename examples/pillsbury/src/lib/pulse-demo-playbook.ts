import type { PulseSource, PulseStateCode } from '@/lib/pulse-types';

/**
 * Curated Pulse demo intents so key SE questions always cite real Knowledge Articles
 * plus FL/NC Shared Content — even when Edge Search indexing lags.
 */

export type PulseDemoIntentId = 'personal-auto-fnol' | 'homeowners-water-damage';

type StateChunk = {
  id: string;
  title: string;
  path: string;
  excerpt: string;
};

type PulseDemoIntent = {
  id: PulseDemoIntentId;
  /** All keywords must appear somewhere in the normalized question (OR groups via nested arrays). */
  matchAny: string[][];
  article: Omit<PulseSource, 'score'>;
  sharedByState: Partial<Record<PulseStateCode, StateChunk>>;
};

const INTENTS: PulseDemoIntent[] = [
  {
    id: 'personal-auto-fnol',
    matchAny: [
      ['fnol'],
      ['first', 'notice'],
      ['personal', 'auto', 'intake'],
      ['auto', 'intake'],
      ['florida', 'north', 'carolina', 'auto'],
      ['requirements', 'auto'],
    ],
    article: {
      id: '{8134326F-FF16-4B77-8D34-9EDB10353DA1}',
      title: 'Personal Auto FNOL — First Notice of Loss Intake',
      url: '/Knowledge-Articles/PersonalLines/Auto/KB-AU-1001-FNOL',
      path: '/sitecore/content/progressive/pkm/Home/Knowledge Articles/PersonalLines/Auto/KB-AU-1001-FNOL',
      excerpt:
        'Guide Progressive Claims Advisors through accurate, complete Personal Auto FNOL so the claim is set up correctly the first time.',
      type: 'knowledge-article',
    },
    sharedByState: {
      FL: {
        id: '{69F3074A-AC8C-407E-B9FF-3BD55F1FB742}',
        title: 'KB-AU-1001-FNOL-FL (Claims Timelines)',
        path: '/sitecore/content/progressive/pkm/Home/Shared Content/07-ClaimsTimelines/StateSpecific/FL/KB-AU-1001-FNOL-FL',
        excerpt:
          'In Florida, complete Personal Auto FNOL the same calendar day whenever the loss is reported before Progressive late-day cutoff, and note the report time in Eastern Time. If a Florida Traffic Crash Report is pending, schedule the follow-up within 24 hours.',
      },
      NC: {
        id: '{6D5FB648-7873-4E75-AA4F-82CD1A07A640}',
        title: 'KB-AU-1001-FNOL-NC (Regulatory & Compliance)',
        path: '/sitecore/content/progressive/pkm/Home/Shared Content/08-RegulatoryAndCompliance/StateSpecific/NC/KB-AU-1001-FNOL-NC',
        excerpt:
          'For North Carolina Auto FNOL, capture loss date/time, operator identity, injury indicators, and police report status consistently. Avoid improvised coverage or liability statements at intake.',
      },
    },
  },
  {
    id: 'homeowners-water-damage',
    matchAny: [
      ['water', 'damage'],
      ['water', 'mitigation'],
      ['homeowners', 'water'],
      ['homeowner', 'water'],
      ['licensed', 'state', 'water'],
      ['handle', 'water'],
    ],
    article: {
      id: '{8EB3B901-6561-463B-B09B-012F7EB4FC2D}',
      title: 'Homeowners Water Damage — Intake to Mitigation',
      url: '/Knowledge-Articles/PersonalLines/Homeowners/KB-HO-1001-WaterDamage',
      path: '/sitecore/content/progressive/pkm/Home/Knowledge Articles/PersonalLines/Homeowners/KB-HO-1001-WaterDamage',
      excerpt:
        'Equip Progressive Claims Advisors to handle Personal Home water damage claims with accurate intake, rapid mitigation, and clear coverage framing.',
      type: 'knowledge-article',
    },
    sharedByState: {
      FL: {
        id: '{814F9F31-DC06-4BD7-ADBD-DFE5C0B16B95}',
        title: 'KB-HO-1001-WaterDamage-FL (Claims Timelines)',
        path: '/sitecore/content/progressive/pkm/Home/Shared Content/07-ClaimsTimelines/StateSpecific/FL/KB-HO-1001-WaterDamage-FL',
        excerpt:
          'For Florida water damage claims, authorize emergency mitigation the same day when materials remain wet, and document discovery versus occurrence times carefully for hurricane and tropical-storm windows.',
      },
      NC: {
        id: '{A843C525-812F-4194-A791-437478987E58}',
        title: 'KB-HO-1001-WaterDamage-NC (Regulatory & Compliance)',
        path: '/sitecore/content/progressive/pkm/Home/Shared Content/08-RegulatoryAndCompliance/StateSpecific/NC/KB-HO-1001-WaterDamage-NC',
        excerpt:
          'In North Carolina water claims, distinguish sudden or accidental discharge from flood and long-term seepage before confirming Homeowners coverage. When flood indicators exist, direct the customer to the flood path.',
      },
    },
  },
];

function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchPulseDemoIntent(question: string): PulseDemoIntent | null {
  const normalized = normalizeQuestion(question);
  if (!normalized) return null;

  // Prefer more specific multi-token groups by scoring match group length
  let best: PulseDemoIntent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    for (const group of intent.matchAny) {
      if (group.every((token) => normalized.includes(token))) {
        const score = group.length;
        if (score > bestScore) {
          best = intent;
          bestScore = score;
        }
      }
    }
  }

  return best;
}

/**
 * Build high-confidence sources for a matched demo intent.
 * Knowledge Article is always first; state Shared Content is second when persona is set.
 * Shared Content cards link to the Knowledge Article page (where VariantContent renders).
 */
export function buildDemoPlaybookSources(
  question: string,
  stateCode?: PulseStateCode | null
): PulseSource[] {
  const intent = matchPulseDemoIntent(question);
  if (!intent) return [];

  const sources: PulseSource[] = [
    {
      ...intent.article,
      score: 1000,
    },
  ];

  if (stateCode && intent.sharedByState[stateCode]) {
    const chunk = intent.sharedByState[stateCode]!;
    sources.push({
      id: chunk.id,
      title: chunk.title,
      // Cite the Knowledge Article page — Shared Content renders there via VariantContent
      url: intent.article.url,
      path: chunk.path,
      excerpt: chunk.excerpt,
      type: 'shared-content',
      stateCode,
      score: 900,
    });
  } else {
    // Nationwide: include both FL and NC shared excerpts as citations (still link to KA)
    for (const code of ['FL', 'NC'] as PulseStateCode[]) {
      const chunk = intent.sharedByState[code];
      if (!chunk) continue;
      sources.push({
        id: chunk.id,
        title: chunk.title,
        url: intent.article.url,
        path: chunk.path,
        excerpt: chunk.excerpt,
        type: 'shared-content',
        stateCode: code,
        score: 800,
      });
    }
  }

  return sources;
}

/** Starter prompts shown in the Pulse empty state (aligned with demo intents). */
export const PULSE_DEMO_STARTER_PROMPTS = [
  'What are the Florida or North Carolina requirements for Personal Auto FNOL intake?',
  'How should I handle homeowners water damage mitigation for my licensed state?',
  'Who covers commercial auto products?',
] as const;
