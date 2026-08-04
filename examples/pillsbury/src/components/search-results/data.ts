/**
 * Mock Knowledge Article search catalog for Progressive PKM (insurance agents).
 * Data only — UI lives in SearchResults.tsx.
 * Every result href points at a Knowledge Article route.
 */

import {
  type DemoUserTaxonomy,
  getPersonaCode,
  parseDemoUserTaxonomy,
} from '@/lib/demo-taxonomy';

export type { DemoUserTaxonomy };
export { parseDemoUserTaxonomy };

/** Line of business facet (aligned with KA LOB taxonomy) */
export type SearchLob =
  | 'personalAuto'
  | 'personalHome'
  | 'commercialAuto'
  | 'commercialProperty';

/** Peril / loss-type facet */
export type SearchPeril =
  | 'fnolIntake'
  | 'coverage'
  | 'waterDamage'
  | 'windHail'
  | 'fireSmoke'
  | 'theft'
  | 'glass'
  | 'umUim'
  | 'liability'
  | 'businessInterruption';

/** Claim-stage / topic facet for agent workflows */
export type SearchTopic =
  | 'intake'
  | 'coverageDetermination'
  | 'mitigation'
  | 'stormHandling'
  | 'documentation'
  | 'recovery';

/** Keyword buckets for curated natural-language / Q&A searches */
export type SearchBucket =
  | 'fnol'
  | 'auto'
  | 'homeowners'
  | 'water'
  | 'wind'
  | 'glass'
  | 'umuim'
  | 'commercial'
  | 'fire'
  | 'theft'
  | 'coverage';

export type SearchResultItem = {
  id: string;
  kbId: string;
  title: string;
  description: string;
  /** Always a Knowledge Article path under /Knowledge-Articles/... (Edge url.path) */
  href: string;
  lob: SearchLob;
  perils: SearchPeril[];
  topics: SearchTopic[];
  searchBuckets: SearchBucket[];
  dateLabel?: string;
  breadcrumb?: string[];
  matchTerms?: string[];
  isNew?: boolean;
  demoUserTaxonomy?: DemoUserTaxonomy;
  visibleForDemoUsers?: DemoUserTaxonomy[];
};

export type AiCitation = {
  title: string;
  href: string;
  kbId?: string;
  excerpt?: string;
};

/** Pulse-style Q&A block shown above Knowledge Article results */
export type AiSearchInsight = {
  id: string;
  /** User question or search phrase echoed back */
  question: string;
  /** Short label above the answer */
  headline: string;
  /** Prose answer (mimics Ask Pulse) */
  answer: string;
  bullets: string[];
  citations: AiCitation[];
  stateCallout?: string | null;
  learnMoreHref: string;
  learnMoreLabel?: string;
};

/** Matches Experience Edge `url.path` for Knowledge Article pages (hyphenated segment). */
export const KA_BASE = '/Knowledge-Articles';

export const RESULTS_PAGE_SIZE = 8;

export const searchFacetLabels = {
  lob: {
    personalAuto: 'Personal Auto',
    personalHome: 'Homeowners',
    commercialAuto: 'Commercial Auto',
    commercialProperty: 'Commercial Property',
  },
  peril: {
    fnolIntake: 'FNOL / first notice',
    coverage: 'Coverage determination',
    waterDamage: 'Water damage',
    windHail: 'Wind & hail',
    fireSmoke: 'Fire & smoke',
    theft: 'Theft / burglary',
    glass: 'Glass / ADAS',
    umUim: 'UM / UIM',
    liability: 'Liability triage',
    businessInterruption: 'Business interruption',
  },
  topic: {
    intake: 'Intake',
    coverageDetermination: 'Coverage',
    mitigation: 'Mitigation',
    stormHandling: 'Storm handling',
    documentation: 'Documentation',
    recovery: 'Recovery / total loss',
  },
} as const;

export const popularSearches = [
  'Personal Auto FNOL Florida requirements',
  'Homeowners water damage mitigation',
  'UM UIM intake North Carolina',
  'Wind hail storm documentation',
  'Commercial Auto FNOL',
];

