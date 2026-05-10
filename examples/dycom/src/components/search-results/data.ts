/**
 * Mock search catalog for Dycom Industries–style site search demo.
 * Inspired by public pages and themes from dycomind.com (careers, services, investors).
 * Data only — UI lives in SearchResults.tsx.
 */

export type DemoUserTaxonomy = 'Job Seeker' | 'Investor' | 'Telecom Provider';

export type SearchContentType = 'serviceLine' | 'careersPage' | 'investorResource' | 'companyPage';

/** Topic / line-of-business facet */
export type SearchCategory =
  | 'wirelineConstruction'
  | 'wirelessConstruction'
  | 'engineering'
  | 'locating'
  | 'fulfillment'
  | 'maintenanceRestoration'
  | 'projectManagement'
  | 'careersPrograms'
  | 'benefitsAndWellbeing'
  | 'investorFilings'
  | 'investorEvents'
  | 'corporateGovernance';

/** Site area facet (maps to primary navigation sections) */
export type SearchBrand = 'services' | 'careers' | 'investors' | 'corporate';

/** Keyword buckets for curated queries */
export type SearchBucket = 'careers' | 'services' | 'investors';

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  contentType: SearchContentType;
  categories: SearchCategory[];
  brands: SearchBrand[];
  searchBuckets: SearchBucket[];
  dateLabel?: string;
  breadcrumb?: string[];
  matchTerms?: string[];
  imageSrc?: string;
  isNew?: boolean;
  demoUserTaxonomy?: DemoUserTaxonomy;
  visibleForDemoUsers?: DemoUserTaxonomy[];
  /** Secondary badge text on cards (e.g. audience or content subtype) */
  badgeLabel?: string;
};

export type AiSearchInsight = {
  id: string;
  headline: string;
  body: string;
  bullets: string[];
  learnMoreHref: string;
  learnMoreLabel?: string;
};

export const DYCOM_PUBLIC_BASE = 'https://www.dycomind.com/';

export const RESULTS_PAGE_SIZE = 9;

export const searchFacetLabels = {
  contentType: {
    serviceLine: 'Services',
    careersPage: 'Careers',
    investorResource: 'Investor relations',
    companyPage: 'Company',
  },
  category: {
    wirelineConstruction: 'Wireline construction',
    wirelessConstruction: 'Wireless construction',
    engineering: 'Engineering',
    locating: 'Locating',
    fulfillment: 'Fulfillment',
    maintenanceRestoration: 'Maintenance & restoration',
    projectManagement: 'Project management',
    careersPrograms: 'Careers programs',
    benefitsAndWellbeing: 'Benefits & wellbeing',
    investorFilings: 'Filings & financials',
    investorEvents: 'Events & presentations',
    corporateGovernance: 'Governance',
  },
  brand: {
    services: 'Services',
    careers: 'Careers',
    investors: 'Investors',
    corporate: 'Corporate',
  },
} as const;

export const popularSearches = [
  'What we do',
  'Careers and opportunities',
  'Employee benefits',
  'Wireless construction',
  'Investor news and filings',
  'Recruitment process',
];

export const QUERY_BUCKET_SYNONYMS: Record<SearchBucket, readonly string[]> = {
  careers: [
    'career',
    'careers',
    'job',
    'jobs',
    'hiring',
    'recruit',
    'recruitment',
    'opportunit',
    'apply',
    'applicant',
    'benefit',
    'benefits',
    'life@',
    'life at',
    'talent',
    'workforce',
    'onboarding',
  ],
  services: [
    'service',
    'services',
    'wireline',
    'wireless',
    'construction',
    'fiber',
    'broadband',
    'telecom',
    'engineering',
    'locating',
    'fulfillment',
    'maintenance',
    'restoration',
    'project management',
    'macro',
    'small cell',
    '5g',
    '4g',
    'utility',
    'network',
    'build',
    'what we do',
    'capabilities',
  ],
  investors: [
    'investor',
    'investors',
    'invest',
    'stock',
    'share',
    'sec',
    'filing',
    'filings',
    'earnings',
    'dividend',
    'annual report',
    'quarterly',
    'governance',
    'board',
    'presentation',
    'event',
    'financial',
    'ir',
    'alerts',
    'proxy',
  ],
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
  'what',
  'does',
]);

