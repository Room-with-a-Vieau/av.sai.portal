/**
 * Illumina site search — mock catalog, category filters, AI Q&A, and persona personalization.
 * Pattern aligned with illumina.com/search (Products, Learn, Tech Support, Manuals + extensions).
 */

import type { DemoUserTaxonomy } from '@/lib/demo-user-personas';
import { parseDemoUserTaxonomy } from '@/lib/demo-user-personas';

export type { DemoUserTaxonomy };
export { parseDemoUserTaxonomy };

export const ILLUMINA_BASE = 'https://www.illumina.com';

/** Primary filters (illumina.com) plus enhanced categories for this demo. */
export type SearchCategoryFilter =
  | 'all'
  | 'products'
  | 'learn'
  | 'techSupport'
  | 'manuals'
  | 'solutions'
  | 'software'
  | 'publications'
  | 'training';

/** Cross-cutting search themes — when detected in a query, all tagged catalog items match. */
export type SearchTopic = 'stratamap-spatial';

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: Exclude<SearchCategoryFilter, 'all'>;
  breadcrumb?: string[];
  dateLabel?: string;
  matchTerms?: string[];
  searchTopics?: SearchTopic[];
  documentType?: string;
  isNew?: boolean;
  demoUserTaxonomy?: DemoUserTaxonomy;
  visibleForDemoUsers?: DemoUserTaxonomy[];
};

export type FeaturedAnswer = {
  id: string;
  triggeredWhenQueryIncludes: string[];
  question: string;
  answer: string;
  learnMoreHref: string;
  learnMoreLabel?: string;
  /** Optional persona-specific answer variant */
  personaAnswer?: Partial<Record<DemoUserTaxonomy, string>>;
};

export type AiSearchInsight = {
  id: string;
  headline: string;
  body: string;
  bullets: string[];
  learnMoreHref: string;
  learnMoreLabel?: string;
};

export const RESULTS_PAGE_SIZE = 10;

export const categoryFilterLabels: Record<SearchCategoryFilter, string> = {
  all: 'All',
  products: 'Products',
  learn: 'Learn',
  techSupport: 'Tech Support',
  manuals: 'Manuals',
  solutions: 'Solutions',
  software: 'Software & Analysis',
  publications: 'Publications',
  training: 'Training',
};

export const categoryFilters: SearchCategoryFilter[] = [
  'all',
  'products',
  'learn',
  'techSupport',
  'manuals',
  'solutions',
  'software',
  'publications',
  'training',
];

export const popularSearches = [
  'spatial discovery',
  'StrataMap Spatial',
  'NovaSeq X',
  'library prep',
  'DRAGEN analysis',
  'clinical NGS',
  'BaseSpace',
  'TruSight Oncology',
];

export const suggestedQuestions = [
  'What is Illumina StrataMap Spatial?',
  'How do I get started with spatial transcriptomics?',
  'Where can I find StrataMap installation manuals?',
  'Which library prep kits are compatible with NovaSeq X?',
  'How do I validate a clinical NGS workflow?',
  'What is Illumina Connected Analytics?',
];

export const searchTools = [
  {
    label: 'Library Prep and Array Kit Selector',
    href: `${ILLUMINA_BASE}/techniques/microarrays/microarray-kits/library-prep-kit-selector.html`,
  },
  {
    label: 'Gene Panel and Array Finder',
    href: `${ILLUMINA_BASE}/products/by-type/gene-panel-finder.html`,
  },
  {
    label: 'Sequencing Method Explorer',
    href: `${ILLUMINA_BASE}/techniques/sequencing/ngs-method-explorer.html`,
  },
  {
    label: 'Custom Protocol Selector',
    href: `${ILLUMINA_BASE}/products/by-type/custom-protocol-selector.html`,
  },
];