export const QUERY_BUCKET_SYNONYMS: Record<SearchBucket, readonly string[]> = {
  fnol: ['fnol', 'first notice', 'first notice of loss', 'intake', 'new claim', 'report a loss'],
  auto: ['auto', 'vehicle', 'car', 'personal auto', 'motorist', 'adas'],
  homeowners: ['homeowners', 'homeowner', 'ho ', ' dwelling', 'property home', 'house'],
  water: ['water', 'flood', 'leak', 'mitigation', 'sprinkler', 'moisture'],
  wind: ['wind', 'hail', 'storm', 'hurricane', 'fallen tree', 'roof'],
  glass: ['glass', 'windshield', 'adas calibration', 'chip'],
  umuim: ['um', 'uim', 'uninsured', 'underinsured', 'um/uim'],
  commercial: ['commercial', 'business', 'fleet', 'hired', 'non-owned', 'cargo', 'tools'],
  fire: ['fire', 'smoke', 'kitchen fire', 'burn'],
  theft: ['theft', 'stolen', 'burglary', 'break-in', 'recovery'],
  coverage: ['coverage', 'determine coverage', 'covered', 'exclusion', 'policy'],
};

const QUERY_STOP_WORDS = new Set([
  'and',
  'or',
  'the',
  'for',
  'with',
  'from',
  'your',
  'our',
  'are',
  'you',
  'how',
  'what',
  'should',
  'does',
  'about',
  'my',
  'a',
  'an',
  'in',
  'to',
  'of',
]);

function kaHref(folder: string, slug: string): string {
  return `${KA_BASE}/${folder}/${slug}`;
}

/**
 * Build a public href from an Edge Knowledge Article node (same rules as KnowledgeListing).
 * Prefer Edge `url.path` so search always deep-links to a real published article.
 */
export function knowledgeArticleHrefFromEdge(item: {
  url?: string | { path?: string } | null;
  path?: string | null;
  name?: string | null;
}): string | null {
  if (typeof item.url === 'string' && item.url.trim()) {
    const u = item.url.trim();
    return u.startsWith('/') ? u : `/${u}`;
  }
  if (item.url && typeof item.url === 'object' && item.url.path?.trim()) {
    const u = item.url.path.trim();
    return u.startsWith('/') ? u : `/${u}`;
  }
  if (item.path) {
    const marker = '/Home';
    const idx = item.path.indexOf(marker);
    if (idx >= 0) {
      const rest = item.path.slice(idx + marker.length).replace(/\s+/g, '-');
      return rest.startsWith('/') ? rest : `/${rest}`;
    }
  }
  return null;
}

function readEdgeFieldString(field: unknown): string {
  if (!field) return '';
  if (typeof field === 'string') return field.trim();
  if (typeof field === 'object' && field !== null) {
    const f = field as { jsonValue?: { value?: unknown }; value?: unknown };
    const v = f.jsonValue?.value ?? f.value;
    if (typeof v === 'string') return v.trim();
  }
  return '';
}

/**
 * Map Edge listing payload → kbId / item name → real public href.
 */
export function buildKnowledgeHrefIndex(
  articles: Array<{
    name?: string;
    path?: string;
    url?: string | { path?: string };
    kbId?: unknown;
  }>
): Map<string, string> {
  const index = new Map<string, string>();
  for (const article of articles) {
    const href = knowledgeArticleHrefFromEdge(article);
    if (!href || href === '#') continue;
    const kbId = readEdgeFieldString(article.kbId);
    const name = (article.name || '').trim();
    const isStateSpecific =
      Boolean(name && /-[A-Z]{2}$/.test(name)) || href.includes('/State-Specific/');

    if (kbId) {
      const key = kbId.toLowerCase();
      const existing = index.get(key);
      // Prefer canonical (non–state-specific) pages when duplicate KB-IDs appear
      if (!existing || (!isStateSpecific && existing.includes('/State-Specific/'))) {
        index.set(key, href);
      }
    }
    if (name) index.set(name.toLowerCase(), href);
  }
  return index;
}

/** Overlay live Edge hrefs onto catalog rows matched by kbId or item slug in href. */
export function applyLiveKnowledgeHrefs(
  items: SearchResultItem[],
  hrefIndex: Map<string, string>
): SearchResultItem[] {
  if (!hrefIndex.size) return items;
  return items.map((item) => {
    const byKb = hrefIndex.get(item.kbId.toLowerCase());
    const slug = item.href.split('/').pop()?.toLowerCase() || '';
    const bySlug = slug ? hrefIndex.get(slug) : undefined;
    const live = byKb || bySlug;
    if (!live || live === item.href) return item;
    return { ...item, href: live };
  });
}

export function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function detectSearchBuckets(q: string): SearchBucket[] {
  const n = normalizeQuery(q);
  if (!n) return [];
  const words = n.split(/\s+/).filter(Boolean);
  const hits = new Set<SearchBucket>();
  for (const [bucket, synonyms] of Object.entries(QUERY_BUCKET_SYNONYMS) as [
    SearchBucket,
    readonly string[],
  ][]) {
    for (const syn of synonyms) {
      if (n.includes(syn) || words.some((w) => w.length > 2 && syn.startsWith(w))) {
        hits.add(bucket);
        break;
      }
    }
  }
  return [...hits];
}