const UNSPLASH_PHOTO_IDS: readonly string[] = [
  '1581091226825-a6a2a5aee158',
  '1518770660439-4636190af475',
  '1582719478250-c89cae4dc85b',
  '1581092162384-8987c1d64718',
  '1531297484001-80022131f5a1',
  '1551288049-bebda4e38f71',
  '1504328345606-18bbc8c9d7d1',
  '1589829545856-d10d557cf95f',
  '1565043666747-69f6646db940',
  '1576091160550-2173dba999ef',
  '1576091160399-112ba8d25d1d',
  '1587854692152-cbe660dbde88',
  '1504711434969-e33886168f5c',
  '1505751172876-fa1923c5c528',
  '1571019613454-1cb2f99b2d8b',
  '1451187580459-43490279c0fa',
  '1489515217757-5fd1be406fef',
  '1500530855697-b586d89ba3ee',
  '1460925895917-afdab827c52f',
  '1581094794329-c8112a89af12',
  '1558618666-fcd25c85cd64',
  '1519389950473-47ba0277781c',
  '1573164713714-d95e436ab8d6',
  '1677442136019-21780ecad995',
  '1515886657613-9f3515b0c78f',
  '1554224155-6726b3ff858f',
  '1497366216548-37526070297c',
  '1497366754035-f200968a6e72',
  '1600585154340-be6161a56a0c',
  '1617791160505-6f00504e3519',
];

function buildCatalogImageUrl(id: string): string {
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;
}

function catalogDemoImage(slot: number): string {
  const len = UNSPLASH_PHOTO_IDS.length;
  const id = UNSPLASH_PHOTO_IDS[((slot % len) + len) % len]!;
  return buildCatalogImageUrl(id);
}

export function parseDemoUserTaxonomy(raw: string | undefined | null): DemoUserTaxonomy | null {
  const t = raw?.trim();
  if (t === 'Job Seeker' || t === 'Investor' || t === 'Telecom Provider') {
    return t;
  }
  return null;
}