export const featuredAnswers: FeaturedAnswer[] = [
  {
    id: 'fa-stratamap',
    triggeredWhenQueryIncludes: [
      'stratamap',
      'spatial',
      'spatial discovery',
      'spatial transcriptomics',
      'spatial omics',
      'what is illumina stratamap spatial',
      'what is stratamap spatial',
    ],
    question: 'What is Illumina StrataMap Spatial?',
    answer:
      'Illumina StrataMap Spatial is a scalable spatial discovery platform designed for unbiased, barrier-free profiling across tissue sections. It supports whole-transcriptome and targeted spatial workflows so labs can move from sample to insight with integrated Illumina sequencing and analysis.',
    learnMoreHref: `${ILLUMINA_BASE}/products/by-type/sequencing-kits.html`,
    learnMoreLabel: 'Explore StrataMap Spatial',
    personaAnswer: {
      'Academic/Research Lab Scientists':
        'For research labs, StrataMap Spatial enables hypothesis-driven spatial discovery with flexible panel design and publication-ready datasets integrated into common analysis pipelines.',
      'Clinical Lab Directors':
        'Clinical lab leaders evaluate StrataMap Spatial for translational studies and assay development paths that may extend toward regulated workflows with appropriate validation.',
      'Molecular Pathologists':
        'Pathologists use spatial outputs to correlate morphology with molecular signatures, supporting tumor microenvironment studies and biomarker discovery.',
      Procurement:
        'Procurement teams typically bundle StrataMap Spatial with compatible sequencers, reagent contracts, and service plans — request a quote for total cost of ownership modeling.',
    },
  },
  {
    id: 'fa-manuals',
    triggeredWhenQueryIncludes: ['manual', 'manuals', 'installation', 'guide', 'documentation'],
    question: 'Where do I find Illumina product manuals and documentation?',
    answer:
      'Product manuals, quick guides, and safety documents are published in Illumina Technical Support. Filter results by Manuals or search by instrument or kit name, then download PDFs for installation, maintenance, and operational procedures.',
    learnMoreHref: `${ILLUMINA_BASE}/support.html`,
    learnMoreLabel: 'Visit Tech Support',
  },
  {
    id: 'fa-library-prep',
    triggeredWhenQueryIncludes: ['library prep', 'library preparation', 'prep kit', 'rna prep', 'dna prep'],
    question: 'How do I choose a library preparation kit?',
    answer:
      'Use the Library Prep and Array Kit Selector to match sample type, throughput, and sequencer compatibility. Illumina prep workflows are optimized for NovaSeq, NextSeq, and MiSeq systems with documented compatibility matrices.',
    learnMoreHref: `${ILLUMINA_BASE}/techniques/microarrays/microarray-kits/library-prep-kit-selector.html`,
    learnMoreLabel: 'Open kit selector',
  },
  {
    id: 'fa-dragen',
    triggeredWhenQueryIncludes: ['dragen', 'secondary analysis', 'bioinformatics', 'pipeline', 'bcl'],
    question: 'What is DRAGEN secondary analysis?',
    answer:
      'DRAGEN provides accelerated secondary analysis for sequencing data — from FASTQ or BCL through alignment, variant calling, and specialized pipelines — on-premise or in Illumina Connected Analytics.',
    learnMoreHref: `${ILLUMINA_BASE}/products/by-type/software-and-analysis/dragen-bio-it-platform.html`,
    learnMoreLabel: 'DRAGEN platform',
  },
  {
    id: 'fa-clinical-ngs',
    triggeredWhenQueryIncludes: ['clinical', 'ivd', 'diagnostic', 'cap', 'clia', 'validation'],
    question: 'How do I validate a clinical NGS workflow?',
    answer:
      'Clinical labs document analytical validation, bioinformatics validation, and ongoing QC using Illumina clinical research and IVD resources, compliance guides, and recommended reference materials for your assay class.',
    learnMoreHref: `${ILLUMINA_BASE}/applications/clinical/clinical-research.html`,
    learnMoreLabel: 'Clinical research solutions',
    personaAnswer: {
      'Clinical Lab Directors':
        'Lab directors typically align validation plans with CAP/CLIA expectations, IQ/OQ/PQ documentation, and vendor change-control before patient reporting.',
      'Molecular Pathologists':
        'Pathologists focus validation evidence on variant interpretation, reportable range, and integration with LIS and sign-out workflows.',
    },
  },
  {
    id: 'fa-procurement',
    triggeredWhenQueryIncludes: ['quote', 'pricing', 'procurement', 'purchase', 'contract', 'tender'],
    question: 'How do I request a quote or manage procurement?',
    answer:
      'Contact Illumina sales or your account representative for instrument, reagent, and service quotes. Procurement teams can align capital equipment, consumable stocking, and multi-year service agreements in a single commercial package.',
    learnMoreHref: `${ILLUMINA_BASE}/company/contact-us.html`,
    learnMoreLabel: 'Contact Illumina',
    personaAnswer: {
      Procurement:
        'Include instrument list price, annual reagent forecasts, freight and storage requirements, and IT/security review for cloud analysis products in your RFP checklist.',
    },
  },
];

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
  'is',
  'was',
  'were',
  'does',
  'do',
  'can',
  'where',
  'when',
  'who',
  'why',
]);

