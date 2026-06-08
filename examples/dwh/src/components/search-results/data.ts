/**
 * Mock search catalog for ThreatLocker (threatlocker.com).
 * Data only — UI lives in SearchResults.tsx.
 */

import type { DemoUserTaxonomy } from '@/lib/dwh-buyer-personas';

export type { DemoUserTaxonomy };
export { parseDemoUserTaxonomy } from '@/lib/dwh-buyer-personas';

export type SearchContentType = 'product' | 'blog' | 'service' | 'content';

export type SearchCategory =
  | 'capabilities'
  | 'solutions'
  | 'compliance'
  | 'threatResearch'
  | 'blogs'
  | 'pressReleases'
  | 'keynotesNews'
  | 'mspOperations';

export type SearchBrand =
  | 'zeroTrust'
  | 'ransomware'
  | 'compliance'
  | 'endpointSecurity'
  | 'networkCloud'
  | 'mspMssp';

export type SearchBucket =
  | 'capabilities'
  | 'zeroTrust'
  | 'compliance'
  | 'ransomware'
  | 'pam'
  | 'network'
  | 'cloud'
  | 'msp'
  | 'edrMdr'
  | 'blogs'
  | 'press';

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
};

export type AiSearchInsight = {
  id: string;
  headline: string;
  body: string;
  bullets: string[];
  learnMoreHref: string;
  learnMoreLabel?: string;
};

export const TL_BASE = 'https://www.threatlocker.com/';

export const RESULTS_PAGE_SIZE = 9;

export const searchFacetLabels = {
  contentType: {
    product: 'Capabilities',
    blog: 'Blogs',
    service: 'Solutions',
    content: 'Press & news',
  },
  category: {
    capabilities: 'Platform capabilities',
    solutions: 'Solutions',
    compliance: 'Compliance & frameworks',
    threatResearch: 'Threat research',
    blogs: 'Blog articles',
    pressReleases: 'Press releases',
    keynotesNews: 'Keynotes & in the news',
    mspOperations: 'MSP operations',
  },
  brand: {
    zeroTrust: 'Zero Trust',
    ransomware: 'Ransomware defense',
    compliance: 'Compliance',
    endpointSecurity: 'Endpoint security',
    networkCloud: 'Network & cloud',
    mspMssp: 'MSP / MSSP',
  },
} as const;

export const popularSearches = [
  'Zero Trust',
  'Allowlisting',
  'Ringfencing',
  'CMMC compliance',
  'MSP Conditional Access',
  'Stop ransomware',
  'FedRAMP',
  'ZTNA',
];

export const QUERY_BUCKET_SYNONYMS: Record<SearchBucket, readonly string[]> = {
  capabilities: [
    'capability',
    'capabilities',
    'product',
    'products',
    'platform',
    'allowlisting',
    'ringfencing',
    'pam',
    'patch',
    'firewall',
    'edr',
    'mdr',
  ],
  zeroTrust: ['zero trust', 'zerotrust', 'default deny', 'default-deny', 'deny by default'],
  compliance: [
    'compliance',
    'cmmc',
    'iso 27001',
    'fedramp',
    'nist',
    'hipaa',
    'soc 2',
    'essential 8',
    'audit',
    'framework',
    'dac',
  ],
  ransomware: ['ransomware', 'extortion', 'breach', 'locker'],
  pam: ['privileged', 'privilege', 'admin', 'standing privilege', 'epm'],
  network: ['network', 'ztna', 'vpn', 'firewall', 'lateral', 'endpoint firewall'],
  cloud: ['cloud', 'saas', 'credentials', 'oauth', 'm365', 'azure'],
  msp: ['msp', 'mssp', 'multi-tenant', 'partner', 'conditional access', 'cipp', 'syncro'],
  edrMdr: ['edr', 'mdr', 'detection', 'response', 'soc', 'threat detection'],
  blogs: ['blog', 'article', 'guide', 'how to'],
  press: ['press', 'release', 'announcement', 'news', 'keynote', 'podcast'],
};

const QUERY_STOP_WORDS = new Set(['and', 'or', 'the', 'for', 'with', 'from', 'your', 'our', 'are', 'you']);

const TL_PHOTO_IDS: readonly string[] = [
  '1550751827-4bd374c1f58b',
  '1563986768609-322da13575f3',
  '1526374969488-56653f6cdc43',
  '1614064554769-814064e778a0',
  '1633265486064-086b219458ec',
  '1555949963-aa79e7381875',
  '1451187580459-43490279c0fa',
  '1516321318523-f06f85e504b3',
  '1504639725590-34d0984388bd',
  '1558494949-ef010cbdcc31',
  '1551288049-bebda4e38f71',
  '1563013544-824ae1b704d3',
];

function buildCatalogImageUrl(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
}

function catalogDemoImage(slot: number): string {
  const len = TL_PHOTO_IDS.length;
  const id = TL_PHOTO_IDS[((slot % len) + len) % len]!;
  return buildCatalogImageUrl(id);
}