export function itemVisibleForDemoUser(item: SearchResultItem, user: DemoUserTaxonomy | null): boolean {
  if (!item.visibleForDemoUsers?.length) return true;
  if (!user) return false;
  return item.visibleForDemoUsers.includes(user);
}

function itemMatchesBuckets(item: SearchResultItem, buckets: SearchBucket[]): boolean {
  if (!buckets.length) return true;
  return buckets.some((b) => item.searchBuckets.includes(b));
}

function significantQueryWords(n: string): string[] {
  return n
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !QUERY_STOP_WORDS.has(w));
}

export function itemMatchesQuery(item: SearchResultItem, q: string): boolean {
  const n = normalizeQuery(q);
  if (!n) return true;
  const buckets = detectSearchBuckets(n);
  const hay = [
    item.title,
    item.description,
    item.kbId,
    ...(item.breadcrumb ?? []),
    ...(item.matchTerms ?? []),
  ]
    .join(' ')
    .toLowerCase();
  const words = significantQueryWords(n);
  if (!words.length) {
    return !buckets.length || itemMatchesBuckets(item, buckets);
  }
  // Natural-language / Q&A: matching a curated bucket is enough for agent discovery
  if (buckets.length && itemMatchesBuckets(item, buckets)) {
    return true;
  }
  return words.every((w) => hay.includes(w));
}

export function relevanceScore(
  item: SearchResultItem,
  q: string,
  activeDemoUserTaxonomy: DemoUserTaxonomy | null
): number {
  const n = normalizeQuery(q);
  if (!n) return 0;
  const words = significantQueryWords(n);
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const crumbs = (item.breadcrumb ?? []).join(' ').toLowerCase();
  const extra = (item.matchTerms ?? []).join(' ').toLowerCase();
  let score = 0;
  for (const w of words) {
    if (title.includes(w)) score += 5;
    if (item.kbId.toLowerCase().includes(w)) score += 4;
    if (desc.includes(w)) score += 2;
    if (crumbs.includes(w)) score += 1;
    if (extra.includes(w)) score += 3;
  }
  if (activeDemoUserTaxonomy && item.demoUserTaxonomy === activeDemoUserTaxonomy) score += 25;
  for (const b of detectSearchBuckets(n)) {
    if (item.searchBuckets.includes(b)) score += 8;
  }
  return score;
}

export function supplementalResultsForDemoUserTaxonomy(persona: DemoUserTaxonomy): SearchResultItem[] {
  const code = getPersonaCode(persona);

  const rowsByPersona: Record<DemoUserTaxonomy, Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[]> = {
    'Internal Agent licensed in FL': [
      {
        kbId: 'KB-AU-1001',
        title: 'Florida Personal Auto FNOL — state intake checkpoints',
        description:
          'FL-licensed agent quick path: PIP cues, comparative negligence prompts, and Progressive Personal Auto FNOL setup for first-notice accuracy.',
        href: kaHref('PersonalLines/Auto', 'KB-AU-1001-FNOL'),
        lob: 'personalAuto',
        perils: ['fnolIntake'],
        topics: ['intake', 'documentation'],
        searchBuckets: ['fnol', 'auto'],
        dateLabel: 'FL agent playbook',
        breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Auto', 'FNOL'],
        matchTerms: ['florida', 'internal agent', 'fnol', 'pip', 'licensed fl', 'requirements'],
        isNew: true,
      },
      {
        kbId: 'KB-HO-1001',
        title: 'Florida homeowners water damage — mitigation timing',
        description:
          'State-aware water loss triage for FL agents: customer mitigation steps, documentation, and when to escalate HO water claims.',
        href: kaHref('PersonalLines/Homeowners', 'KB-HO-1001-WaterDamage'),
        lob: 'personalHome',
        perils: ['waterDamage'],
        topics: ['intake', 'mitigation'],
        searchBuckets: ['water', 'homeowners', 'fnol'],
        dateLabel: 'FL HO guidance',
        breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Homeowners', 'Water'],
        matchTerms: ['florida', 'water', 'mitigation', 'homeowners', 'licensed fl'],
      },
    ],
    'Claims Specialist licensed in NC': [
      {
        kbId: 'KB-AU-1005',
        title: 'North Carolina UM/UIM and liability triage',
        description:
          'NC-licensed specialist path for uninsured/underinsured motorist intake, liability facts, and Progressive severity routing.',
        href: kaHref('PersonalLines/Auto', 'KB-AU-1005-UMUIMIntake'),
        lob: 'personalAuto',
        perils: ['umUim', 'liability'],
        topics: ['intake', 'coverageDetermination'],
        searchBuckets: ['umuim', 'auto', 'coverage'],
        dateLabel: 'NC claims playbook',
        breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Auto', 'UM/UIM'],
        matchTerms: ['north carolina', 'claims specialist', 'um', 'uim', 'licensed nc'],
        isNew: true,
      },
      {
        kbId: 'KB-HO-1002',
        title: 'North Carolina wind and hail storm handling',
        description:
          'Progressive HO wind/hail documentation standards and deductible checks for specialists licensed in North Carolina.',
        href: kaHref('PersonalLines/Homeowners', 'KB-HO-1002-WindHail'),
        lob: 'personalHome',
        perils: ['windHail'],
        topics: ['stormHandling', 'documentation'],
        searchBuckets: ['wind', 'homeowners'],
        dateLabel: 'NC storm claims',
        breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Homeowners', 'Wind Hail'],
        matchTerms: ['north carolina', 'wind', 'hail', 'claims specialist', 'storm'],
      },
    ],
  };

  return rowsByPersona[persona].map((row, i) => ({
    ...row,
    id: `demo-sup-${code}-${i + 1}`,
    demoUserTaxonomy: persona,
  }));
}