/** Site brand tokens — optional for matching (users already search within Illumina). */
const BRAND_STOP_WORDS = new Set(['illumina', 'illumnia']);

const SEARCH_TOPIC_SYNONYMS: Record<SearchTopic, string[]> = {
  'stratamap-spatial': [
    'stratamap',
    'strata map',
    'strata-map',
    'spatial discovery',
    'spatial transcriptomics',
    'spatial omics',
    'stratamap spatial',
    'illumina stratamap',
    'what is illumina stratamap spatial',
  ],
};

export function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

function significantQueryWords(n: string): string[] {
  return n
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !QUERY_STOP_WORDS.has(w) && !BRAND_STOP_WORDS.has(w));
}

function itemHaystack(item: SearchResultItem): string {
  return [item.title, item.description, ...(item.breadcrumb ?? []), ...(item.matchTerms ?? [])]
    .join(' ')
    .toLowerCase();
}

export function detectQueryTopics(normalizedQuery: string): SearchTopic[] {
  const topics = new Set<SearchTopic>();
  for (const [topic, synonyms] of Object.entries(SEARCH_TOPIC_SYNONYMS) as [SearchTopic, string[]][]) {
    if (synonyms.some((phrase) => normalizedQuery.includes(phrase))) {
      topics.add(topic);
    }
  }
  if (
    normalizedQuery.includes('stratamap') &&
    normalizedQuery.includes('spatial') &&
    !topics.has('stratamap-spatial')
  ) {
    topics.add('stratamap-spatial');
  }
  return [...topics];
}

export function itemVisibleForDemoUser(item: SearchResultItem, user: DemoUserTaxonomy | null): boolean {
  if (!item.visibleForDemoUsers?.length) return true;
  if (!user) return false;
  return item.visibleForDemoUsers.includes(user);
}

export function itemMatchesQuery(item: SearchResultItem, q: string): boolean {
  const n = normalizeQuery(q);
  if (!n) return true;

  const topics = detectQueryTopics(n);
  if (topics.length && item.searchTopics?.some((topic) => topics.includes(topic))) {
    return true;
  }

  const hay = itemHaystack(item);
  if (n.length >= 4 && hay.includes(n)) return true;

  const words = significantQueryWords(n);
  if (!words.length) return true;

  const matchedCount = words.filter((w) => hay.includes(w)).length;
  const requiredMatches = words.length <= 1 ? 1 : Math.ceil(words.length / 2);
  return matchedCount >= requiredMatches;
}

export function relevanceScore(
  item: SearchResultItem,
  q: string,
  activeDemoUserTaxonomy: DemoUserTaxonomy | null
): number {
  const n = normalizeQuery(q);
  if (!n) return item.isNew ? 1 : 0;
  const words = significantQueryWords(n);
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const extra = (item.matchTerms ?? []).join(' ').toLowerCase();
  let score = 0;
  for (const w of words) {
    if (title.includes(w)) score += 6;
    if (desc.includes(w)) score += 3;
    if (extra.includes(w)) score += 4;
  }
  const topics = detectQueryTopics(n);
  if (topics.length && item.searchTopics?.some((topic) => topics.includes(topic))) {
    score += 50;
    if (title.includes('stratamap') || title.includes('spatial')) score += 10;
  }
  if (activeDemoUserTaxonomy && item.demoUserTaxonomy === activeDemoUserTaxonomy) score += 30;
  if (item.isNew) score += 2;
  return score;
}