export function getDefaultCardImage(): string {
  return catalogDemoImage(0);
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
      if (n.includes(syn) || words.some((w) => w.length > 2 && syn.includes(w))) {
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
  if (buckets.length && !itemMatchesBuckets(item, buckets)) return false;
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
  if (buckets.length) return words.some((w) => hay.includes(w));
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
  if (activeDemoUserTaxonomy && item.demoUserTaxonomy === activeDemoUserTaxonomy) score += 25;
  for (const b of detectSearchBuckets(n)) {
    if (item.searchBuckets.includes(b)) score += 8;
  }
  return score;
}

export function supplementalResultsForDemoUserTaxonomy(persona: DemoUserTaxonomy): SearchResultItem[] {
  const code =
    persona === 'First-time homebuyers'
      ? 'first-time'
      : persona === 'Move-up Families'
        ? 'move-up'
        : 'empty-nesters';

  const rows: Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[] =
    persona === 'First-time homebuyers'
      ? [
          {
            title: 'Homebuying made simple for first-time buyers',
            description:
              'Step-by-step guidance on financing, design choices, and what to expect from contract through closing.',
            href: 'https://www.davidweekleyhomes.com/',
            contentType: 'content',
            categories: ['solutions', 'blogs'],
            brands: ['zeroTrust', 'endpointSecurity'],
            searchBuckets: ['blogs', 'capabilities'],
            dateLabel: 'Personalized for first-time buyers',
            breadcrumb: ['Homebuying Help', 'Buying'],
            matchTerms: ['first-time', 'financing', 'mortgage', 'buying', 'new home'],
            imageSrc: catalogDemoImage(0),
            isNew: true,
          },
          {
            title: 'Financial calculators and pre-approval resources',
            description:
              'Estimate monthly payments and explore financing options before you tour model homes.',
            href: 'https://www.davidweekleyhomes.com/',
            contentType: 'service',
            categories: ['solutions'],
            brands: ['compliance'],
            searchBuckets: ['capabilities'],
            dateLabel: 'Financing tools',
            breadcrumb: ['Homebuying Help', 'Financing'],
            matchTerms: ['calculator', 'payment', 'loan', 'budget', 'afford'],
            imageSrc: catalogDemoImage(1),
          },
          {
            title: 'Quick move-in homes ready now',
            description:
              'Browse move-in ready homes across David Weekley markets when you want a shorter path to closing.',
            href: 'https://www.davidweekleyhomes.com/',
            contentType: 'product',
            categories: ['capabilities'],
            brands: ['endpointSecurity'],
            searchBuckets: ['capabilities'],
            dateLabel: 'Available now',
            breadcrumb: ['Find a Home', 'Quick Move In'],
            matchTerms: ['quick move', 'inventory', 'available', 'ready'],
            imageSrc: catalogDemoImage(2),
          },
        ]
      : persona === 'Move-up Families'
        ? [
            {
              title: 'More space, better design — communities for growing families',
              description:
                'Explore floor plans with flexible living areas, bonus rooms, and outdoor spaces built for everyday life.',
              href: 'https://www.davidweekleyhomes.com/',
              contentType: 'content',
              categories: ['solutions', 'blogs'],
              brands: ['zeroTrust', 'networkCloud'],
              searchBuckets: ['blogs', 'zeroTrust'],
              dateLabel: 'Personalized for move-up families',
              breadcrumb: ['Find a Home', 'Communities'],
              matchTerms: ['move-up', 'family', 'floor plan', 'community', 'upgrade'],
              imageSrc: catalogDemoImage(3),
              isNew: true,
            },
            {
              title: 'Design Center inspiration for your next home',
              description:
                'Personalize finishes, fixtures, and details with David Weekley design consultants.',
              href: 'https://www.davidweekleyhomes.com/',
              contentType: 'service',
              categories: ['solutions'],
              brands: ['mspMssp'],
              searchBuckets: ['capabilities'],
              dateLabel: 'Designing your home',
              breadcrumb: ['Homebuying Help', 'Designing'],
              matchTerms: ['design center', 'options', 'finishes', 'personalize'],
              imageSrc: catalogDemoImage(4),
            },
            {
              title: 'EnergySaver homes for long-term comfort',
              description:
                'Learn how EnergySaver features support efficiency and lower utility costs in your new home.',
              href: 'https://www.davidweekleyhomes.com/',
              contentType: 'product',
              categories: ['capabilities'],
              brands: ['endpointSecurity', 'zeroTrust'],
              searchBuckets: ['capabilities', 'zeroTrust'],
              dateLabel: 'EnergySaver',
              breadcrumb: ['The David Weekley Difference', 'EnergySaver'],
              matchTerms: ['energy', 'efficiency', 'utilities', 'comfort'],
              imageSrc: catalogDemoImage(5),
            },
          ]
        : [
            {
              title: 'Right-sized living for your next chapter',
              description:
                'Discover single-story and low-maintenance plans designed for comfort, accessibility, and ease.',
              href: 'https://www.davidweekleyhomes.com/',
              contentType: 'service',
              categories: ['solutions', 'compliance'],
              brands: ['compliance', 'zeroTrust'],
              searchBuckets: ['compliance', 'zeroTrust'],
              dateLabel: 'Personalized for empty nesters',
              breadcrumb: ['Find a Home', 'Floor plans'],
              matchTerms: ['empty nester', 'downsize', 'single story', 'maintenance'],
              imageSrc: catalogDemoImage(6),
              isNew: true,
            },
            {
              title: 'Schedule a personal model home tour',
              description:
                'Walk through finished spaces and experience the David Weekley difference with a guided tour.',
              href: 'https://www.davidweekleyhomes.com/',
              contentType: 'content',
              categories: ['capabilities', 'compliance'],
              brands: ['compliance', 'endpointSecurity'],
              searchBuckets: ['compliance', 'capabilities'],
              dateLabel: 'Visit a model',
              breadcrumb: ['Contact', 'Schedule tour'],
              matchTerms: ['tour', 'model home', 'visit', 'appointment'],
              imageSrc: catalogDemoImage(7),
            },
            {
              title: 'Maintaining your David Weekley home',
              description:
                'Helpful resources for caring for your home after move-in, from warranty support to seasonal upkeep.',
              href: 'https://www.davidweekleyhomes.com/',
              contentType: 'content',
              categories: ['pressReleases', 'compliance'],
              brands: ['compliance', 'zeroTrust'],
              searchBuckets: ['press', 'compliance'],
              dateLabel: 'Homeownership support',
              breadcrumb: ['Homebuying Help', 'Maintaining'],
              matchTerms: ['warranty', 'maintain', 'homeowner', 'support'],
              imageSrc: catalogDemoImage(8),
            },
          ];

  return rows.map((row, i) => ({
    ...row,
    id: `demo-sup-${code}-${i + 1}`,
    demoUserTaxonomy: persona,
  }));
}

function result(partial: Omit<SearchResultItem, 'href'> & { href?: string }): SearchResultItem {
  return {
    href: partial.href ?? TL_BASE,
    imageSrc: partial.imageSrc ?? catalogDemoImage(6),
    ...partial,
  };
}

type CatalogSeed = Omit<SearchResultItem, 'id' | 'href' | 'imageSrc'> & {
  id: string;
  href?: string;
  imageSlot?: number;
};

function fromSeed(seed: CatalogSeed): SearchResultItem {
  return result({
    ...seed,
    href: seed.href ?? TL_BASE,
    imageSrc: catalogDemoImage(seed.imageSlot ?? 6),
  });
}

const capabilityProducts: CatalogSeed[] = [
  {
    id: 'cap-allowlisting',
    title: 'Allowlisting (Application Control)',
    description:
      'Allows only approved applications, scripts, executables, and libraries to run; blocks unknown software and ransomware by default.',
    href: `${TL_BASE}platform/allowlisting`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['zeroTrust', 'ransomware', 'endpointSecurity'],
    searchBuckets: ['capabilities', 'zeroTrust', 'ransomware'],
    breadcrumb: ['Capabilities', 'Allowlisting'],
    matchTerms: ['allowlisting', 'application control', 'default deny', 'executable', 'script'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 0,
  },
  {
    id: 'cap-ringfencing',
    title: 'Ringfencing™',
    description:
      'Restricts what trusted applications can do — for example preventing Microsoft Word from launching PowerShell or accessing sensitive resources.',
    href: `${TL_BASE}platform/ringfencing`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['zeroTrust', 'endpointSecurity'],
    searchBuckets: ['capabilities', 'zeroTrust'],
    breadcrumb: ['Capabilities', 'Ringfencing'],
    matchTerms: ['ringfencing', 'ring fence', 'powershell', 'lateral movement'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 1,
  },
  {
    id: 'cap-ztna',
    title: 'Zero Trust Network Access (ZTNA)',
    description:
      'Controls access to internal resources and applications based on identity and device trust rather than traditional VPN access.',
    href: `${TL_BASE}platform/zero-trust-network-access`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['zeroTrust', 'networkCloud'],
    searchBuckets: ['network', 'zeroTrust', 'capabilities'],
    breadcrumb: ['Capabilities', 'ZTNA'],
    matchTerms: ['ztna', 'network access', 'vpn replacement', 'remote access'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 2,
  },
  {
    id: 'cap-cloud',
    title: 'Zero Trust Cloud Access',
    description:
      'Protects access to cloud services even when credentials are compromised.',
    href: `${TL_BASE}platform/zero-trust-cloud-access`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['zeroTrust', 'networkCloud'],
    searchBuckets: ['cloud', 'zeroTrust', 'capabilities'],
    breadcrumb: ['Capabilities', 'Zero Trust Cloud Access'],
    matchTerms: ['cloud access', 'saas', 'credentials', 'oauth', 'compromised'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 3,
  },
  {
    id: 'cap-pam',
    title: 'Privileged Access Management (PAM)',
    description:
      'Removes standing administrator rights and grants elevated privileges only when required.',
    href: `${TL_BASE}platform/privileged-access-management`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['endpointSecurity', 'compliance'],
    searchBuckets: ['pam', 'capabilities', 'compliance'],
    breadcrumb: ['Capabilities', 'PAM'],
    matchTerms: ['pam', 'privileged access', 'admin rights', 'least privilege', 'epm'],
    demoUserTaxonomy: 'Empty Nesters',
    imageSlot: 4,
  },
  {
    id: 'cap-firewall',
    title: 'Endpoint Firewall / Network Control',
    description:
      'Applies device-level firewall policies and controls network communication to contain lateral movement.',
    href: `${TL_BASE}platform/network-control`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['networkCloud', 'endpointSecurity'],
    searchBuckets: ['network', 'capabilities'],
    breadcrumb: ['Capabilities', 'Network Control'],
    matchTerms: ['firewall', 'network control', 'lateral movement', 'endpoint firewall'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 5,
  },
  {
    id: 'cap-storage',
    title: 'External Storage Device Control',
    description: 'Manages and restricts USB drives and other removable media.',
    href: `${TL_BASE}platform/external-storage-device-control`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['endpointSecurity', 'ransomware'],
    searchBuckets: ['capabilities', 'ransomware'],
    breadcrumb: ['Capabilities', 'Storage device control'],
    matchTerms: ['usb', 'removable media', 'external storage', 'device control'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 6,
  },
  {
    id: 'cap-data-storage',
    title: 'Data Storage Access Control',
    description:
      'Controls access to files, folders, and storage locations to help prevent data exfiltration.',
    href: `${TL_BASE}platform/data-storage-access-control`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['endpointSecurity', 'compliance'],
    searchBuckets: ['capabilities', 'compliance'],
    breadcrumb: ['Capabilities', 'Data storage access'],
    matchTerms: ['data exfiltration', 'file access', 'storage control', 'dlp'],
    demoUserTaxonomy: 'Empty Nesters',
    imageSlot: 7,
  },
  {
    id: 'cap-edr',
    title: 'Endpoint Detection & Response (EDR)',
    description: 'Detects and isolates suspicious endpoint activity in real time.',
    href: `${TL_BASE}platform/edr-real-time-threat-detection`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['endpointSecurity'],
    searchBuckets: ['edrMdr', 'capabilities'],
    breadcrumb: ['Capabilities', 'EDR'],
    matchTerms: ['edr', 'detection', 'response', 'isolate', 'threat detection'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 8,
  },
  {
    id: 'cap-mdr',
    title: 'Managed Detection & Response (MDR)',
    description:
      'Threat monitoring and response services managed by ThreatLocker Cyber Hero security experts.',
    href: `${TL_BASE}platform/managed-detection-and-response-mdr`,
    contentType: 'product',
    categories: ['capabilities', 'mspOperations'],
    brands: ['endpointSecurity', 'mspMssp'],
    searchBuckets: ['edrMdr', 'msp', 'capabilities'],
    breadcrumb: ['Capabilities', 'MDR'],
    matchTerms: ['mdr', 'managed detection', 'cyber hero', '24/7', 'soc'],
    demoUserTaxonomy: 'First-time homebuyers',
    imageSlot: 9,
  },
  {
    id: 'cap-config',
    title: 'Centralized Configuration Management',
    description:
      'Manages security policies and configurations across endpoints from a central console.',
    href: `${TL_BASE}platform/centralized-configuration-management`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['endpointSecurity', 'zeroTrust'],
    searchBuckets: ['capabilities', 'zeroTrust'],
    breadcrumb: ['Capabilities', 'Configuration management'],
    matchTerms: ['configuration', 'policy', 'centralized', 'baseline'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 10,
  },
  {
    id: 'cap-patch',
    title: 'Patch Management',
    description: 'Helps deploy and manage software updates and patches across endpoints.',
    href: `${TL_BASE}platform/patch-management`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['endpointSecurity'],
    searchBuckets: ['capabilities'],
    breadcrumb: ['Capabilities', 'Patch Management'],
    matchTerms: ['patch', 'update', 'vulnerability', 'remediation'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 11,
  },
  {
    id: 'cap-web',
    title: 'Web Content Control',
    description: 'Controls and restricts access to websites and web content.',
    href: `${TL_BASE}platform/web-content-control`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['endpointSecurity', 'networkCloud'],
    searchBuckets: ['capabilities', 'cloud'],
    breadcrumb: ['Capabilities', 'Web content control'],
    matchTerms: ['web filter', 'browser', 'phishing', 'web content'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 0,
  },
  {
    id: 'cap-testing',
    title: 'Controlled Application Testing Environment',
    description: 'Lets administrators test software before broadly approving it in allowlists.',
    href: `${TL_BASE}platform/controlled-application-testing-environment`,
    contentType: 'product',
    categories: ['capabilities'],
    brands: ['zeroTrust', 'endpointSecurity'],
    searchBuckets: ['capabilities', 'zeroTrust'],
    breadcrumb: ['Capabilities', 'Application testing'],
    matchTerms: ['testing', 'sandbox', 'approve', 'software trust'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 1,
  },
];

const solutionServices: CatalogSeed[] = [
  {
    id: 'sol-ransomware',
    title: 'Stop ransomware',
    description:
      'Deny-by-default application control breaks ransomware execution paths before encryption begins.',
    href: `${TL_BASE}solutions/stop-ransomware`,
    contentType: 'service',
    categories: ['solutions'],
    brands: ['ransomware', 'zeroTrust'],
    searchBuckets: ['ransomware', 'zeroTrust'],
    breadcrumb: ['Solutions', 'Stop ransomware'],
    matchTerms: ['stop ransomware', 'deny by default', 'extortion'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 2,
  },
  {
    id: 'sol-compliance',
    title: 'Achieve compliance',
    description:
      'Endpoints are validated continuously, evidence is logged automatically, and gaps are flagged for remediation.',
    href: `${TL_BASE}solutions/achieve-compliance`,
    contentType: 'service',
    categories: ['solutions', 'compliance'],
    brands: ['compliance', 'zeroTrust'],
    searchBuckets: ['compliance', 'zeroTrust'],
    breadcrumb: ['Solutions', 'Achieve compliance'],
    matchTerms: ['compliance', 'audit', 'framework', 'evidence'],
    demoUserTaxonomy: 'Empty Nesters',
    imageSlot: 3,
  },
  {
    id: 'sol-phishing',
    title: 'Stop token and phishing theft',
    description:
      'Block unauthorized sessions even when credentials or MFA tokens are stolen.',
    href: `${TL_BASE}solutions/stop-token-and-phishing-theft`,
    contentType: 'service',
    categories: ['solutions'],
    brands: ['zeroTrust', 'networkCloud'],
    searchBuckets: ['zeroTrust', 'cloud'],
    breadcrumb: ['Solutions', 'Phishing & token theft'],
    matchTerms: ['phishing', 'token', 'credential theft', 'session'],
    demoUserTaxonomy: 'Empty Nesters',
    imageSlot: 4,
  },
  {
    id: 'sol-privilege',
    title: 'Reduce admin privilege abuse',
    description: 'Remove forgotten standing privilege and cut breach risk immediately.',
    href: `${TL_BASE}solutions/reduce-admin-privilege-abuse`,
    contentType: 'service',
    categories: ['solutions'],
    brands: ['endpointSecurity', 'compliance'],
    searchBuckets: ['pam', 'compliance'],
    breadcrumb: ['Solutions', 'Admin privilege abuse'],
    matchTerms: ['admin abuse', 'privilege', 'standing access'],
    demoUserTaxonomy: 'Empty Nesters',
    imageSlot: 5,
  },
  {
    id: 'sol-exfil',
    title: 'Stop data exfiltration',
    description: 'Make data exfiltration structurally difficult with storage and ringfencing controls.',
    href: `${TL_BASE}solutions/stop-data-exfiltration`,
    contentType: 'service',
    categories: ['solutions'],
    brands: ['endpointSecurity', 'compliance'],
    searchBuckets: ['capabilities', 'compliance'],
    breadcrumb: ['Solutions', 'Data exfiltration'],
    matchTerms: ['exfiltration', 'data loss', 'insider'],
    demoUserTaxonomy: 'Empty Nesters',
    imageSlot: 6,
  },
  {
    id: 'sol-lateral',
    title: 'Contain lateral movement',
    description:
      'Stop a compromised machine from becoming an enterprise-wide incident with network and application controls.',
    href: `${TL_BASE}solutions/contain-lateral-movement`,
    contentType: 'service',
    categories: ['solutions'],
    brands: ['networkCloud', 'zeroTrust'],
    searchBuckets: ['network', 'zeroTrust'],
    breadcrumb: ['Solutions', 'Lateral movement'],
    matchTerms: ['lateral movement', 'segmentation', 'contain'],
    demoUserTaxonomy: 'Move-up Families',
    imageSlot: 7,
  },
];

type BlogSeed = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category?: SearchCategory;
  buckets?: SearchBucket[];
  persona?: DemoUserTaxonomy;
  terms?: string[];
  slot?: number;
};

const blogSeeds: BlogSeed[] = [
  {
    slug: 'claude-mythos-zero-trust-ai',
    title: "The Claude Mythos Preview proves now is the time for Zero Trust",
    description:
      'Anthropic’s Claude Mythos highlights why Zero Trust remains the best match for AI-driven cyber threats.',
    date: 'Jun 1, 2026',
    buckets: ['blogs', 'zeroTrust'],
    persona: 'Empty Nesters',
    terms: ['ai', 'claude', 'zero trust', 'agentic'],
    slot: 0,
  },
  {
    slug: 'mini-shai-hulud-supply-chain',
    title: 'How Mini Shai-Hulud worm moved through supply chain',
    description:
      'Supply chain compromise impacting GitHub, Nx Console, and TanStack npm packages.',
    date: 'May 27, 2026',
    buckets: ['blogs', 'capabilities'],
    persona: 'Move-up Families',
    terms: ['supply chain', 'npm', 'github', 'worm'],
    slot: 1,
  },
  {
    slug: 'essential-8-australia',
    title: "Essential 8: Australia's cybersecurity framework explained",
    description:
      'Guide to implementing the ACSC Essential 8 strategies with Zero Trust enforcement.',
    date: 'May 25, 2026',
    category: 'compliance',
    buckets: ['blogs', 'compliance'],
    persona: 'Empty Nesters',
    terms: ['essential 8', 'acsc', 'australia', 'framework'],
    slot: 2,
  },
  {
    slug: 'business-email-compromise',
    title: 'How to protect your organization from business email compromise',
    description: 'BEC attacks go beyond phishing — learn prevention with Zero Trust controls.',
    date: 'May 21, 2026',
    buckets: ['blogs', 'cloud'],
    persona: 'Empty Nesters',
    terms: ['bec', 'email', 'phishing', 'fraud'],
    slot: 3,
  },
  {
    slug: 'github-nx-console-breach',
    title: 'GitHub confirms compromised Nx Console extension was initial access vector',
    description: 'Research on malicious VS Code extension leading to thousands of repository compromises.',
    date: 'May 21, 2026',
    category: 'threatResearch',
    buckets: ['blogs', 'capabilities'],
    persona: 'Move-up Families',
    terms: ['github', 'vscode', 'extension', 'breach'],
    slot: 4,
  },
  {
    slug: 'windows-zero-days-yellowkey',
    title: 'What YellowKey and GreenPlasma zero-days reveal about Windows security',
    description:
      'Physical access and trusted native components remain under-estimated attack paths.',
    date: 'May 20, 2026',
    category: 'threatResearch',
    buckets: ['blogs', 'capabilities'],
    persona: 'Move-up Families',
    terms: ['zero-day', 'windows', 'privilege escalation'],
    slot: 5,
  },
  {
    slug: 'miniplasma-windows-zero-day',
    title: 'MiniPlasma: Windows privilege escalation zero-day',
    description: 'Working exploit elevates standard users to SYSTEM on patched Windows 11 systems.',
    date: 'May 19, 2026',
    category: 'threatResearch',
    buckets: ['blogs', 'capabilities'],
    persona: 'Move-up Families',
    terms: ['miniplasma', 'windows', 'system', 'zero-day'],
    slot: 6,
  },
  {
    slug: 'implement-zero-trust-framework',
    title: 'How to implement a Zero Trust security framework',
    description: 'Implement Zero Trust without friction using default-deny and least privilege.',
    date: 'May 18, 2026',
    buckets: ['blogs', 'zeroTrust'],
    persona: 'Move-up Families',
    terms: ['zero trust', 'framework', 'implementation'],
    slot: 7,
  },
  {
    slug: 'prevent-cyberattacks-best-practices',
    title: 'How to prevent cyberattacks: 10 proven cybersecurity best practices',
    description:
      'Zero Trust, default-deny, least privilege, and proactive threat prevention strategies.',
    date: 'May 16, 2026',
    buckets: ['blogs', 'zeroTrust'],
    persona: 'Empty Nesters',
    terms: ['best practices', 'prevention', 'zero trust'],
    slot: 8,
  },
  {
    slug: 'iso-27001-guide',
    title: 'What is ISO 27001 certification? A complete guide',
    description: 'Risk-based ISMS guidance for global security standards and certification.',
    date: 'May 14, 2026',
    category: 'compliance',
    buckets: ['blogs', 'compliance'],
    persona: 'Empty Nesters',
    terms: ['iso 27001', 'isms', 'certification'],
    slot: 9,
  },
  {
    slug: 'five-eyes-zero-trust-ai',
    title: 'Why the Five-Eyes Alliance sees Zero Trust as the best defense against agentic AI',
    description: 'Allied guidance recommends Zero Trust to counter evolving AI threat models.',
    date: 'May 8, 2026',
    buckets: ['blogs', 'zeroTrust'],
    persona: 'Empty Nesters',
    terms: ['five eyes', 'ai', 'agentic', 'zero trust'],
    slot: 10,
  },
  {
    slug: 'cmmc-compliance-guide',
    title: 'What is CMMC compliance? Requirements, levels, and audit prep',
    description: 'DoD contractor cybersecurity requirements and preparation for CMMC audits.',
    date: 'May 4, 2026',
    category: 'compliance',
    buckets: ['blogs', 'compliance'],
    persona: 'Empty Nesters',
    terms: ['cmmc', 'dod', 'contractor', 'audit'],
    slot: 11,
  },
  {
    slug: 'cybersecurity-frameworks-nist-soc2',
    title: 'Cybersecurity frameworks explained: NIST, SOC 2, ISO 27001, HIPAA, and more',
    description: 'Compare major frameworks and how Zero Trust supports continuous compliance.',
    date: 'Apr 24, 2026',
    category: 'compliance',
    buckets: ['blogs', 'compliance'],
    persona: 'Empty Nesters',
    terms: ['nist', 'soc 2', 'hipaa', 'frameworks'],
    slot: 0,
  },
  {
    slug: 'restrict-cipp-conditional-access',
    title: 'Restrict CyberDrain CIPP to specific IP addresses using Conditional Access',
    description: 'MSP guide for IP-restricting CIPP portal and API access in your tenant.',
    date: 'Apr 22, 2026',
    category: 'mspOperations',
    buckets: ['blogs', 'msp', 'cloud'],
    persona: 'First-time homebuyers',
    terms: ['cipp', 'conditional access', 'msp', 'ip restriction'],
    slot: 1,
  },
  {
    slug: 'vibe-hacking-ai-cybercrime',
    title: 'Vibe hacking: How AI-driven cybercrime outpaces EDR and signature defenses',
    description: 'Why Zero Trust stops AI-powered attacks that evade traditional AV and EDR.',
    date: 'Apr 21, 2026',
    buckets: ['blogs', 'zeroTrust', 'edrMdr'],
    persona: 'Empty Nesters',
    terms: ['vibe hacking', 'ai', 'edr', 'signature'],
    slot: 2,
  },
  {
    slug: 'nist-csf-2',
    title: 'NIST CSF 2.0: How the framework is evolving for modern cyber risk',
    description: 'Governance, AI security guidance, and operational use of NIST CSF 2.0.',
    date: 'Apr 10, 2026',
    category: 'compliance',
    buckets: ['blogs', 'compliance'],
    persona: 'Empty Nesters',
    terms: ['nist csf', '2.0', 'governance'],
    slot: 3,
  },
  {
    slug: 'privileged-identity-management',
    title: 'What is privileged identity management?',
    description: 'PIM fundamentals aligned with ThreatLocker PAM and least-privilege enforcement.',
    date: 'Apr 9, 2026',
    buckets: ['blogs', 'pam'],
    persona: 'Empty Nesters',
    terms: ['pim', 'privileged identity', 'pam'],
    slot: 4,
  },
  {
    slug: 'allowlisting-vs-blocklisting',
    title: 'Allowlisting vs. blocklisting: Which maximizes security?',
    description: 'Policy-driven allowlisting as the foundation of Zero Trust application control.',
    date: 'Apr 6, 2026',
    buckets: ['blogs', 'capabilities', 'zeroTrust'],
    persona: 'Move-up Families',
    terms: ['allowlisting', 'blocklisting', 'default deny'],
    slot: 5,
  },
  {
    slug: 'strong-allowlisting-policies',
    title: 'Why strong allowlisting policies are more important than ever',
    description: 'Permit only approved applications and block everything else — including ransomware.',
    date: 'Apr 3, 2026',
    category: 'capabilities',
    buckets: ['blogs', 'capabilities', 'ransomware'],
    persona: 'Move-up Families',
    terms: ['allowlisting', 'ransomware', 'policy'],
    slot: 6,
  },
  {
    slug: 'fedramp-zero-trust',
    title: 'Why FedRAMP matters for Zero Trust enforcement',
    description: 'FedRAMP Marketplace expectations for federal-grade cloud security and compliance.',
    date: 'Mar 30, 2026',
    category: 'compliance',
    buckets: ['blogs', 'compliance'],
    persona: 'Empty Nesters',
    terms: ['fedramp', 'federal', 'cloud'],
    slot: 7,
  },
  {
    slug: 'endpoint-privilege-management',
    title: 'What is endpoint privilege management?',
    description: 'Endpoint privilege management explained for IT and security leaders.',
    date: 'Mar 29, 2026',
    buckets: ['blogs', 'pam'],
    persona: 'Move-up Families',
    terms: ['epm', 'endpoint privilege', 'least privilege'],
    slot: 8,
  },
  {
    slug: 'restrict-m365-conditional-access',
    title: 'Restrict Microsoft 365 access to a specific IP address using Conditional Access',
    description: 'Step-by-step Entra ID Named Locations for M365 tenant protection.',
    date: 'Mar 4, 2026',
    category: 'mspOperations',
    buckets: ['blogs', 'msp', 'cloud'],
    persona: 'First-time homebuyers',
    terms: ['microsoft 365', 'conditional access', 'entra', 'ip'],
    slot: 9,
  },
  {
    slug: 'restrict-syncro-conditional-access',
    title: 'Restrict Syncro access to specific IP addresses using Conditional Access',
    description: 'MSP operational security for Syncro RMM sign-ins by IP range.',
    date: 'Mar 3, 2026',
    category: 'mspOperations',
    buckets: ['blogs', 'msp'],
    persona: 'First-time homebuyers',
    terms: ['syncro', 'rmm', 'conditional access', 'msp'],
    slot: 10,
  },
  {
    slug: 'restrict-threatlocker-portal-ip',
    title: 'Restrict ThreatLocker portal access to specific IP addresses',
    description: 'Add an extra layer of protection for your ThreatLocker admin portal.',
    date: 'Mar 8, 2026',
    category: 'mspOperations',
    buckets: ['blogs', 'msp', 'zeroTrust'],
    persona: 'First-time homebuyers',
    terms: ['portal', 'ip restriction', 'admin'],
    slot: 11,
  },
  {
    slug: 'zero-trust-overcoming-challenges',
    title: 'Zero Trust security: Overcoming common challenges',
    description: 'Practical guidance for IT teams adopting default-deny across the enterprise.',
    date: 'Feb 20, 2026',
    buckets: ['blogs', 'zeroTrust'],
    persona: 'Move-up Families',
    terms: ['zero trust', 'adoption', 'challenges'],
    slot: 0,
  },
  {
    slug: 'secure-remote-workforce-byod',
    title: 'Securing the remote workforce: Zero Trust for BYOD, VPN, and cloud',
    description: 'Replace implicit trust for remote users with identity- and device-aware access.',
    date: 'Feb 19, 2026',
    buckets: ['blogs', 'network', 'cloud'],
    persona: 'Move-up Families',
    terms: ['remote', 'byod', 'vpn', 'workforce'],
    slot: 1,
  },
  {
    slug: 'oktapus-phishing-mfa-bypass',
    title: '0ktapus phishing campaign: How attackers abuse Okta SSO to bypass MFA',
    description: 'Credential theft campaigns targeting SSO and why Zero Trust limits blast radius.',
    date: 'Feb 13, 2026',
    buckets: ['blogs', 'cloud'],
    persona: 'Empty Nesters',
    terms: ['okta', 'sso', 'mfa bypass', 'phishing'],
    slot: 2,
  },
  {
    slug: 'financial-services-zero-trust',
    title: 'Financial services cybersecurity: Why Zero Trust is critical',
    description: 'Ransomware and compliance pressures facing financial institutions.',
    date: 'Apr 27, 2026',
    buckets: ['blogs', 'compliance', 'zeroTrust'],
    persona: 'Empty Nesters',
    terms: ['financial services', 'banking', 'compliance'],
    slot: 3,
  },
  {
    slug: 'cybercrime-economy',
    title: 'The cybercrime economy: How it works and why it matters',
    description: 'Malware-as-a-service and affiliate models driving scalable attacks.',
    date: 'May 13, 2026',
    category: 'threatResearch',
    buckets: ['blogs'],
    persona: 'Empty Nesters',
    terms: ['cybercrime', 'affiliate', 'economy'],
    slot: 4,
  },
  {
    slug: 'insider-threats-best-practices',
    title: 'Best practices to prevent insider threats in cybersecurity',
    description: 'Ringfencing, storage control, and privilege reduction for insider risk.',
    date: 'Mar 26, 2026',
    buckets: ['blogs', 'pam'],
    persona: 'Empty Nesters',
    terms: ['insider threat', 'ringfencing', 'privilege'],
    slot: 5,
  },
];

const blogCatalog: SearchResultItem[] = blogSeeds.map((b, i) =>
  fromSeed({
    id: `blog-${b.slug}`,
    title: b.title,
    description: b.description,
    href: `${TL_BASE}resources/blogs`,
    contentType: 'blog',
    categories: [b.category ?? 'blogs'],
    brands: b.buckets?.includes('compliance')
      ? ['compliance', 'zeroTrust']
      : b.buckets?.includes('msp')
        ? ['mspMssp']
        : ['zeroTrust', 'endpointSecurity'],
    searchBuckets: b.buckets ?? ['blogs'],
    dateLabel: b.date,
    breadcrumb: ['Resources', 'Blogs'],
    matchTerms: b.terms,
    demoUserTaxonomy: b.persona,
    imageSlot: b.slot ?? i % 12,
  })
);

type PressSeed = { title: string; description: string; date: string; terms?: string[]; persona?: DemoUserTaxonomy };

const pressSeeds: PressSeed[] = [
  {
    title: 'ThreatLocker Highlights Key Cyber Threat Activity and Research from April 2026',
    description: 'Monthly threat activity roundup from ThreatLocker research teams.',
    date: 'May 1, 2026',
    terms: ['threat activity', 'research', 'april'],
    persona: 'Empty Nesters',
  },
  {
    title: 'ThreatLocker Hosts Orlando Hiring Event Amid Company Expansion',
    description: 'Regional tech growth and career opportunities at ThreatLocker headquarters.',
    date: 'Apr 6, 2026',
    terms: ['orlando', 'hiring', 'expansion'],
  },
  {
    title: 'ThreatLocker named lead sponsor for Cyber Florida CyberLaunch competition',
    description: 'Supporting grades 6–12 cybersecurity education and talent pipeline.',
    date: 'Apr 1, 2026',
    terms: ['education', 'sponsor', 'cyberlaunch'],
  },
  {
    title: 'ThreatLocker launches Zero Trust network and cloud access',
    description: 'New capabilities stop credential-based cyberattacks on network and cloud resources.',
    date: 'Mar 5, 2026',
    terms: ['ztna', 'cloud access', 'credentials', 'launch'],
    persona: 'Move-up Families',
  },
  {
    title: 'ThreatLocker announces Zero Trust World 2026 speaker lineup',
    description: 'Hands-on sessions and keynotes for the Zero Trust practitioner community.',
    date: 'Feb 12, 2026',
    terms: ['zero trust world', 'conference', 'ztw'],
  },
  {
    title: 'ThreatLocker Announces Expansion to Second Orlando Headquarters',
    description: 'Physical expansion supporting global Zero Trust platform growth.',
    date: 'Dec 12, 2025',
    terms: ['headquarters', 'orlando', 'expansion'],
  },
  {
    title: 'ThreatLocker CEO Danny Jenkins Named to Florida Trend Florida 500 List',
    description: 'Leadership recognition for ThreatLocker founder and CEO.',
    date: 'Oct 28, 2025',
    terms: ['danny jenkins', 'leadership', 'florida 500'],
  },
  {
    title: 'ThreatLocker Earns TX-RAMP Level 2 Certification',
    description: 'Texas risk authorization for state and local government cloud security.',
    date: 'Oct 6, 2025',
    terms: ['tx-ramp', 'texas', 'certification'],
    persona: 'Empty Nesters',
  },
  {
    title: 'ThreatLocker Joins Internet Watch Foundation to Tackle CSAM',
    description: 'Industry collaboration on child safety and abuse imagery online.',
    date: 'Oct 2, 2025',
    terms: ['iwf', 'partnership', 'safety'],
  },
  {
    title: 'ThreatLocker Launches No-Cost Zero Trust Cybersecurity Bootcamp',
    description: 'Free training program for practitioners adopting Zero Trust controls.',
    date: 'Sep 17, 2025',
    terms: ['bootcamp', 'training', 'zero trust'],
    persona: 'Move-up Families',
  },
  {
    title: 'ThreatLocker Expands Global Presence with Brisbane Office Opening',
    description: 'APAC expansion for partners and enterprise customers.',
    date: 'Sep 15, 2025',
    terms: ['brisbane', 'apac', 'global'],
    persona: 'First-time homebuyers',
  },
  {
    title: 'ThreatLocker Unveils Advanced Anomaly Detection for Cloud Security',
    description: 'Impossible travel insights and cloud anomaly detection capabilities.',
    date: 'Aug 13, 2025',
    terms: ['anomaly detection', 'cloud', 'impossible travel'],
    persona: 'Empty Nesters',
  },
  {
    title: 'ThreatLocker Chosen for the 2025 Inc. 5000 List',
    description: 'Recognition as one of America’s fastest-growing private companies.',
    date: 'Aug 12, 2025',
    terms: ['inc 5000', 'growth', 'award'],
  },
  {
    title: 'ThreatLocker Achieves FedRAMP Authorization',
    description: 'Federal-grade authorization for regulated and public-sector deployments.',
    date: 'Aug 5, 2025',
    terms: ['fedramp', 'federal', 'authorization'],
    persona: 'Empty Nesters',
  },
  {
    title: 'ThreatLocker Launches DAC for Configuration Risk and Compliance Gaps',
    description: 'Real-time visibility into misconfigurations and compliance drift.',
    date: 'Aug 5, 2025',
    terms: ['dac', 'configuration', 'compliance'],
    persona: 'Empty Nesters',
  },
  {
    title: 'ThreatLocker CEO Danny Jenkins Featured Speaker at Black Hat USA 2025',
    description: 'Zero Trust leadership on the Black Hat conference stage.',
    date: 'Aug 1, 2025',
    terms: ['black hat', 'keynote', 'las vegas'],
  },
  {
    title: 'ThreatLocker Receives Double Honors at teissAwards2025',
    description: 'Industry awards recognizing innovation in endpoint protection.',
    date: 'Apr 28, 2025',
    terms: ['teiss', 'award', 'endpoint'],
  },
  {
    title: 'ThreatLocker Expands Global Footprint with Saudi Arabia Infrastructure',
    description: 'Regional infrastructure investment for Middle East customers and partners.',
    date: 'Apr 22, 2025',
    terms: ['saudi arabia', 'infrastructure', 'global'],
  },
];

const pressCatalog: SearchResultItem[] = pressSeeds.map((p, i) =>
  fromSeed({
    id: `press-${i + 1}`,
    title: p.title,
    description: p.description,
    href: `${TL_BASE}resources/press-releases`,
    contentType: 'content',
    categories: ['pressReleases'],
    brands: ['zeroTrust'],
    searchBuckets: ['press'],
    dateLabel: p.date,
    breadcrumb: ['Resources', 'Press releases'],
    matchTerms: p.terms,
    demoUserTaxonomy: p.persona,
    imageSlot: (i + 3) % 12,
  })
);

type NewsSeed = { title: string; description: string; date: string; terms?: string[]; persona?: DemoUserTaxonomy };

const newsSeeds: NewsSeed[] = [
  {
    title: "Britain's Cyber Skills Gap Is Now A National Security Risk",
    description: 'Podcast conversation on workforce gaps and Zero Trust adoption in the UK.',
    date: 'Mar 26, 2026',
    terms: ['skills gap', 'uk', 'podcast'],
    persona: 'Empty Nesters',
  },
  {
    title: "ThreatLocker's Rob Allen on the future of zero trust security",
    description: 'SC Media interview on Zero Trust platform direction and MSP growth.',
    date: 'Mar 26, 2026',
    terms: ['rob allen', 'sc media', 'zero trust'],
    persona: 'First-time homebuyers',
  },
  {
    title: 'Stopping Cyberattacks Before They Start: Zero Trust Approach',
    description: 'Media coverage of proactive default-deny strategies.',
    date: 'Mar 16, 2026',
    terms: ['proactive', 'zero trust', 'prevention'],
    persona: 'Move-up Families',
  },
  {
    title: 'On the ground with CEO Danny Jenkins at Zero Trust World',
    description: 'Event coverage from Zero Trust World 2026.',
    date: 'Mar 9, 2026',
    terms: ['zero trust world', 'danny jenkins', 'event'],
  },
  {
    title: 'Cybersecurity in Asia-Pacific: Zero Trust Adoption Accelerates',
    description: 'APAC market trends for Zero Trust endpoint and cloud controls.',
    date: 'Mar 5, 2026',
    terms: ['apac', 'adoption', 'asia pacific'],
    persona: 'First-time homebuyers',
  },
  {
    title: "ThreatLocker's Rob Allen on the dual impact of AI",
    description: 'CyberScoop discussion on AI for defenders and attackers.',
    date: 'Mar 4, 2026',
    terms: ['ai', 'cyberscoop', 'rob allen'],
    persona: 'Empty Nesters',
  },
  {
    title: 'We Left It Vulnerable On Purpose – Rob Allen – PSW #910',
    description: 'Security weekly podcast on intentional vulnerability research and Zero Trust.',
    date: 'Jan 22, 2026',
    terms: ['podcast', 'psw', 'research'],
  },
  {
    title: 'CRN Deep Dive: The 2025 CRN Australia Scorecard',
    description: 'Channel partner analysis including ThreatLocker market momentum.',
    date: 'Dec 10, 2025',
    terms: ['crn', 'australia', 'channel'],
    persona: 'First-time homebuyers',
  },
  {
    title: 'Danny Jenkins - Founder of ThreatLocker and the Zero-Trust Revolution',
    description: 'No Password Required podcast episode on ThreatLocker founding story.',
    date: 'Dec 3, 2025',
    terms: ['podcast', 'founder', 'zero trust revolution'],
  },
  {
    title: 'ThreatLocker to hire hundreds for tech jobs in Orlando',
    description: 'Orlando Business Journal on regional hiring and tech ecosystem growth.',
    date: 'Nov 17, 2025',
    terms: ['orlando', 'jobs', 'hiring'],
  },
  {
    title: 'ThreatLocker CEO Danny Jenkins on growth and customer success',
    description: 'Executive interview on scaling Zero Trust globally.',
    date: 'Oct 23, 2025',
    terms: ['ceo', 'growth', 'interview'],
  },
  {
    title: "ThreatLocker Exec: 'The Bad Guys Are Not Working 9 To 5'",
    description: 'Media quote on 24/7 threat landscape and MDR value.',
    date: 'Oct 22, 2025',
    terms: ['mdr', '24/7', 'threats'],
    persona: 'First-time homebuyers',
  },
  {
    title: 'Dear Abby: Why Should I Trust a Vendor Selling Me Zero Trust?',
    description: 'CISO Series podcast on evaluating Zero Trust vendors.',
    date: 'Oct 21, 2025',
    terms: ['ciso series', 'vendor', 'evaluation'],
    persona: 'Empty Nesters',
  },
  {
    title: 'ThreatLocker Keynote Address at ITEXPO #TECHSUPERSHOW 2023',
    description: 'Keynote replay on Zero Trust platform vision.',
    date: 'Mar 10, 2023',
    terms: ['keynote', 'itexpo', 'techsupershow'],
    persona: 'Move-up Families',
  },
];

const newsCatalog: SearchResultItem[] = newsSeeds.map((n, i) =>
  fromSeed({
    id: `news-${i + 1}`,
    title: n.title,
    description: n.description,
    href: `${TL_BASE}resources/keynotes`,
    contentType: 'content',
    categories: ['keynotesNews'],
    brands: ['zeroTrust'],
    searchBuckets: ['press', 'blogs'],
    dateLabel: n.date,
    breadcrumb: ['Resources', 'Keynotes & podcasts'],
    matchTerms: n.terms,
    demoUserTaxonomy: n.persona,
    imageSlot: (i + 6) % 12,
  })
);

const homepageContent: SearchResultItem[] = [
  fromSeed({
    id: 'content-platform-overview',
    title: "Meet the world's leading Zero Trust platform",
    description:
      'Allow what you need. Block everything else by default, including ransomware and rogue code.',
    contentType: 'content',
    categories: ['capabilities', 'solutions'],
    brands: ['zeroTrust', 'ransomware'],
    searchBuckets: ['zeroTrust', 'capabilities'],
    dateLabel: 'Platform overview',
    breadcrumb: ['Home', 'Zero Trust platform'],
    matchTerms: ['zero trust platform', 'endpoint', 'cloud', 'network', 'ransomware'],
    imageSlot: 8,
  }),
  fromSeed({
    id: 'content-stop-exploits',
    title: 'Stop exploits before they run',
    description:
      'Ironclad Zero Trust with granular control over every app, script, and process — backed by 24/7 Cyber Hero support.',
    contentType: 'content',
    categories: ['solutions'],
    brands: ['zeroTrust', 'endpointSecurity'],
    searchBuckets: ['zeroTrust', 'capabilities'],
    dateLabel: 'Homepage',
    breadcrumb: ['Home', 'Capabilities carousel'],
    matchTerms: ['exploits', 'granular control', 'cyber hero'],
    imageSlot: 9,
  }),
  fromSeed({
    id: 'content-cyber-hero',
    title: 'ThreatLocker Cyber Hero Team — elite 24/7 support',
    description:
      'Award-winning support with typical response within 60 seconds, based in Orlando and serving worldwide.',
    contentType: 'content',
    categories: ['capabilities'],
    brands: ['mspMssp', 'endpointSecurity'],
    searchBuckets: ['edrMdr', 'msp'],
    dateLabel: 'Support',
    breadcrumb: ['Company', 'Cyber Hero Team'],
    matchTerms: ['cyber hero', 'support', '24/7', 'orlando'],
    demoUserTaxonomy: 'First-time homebuyers',
    imageSlot: 10,
  }),
];

export const searchCatalog: SearchResultItem[] = [
  ...capabilityProducts.map(fromSeed),
  ...solutionServices.map(fromSeed),
  ...blogCatalog,
  ...pressCatalog,
  ...newsCatalog,
  ...homepageContent,
];

export const contentTypes = Object.keys(searchFacetLabels.contentType) as SearchContentType[];
export const categories = Object.keys(searchFacetLabels.category) as SearchCategory[];
export const brands = Object.keys(searchFacetLabels.brand) as SearchBrand[];

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

  const personaHint =
    user === 'First-time homebuyers'
      ? 'Highlight financing tools, buying guides, and quick move-in options for first-time buyers.'
      : user === 'Move-up Families'
        ? 'Surface larger floor plans, design options, and family-friendly communities.'
        : user === 'Empty Nesters'
          ? 'Emphasize right-sized plans, model home tours, and low-maintenance living.'
          : 'Select a buyer persona in the Login menu to personalize ranking and supplemental results.';

  if (buckets.includes('compliance')) {
    return {
      id: `ai-compliance-${key}`,
      headline: 'AI suggestion — map controls to your compliance framework',
      body:
        'ThreatLocker supports continuous endpoint validation with logged evidence for CMMC, ISO 27001, NIST CSF, Essential 8, and FedRAMP programs.',
      bullets: [
        personaHint,
        'Review DAC and PAM capabilities for configuration and privilege governance',
        'Filter Press & news for FedRAMP, TX-RAMP, and authorization announcements',
      ],
      learnMoreHref: `${TL_BASE}solutions/achieve-compliance`,
      learnMoreLabel: 'Explore compliance solutions',
    };
  }

  if (buckets.includes('msp')) {
    return {
      id: `ai-msp-${key}`,
      headline: 'AI suggestion — start with MSP operational hardening',
      body:
        'ThreatLocker publishes Conditional Access playbooks for the SaaS platforms MSPs manage daily, plus MDR to extend your SOC.',
      bullets: [
        personaHint,
        'Search blogs for CIPP, Syncro, M365, and portal IP restriction guides',
        'Consider MDR and centralized configuration for multi-client policy baselines',
      ],
      learnMoreHref: `${TL_BASE}resources/blogs`,
      learnMoreLabel: 'Browse MSP guides',
    };
  }

  if (buckets.includes('ransomware') || buckets.includes('zeroTrust')) {
    return {
      id: `ai-zt-${key}`,
      headline: 'AI suggestion — enforce default-deny across endpoints',
      body:
        'Allowlisting and Ringfencing block unauthorized code execution — the fastest path to stop ransomware and rogue scripts.',
      bullets: [
        personaHint,
        'Pair Allowlisting with Patch Management to close known vulnerability gaps',
        'Review Stop ransomware solution content for deployment patterns',
      ],
      learnMoreHref: `${TL_BASE}solutions/stop-ransomware`,
      learnMoreLabel: 'Stop ransomware',
    };
  }

  if (buckets.includes('network') || buckets.includes('cloud')) {
    return {
      id: `ai-network-${key}`,
      headline: 'AI suggestion — extend Zero Trust beyond the endpoint',
      body:
        'ZTNA and Zero Trust Cloud Access replace implicit VPN trust with identity- and device-aware access to apps and SaaS.',
      bullets: [
        personaHint,
        'Compare ZTNA vs legacy VPN for remote workforce scenarios',
        'Use cloud access controls when credential theft is a primary concern',
      ],
      learnMoreHref: `${TL_BASE}platform/zero-trust-network-access`,
      learnMoreLabel: 'Explore ZTNA',
    };
  }

  if (buckets.includes('capabilities')) {
    return {
      id: `ai-cap-${key}`,
      headline: 'AI suggestion — build a capability stack',
      body:
        'ThreatLocker capabilities span application control, network/cloud access, privilege, EDR/MDR, and configuration management.',
      bullets: [
        personaHint,
        'Filter by Platform capabilities for the full product list',
        'Use Solutions facets to tie capabilities to outcomes like compliance or ransomware',
      ],
      learnMoreHref: TL_BASE,
      learnMoreLabel: 'Explore the platform',
    };
  }

  return {
    id: `ai-gen-${key}`,
    headline: 'AI suggestion — refine by capabilities, blogs, or press',
    body:
      'This ThreatLocker mock catalog includes platform capabilities, solution outcomes, blogs, press releases, and keynotes aligned to threatlocker.com.',
    bullets: [
      personaHint,
      'Try popular searches such as Zero Trust, Allowlisting, CMMC, or MSP Conditional Access',
      'Switch the Login persona to reorder results and surface personalized rows',
    ],
    learnMoreHref: TL_BASE,
    learnMoreLabel: 'Visit threatlocker.com',
  };
}

export function itemMetadataLine(item: SearchResultItem): string {
  const type = searchFacetLabels.contentType[item.contentType];
  const when = item.dateLabel ?? (item.contentType === 'product' ? 'Capability' : 'Resource');
  const trail = item.breadcrumb?.length ? item.breadcrumb.join(' · ') : '';
  const bits = [type, when, trail].filter(Boolean);
  return bits.join(' · ');
}