function article(partial: SearchResultItem): SearchResultItem {
  return partial;
}

/** Full Knowledge Article catalog used by mock search (all hrefs are KA links). */
export const searchCatalog: SearchResultItem[] = [
  article({
    id: 'ka-au-1001',
    kbId: 'KB-AU-1001',
    title: 'Personal Auto FNOL — First Notice of Loss Intake',
    description:
      'Guide Claims Advisors through accurate Personal Auto FNOL so the claim is set up correctly the first time — parties, vehicles, loss facts, and severity cues.',
    href: kaHref('PersonalLines/Auto', 'KB-AU-1001-FNOL'),
    lob: 'personalAuto',
    perils: ['fnolIntake'],
    topics: ['intake', 'documentation'],
    searchBuckets: ['fnol', 'auto'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Auto'],
    matchTerms: ['fnol', 'first notice', 'personal auto', 'intake', 'florida', 'north carolina', 'requirements'],
    isNew: true,
  }),
  article({
    id: 'ka-au-1002',
    kbId: 'KB-AU-1002',
    title: 'Personal Auto Coverage Determination',
    description:
      'Walk through liability, collision, and comprehensive coverage checks after FNOL — when to confirm, escalate, or document exclusions.',
    href: kaHref('PersonalLines/Auto', 'KB-AU-1002-CoverageDetermination'),
    lob: 'personalAuto',
    perils: ['coverage'],
    topics: ['coverageDetermination'],
    searchBuckets: ['coverage', 'auto'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Auto'],
    matchTerms: ['coverage determination', 'liability', 'collision', 'comprehensive'],
  }),
  article({
    id: 'ka-au-1003',
    kbId: 'KB-AU-1003',
    title: 'Personal Auto Vehicle Theft — Recovery and Total Loss',
    description:
      'Theft claim intake, recovery coordination, and total-loss handling for Personal Auto stolen vehicle scenarios.',
    href: kaHref('PersonalLines/Auto', 'KB-AU-1003-VehicleTheft'),
    lob: 'personalAuto',
    perils: ['theft'],
    topics: ['intake', 'recovery'],
    searchBuckets: ['theft', 'auto'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Auto'],
    matchTerms: ['vehicle theft', 'stolen', 'total loss', 'recovery'],
  }),
  article({
    id: 'ka-au-1004',
    kbId: 'KB-AU-1004',
    title: 'Personal Auto Glass Claims — ADAS and Network Handling',
    description:
      'Glass and windshield claims including ADAS calibration, network shop routing, and documentation standards.',
    href: kaHref('PersonalLines/Auto', 'KB-AU-1004-GlassClaims'),
    lob: 'personalAuto',
    perils: ['glass'],
    topics: ['intake', 'documentation'],
    searchBuckets: ['glass', 'auto'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Auto'],
    matchTerms: ['glass', 'windshield', 'adas', 'calibration'],
  }),
  article({
    id: 'ka-au-1005',
    kbId: 'KB-AU-1005',
    title: 'Personal Auto Uninsured and Underinsured Motorist Intake',
    description:
      'UM/UIM intake checklist: coverage stacking cues, liability facts, and when to involve counsel or specialty units.',
    href: kaHref('PersonalLines/Auto', 'KB-AU-1005-UMUIMIntake'),
    lob: 'personalAuto',
    perils: ['umUim', 'liability'],
    topics: ['intake', 'coverageDetermination'],
    searchBuckets: ['umuim', 'auto', 'coverage'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Auto'],
    matchTerms: ['um', 'uim', 'uninsured', 'underinsured', 'north carolina'],
  }),
  article({
    id: 'ka-ho-1001',
    kbId: 'KB-HO-1001',
    title: 'Homeowners Water Damage — Intake to Mitigation',
    description:
      'HO water loss from intake through customer mitigation: stop the source, document damage, and route for inspection.',
    href: kaHref('PersonalLines/Homeowners', 'KB-HO-1001-WaterDamage'),
    lob: 'personalHome',
    perils: ['waterDamage'],
    topics: ['intake', 'mitigation'],
    searchBuckets: ['water', 'homeowners', 'fnol'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Homeowners'],
    matchTerms: ['water damage', 'mitigation', 'leak', 'homeowners', 'florida', 'licensed state'],
    isNew: true,
  }),
  article({
    id: 'ka-ho-1002',
    kbId: 'KB-HO-1002',
    title: 'Homeowners Wind and Hail — Storm Damage Handling',
    description:
      'Storm wind/hail HO claims: roof and exterior documentation, deductible confirmation, and CAT surge tips.',
    href: kaHref('PersonalLines/Homeowners', 'KB-HO-1002-WindHail'),
    lob: 'personalHome',
    perils: ['windHail'],
    topics: ['stormHandling', 'documentation'],
    searchBuckets: ['wind', 'homeowners'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Homeowners'],
    matchTerms: ['wind', 'hail', 'storm', 'roof', 'deductible'],
  }),
  article({
    id: 'ka-ho-1003',
    kbId: 'KB-HO-1003',
    title: 'Homeowners Kitchen Fire and Smoke Damage',
    description:
      'Kitchen fire and smoke HO claims — safety first, contents vs. structure, and mitigation vendor guidance.',
    href: kaHref('PersonalLines/Homeowners', 'KB-HO-1003-KitchenFireSmoke'),
    lob: 'personalHome',
    perils: ['fireSmoke'],
    topics: ['intake', 'mitigation'],
    searchBuckets: ['fire', 'homeowners'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Homeowners'],
    matchTerms: ['kitchen fire', 'smoke', 'fire damage'],
  }),
  article({
    id: 'ka-ho-1004',
    kbId: 'KB-HO-1004',
    title: 'Homeowners Theft and Burglary Claims',
    description:
      'Theft and burglary HO intake: police reports, inventories, and coverage checks for personal property.',
    href: kaHref('PersonalLines/Homeowners', 'KB-HO-1004-TheftBurglary'),
    lob: 'personalHome',
    perils: ['theft'],
    topics: ['intake', 'documentation'],
    searchBuckets: ['theft', 'homeowners'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Homeowners'],
    matchTerms: ['theft', 'burglary', 'stolen property', 'inventory'],
  }),
  article({
    id: 'ka-ho-1005',
    kbId: 'KB-HO-1005',
    title: 'Homeowners Fallen Tree and Wind Damage',
    description:
      'Fallen tree and related wind damage: removal vs. covered repairs, neighbor trees, and documentation photos.',
    href: kaHref('PersonalLines/Homeowners', 'KB-HO-1005-FallenTreeWind'),
    lob: 'personalHome',
    perils: ['windHail'],
    topics: ['stormHandling', 'mitigation'],
    searchBuckets: ['wind', 'homeowners'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Personal Lines', 'Homeowners'],
    matchTerms: ['fallen tree', 'wind damage', 'tree removal'],
  }),
  article({
    id: 'ka-ca-1001',
    kbId: 'KB-CA-1001',
    title: 'Commercial Auto FNOL — Business Vehicle Intake',
    description:
      'Commercial Auto first notice for business vehicles — insured entity, drivers, cargo exposure, and severity.',
    href: kaHref('CommercialLines/CommercialAuto', 'KB-CA-1001-CommercialAutoFNOL'),
    lob: 'commercialAuto',
    perils: ['fnolIntake'],
    topics: ['intake'],
    searchBuckets: ['fnol', 'commercial', 'auto'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Auto'],
    matchTerms: ['commercial auto', 'fnol', 'fleet', 'business vehicle'],
  }),
  article({
    id: 'ka-ca-1002',
    kbId: 'KB-CA-1002',
    title: 'Hired and Non-Owned Auto — Coverage Triage',
    description:
      'HNOA triage: when hired or non-owned auto applies, certificate checks, and escalation paths.',
    href: kaHref('CommercialLines/CommercialAuto', 'KB-CA-1002-HiredNonOwnedAuto'),
    lob: 'commercialAuto',
    perils: ['coverage', 'liability'],
    topics: ['coverageDetermination'],
    searchBuckets: ['commercial', 'coverage', 'auto'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Auto'],
    matchTerms: ['hired', 'non-owned', 'hnoa', 'coverage triage'],
  }),
  article({
    id: 'ka-ca-1003',
    kbId: 'KB-CA-1003',
    title: 'Commercial Auto Liability — Third-Party Injury and PD',
    description:
      'Third-party injury and property damage liability handling for Commercial Auto claims.',
    href: kaHref('CommercialLines/CommercialAuto', 'KB-CA-1003-LiabilityTriage'),
    lob: 'commercialAuto',
    perils: ['liability'],
    topics: ['intake', 'coverageDetermination'],
    searchBuckets: ['commercial', 'auto', 'coverage'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Auto'],
    matchTerms: ['liability', 'third-party', 'injury', 'property damage'],
  }),
  article({
    id: 'ka-ca-1004',
    kbId: 'KB-CA-1004',
    title: 'Commercial Auto Glass and Comprehensive Damage',
    description:
      'Commercial glass and comprehensive damage routing for fleet and business vehicles.',
    href: kaHref('CommercialLines/CommercialAuto', 'KB-CA-1004-GlassComprehensive'),
    lob: 'commercialAuto',
    perils: ['glass'],
    topics: ['intake', 'documentation'],
    searchBuckets: ['glass', 'commercial', 'auto'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Auto'],
    matchTerms: ['commercial glass', 'comprehensive'],
  }),
  article({
    id: 'ka-ca-1005',
    kbId: 'KB-CA-1005',
    title: 'Commercial Auto — Tools, Equipment, and Cargo After Collision',
    description:
      'Tools, equipment, and cargo exposures after a commercial vehicle collision — what to capture at FNOL.',
    href: kaHref('CommercialLines/CommercialAuto', 'KB-CA-1005-ToolsCargo'),
    lob: 'commercialAuto',
    perils: ['fnolIntake', 'coverage'],
    topics: ['intake', 'documentation'],
    searchBuckets: ['commercial', 'auto', 'fnol'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Auto'],
    matchTerms: ['tools', 'cargo', 'equipment', 'collision'],
  }),
  article({
    id: 'ka-cp-1001',
    kbId: 'KB-CP-1001',
    title: 'Commercial Property Fire — Intake to Mitigation',
    description:
      'Commercial property fire losses from intake through mitigation and business impact capture.',
    href: kaHref('CommercialLines/CommercialProperty', 'KB-CP-1001-FireLoss'),
    lob: 'commercialProperty',
    perils: ['fireSmoke'],
    topics: ['intake', 'mitigation'],
    searchBuckets: ['fire', 'commercial'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Property'],
    matchTerms: ['commercial fire', 'property fire', 'mitigation'],
  }),
  article({
    id: 'ka-cp-1002',
    kbId: 'KB-CP-1002',
    title: 'Commercial Property Business Interruption — After a Covered Loss',
    description:
      'Business interruption after a covered commercial property loss — documentation and specialist handoff.',
    href: kaHref('CommercialLines/CommercialProperty', 'KB-CP-1002-BusinessInterruption'),
    lob: 'commercialProperty',
    perils: ['businessInterruption'],
    topics: ['documentation', 'recovery'],
    searchBuckets: ['commercial', 'coverage'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Property'],
    matchTerms: ['business interruption', 'bi', 'loss of income'],
  }),
  article({
    id: 'ka-cp-1003',
    kbId: 'KB-CP-1003',
    title: 'Commercial Property Water and Sprinkler Damage',
    description:
      'Water and sprinkler damage on commercial property — source control, mitigation, and coverage cues.',
    href: kaHref('CommercialLines/CommercialProperty', 'KB-CP-1003-WaterSprinkler'),
    lob: 'commercialProperty',
    perils: ['waterDamage'],
    topics: ['intake', 'mitigation'],
    searchBuckets: ['water', 'commercial'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Property'],
    matchTerms: ['sprinkler', 'commercial water', 'leak'],
  }),
  article({
    id: 'ka-cp-1004',
    kbId: 'KB-CP-1004',
    title: 'Commercial Property Wind and Hail — Roof and Exterior',
    description:
      'Commercial roof and exterior wind/hail handling — photos, temporary repairs, and CAT tips.',
    href: kaHref('CommercialLines/CommercialProperty', 'KB-CP-1004-WindHail'),
    lob: 'commercialProperty',
    perils: ['windHail'],
    topics: ['stormHandling', 'documentation'],
    searchBuckets: ['wind', 'commercial'],
    dateLabel: 'Knowledge Article',
    breadcrumb: ['Knowledge Articles', 'Commercial Lines', 'Commercial Property'],
    matchTerms: ['commercial wind', 'hail', 'roof'],
  }),
];

export const lobs = Object.keys(searchFacetLabels.lob) as SearchLob[];
export const perils = Object.keys(searchFacetLabels.peril) as SearchPeril[];
export const topics = Object.keys(searchFacetLabels.topic) as SearchTopic[];

/** Legacy aliases kept for generated Sitecore import-map until tools regenerate. */
export const contentTypes = lobs;
export const categories = perils;
export const brands = topics;

export function getDefaultCardImage(): string {
  return '';
}

function stateNameForUser(user: DemoUserTaxonomy | null): string | null {
  if (!user) return null;
  if (user.includes('FL')) return 'Florida';
  if (user.includes('NC')) return 'North Carolina';
  return null;
}

function citationFromCatalog(kbId: string): AiCitation | null {
  const hit = searchCatalog.find((i) => i.kbId === kbId);
  if (!hit) return null;
  return {
    title: hit.title,
    href: hit.href,
    kbId: hit.kbId,
    excerpt: hit.description,
  };
}

/**
 * Build a Pulse-like Q&A insight for natural-language or keyword searches.
 * Always cites Knowledge Article links (never external product URLs).
 */
export function selectAiSearchInsight(query: string, user: DemoUserTaxonomy | null): AiSearchInsight | null {
  const n = normalizeQuery(query);
  if (n.length < 2) return null;

  const buckets = detectSearchBuckets(n);
  const state = stateNameForUser(user);
  const question = query.trim();
  const personaLine = user
    ? `Your demo persona (${user}) prioritizes ${state ?? 'licensed-state'} Shared Content on the article page.`
    : 'Open a Knowledge Article below — state Shared Content (FL / NC / TX) appears on the article when applicable.';

  const isFnolAuto =
    buckets.includes('fnol') ||
    (buckets.includes('auto') && (n.includes('requirement') || n.includes('intake') || n.includes('notice'))) ||
    (n.includes('fnol') && buckets.includes('auto'));

  const isWaterHo =
    buckets.includes('water') ||
    (buckets.includes('homeowners') && (n.includes('mitigation') || n.includes('water') || n.includes('leak')));

  if (isFnolAuto || (buckets.includes('fnol') && !buckets.includes('homeowners') && !buckets.includes('water'))) {
    const primary = citationFromCatalog('KB-AU-1001')!;
    const related = citationFromCatalog('KB-AU-1002');
    return {
      id: `qa-fnol-${user ?? 'any'}`,
      question,
      headline: 'AI answer — Personal Auto FNOL',
      answer:
        `Based on Progressive Knowledge Articles, start with **${primary.title}** for complete first-notice intake ` +
        `(parties, vehicles, loss facts, and severity). ` +
        (state
          ? `Because you’re licensed in ${state}, use the state Shared Content on that article for timelines and regulatory cues. `
          : '') +
        `Then confirm coverage with Personal Auto Coverage Determination when facts support a coverage check.`,
      bullets: [
        personaLine,
        'Capture loss facts completely at FNOL so the claim is set up correctly the first time',
        'Use LOB = Personal Auto and Peril = FNOL filters to narrow the result list',
      ],
      citations: [primary, ...(related ? [related] : [])],
      stateCallout: state ? `Highlighted for ${state} agents` : null,
      learnMoreHref: primary.href,
      learnMoreLabel: 'Open FNOL Knowledge Article',
    };
  }

  if (isWaterHo) {
    const primary = citationFromCatalog('KB-HO-1001')!;
    const related = citationFromCatalog('KB-HO-1002');
    return {
      id: `qa-water-${user ?? 'any'}`,
      question,
      headline: 'AI answer — Homeowners water damage',
      answer:
        `For homeowners water damage, open **${primary.title}**. ` +
        `Guide the customer to stop the source, mitigate further damage, and document photos before inspection. ` +
        (state
          ? `${state}-specific Shared Content on that article covers licensed-state timelines and compliance notes. `
          : '') +
        `If the loss is storm-related wind/hail instead, switch to the Wind and Hail article.`,
      bullets: [
        personaLine,
        'Prioritize mitigation and documentation before sending for inspection',
        'Filter by Homeowners + Water damage to see related Knowledge Articles only',
      ],
      citations: [primary, ...(related ? [related] : [])],
      stateCallout: state ? `Highlighted for ${state} agents` : null,
      learnMoreHref: primary.href,
      learnMoreLabel: 'Open water damage Knowledge Article',
    };
  }

  if (buckets.includes('umuim')) {
    const primary = citationFromCatalog('KB-AU-1005')!;
    return {
      id: `qa-umuim-${user ?? 'any'}`,
      question,
      headline: 'AI answer — UM / UIM intake',
      answer:
        `Use **${primary.title}** for uninsured and underinsured motorist intake — coverage stacking cues, liability facts, and when to escalate. ` +
        personaLine,
      bullets: [
        'Confirm UM/UIM eligibility early in the intake conversation',
        'Pair with Personal Auto Coverage Determination when policy questions remain',
      ],
      citations: [primary],
      stateCallout: state ? `Highlighted for ${state} agents` : null,
      learnMoreHref: primary.href,
      learnMoreLabel: 'Open UM/UIM Knowledge Article',
    };
  }

  if (buckets.includes('wind')) {
    const primary = citationFromCatalog('KB-HO-1002')!;
    const commercial = citationFromCatalog('KB-CP-1004');
    return {
      id: `qa-wind-${user ?? 'any'}`,
      question,
      headline: 'AI answer — Wind & hail handling',
      answer:
        `For residential storm losses, start with **${primary.title}** (roof/exterior photos, deductible checks, CAT tips). ` +
        (commercial
          ? `Commercial property roof/exterior storms are covered in **${commercial.title}**. `
          : '') +
        personaLine,
      bullets: [
        'Filter Peril = Wind & hail to see HO and Commercial Property articles together',
        'Confirm deductible and photo standards before promising next steps',
      ],
      citations: [primary, ...(commercial ? [commercial] : [])],
      stateCallout: state ? `Highlighted for ${state} agents` : null,
      learnMoreHref: primary.href,
      learnMoreLabel: 'Open wind/hail Knowledge Article',
    };
  }

  if (buckets.includes('commercial')) {
    const primary = citationFromCatalog('KB-CA-1001')!;
    return {
      id: `qa-commercial-${user ?? 'any'}`,
      question,
      headline: 'AI answer — Commercial claims',
      answer:
        `Commercial Auto first notice begins with **${primary.title}**. ` +
        `Use Line of business filters (Commercial Auto / Commercial Property) to find FNOL, liability, fire, water, and BI articles. ` +
        personaLine,
      bullets: [
        'Capture insured entity, driver, and cargo/tools exposure at commercial FNOL',
        'All search results below are Knowledge Article links only',
      ],
      citations: [primary],
      stateCallout: null,
      learnMoreHref: primary.href,
      learnMoreLabel: 'Open Commercial Auto FNOL article',
    };
  }

  // Generic Q&A when the agent typed a question-like phrase
  const looksLikeQuestion =
    /\?$/.test(question) ||
    /^(how|what|when|where|why|should|can|do|does|is|are)\b/i.test(question);

  if (looksLikeQuestion || buckets.length) {
    const top =
      searchCatalog.find((i) => itemMatchesQuery(i, n)) ?? searchCatalog[0]!;
    return {
      id: `qa-gen-${normalizeQuery(question).slice(0, 40)}`,
      question,
      headline: 'AI answer — Knowledge search',
      answer:
        `I matched Progressive Knowledge Articles for “${question}”. ` +
        `Start with **${top.title}** (${top.kbId}), then use the facets (Line of business, Peril, Claim stage) to refine. ` +
        personaLine,
      bullets: [
        'Every result below links to a Knowledge Article',
        'Ask a full question (for example FNOL requirements or water mitigation) for a richer AI answer',
        'Switch the demo persona to personalize FL vs NC guidance',
      ],
      citations: [
        {
          title: top.title,
          href: top.href,
          kbId: top.kbId,
          excerpt: top.description,
        },
      ],
      stateCallout: state ? `Highlighted for ${state} agents` : null,
      learnMoreHref: top.href,
      learnMoreLabel: 'Open top Knowledge Article',
    };
  }

  return null;
}

export function itemMetadataLine(item: SearchResultItem): string {
  const lob = searchFacetLabels.lob[item.lob];
  const peril = item.perils[0] ? searchFacetLabels.peril[item.perils[0]] : 'Knowledge Article';
  const trail = item.breadcrumb?.length ? item.breadcrumb.join(' · ') : '';
  return [item.kbId, lob, peril, trail].filter(Boolean).join(' · ');
}