export function selectFeaturedAnswer(
  query: string,
  persona: DemoUserTaxonomy | null
): (FeaturedAnswer & { displayAnswer: string }) | null {
  const n = normalizeQuery(query);
  if (n.length < 2) return null;
  let best: { fa: FeaturedAnswer; score: number } | null = null;
  for (const fa of featuredAnswers) {
    const score = fa.triggeredWhenQueryIncludes.filter((t) => n.includes(t.toLowerCase())).length;
    if (score > 0 && (!best || score > best.score)) best = { fa, score };
  }
  if (!best) return null;
  const personaText = persona && best.fa.personaAnswer?.[persona];
  return {
    ...best.fa,
    displayAnswer: personaText ?? best.fa.answer,
  };
}

export function selectAiSearchInsight(
  query: string,
  persona: DemoUserTaxonomy | null
): AiSearchInsight | null {
  const n = normalizeQuery(query);
  if (n.length < 2) return null;
  if (n.includes('spatial') || n.includes('stratamap')) {
    return {
      id: 'ai-spatial',
      headline: 'AI suggestion — start with spatial discovery resources',
      body:
        'Based on your query, prioritize StrataMap Spatial product pages, installation manuals, and learning modules on spatial transcriptomics workflow design.',
      bullets: [
        persona
          ? `Personalized for ${persona}: results tagged for your role are ranked higher.`
          : 'Select a persona in the header Login menu to personalize ranking.',
        'Filter by Manuals for installation and quick reference PDFs.',
        'Filter by Learn for webinars, protocols, and application notes.',
      ],
      learnMoreHref: `${ILLUMINA_BASE}/products/by-type/sequencing-kits.html`,
      learnMoreLabel: 'View spatial products',
    };
  }
  if (n.includes('novaseq') || n.includes('sequenc')) {
    return {
      id: 'ai-sequencing',
      headline: 'AI suggestion — sequencing workflow resources',
      body: 'Explore instrument pages, library prep compatibility, and DRAGEN analysis options for your throughput target.',
      bullets: [
        'Compare NovaSeq X Series specifications and reagent kits.',
        'Use the Sequencing Method Explorer to map sample type to workflow.',
        'Review training modules for instrument operation and maintenance.',
      ],
      learnMoreHref: `${ILLUMINA_BASE}/systems/sequencing-platforms.html`,
      learnMoreLabel: 'Sequencing platforms',
    };
  }
  return null;
}

function item(input: Omit<SearchResultItem, 'href'> & { href?: string }): SearchResultItem {
  return { href: input.href ?? ILLUMINA_BASE, ...input };
}

const STRATAMAP_SPATIAL_TOPIC: Pick<SearchResultItem, 'searchTopics'> = {
  searchTopics: ['stratamap-spatial'],
};

