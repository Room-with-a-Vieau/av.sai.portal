import type { PulseSource, PulseStateCode } from '@/lib/pulse-types';

/**
 * Curated Pulse demo intents for the Pillsbury Law visitor demo.
 * These scenarios are intentionally hard to solve with keyword search alone —
 * they need multi-criteria matching (practice + industry + geography + situation).
 */

export type PulseDemoIntentId =
  | 'japan-us-tech-acquisition'
  | 'distressed-portfolio-company'
  | 'mena-trade-sanctions'
  | 'insurance-construction-dispute';

type PulseDemoIntent = {
  id: PulseDemoIntentId;
  /** All tokens in a group must appear in the normalized question; any matching group wins. */
  matchAny: string[][];
  /** Ordered citations (highest confidence first). */
  sources: Omit<PulseSource, 'score'>[];
};

const INTENTS: PulseDemoIntent[] = [
  {
    id: 'japan-us-tech-acquisition',
    matchAny: [
      ['japanese', 'acqui'],
      ['japan', 'us', 'tech'],
      ['japan', 'intellectual'],
      ['japan', 'patent'],
      ['cross', 'border', 'japan'],
      ['japanese', 'company'],
      ['japan', 'practice'],
    ],
    sources: [
      {
        id: '{4CF3E8A1-73B9-444F-9CBE-3E1F18A2D5D9}',
        title: 'Shinya Akiyama — Corporate / Japan Practice',
        url: '/Lawyers/Bios/Shinya-Akiyama',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Shinya-Akiyama',
        excerpt:
          'Corporate partner and Japan Practice co-leader who counsels Japanese companies on starting, acquiring, and managing U.S. businesses.',
        type: 'people-and-teams',
      },
      {
        id: '{3359606E-DFEC-4297-910F-7F15D0540066}',
        title: 'Mark Abate — Intellectual Property',
        url: '/Lawyers/Bios/Mark-Abate',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Mark-Abate',
        excerpt:
          'Leading IP trial lawyer recognized for patent litigation strategy and technical mastery — a natural second seat when a tech deal carries IP risk.',
        type: 'people-and-teams',
      },
      {
        id: '{ED34EB16-C784-43E5-BE3C-FBFC6697B205}',
        title: 'Ranjini Acharya — Intellectual Property',
        url: '/Lawyers/Bios/Ranjini-Acharya',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Ranjini-Acharya',
        excerpt:
          'Silicon Valley IP partner covering patents, trade secrets, trademarks, and copyright enforcement across complex technology matters.',
        type: 'people-and-teams',
      },
    ],
  },
  {
    id: 'distressed-portfolio-company',
    matchAny: [
      ['distress'],
      ['insolvency'],
      ['restructur'],
      ['bankrupt'],
      ['creditor'],
      ['portfolio', 'company', 'trouble'],
      ['financial', 'distress'],
    ],
    sources: [
      {
        id: '{2F243F36-C6AC-477C-9577-67AB86B05306}',
        title: 'Andrew V. Alfano — Insolvency & Restructuring',
        url: '/Lawyers/Bios/Andrew-V-Alfano',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Andrew-V-Alfano',
        excerpt:
          'Advises distressed companies, investors, and creditors through complex restructurings across industries including energy, aviation, and EVs.',
        type: 'people-and-teams',
      },
      {
        id: '{30D08BD7-7D13-4B0F-A8F4-E362FB8E01FD}',
        title: 'Semma G. Arzapalo — Funds / Corporate',
        url: '/Lawyers/Bios/Semma-G-Arzapalo',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Semma-G-Arzapalo',
        excerpt:
          'Global Funds practice leader representing institutional investors through private equity commitments — useful when LPs need coordinated counsel on a troubled portfolio company.',
        type: 'people-and-teams',
      },
    ],
  },
  {
    id: 'mena-trade-sanctions',
    matchAny: [
      ['sanction'],
      ['export', 'control'],
      ['international', 'trade'],
      ['national', 'security', 'trade'],
      ['middle', 'east'],
      ['saudi'],
      ['qatar'],
      ['mena'],
      ['riyadh'],
      ['doha'],
    ],
    sources: [
      {
        id: '{8306EB6F-3AA2-474A-ABF0-CD35B805CE6E}',
        title: 'Ata A. Akiner — International Trade',
        url: '/Lawyers/Bios/Ata-A-Akiner',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Ata-A-Akiner',
        excerpt:
          'Helps global and U.S. clients navigate complex international trade, regulatory, and national-security matters from Washington, DC.',
        type: 'people-and-teams',
      },
      {
        id: '{4746BD74-AC63-4ED2-8B86-A2CE1B2BA178}',
        title: 'Osama Abu-Dehays — Corporate (Doha / London)',
        url: '/Lawyers/Bios/Osama-Abu-Dehays',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Osama-Abu-Dehays',
        excerpt:
          'Corporate partner known across MENA for commercial, technology, media, and telecommunications matters — strong local counterpart for regional expansion.',
        type: 'people-and-teams',
      },
      {
        id: '{A17985F3-2812-4721-8928-6B4381768660}',
        title: 'Khalid A. AlArfaj — Corporate (Riyadh)',
        url: '/Lawyers/Bios/Khalid-A-AlArfaj',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Khalid-A-AlArfaj',
        excerpt:
          'Advises national and international clients on complex corporate and commercial matters across Saudi Arabia and the United States.',
        type: 'people-and-teams',
      },
    ],
  },
  {
    id: 'insurance-construction-dispute',
    matchAny: [
      ['insurance', 'recover'],
      ['insurance', 'coverage'],
      ['construction', 'insurance'],
      ['construction', 'claim'],
      ['carrier', 'dispute'],
      ['risk', 'management', 'insurance'],
      ['coverage', 'fight'],
    ],
    sources: [
      {
        id: '{A65B716C-C64E-4F83-AC29-5BA7FAD8B503}',
        title: 'Stephen S. Asay — Insurance Recovery & Advisory',
        url: '/Lawyers/Bios/Stephen-S-Asay',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Stephen-S-Asay',
        excerpt:
          'Advises on proactive risk management and complex commercial litigation involving insurance coverage and construction claims from Washington, DC.',
        type: 'people-and-teams',
      },
      {
        id: '{3FACDBC5-B0E5-472F-9ED5-C16EC268C75C}',
        title: 'Jennifer Altman — Litigation (Miami)',
        url: '/Lawyers/Bios/Jennifer-Altman',
        path: '/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Jennifer-Altman',
        excerpt:
          'Miami managing partner and Chambers-recognized commercial litigator with deep trial and arbitration experience when a coverage dispute becomes hard-fought litigation.',
        type: 'people-and-teams',
      },
    ],
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
 * `stateCode` is retained for API compatibility with the Pulse ask route;
 * Pillsbury visitor demos do not layer state Shared Content.
 */
export function buildDemoPlaybookSources(
  question: string,
  _stateCode?: PulseStateCode | null
): PulseSource[] {
  const intent = matchPulseDemoIntent(question);
  if (!intent) return [];

  return intent.sources.map((source, index) => ({
    ...source,
    score: 1000 - index * 50,
  }));
}

/**
 * Starter prompts shown in the Pulse empty state.
 * Each maps to a demo intent and is phrased as a visitor would ask — not as a keyword search.
 */
export const PULSE_DEMO_STARTER_PROMPTS = [
  'A Japanese company is buying a U.S. tech business — who should lead, and who covers the IP risk?',
  'One of our portfolio companies is in financial distress. Who should we talk to?',
  "We're expanding into Saudi Arabia and have export-control questions. Who can help?",
  'Our construction project is in a coverage fight with the carrier — who handles insurance recovery?',
] as const;