export function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function detectSearchBuckets(q: string): SearchBucket[] {
  const n = normalizeQuery(q);
  if (!n) return [];
  const words = n.split(/\s+/).filter(Boolean);
  const hits = new Set<SearchBucket>();
  for (const [bucket, synonyms] of Object.entries(QUERY_BUCKET_SYNONYMS) as [SearchBucket, readonly string[]][]) {
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
  if (buckets.length) {
    if (!itemMatchesBuckets(item, buckets)) return false;
  }
  const hay = [
    item.title,
    item.description,
    ...(item.breadcrumb ?? []),
    ...(item.matchTerms ?? []),
  ]
    .join(' ')
    .toLowerCase();
  const words = significantQueryWords(n);
  if (!words.length) return true;
  if (buckets.length) {
    return words.some((w) => hay.includes(w));
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
    if (desc.includes(w)) score += 2;
    if (crumbs.includes(w)) score += 1;
    if (extra.includes(w)) score += 3;
  }
  if (activeDemoUserTaxonomy && item.demoUserTaxonomy === activeDemoUserTaxonomy) {
    score += 25;
  }
  const buckets = detectSearchBuckets(n);
  if (buckets.length) {
    for (const b of buckets) {
      if (item.searchBuckets.includes(b)) score += 8;
    }
  }
  return score;
}

export function supplementalResultsForDemoUserTaxonomy(plan: DemoUserTaxonomy): SearchResultItem[] {
  const code = plan === 'Job Seeker' ? 'js' : plan === 'Investor' ? 'inv' : 'tp';
  const rows: Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[] =
    plan === 'Job Seeker'
      ? [
          {
            badgeLabel: 'For job seekers',
            imageSrc: catalogDemoImage(0),
            isNew: true,
            title: 'Open roles updated weekly — field & corporate',
            description:
              'Dycom subsidiaries hire technicians, project managers, engineers, and safety leaders nationwide. Filter by region and craft on the careers portal.',
            href: `${DYCOM_PUBLIC_BASE}`,
            contentType: 'careersPage',
            categories: ['careersPrograms'],
            brands: ['careers'],
            searchBuckets: ['careers'],
            dateLabel: 'Weekly',
            breadcrumb: ['Careers', 'Opportunities'],
            matchTerms: ['opportunities', 'roles', 'openings', 'apply'],
          },
          {
            badgeLabel: 'Benefits snapshot',
            imageSrc: catalogDemoImage(1),
            title: 'Total rewards: medical, retirement, and tuition support',
            description:
              'Overview of health plans, 401(k), paid time off, and professional development aligned to craft and leadership paths.',
            href: `${DYCOM_PUBLIC_BASE}`,
            contentType: 'careersPage',
            categories: ['benefitsAndWellbeing'],
            brands: ['careers'],
            searchBuckets: ['careers'],
            dateLabel: 'Guide',
            breadcrumb: ['Careers', 'Benefits'],
            matchTerms: ['benefits', 'wellbeing', '401', 'pto', 'medical'],
          },
        ]
      : plan === 'Investor'
        ? [
            {
              badgeLabel: 'IR hub',
              imageSrc: catalogDemoImage(2),
              isNew: true,
              title: 'Earnings materials & SEC filings in one place',
              description:
                'Quarterly releases, prepared remarks, and supplemental slides for Dycom Industries — bookmark the investor relations landing page.',
              href: `${DYCOM_PUBLIC_BASE}`,
              contentType: 'investorResource',
              categories: ['investorFilings'],
              brands: ['investors'],
              searchBuckets: ['investors'],
              dateLabel: 'Filings',
              breadcrumb: ['Investors', 'Financials'],
              matchTerms: ['earnings', 'sec', '10-q', '10-k', 'filings'],
            },
            {
              badgeLabel: 'Events',
              imageSrc: catalogDemoImage(3),
              title: 'Conference replays & shareholder communications',
              description:
                'Catch up on recent investor conferences and governance notices — subscribe for email alerts when new events post.',
              href: `${DYCOM_PUBLIC_BASE}`,
              contentType: 'investorResource',
              categories: ['investorEvents'],
              brands: ['investors'],
              searchBuckets: ['investors'],
              dateLabel: 'On-demand',
              breadcrumb: ['Investors', 'Events'],
              matchTerms: ['presentation', 'webcast', 'shareholder', 'conference'],
            },
          ]
        : [
            {
              badgeLabel: 'Partner briefing',
              imageSrc: catalogDemoImage(4),
              isNew: true,
              title: 'National wireline & wireless programs — capacity & safety',
              description:
                'Enterprise tooling augments craft labor for long-haul fiber, small cells, and emergency restoration — ideal for carrier and MSO programs.',
              href: `${DYCOM_PUBLIC_BASE}`,
              contentType: 'serviceLine',
              categories: ['wirelineConstruction', 'wirelessConstruction', 'projectManagement'],
              brands: ['services'],
              searchBuckets: ['services'],
              dateLabel: 'Capabilities',
              breadcrumb: ['Services', 'Overview'],
              matchTerms: ['fiber', 'small cell', 'macro', 'program', 'carrier'],
            },
            {
              badgeLabel: 'Delivery',
              imageSrc: catalogDemoImage(5),
              title: 'Fulfillment & maintenance for broadband installations',
              description:
                'In-home installs, drop maintenance, and restoration crews aligned to SLA-driven telecommunications partners.',
              href: `${DYCOM_PUBLIC_BASE}`,
              contentType: 'serviceLine',
              categories: ['fulfillment', 'maintenanceRestoration'],
              brands: ['services'],
              searchBuckets: ['services'],
              dateLabel: 'Operations',
              breadcrumb: ['Services', 'Fulfillment'],
              matchTerms: ['install', 'drop', 'maintenance', 'sla', 'broadband'],
            },
          ];

  return rows.map((row, i) => ({
    ...row,
    id: `demo-sup-${code}-${i + 1}`,
    demoUserTaxonomy: plan,
  }));
}

const defaultImg = catalogDemoImage(6);

function p(
  partial: Omit<SearchResultItem, 'id' | 'href'> & { id: string; href?: string }
): SearchResultItem {
  return {
    href: partial.href ?? DYCOM_PUBLIC_BASE,
    imageSrc: partial.imageSrc ?? defaultImg,
    ...partial,
  };
}

/** Faceted catalog mirroring dycomind.com themes (careers, services, investors, corporate). */
export const searchCatalog: SearchResultItem[] = [
  // —— Careers & talent ——
  p({
    id: 'car-1',
    badgeLabel: 'Careers home',
    title: 'Careers at Dycom — build critical telecom infrastructure',
    description:
      'Learn how field and corporate teams deliver fiber, wireless, and fulfillment programs with safety-first culture and advancement paths.',
    contentType: 'careersPage',
    categories: ['careersPrograms'],
    brands: ['careers'],
    searchBuckets: ['careers'],
    matchTerms: ['careers', 'home', 'culture', 'teams', 'jobs'],
    imageSrc: catalogDemoImage(7),
    breadcrumb: ['Careers'],
  }),
  p({
    id: 'car-2',
    badgeLabel: 'Now hiring',
    title: 'Opportunities — nationwide technician & project roles',
    description:
      'Search openings by craft and geography — includes apprentice-friendly paths into aerial, buried, and wireless disciplines.',
    contentType: 'careersPage',
    categories: ['careersPrograms'],
    brands: ['careers'],
    searchBuckets: ['careers'],
    matchTerms: ['opportunities', 'openings', 'technician', 'apply'],
    imageSrc: catalogDemoImage(8),
    isNew: true,
    breadcrumb: ['Careers', 'Opportunities'],
  }),
  p({
    id: 'car-3',
    badgeLabel: 'Benefits',
    title: 'Benefits page — health, wellbeing, and retirement programs',
    description:
      'Medical, dental, vision, disability coverage, plus retirement savings and employee assistance resources.',
    contentType: 'careersPage',
    categories: ['benefitsAndWellbeing'],
    brands: ['careers'],
    searchBuckets: ['careers'],
    matchTerms: ['benefits', 'wellbeing', 'retirement', 'health'],
    imageSrc: catalogDemoImage(9),
    breadcrumb: ['Careers', 'Benefits'],
  }),
  p({
    id: 'car-4',
    badgeLabel: 'Culture',
    title: 'Life@Dycom — stories from the field and office',
    description:
      'Spotlights on crews, mentors, and community projects that highlight Dycom’s operating companies.',
    contentType: 'careersPage',
    categories: ['careersPrograms'],
    brands: ['careers'],
    searchBuckets: ['careers'],
    matchTerms: ['life', 'culture', 'community', 'field'],
    imageSrc: catalogDemoImage(10),
    breadcrumb: ['Careers', 'Life@Dycom'],
  }),
  p({
    id: 'car-5',
    badgeLabel: 'Process',
    title: 'Our recruitment process — what to expect after you apply',
    description:
      'Screening, interviews, safety orientation, and onboarding checkpoints for craft and professional candidates.',
    contentType: 'careersPage',
    categories: ['careersPrograms'],
    brands: ['careers'],
    searchBuckets: ['careers'],
    matchTerms: ['recruitment', 'process', 'interview', 'onboarding', 'apply'],
    imageSrc: catalogDemoImage(11),
    breadcrumb: ['Careers', 'Recruitment'],
  }),
  p({
    id: 'car-6',
    badgeLabel: 'Disclosures',
    title: 'Benefit plan disclosures & notices',
    description:
      'Plan documents and regulatory notices for eligible participants — bookmark for open enrollment periods.',
    contentType: 'companyPage',
    categories: ['benefitsAndWellbeing'],
    brands: ['careers'],
    searchBuckets: ['careers'],
    matchTerms: ['benefit', 'disclosure', 'plan', 'notices'],
    imageSrc: catalogDemoImage(12),
    breadcrumb: ['Careers', 'Compliance'],
  }),
  p({
    id: 'car-js-only',
    badgeLabel: 'Candidates',
    title: 'Job seeker toolkit — résumé tips for telecom craft roles',
    description:
      'Highlight certifications (OSHA, CDL), travel flexibility, and safety metrics recruiters scan first.',
    contentType: 'careersPage',
    categories: ['careersPrograms'],
    brands: ['careers'],
    searchBuckets: ['careers'],
    matchTerms: ['resume', 'certification', 'osha', 'candidate'],
    imageSrc: catalogDemoImage(13),
    visibleForDemoUsers: ['Job Seeker'],
    demoUserTaxonomy: 'Job Seeker',
    breadcrumb: ['Careers', 'Resources'],
  }),
  p({
    id: 'car-inv-only',
    badgeLabel: 'Talent signal',
    title: 'Investor lens — workforce trends in telecom construction',
    description:
      'Macro view on labor availability, training investments, and backlog implications for specialty contractors.',
    contentType: 'investorResource',
    categories: ['investorFilings'],
    brands: ['investors'],
    searchBuckets: ['careers', 'investors'],
    matchTerms: ['workforce', 'labor', 'training', 'backlog'],
    imageSrc: catalogDemoImage(14),
    visibleForDemoUsers: ['Investor'],
    demoUserTaxonomy: 'Investor',
    breadcrumb: ['Investors', 'ESG context'],
  }),
  p({
    id: 'car-tp-only',
    badgeLabel: 'Partners',
    title: 'Telecom providers — Dycom surge staffing for major builds',
    description:
      'How operating companies align crews, engineers, and PMOs to accelerate fiber and 5G densification programs.',
    contentType: 'companyPage',
    categories: ['careersPrograms'],
    brands: ['services'],
    searchBuckets: ['careers', 'services'],
    matchTerms: ['staffing', 'surge', 'fiber', '5g', 'program'],
    imageSrc: catalogDemoImage(15),
    visibleForDemoUsers: ['Telecom Provider'],
    demoUserTaxonomy: 'Telecom Provider',
    breadcrumb: ['Partners', 'Capacity'],
  }),

  // —— Services ——
  p({
    id: 'svc-1',
    badgeLabel: 'Capabilities',
    title: 'What we do — telecommunications specialty contracting',
    description:
      'Nationwide construction, engineering, fulfillment, and restoration supporting broadband and wireless operators.',
    contentType: 'companyPage',
    categories: ['projectManagement'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['what', 'capabilities', 'telecommunications', 'contracting'],
    imageSrc: catalogDemoImage(16),
    breadcrumb: ['Company', 'What we do'],
  }),
  p({
    id: 'svc-2',
    badgeLabel: 'Wireline',
    title: 'Wireline construction — fiber and copper outside plant',
    description:
      'Long-haul and metro fiber builds with crews augmented by enterprise scheduling and quality tooling.',
    contentType: 'serviceLine',
    categories: ['wirelineConstruction'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['wireline', 'fiber', 'copper', 'osp'],
    imageSrc: catalogDemoImage(17),
    breadcrumb: ['Services', 'Wireline'],
  }),
  p({
    id: 'svc-3',
    badgeLabel: 'Wireless',
    title: 'Wireless construction — macro sites to small cells',
    description:
      'Expert wireless communications construction for 4G and 5G networks at scalable program volumes.',
    contentType: 'serviceLine',
    categories: ['wirelessConstruction'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['wireless', 'macro', 'small cell', '5g', '4g'],
    imageSrc: catalogDemoImage(18),
    isNew: true,
    breadcrumb: ['Services', 'Wireless'],
  }),
  p({
    id: 'svc-4',
    badgeLabel: 'Safety',
    title: 'Locating — identify utilities before excavation',
    description:
      'Skilled locate technicians protect underground utilities prior to construction starts.',
    contentType: 'serviceLine',
    categories: ['locating'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['locating', 'utilities', '811', 'damage prevention'],
    imageSrc: catalogDemoImage(19),
    breadcrumb: ['Services', 'Locating'],
  }),
  p({
    id: 'svc-5',
    badgeLabel: 'Design',
    title: 'Engineering — survey and design for copper, coax, and fiber',
    description:
      'Field surveys and facility design supporting carrier network expansions and upgrades.',
    contentType: 'serviceLine',
    categories: ['engineering'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['engineering', 'survey', 'design', 'fiber'],
    imageSrc: catalogDemoImage(20),
    breadcrumb: ['Services', 'Engineering'],
  }),
  p({
    id: 'svc-6',
    badgeLabel: 'Install',
    title: 'Fulfillment — in-home and drop installations',
    description:
      'Residential and commercial fulfillment including installs, upgrades, and broadband repairs.',
    contentType: 'serviceLine',
    categories: ['fulfillment'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['fulfillment', 'install', 'in-home', 'drop'],
    imageSrc: catalogDemoImage(21),
    breadcrumb: ['Services', 'Fulfillment'],
  }),
  p({
    id: 'svc-7',
    badgeLabel: 'Operate',
    title: 'Maintenance & restoration — keep networks running',
    description:
      'Ongoing maintenance and emergency restoration for telecommunications infrastructure nationwide.',
    contentType: 'serviceLine',
    categories: ['maintenanceRestoration'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['maintenance', 'restoration', 'emergency', 'network'],
    imageSrc: catalogDemoImage(22),
    breadcrumb: ['Services', 'Maintenance'],
  }),
  p({
    id: 'svc-8',
    badgeLabel: 'Programs',
    title: 'Project management — turnkey and managed telecom projects',
    description:
      'From small towns to major metros — coordinated scheduling, safety, and customer reporting.',
    contentType: 'serviceLine',
    categories: ['projectManagement'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['project', 'management', 'turnkey', 'program'],
    imageSrc: catalogDemoImage(23),
    breadcrumb: ['Services', 'PMO'],
  }),
  p({
    id: 'svc-tp-only',
    badgeLabel: 'Provider FAQ',
    title: 'Telecom providers — integrated safety & QA dashboards',
    description:
      'Mock overview of how Dycom subsidiaries align OSHA metrics and close-out packages for carrier QA teams.',
    contentType: 'serviceLine',
    categories: ['projectManagement', 'wirelessConstruction'],
    brands: ['services'],
    searchBuckets: ['services'],
    matchTerms: ['qa', 'osha', 'dashboard', 'close-out'],
    imageSrc: catalogDemoImage(24),
    visibleForDemoUsers: ['Telecom Provider'],
    demoUserTaxonomy: 'Telecom Provider',
    breadcrumb: ['Partners', 'Quality'],
  }),

  // —— Investors ——
  p({
    id: 'inv-1',
    badgeLabel: 'Overview',
    title: 'Investor relations — news, events, and filings',
    description:
      'Central entry point for earnings, SEC documents, stock information, and governance updates.',
    contentType: 'investorResource',
    categories: ['investorFilings'],
    brands: ['investors'],
    searchBuckets: ['investors'],
    matchTerms: ['investor', 'relations', 'news', 'stock'],
    imageSrc: catalogDemoImage(25),
    breadcrumb: ['Investors'],
  }),
  p({
    id: 'inv-2',
    badgeLabel: 'Filings',
    title: 'Financials & filings — quarterly and annual reports',
    description:
      'Access SEC filings, quarterly highlights, and annual report archives for Dycom Industries, Inc.',
    contentType: 'investorResource',
    categories: ['investorFilings'],
    brands: ['investors'],
    searchBuckets: ['investors'],
    matchTerms: ['financial', 'sec', '10-k', '10-q', 'annual'],
    imageSrc: catalogDemoImage(26),
    breadcrumb: ['Investors', 'Financials'],
  }),
  p({
    id: 'inv-3',
    badgeLabel: 'Stock',
    title: 'Stock information — quote tools & historical lookup',
    description:
      'Market data references and historical price lookup aligned to Dycom listed securities.',
    contentType: 'investorResource',
    categories: ['investorFilings'],
    brands: ['investors'],
    searchBuckets: ['investors'],
    matchTerms: ['stock', 'quote', 'price', 'ticker'],
    imageSrc: catalogDemoImage(27),
    breadcrumb: ['Investors', 'Stock'],
  }),
  p({
    id: 'inv-4',
    badgeLabel: 'Leadership',
    title: 'Governance — board, committees, and officers',
    description:
      'Profiles and documents covering board structure, committee charters, and executive leadership.',
    contentType: 'investorResource',
    categories: ['corporateGovernance'],
    brands: ['investors'],
    searchBuckets: ['investors'],
    matchTerms: ['governance', 'board', 'committee', 'officers'],
    imageSrc: catalogDemoImage(28),
    breadcrumb: ['Investors', 'Governance'],
  }),
  p({
    id: 'inv-5',
    badgeLabel: 'Calendar',
    title: 'Events & presentations — conferences and webcasts',
    description:
      'Upcoming and archived management presentations for shareholders and analysts.',
    contentType: 'investorResource',
    categories: ['investorEvents'],
    brands: ['investors'],
    searchBuckets: ['investors'],
    matchTerms: ['events', 'presentation', 'webcast', 'conference'],
    imageSrc: catalogDemoImage(29),
    breadcrumb: ['Investors', 'Events'],
  }),
  p({
    id: 'inv-inv-only',
    badgeLabel: 'Deep dive',
    title: 'Investor-only briefing — backlog & fiber cycle indicators',
    description:
      'Supplemental narrative on backlog composition and wireless capex cadence (demo personalization row).',
    contentType: 'investorResource',
    categories: ['investorFilings'],
    brands: ['investors'],
    searchBuckets: ['investors'],
    matchTerms: ['backlog', 'capex', 'fiber', 'wireless'],
    imageSrc: catalogDemoImage(30),
    visibleForDemoUsers: ['Investor'],
    demoUserTaxonomy: 'Investor',
    breadcrumb: ['Investors', 'Insights'],
  }),

  // —— Corporate ——
  p({
    id: 'corp-1',
    badgeLabel: 'Trust',
    title: 'Privacy policy — data stewardship for visitors',
    description:
      'How Dycom handles personal information collected through websites and investor alerts.',
    contentType: 'companyPage',
    categories: ['corporateGovernance'],
    brands: ['corporate'],
    searchBuckets: ['investors'],
    matchTerms: ['privacy', 'policy', 'data', 'cookies'],
    imageSrc: catalogDemoImage(31),
    breadcrumb: ['Corporate', 'Privacy'],
  }),
  p({
    id: 'corp-2',
    badgeLabel: 'Legal',
    title: 'Terms of use — website policies',
    description:
      'Terms governing access to Dycom digital properties and acceptable use expectations.',
    contentType: 'companyPage',
    categories: ['corporateGovernance'],
    brands: ['corporate'],
    searchBuckets: ['services'],
    matchTerms: ['terms', 'legal', 'website'],
    imageSrc: catalogDemoImage(32),
    breadcrumb: ['Corporate', 'Legal'],
  }),
  p({
    id: 'corp-3',
    badgeLabel: 'Thanks',
    title: 'Thank you for subscribing — preferences confirmation',
    description:
      'Confirmation page shown after email alert or newsletter preferences are saved.',
    contentType: 'companyPage',
    categories: ['investorEvents'],
    brands: ['corporate'],
    searchBuckets: ['investors'],
    matchTerms: ['subscribe', 'preferences', 'thank', 'alert'],
    imageSrc: catalogDemoImage(33),
    breadcrumb: ['Investors', 'Subscribe'],
  }),
];

export const contentTypes = Object.keys(searchFacetLabels.contentType) as SearchContentType[];
export const categories = Object.keys(searchFacetLabels.category) as SearchCategory[];
export const brands = Object.keys(searchFacetLabels.brand) as SearchBrand[];

export function getDefaultCardImage(): string {
  return defaultImg;
}

function insightKey(buckets: SearchBucket[], user: DemoUserTaxonomy | null): string {
  const b = [...buckets].sort().join('|') || 'browse';
  const u = user ?? 'any';
  return `${b}::${u}`;
}

export function selectAiSearchInsight(query: string, user: DemoUserTaxonomy | null): AiSearchInsight | null {
  const n = normalizeQuery(query);
  if (n.length < 2) return null;
  const buckets = detectSearchBuckets(n);
  const key = insightKey(buckets, user);

  const pool: Record<string, AiSearchInsight> = {
    'careers::Job Seeker': {
      id: 'ai-car-js',
      headline: 'AI suggestion — map your craft to Dycom subsidiaries',
      body:
        'Technician resumes land faster when they cite travel radius, climber certifications, and aerial/buried experience. Start at Careers home, then narrow Opportunities by state.',
      bullets: [
        'Compare Benefits and Life@Dycom pages before interviews',
        'Review the recruitment process timeline to prep safety screenings',
        'Save Benefit Plan Disclosures for enrollment conversations',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Explore Dycom careers content',
    },
    'careers::Investor': {
      id: 'ai-car-inv',
      headline: 'AI suggestion — correlate hiring narratives with backlog commentary',
      body:
        'Labor availability often appears alongside backlog and wireless capex commentary. Pair Careers highlights with Financials & Filings for context on execution capacity.',
      bullets: [
        'Scan earnings decks for training and retention initiatives',
        'Compare governance disclosures with workforce risk factors',
        'Use Events & Presentations for management Q&A on hiring',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Investor relations overview',
    },
    'careers::Telecom Provider': {
      id: 'ai-car-tp',
      headline: 'AI suggestion — align staffing plans with Dycom program offices',
      body:
        'Carrier program managers should sync forecasted volumes with Dycom PMOs early — recruitment pages signal regional bench strength for wireless and wireline surges.',
      bullets: [
        'Reference Maintenance & Restoration pages for storm response playbooks',
        'Share fulfillment SLAs when scoping in-home install waves',
        'Cross-check Engineering offerings for survey-heavy fiber expansions',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Services overview',
    },
    'services::Job Seeker': {
      id: 'ai-svc-js',
      headline: 'AI suggestion — pick a craft lane before browsing openings',
      body:
        'Wireless construction, wireline fiber, and fulfillment each emphasize different certifications. Read service pages to vocabulary-match your experience in applications.',
      bullets: [
        'Wireless openings highlight climbing and RF safety exposure',
        'Wireline roles reward OTDR and fusion splicing experience',
        'Fulfillment emphasizes customer-facing installs and truck stock discipline',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'What we do',
    },
    'services::Investor': {
      id: 'ai-svc-inv',
      headline: 'AI suggestion — tie service lines to revenue mix narratives',
      body:
        'Dycom’s publicly described capabilities span construction, engineering, and fulfillment — useful when reconciling segment commentary in filings.',
      bullets: [
        'Wireless vs wireline mix often surfaces in macro carrier spend cycles',
        'Maintenance & restoration content explains recurring storm revenue',
        'Project management pages illustrate turnkey program economics',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Financials & filings',
    },
    'services::Telecom Provider': {
      id: 'ai-svc-tp',
      headline: 'AI suggestion — bundle scopes across engineering + construction',
      body:
        'Telecom programs compress schedules when survey, locate, and construction share one PMO rhythm — mirror Dycom’s turnkey framing in your RFP structure.',
      bullets: [
        'Add locating milestones ahead of fiber platoon mobilization',
        'Specify restoration SLAs aligned to storm mutual-aid commitments',
        'Reference fulfillment pages for residential install surge capacity',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Services catalog',
    },
    'investors::Job Seeker': {
      id: 'ai-inv-js',
      headline: 'AI suggestion — understand employer stability before you apply',
      body:
        'Public filings summarize Dycom’s markets and risks — helpful context when evaluating long-term craft employment and geographic transfers.',
      bullets: [
        'Read the latest annual report overview for strategic priorities',
        'Compare shareholder communications with regional hiring pushes',
        'Use governance pages to learn about leadership stability',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Investor news hub',
    },
    'investors::Investor': {
      id: 'ai-inv-inv',
      headline: 'AI suggestion — stack filings, events, and stock tools',
      body:
        'Start from Investor Relations, then drill into SEC filings and replay recent conferences — Dycom surfaces governance documents alongside financial archives.',
      bullets: [
        'Bookmark quarterly packets for estimate reconciliation',
        'Download committee charters when evaluating oversight quality',
        'Enable email alerts for new filings and presentations',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'SEC filings & reports',
    },
    'investors::Telecom Provider': {
      id: 'ai-inv-tp',
      headline: 'AI suggestion — monitor supplier financial health',
      body:
        'Telecom procurement teams use investor updates to gauge subcontractor capacity and capital discipline during multi-year fiber awards.',
      bullets: [
        'Read earnings commentary on backlog coverage vs labor supply',
        'Track covenant and liquidity metrics in periodic filings',
        'Watch event replays for commentary on carrier spending outlook',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Investor events',
    },
  };

  const order: SearchBucket[] = ['careers', 'services', 'investors'];
  for (const b of order) {
    if (buckets.includes(b)) {
      const singleKey = `${b}::${user ?? 'any'}`;
      if (pool[singleKey]) return pool[singleKey];
    }
  }

  if (buckets.includes('careers')) {
    return (
      pool[`careers::${user ?? 'any'}`] ?? {
        id: 'ai-car-gen',
        headline: 'AI suggestion — start with Careers home',
        body:
          'Filter Opportunities after reading Benefits and the recruitment process — Dycom mirrors typical enterprise ATS flows with safety onboarding checkpoints.',
        bullets: [
          'Use Benefits pages to compare medical and retirement options',
          'Life@Dycom helps explain regional culture differences',
          'Benefit plan disclosures contain regulatory plan notices',
        ],
        learnMoreHref: DYCOM_PUBLIC_BASE,
        learnMoreLabel: 'Careers landing',
      }
    );
  }
  if (buckets.includes('services')) {
    return (
      pool[`services::${user ?? 'any'}`] ?? {
        id: 'ai-svc-gen',
        headline: 'AI suggestion — choose a service line to narrow results',
        body:
          'Wireline construction, wireless builds, engineering, locating, fulfillment, and maintenance each map to different carrier procurement tracks.',
        bullets: [
          'What we do summarizes Dycom’s nationwide contracting footprint',
          'Project management ties turnkey governance for large programs',
          'Pair Engineering with Wireline when scopes include survey-to-build handoffs',
        ],
        learnMoreHref: DYCOM_PUBLIC_BASE,
        learnMoreLabel: 'Services overview',
      }
    );
  }
  if (buckets.includes('investors')) {
    return (
      pool[`investors::${user ?? 'any'}`] ?? {
        id: 'ai-inv-gen',
        headline: 'AI suggestion — anchor on filings first',
        body:
          'Financials & filings host SEC documents; governance covers committees and leadership; events capture management narratives.',
        bullets: ['Stock information tools supplement filing metrics', 'Email alerts help track new disclosures'],
        learnMoreHref: DYCOM_PUBLIC_BASE,
        learnMoreLabel: 'Investor relations',
      }
    );
  }

  if (n.length >= 3) {
    const generic: AiSearchInsight = {
      id: `ai-gen-${key}`,
      headline: 'AI suggestion — try careers, services, or investor keywords',
      body:
        'Popular Dycom site searches combine talent topics (benefits, recruitment), delivery topics (wireless, fiber, fulfillment), and capital-markets topics (filings, stock, governance).',
      bullets: [
        'Switch demo users to see personalized supplemental rows',
        'Use content type filters to separate Careers pages from Services lines',
      ],
      learnMoreHref: DYCOM_PUBLIC_BASE,
      learnMoreLabel: 'Visit DycomInd.com',
    };
    return generic;
  }

  return null;
}

export function itemMetadataLine(item: SearchResultItem): string {
  const type = searchFacetLabels.contentType[item.contentType];
  const when = item.dateLabel ?? 'Dycom';
  const trail = item.breadcrumb?.length ? item.breadcrumb.join(' · ') : '';
  const badge = item.badgeLabel ?? '';
  const bits = [type, when, badge, trail].filter(Boolean);
  return bits.join(' · ');
}