/** Core catalog — spatial discovery sample set plus persona-tagged rows. */
const baseCatalog: SearchResultItem[] = [
  item({
    id: 'prod-stratamap-spatial',
    title: 'Illumina StrataMap Spatial',
    description:
      'Scalable, unbiased, barrier-free spatial discovery platform for whole-transcriptome and targeted spatial profiling.',
    href: `${ILLUMINA_BASE}/products/by-type/sequencing-kits.html`,
    category: 'products',
    breadcrumb: ['Products', 'Sequencing kits'],
    matchTerms: ['stratamap', 'spatial', 'discovery', 'transcriptomics'],
    isNew: true,
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'prod-novaseq-x',
    title: 'NovaSeq X Series Sequencing Systems',
    description: 'High-throughput sequencing platforms designed for production-scale genomics and multiomic studies.',
    href: `${ILLUMINA_BASE}/systems/sequencing-platforms/novaseq-x-plus.html`,
    category: 'products',
    breadcrumb: ['Products', 'Instruments'],
    matchTerms: ['novaseq', 'sequencer', 'throughput'],
    demoUserTaxonomy: 'Lab Directors',
  }),
  item({
    id: 'prod-nextseq',
    title: 'NextSeq 1000 & 2000 Sequencing Systems',
    description: 'Flexible mid-throughput sequencers for research and clinical research applications.',
    href: `${ILLUMINA_BASE}/systems/sequencing-platforms/nextseq-1000-2000.html`,
    category: 'products',
    breadcrumb: ['Products', 'Instruments'],
    matchTerms: ['nextseq', 'sequencing'],
  }),
  item({
    id: 'manual-stratamap-install',
    title: 'StrataMap Spatial System — Installation Guide',
    description: 'Step-by-step installation, site requirements, and safety information for StrataMap Spatial.',
    href: `${ILLUMINA_BASE}/support.html`,
    category: 'manuals',
    documentType: 'PDF',
    breadcrumb: ['Support', 'Manuals', 'StrataMap Spatial'],
    matchTerms: ['manual', 'installation', 'stratamap', 'spatial'],
    demoUserTaxonomy: 'Operations Managers',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'manual-stratamap-quick',
    title: 'StrataMap Spatial — Quick Reference Card',
    description: 'Operational quick reference for daily startup, shutdown, and maintenance checkpoints.',
    href: `${ILLUMINA_BASE}/support.html`,
    category: 'manuals',
    documentType: 'PDF',
    breadcrumb: ['Support', 'Manuals'],
    matchTerms: ['quick reference', 'stratamap', 'spatial'],
    demoUserTaxonomy: 'Operations Managers',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'manual-novaseq-site-prep',
    title: 'NovaSeq X Series — Site Preparation Guide',
    description: 'Facility, electrical, network, and environmental specifications prior to instrument delivery.',
    href: `${ILLUMINA_BASE}/support.html`,
    category: 'manuals',
    documentType: 'PDF',
    breadcrumb: ['Support', 'Manuals', 'NovaSeq X'],
    matchTerms: ['site prep', 'installation', 'novaseq'],
    demoUserTaxonomy: 'Operations Managers',
  }),
  item({
    id: 'learn-spatial-transcriptomics',
    title: 'Introduction to Spatial Transcriptomics',
    description: 'Learn how spatial technologies map gene expression across tissue architecture for discovery research.',
    href: `${ILLUMINA_BASE}/science/genomics-research.html`,
    category: 'learn',
    breadcrumb: ['Learn', 'Techniques'],
    matchTerms: ['spatial', 'transcriptomics', 'discovery', 'learn'],
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'learn-spatial-workflow',
    title: 'Spatial Discovery Workflow Overview',
    description: 'From sample prep through imaging, library construction, sequencing, and analysis — end-to-end guidance.',
    href: `${ILLUMINA_BASE}/science/genomics-research.html`,
    category: 'learn',
    breadcrumb: ['Learn', 'Workflows'],
    matchTerms: ['workflow', 'spatial', 'discovery'],
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'learn-oncology-spatial',
    title: 'Spatial Profiling in Oncology Research',
    description: 'Application note series on tumor microenvironment and immuno-oncology spatial studies.',
    href: `${ILLUMINA_BASE}/applications/cancer/cancer-research.html`,
    category: 'learn',
    breadcrumb: ['Learn', 'Oncology'],
    matchTerms: ['oncology', 'spatial', 'tumor', 'stratamap'],
    demoUserTaxonomy: 'Molecular Pathologists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'support-stratamap-faq',
    title: 'StrataMap Spatial — Frequently Asked Questions',
    description: 'Answers to common setup, troubleshooting, and reagent storage questions from Technical Support.',
    href: `${ILLUMINA_BASE}/support.html`,
    category: 'techSupport',
    breadcrumb: ['Support', 'FAQ'],
    matchTerms: ['faq', 'support', 'stratamap', 'troubleshoot'],
    demoUserTaxonomy: 'Operations Managers',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'support-instrument-service',
    title: 'Instrument Services & Training',
    description: 'Proactive monitoring, on-site service, and certified operator training for Illumina platforms.',
    href: `${ILLUMINA_BASE}/services/instrument-services-training.html`,
    category: 'techSupport',
    breadcrumb: ['Support', 'Services'],
    matchTerms: ['service', 'training', 'maintenance'],
    demoUserTaxonomy: 'Lab Directors',
  }),
  item({
    id: 'support-clinical-validation',
    title: 'Clinical NGS Validation Support Resources',
    description: 'Documentation templates and guidance for laboratories developing validated clinical sequencing assays.',
    href: `${ILLUMINA_BASE}/applications/clinical/clinical-research.html`,
    category: 'techSupport',
    breadcrumb: ['Support', 'Clinical'],
    matchTerms: ['clinical', 'validation', 'ivd', 'cap', 'clia'],
    demoUserTaxonomy: 'Clinical Lab Directors',
    visibleForDemoUsers: ['Clinical Lab Directors', 'Molecular Pathologists', 'Lab Directors'],
  }),
  item({
    id: 'sol-stratamap-spatial',
    title: 'StrataMap Spatial Discovery Solutions',
    description:
      'End-to-end spatial discovery bundles combining StrataMap Spatial, compatible sequencers, reagents, and analysis workflows.',
    href: `${ILLUMINA_BASE}/applications/research.html`,
    category: 'solutions',
    breadcrumb: ['Solutions', 'Spatial Discovery'],
    matchTerms: ['stratamap', 'spatial', 'solution', 'discovery', 'bundle'],
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'sol-oncology-research',
    title: 'Oncology Research Solutions',
    description: 'Integrated workflows from sample to report for cancer genomics and StrataMap Spatial profiling studies.',
    href: `${ILLUMINA_BASE}/applications/cancer/cancer-research.html`,
    category: 'solutions',
    breadcrumb: ['Solutions', 'Oncology'],
    matchTerms: ['oncology', 'cancer', 'solution', 'spatial', 'stratamap'],
    demoUserTaxonomy: 'Molecular Pathologists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'sol-clinical-lab',
    title: 'Clinical Laboratory Solutions',
    description: 'Scalable NGS solutions for molecular pathology and clinical research laboratories.',
    href: `${ILLUMINA_BASE}/applications/clinical/clinical-research.html`,
    category: 'solutions',
    breadcrumb: ['Solutions', 'Clinical'],
    matchTerms: ['clinical', 'laboratory', 'diagnostic'],
    demoUserTaxonomy: 'Clinical Lab Directors',
  }),
  item({
    id: 'sol-academic',
    title: 'Academic Research Genomics Solutions',
    description: 'Flexible sequencing and analysis packages for university and core facility research programs.',
    href: `${ILLUMINA_BASE}/applications/research.html`,
    category: 'solutions',
    breadcrumb: ['Solutions', 'Research'],
    matchTerms: ['academic', 'university', 'core lab'],
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
  }),
  item({
    id: 'sw-stratamap-analysis',
    title: 'StrataMap Spatial Analysis Module',
    description:
      'Visualize spatial expression maps, compare regions of interest, and export datasets from Illumina Connected Analytics.',
    href: `${ILLUMINA_BASE}/products/by-type/software-and-analysis/illumina-connected-analytics.html`,
    category: 'software',
    breadcrumb: ['Software', 'Spatial Analysis'],
    matchTerms: ['stratamap', 'spatial', 'analysis', 'visualization', 'connected analytics'],
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'sw-dragen',
    title: 'DRAGEN Secondary Analysis Platform',
    description: 'Accelerated genomic pipeline execution for alignment, variant calling, and specialized applications.',
    href: `${ILLUMINA_BASE}/products/by-type/software-and-analysis/dragen-bio-it-platform.html`,
    category: 'software',
    breadcrumb: ['Software', 'DRAGEN'],
    matchTerms: ['dragen', 'bioinformatics', 'analysis', 'pipeline'],
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
  }),
  item({
    id: 'sw-basespace',
    title: 'BaseSpace Sequence Hub',
    description: 'Cloud platform for run monitoring, data storage, and app-based secondary analysis.',
    href: `${ILLUMINA_BASE}/products/by-type/software-and-analysis/basespace-sequence-hub.html`,
    category: 'software',
    breadcrumb: ['Software', 'BaseSpace'],
    matchTerms: ['basespace', 'cloud', 'sequence hub'],
  }),
  item({
    id: 'sw-connected-analytics',
    title: 'Illumina Connected Analytics',
    description: 'Enterprise analysis environment for DRAGEN pipelines, collaboration, and audit-ready workflows.',
    href: `${ILLUMINA_BASE}/products/by-type/software-and-analysis/illumina-connected-analytics.html`,
    category: 'software',
    breadcrumb: ['Software', 'Connected Analytics'],
    matchTerms: ['connected analytics', 'enterprise', 'dragen'],
    demoUserTaxonomy: 'Lab Directors',
  }),
  item({
    id: 'pub-spatial-nature',
    title: 'Publication spotlight — spatial mapping of tissue microenvironments',
    description: 'Featured publication demonstrating unbiased spatial discovery in complex tissue architectures.',
    href: `${ILLUMINA_BASE}/science/literature.html`,
    category: 'publications',
    breadcrumb: ['Publications', 'Research'],
    matchTerms: ['publication', 'spatial', 'paper', 'stratamap'],
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'pub-clinical-ngs-review',
    title: 'Clinical NGS implementation — best practices review',
    description: 'Peer-reviewed summary of validation, QC, and bioinformatics practices for clinical NGS labs.',
    href: `${ILLUMINA_BASE}/science/literature.html`,
    category: 'publications',
    breadcrumb: ['Publications', 'Clinical'],
    matchTerms: ['clinical', 'publication', 'validation'],
    demoUserTaxonomy: 'Clinical Lab Directors',
  }),
  item({
    id: 'train-novaseq-operator',
    title: 'NovaSeq X Operator Training',
    description: 'Instructor-led and e-learning modules for instrument operation, maintenance, and troubleshooting.',
    href: `${ILLUMINA_BASE}/support/training.html`,
    category: 'training',
    breadcrumb: ['Training', 'Instruments'],
    matchTerms: ['training', 'novaseq', 'operator'],
    demoUserTaxonomy: 'Operations Managers',
  }),
  item({
    id: 'train-spatial-lab',
    title: 'Spatial Discovery Lab Skills Course',
    description: 'Hands-on curriculum covering sample prep, imaging QC, and NGS library construction for spatial assays.',
    href: `${ILLUMINA_BASE}/support/training.html`,
    category: 'training',
    breadcrumb: ['Training', 'Spatial'],
    matchTerms: ['training', 'spatial', 'workshop', 'stratamap'],
    demoUserTaxonomy: 'Academic/Research Lab Scientists',
    ...STRATAMAP_SPATIAL_TOPIC,
  }),
  item({
    id: 'proc-quote-guide',
    title: 'Procurement Guide — Illumina Capital & Reagent Planning',
    description: 'Framework for bundling instruments, consumables, service contracts, and cloud analysis in procurement cycles.',
    href: `${ILLUMINA_BASE}/company/contact-us.html`,
    category: 'products',
    breadcrumb: ['Company', 'Procurement'],
    matchTerms: ['procurement', 'quote', 'contract', 'purchase'],
    demoUserTaxonomy: 'Procurement',
    visibleForDemoUsers: ['Procurement', 'Lab Directors', 'Operations Managers'],
  }),
  item({
    id: 'proc-reagent-supply',
    title: 'Reagent Supply & Inventory Planning',
    description: 'Guidance on stocking levels, shelf life, and just-in-time ordering for high-volume sequencing labs.',
    href: `${ILLUMINA_BASE}/company/contact-us.html`,
    category: 'techSupport',
    breadcrumb: ['Support', 'Reagents'],
    matchTerms: ['reagent', 'inventory', 'supply', 'procurement'],
    demoUserTaxonomy: 'Procurement',
  }),
  item({
    id: 'path-variant-reporting',
    title: 'Molecular Pathology — Variant Interpretation Resources',
    description: 'Curated resources for somatic variant assessment, reporting conventions, and LIS integration.',
    href: `${ILLUMINA_BASE}/applications/clinical/clinical-research.html`,
    category: 'learn',
    breadcrumb: ['Learn', 'Pathology'],
    matchTerms: ['pathology', 'variant', 'reporting', 'somatic'],
    demoUserTaxonomy: 'Molecular Pathologists',
  }),
  item({
    id: 'lab-director-ops',
    title: 'Lab Operations Dashboard — KPIs for NGS Core Facilities',
    description: 'Operational metrics, turnaround time targets, and capacity planning for genomics core labs.',
    href: `${ILLUMINA_BASE}/applications/research.html`,
    category: 'learn',
    breadcrumb: ['Learn', 'Operations'],
    matchTerms: ['operations', 'kpi', 'core lab', 'turnaround'],
    demoUserTaxonomy: 'Lab Directors',
  }),
];

export function supplementalResultsForDemoUserTaxonomy(persona: DemoUserTaxonomy): SearchResultItem[] {
  const supplementalByPersona: Record<
    DemoUserTaxonomy,
    Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[]
  > = {
    'Academic/Research Lab Scientists': [
      {
        title: 'Recommended for research scientists — spatial grant planning kit',
        description:
          'Budget templates, sample size guidance, and core facility collaboration checklists for spatial discovery proposals.',
        href: `${ILLUMINA_BASE}/applications/research.html`,
        category: 'learn',
        breadcrumb: ['Personalized', 'Research'],
        matchTerms: ['grant', 'research', 'spatial', 'discovery'],
        isNew: true,
      },
    ],
    'Clinical Lab Directors': [
      {
        title: 'Recommended for clinical lab directors — validation starter pack',
        description:
          'Checklists for analytical validation, SOP templates, and QC metrics for clinical NGS assay onboarding.',
        href: `${ILLUMINA_BASE}/applications/clinical/clinical-research.html`,
        category: 'techSupport',
        breadcrumb: ['Personalized', 'Clinical'],
        matchTerms: ['validation', 'clinical', 'sop', 'qc'],
        isNew: true,
      },
    ],
    'Molecular Pathologists': [
      {
        title: 'Recommended for pathologists — spatial oncology case series',
        description:
          'Case-based learning on correlating H&E morphology with spatial expression patterns in solid tumors.',
        href: `${ILLUMINA_BASE}/applications/cancer/cancer-research.html`,
        category: 'learn',
        breadcrumb: ['Personalized', 'Pathology'],
        matchTerms: ['pathology', 'oncology', 'spatial', 'case'],
        isNew: true,
      },
    ],
    'Lab Directors': [
      {
        title: 'Recommended for lab directors — multi-instrument fleet planning',
        description:
          'Capacity models for balancing NovaSeq, NextSeq, and spatial workflows across shared lab resources.',
        href: `${ILLUMINA_BASE}/systems/sequencing-platforms.html`,
        category: 'solutions',
        breadcrumb: ['Personalized', 'Operations'],
        matchTerms: ['fleet', 'capacity', 'lab director', 'planning'],
        isNew: true,
      },
    ],
    'Operations Managers': [
      {
        title: 'Recommended for operations — StrataMap maintenance calendar',
        description:
          'Preventive maintenance schedule, reagent lot tracking, and downtime reduction playbooks for spatial systems.',
        href: `${ILLUMINA_BASE}/support.html`,
        category: 'manuals',
        breadcrumb: ['Personalized', 'Operations'],
        matchTerms: ['maintenance', 'operations', 'stratamap', 'schedule'],
        isNew: true,
      },
    ],
    Procurement: [
      {
        title: 'Recommended for procurement — Illumina commercial terms overview',
        description:
          'Summary of typical instrument lease, reagent stocking, and enterprise software licensing structures for RFP comparison.',
        href: `${ILLUMINA_BASE}/company/contact-us.html`,
        category: 'products',
        breadcrumb: ['Personalized', 'Procurement'],
        matchTerms: ['procurement', 'rfp', 'quote', 'contract'],
        isNew: true,
      },
    ],
  };

  const rows = supplementalByPersona[persona] ?? [];
  return rows.map((row, index) =>
    item({
      ...row,
      id: `supplemental-${persona.replace(/\W+/g, '-').toLowerCase()}-${index + 1}`,
      demoUserTaxonomy: persona,
    })
  );
}

export const searchCatalog: SearchResultItem[] = baseCatalog;

export function parseCategoryFilter(raw: string | null | undefined): SearchCategoryFilter {
  const value = raw?.trim().toLowerCase();
  if (!value || value === 'all') return 'all';
  const map: Record<string, SearchCategoryFilter> = {
    products: 'products',
    learn: 'learn',
    techsupport: 'techSupport',
    'tech support': 'techSupport',
    manuals: 'manuals',
    solutions: 'solutions',
    software: 'software',
    publications: 'publications',
    training: 'training',
  };
  return map[value] ?? 'all';
}

export function categoryFilterToParam(category: SearchCategoryFilter): string | null {
  if (category === 'all') return null;
  if (category === 'techSupport') return 'techSupport';
  return category;
}
