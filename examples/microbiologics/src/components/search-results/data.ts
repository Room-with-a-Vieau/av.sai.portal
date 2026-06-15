/**
 * Mock search catalog for Microbiologics (microbiologics.com search experience).
 * Facet dimensions mirror the live "Narrow By" filters on the product search page.
 */

import type { DemoUserTaxonomy } from '@/lib/demo-taxonomy';
import { parseDemoUserTaxonomy } from '@/lib/demo-taxonomy';

export type { DemoUserTaxonomy };
export { parseDemoUserTaxonomy };

export const MB_BASE = 'https://www.microbiologics.com/';
export const RESULTS_PAGE_SIZE = 20;

export type BiosafetyLevel = 'bsl1' | 'bsl2' | 'bsl2p' | 'notApplicable';
export type ProductFormat =
  | 'kwikStik2Pack'
  | 'kwikStik6Pack'
  | 'lyfoDisk'
  | 'ezCfuOneStep'
  | 'ezAccuShot'
  | 'ezAccuShotSelect'
  | 'epower'
  | 'helixElite'
  | 'enumeratedMycoplasma'
  | 'microbiologySlide'
  | 'selectPack'
  | 'hydratingFluid'
  | 'document';
export type DocumentLanguage = 'english' | 'german' | 'french' | 'spanish';
export type DocumentCategory = 'promotional' | 'qualitySystems' | 'sds' | 'technicalPublications';
export type AntibioticResistant = 'yes' | 'no';
export type IndustryType =
  | 'clinical'
  | 'pharmaceutical'
  | 'foodSafety'
  | 'environmental'
  | 'education'
  | 'personalCare'
  | 'cannabis';
export type InstrumentKit = 'respiratoryPanel' | 'bloodCultureId' | 'giParasite' | 'customPanel';
export type MolecularSyndromic = 'yes' | 'no';
export type StandardGuideline =
  | 'aoac'
  | 'clsi'
  | 'eucast'
  | 'epa'
  | 'fdaBam'
  | 'iso11133'
  | 'usp61'
  | 'usp62'
  | 'usp51';
export type TaxonomyGroup =
  | 'bacteria'
  | 'fungi'
  | 'viruses'
  | 'mycoplasma'
  | 'parasites'
  | 'molecular'
  | 'panel';
export type TestMethod =
  | 'gpt'
  | 'aet'
  | 'molecularQc'
  | 'compendial'
  | 'environmentalMonitoring'
  | 'waterTesting';

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  catalogNumber: string;
  href: string;
  productFormat: ProductFormat;
  biosafetyLevel: BiosafetyLevel;
  documentLanguage?: DocumentLanguage;
  documentCategory?: DocumentCategory;
  antibioticResistant: AntibioticResistant;
  industryTypes: IndustryType[];
  instrumentKits: InstrumentKit[];
  molecularSyndromic: MolecularSyndromic;
  standards: StandardGuideline[];
  taxonomy: TaxonomyGroup;
  testMethods: TestMethod[];
  listPrice: number | null;
  goldPrice: number | null;
  distributorPrice: number | null;
  imageSrc?: string;
  isDocument?: boolean;
  matchTerms?: string[];
  demoUserTaxonomy?: DemoUserTaxonomy;
  /** Hidden from all demo personas (e.g. OEM-only SKUs) */
  restricted?: 'oem' | 'emea-distributor-hidden' | 'direct-only-promo';
};

export type PriceDisplay =
  | { kind: 'login' }
  | { kind: 'hidden' }
  | { kind: 'price'; amount: number; currency: 'USD' | 'EUR'; listAmount?: number };

export const searchFacetLabels = {
  biosafetyLevel: {
    bsl1: 'BSL-1',
    bsl2: 'BSL-2',
    bsl2p: 'BSL-2 Enhanced',
    notApplicable: 'Not applicable',
  },
  productFormat: {
    kwikStik2Pack: 'KWIK-STIK™ 2 Pack',
    kwikStik6Pack: 'KWIK-STIK™ 6 Pack',
    lyfoDisk: 'LYFO DISK™',
    ezCfuOneStep: 'EZ-CFU™ One Step',
    ezAccuShot: 'EZ-Accu Shot™',
    ezAccuShotSelect: 'EZ-Accu Shot™ Select',
    epower: 'Epower™',
    helixElite: 'Helix Elite™',
    enumeratedMycoplasma: 'Enumerated Mycoplasma',
    microbiologySlide: 'Microbiology Slide',
    selectPack: 'Select Pack',
    hydratingFluid: 'Hydrating Fluid',
    document: 'Document / IFU',
  },
  documentLanguage: {
    english: 'English',
    german: 'German',
    french: 'French',
    spanish: 'Spanish',
  },
  documentCategory: {
    promotional: 'Promotional Literature',
    qualitySystems: 'Quality Systems',
    sds: 'Safety Data Sheets',
    technicalPublications: 'Technical Publications',
  },
  antibioticResistant: {
    yes: 'Antibiotic/Drug Resistant',
    no: 'Standard strain',
  },
  industryType: {
    clinical: 'Clinical',
    pharmaceutical: 'Pharmaceutical',
    foodSafety: 'Food Safety',
    environmental: 'Environmental',
    education: 'Education',
    personalCare: 'Personal Care',
    cannabis: 'Cannabis',
  },
  instrumentKit: {
    respiratoryPanel: 'Respiratory Control Panel',
    bloodCultureId: 'Blood Culture Identification',
    giParasite: 'GI Parasite QC',
    customPanel: 'Custom / Syndromic Panel',
  },
  molecularSyndromic: {
    yes: 'Molecular Syndromic Testing',
    no: 'Not syndromic',
  },
  standardGuideline: {
    aoac: 'AOAC Official Methods of Analysis (OMA)',
    clsi: 'Clinical Laboratory Standards Institute (CLSI)',
    eucast: 'European Committee on Antimicrobial Susceptibility Testing (EUCAST)',
    epa: 'Environmental Protection Agency (EPA)',
    fdaBam: 'FDA Bacteriological Analytical Manual (BAM)',
    iso11133: 'ISO 11133',
    usp61: 'USP <61>',
    usp62: 'USP <62>',
    usp51: 'USP <51>',
  },
  taxonomy: {
    bacteria: 'Bacteria',
    fungi: 'Fungi',
    viruses: 'Viruses',
    mycoplasma: 'Mycoplasma',
    parasites: 'Parasites',
    molecular: 'Molecular',
    panel: 'Multi-organism panel',
  },
  testMethod: {
    gpt: 'Growth Promotion Testing',
    aet: 'Antimicrobial Effectiveness Testing',
    molecularQc: 'Molecular Diagnostics QC',
    compendial: 'Compendial Testing',
    environmentalMonitoring: 'Environmental Monitoring',
    waterTesting: 'Water Testing',
  },
} as const;

export const popularSearches = [
  'E. coli',
  'ATCC 8739',
  'USP <61>',
  'KWIK-STIK',
  'Pseudomonas aeruginosa',
  'SARS-CoV-2',
  'Candida albicans',
  'Salmonella',
];

export const biosafetyLevels = Object.keys(searchFacetLabels.biosafetyLevel) as BiosafetyLevel[];
export const productFormats = Object.keys(searchFacetLabels.productFormat) as ProductFormat[];
export const documentLanguages = Object.keys(searchFacetLabels.documentLanguage) as DocumentLanguage[];
export const documentCategories = Object.keys(searchFacetLabels.documentCategory) as DocumentCategory[];
export const antibioticResistantOptions = Object.keys(
  searchFacetLabels.antibioticResistant
) as AntibioticResistant[];
export const industryTypes = Object.keys(searchFacetLabels.industryType) as IndustryType[];
export const instrumentKits = Object.keys(searchFacetLabels.instrumentKit) as InstrumentKit[];
export const molecularSyndromicOptions = Object.keys(
  searchFacetLabels.molecularSyndromic
) as MolecularSyndromic[];
export const standardGuidelines = Object.keys(searchFacetLabels.standardGuideline) as StandardGuideline[];
export const taxonomyGroups = Object.keys(searchFacetLabels.taxonomy) as TaxonomyGroup[];
export const testMethods = Object.keys(searchFacetLabels.testMethod) as TestMethod[];

const MB_IMG = {
  kwikStik:
    'https://www.microbiologics.com/core/media/media.nl?id=11559102&c=915960&h=IWVsNQYJLUCgUIMUR8dGYvsQLsq5QF3sNgDfqIVttKsI4Zq1',
  ezAccu:
    'https://www.microbiologics.com/core/media/media.nl?id=11559114&c=915960&h=59gHk93oYg47bGqMEoMTVdZTag0u9J3Pw6fs19-3LNXt3QtX',
  epower:
    'https://www.microbiologics.com/core/media/media.nl?id=8001677&c=915960&h=rbNAdz717f0tM9lw8fC-AgawoVd_wesW_Ght6grImROf5r2q',
  helix:
    'https://www.microbiologics.com/core/media/media.nl?id=11559121&c=915960&h=LEj9riu2aEhK3mjfOP1DiL7TkU4hdmqMUI0sZEifiWNCEKJG',
  lyfo:
    'https://www.microbiologics.com/core/media/media.nl?id=11839465&c=915960&h=Gf7iq6W50xYvodvmKx2xl7Z4G-xc50h3uqM_wwciGYnVpx4n',
  ezCfu:
    'https://www.microbiologics.com/core/media/media.nl?id=11559123&c=915960&h=GiNmDg960n-qOWy_jyVO6WtP6PMaXLFIS5T_xAHAl8PEij1O',
};

export function getDefaultCardImage(): string {
  return MB_IMG.kwikStik;
}

export function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function itemVisibleForDemoUser(
  item: SearchResultItem,
  user: DemoUserTaxonomy | null
): boolean {
  if (item.restricted === 'oem') return false;
  if (item.restricted === 'emea-distributor-hidden' && user === 'Distributor Rep') return false;
  if (item.restricted === 'direct-only-promo' && user === 'Distributor Rep') return false;
  return true;
}

export function resolvePriceDisplay(
  item: SearchResultItem,
  user: DemoUserTaxonomy | null
): PriceDisplay {
  if (!user) return { kind: 'login' };
  if (user === 'Regulatory Professional') return { kind: 'hidden' };
  if (item.isDocument || item.listPrice == null) return { kind: 'hidden' };

  if (user === 'Distributor Rep') {
    if (item.distributorPrice == null) return { kind: 'hidden' };
    return {
      kind: 'price',
      amount: item.distributorPrice,
      currency: 'EUR',
      listAmount: undefined,
    };
  }

  const contract = item.goldPrice ?? item.listPrice;
  return {
    kind: 'price',
    amount: contract,
    currency: 'USD',
    listAmount: item.goldPrice != null && item.listPrice != null ? item.listPrice : undefined,
  };
}

export function formatPrice(amount: number, currency: 'USD' | 'EUR'): string {
  return new Intl.NumberFormat(currency === 'EUR' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

const QUERY_STOP = new Set(['and', 'or', 'the', 'for', 'with', 'from', 'atcc']);

export function itemMatchesQuery(item: SearchResultItem, q: string): boolean {
  const n = normalizeQuery(q);
  if (!n) return true;
  const hay = [
    item.title,
    item.description,
    item.catalogNumber,
    searchFacetLabels.productFormat[item.productFormat],
    searchFacetLabels.taxonomy[item.taxonomy],
    ...(item.matchTerms ?? []),
  ]
    .join(' ')
    .toLowerCase();
  const words = n.split(' ').filter((w) => w.length > 1 && !QUERY_STOP.has(w));
  if (!words.length) return true;
  return words.every((w) => hay.includes(w));
}

export function relevanceScore(
  item: SearchResultItem,
  q: string,
  activeDemoUserTaxonomy: DemoUserTaxonomy | null
): number {
  const n = normalizeQuery(q);
  if (!n) return 0;
  const words = n.split(' ').filter(Boolean);
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const cat = item.catalogNumber.toLowerCase();
  const extra = (item.matchTerms ?? []).join(' ').toLowerCase();
  let score = 0;
  for (const w of words) {
    if (title.includes(w)) score += 6;
    if (cat.includes(w)) score += 8;
    if (desc.includes(w)) score += 2;
    if (extra.includes(w)) score += 3;
  }
  if (activeDemoUserTaxonomy && item.demoUserTaxonomy === activeDemoUserTaxonomy) score += 20;
  if (item.isDocument) score -= 2;
  return score;
}

export function supplementalResultsForDemoUserTaxonomy(
  persona: DemoUserTaxonomy
): SearchResultItem[] {
  const code =
    persona === 'Laboratory Procurement Manager'
      ? 'proc'
      : persona === 'Distributor Rep'
        ? 'dist'
        : persona === 'Regulatory Professional'
          ? 'reg'
          : 'sci';

  const rows: Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[] =
    persona === 'Laboratory Procurement Manager'
      ? [
          {
            title: 'EZ-Accu Shot™ Select Pack — USP <61> Full Panel (Recommended)',
            description:
              'Multi-strain compendial panel with quantitated pellets for streamlined growth promotion testing.',
            catalogNumber: 'SK-0ASP61',
            href: `${MB_BASE}search?q=SK-0ASP61`,
            productFormat: 'ezAccuShotSelect',
            biosafetyLevel: 'bsl2',
            antibioticResistant: 'no',
            industryTypes: ['pharmaceutical', 'clinical'],
            instrumentKits: [],
            molecularSyndromic: 'no',
            standards: ['usp61', 'usp62'],
            taxonomy: 'panel',
            testMethods: ['gpt', 'compendial'],
            listPrice: 475,
            goldPrice: 403.75,
            distributorPrice: 338,
            imageSrc: MB_IMG.ezAccu,
            matchTerms: ['panel', 'usp 61', 'procurement', 'compendial'],
          },
        ]
      : persona === 'Distributor Rep'
        ? [
            {
              title: 'Epower™ Staphylococcus aureus ATCC 6538 — Tier 1 stocking SKU',
              description: 'High-volume distributor SKU for EMEA hospital and pharma QC programs.',
              catalogNumber: '0659E7',
              href: `${MB_BASE}search?q=0659E7`,
              productFormat: 'ezCfuOneStep',
              biosafetyLevel: 'bsl2',
              antibioticResistant: 'no',
              industryTypes: ['pharmaceutical', 'clinical'],
              instrumentKits: [],
              molecularSyndromic: 'no',
              standards: ['usp51'],
              taxonomy: 'bacteria',
              testMethods: ['aet', 'compendial'],
              listPrice: 125,
              goldPrice: 106.25,
              distributorPrice: 88.5,
              imageSrc: MB_IMG.epower,
              matchTerms: ['distributor', 'stocking', 's aureus'],
            },
          ]
        : persona === 'Regulatory Professional'
          ? [
              {
                title: '8247 Respiratory Control Panel (22 Targets) IFU',
                description: 'Instructions for Use — molecular syndromic respiratory control panel.',
                catalogNumber: '8247-IFU',
                href: `${MB_BASE}search?q=8247`,
                productFormat: 'document',
                biosafetyLevel: 'notApplicable',
                documentLanguage: 'english',
                documentCategory: 'technicalPublications',
                antibioticResistant: 'no',
                industryTypes: ['clinical', 'pharmaceutical'],
                instrumentKits: ['respiratoryPanel'],
                molecularSyndromic: 'yes',
                standards: ['clsi'],
                taxonomy: 'molecular',
                testMethods: ['molecularQc'],
                listPrice: null,
                goldPrice: null,
                distributorPrice: null,
                isDocument: true,
                matchTerms: ['ifu', 'respiratory', 'regulatory', 'document'],
              },
            ]
          : [
              {
                title: 'Epower™ Escherichia coli ATCC 8739',
                description:
                  'Quantitated E. coli reference strain for USP <61> growth promotion and water testing workflows.',
                catalogNumber: '0681E7',
                href: `${MB_BASE}search?q=0681E7`,
                productFormat: 'ezCfuOneStep',
                biosafetyLevel: 'bsl2',
                antibioticResistant: 'no',
                industryTypes: ['pharmaceutical', 'clinical', 'environmental'],
                instrumentKits: [],
                molecularSyndromic: 'no',
                standards: ['usp61'],
                taxonomy: 'bacteria',
                testMethods: ['gpt', 'waterTesting', 'compendial'],
                listPrice: 125,
                goldPrice: 106.25,
                distributorPrice: 88.5,
                imageSrc: MB_IMG.epower,
                matchTerms: ['e coli', 'atcc 8739', 'scientist', 'enumeration'],
              },
            ];

  return rows.map((row, i) => ({
    ...row,
    id: `sup-${code}-${i + 1}`,
    demoUserTaxonomy: persona,
  }));
}

function seed(
  partial: Omit<SearchResultItem, 'id'> & { id: string }
): SearchResultItem {
  return {
    imageSrc: partial.imageSrc ?? getDefaultCardImage(),
    ...partial,
  };
}

export const searchCatalog: SearchResultItem[] = [
  seed({
    id: 'p-0681e7',
    title: 'Escherichia coli derived from ATCC® 8739™',
    description: 'Epower™ quantitated strain for compendial QC and water testing.',
    catalogNumber: '0681E7',
    href: `${MB_BASE}search?q=0681E7`,
    productFormat: 'ezCfuOneStep',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical', 'environmental'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp61', 'epa'],
    taxonomy: 'bacteria',
    testMethods: ['gpt', 'waterTesting', 'compendial'],
    listPrice: 125,
    goldPrice: 106.25,
    distributorPrice: 88.5,
    imageSrc: MB_IMG.epower,
    matchTerms: ['e coli', 'ecoli', '8739', 'gram negative'],
    demoUserTaxonomy: 'Scientist',
  }),
  seed({
    id: 'p-0659e7',
    title: 'Staphylococcus aureus derived from ATCC® 6538™',
    description: 'Epower™ strain for antimicrobial effectiveness and preservative efficacy testing.',
    catalogNumber: '0659E7',
    href: `${MB_BASE}search?q=0659E7`,
    productFormat: 'ezCfuOneStep',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'personalCare'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp51'],
    taxonomy: 'bacteria',
    testMethods: ['aet', 'compendial'],
    listPrice: 125,
    goldPrice: 106.25,
    distributorPrice: 88.5,
    imageSrc: MB_IMG.epower,
    matchTerms: ['staph', '6538', 'aureus'],
    demoUserTaxonomy: 'Laboratory Procurement Manager',
  }),
  seed({
    id: 'p-0733e7',
    title: 'Pseudomonas aeruginosa derived from ATCC® 9027™',
    description: 'Compendial QC strain for pharmaceutical and environmental monitoring.',
    catalogNumber: '0733E7',
    href: `${MB_BASE}search?q=0733E7`,
    productFormat: 'ezCfuOneStep',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp62'],
    taxonomy: 'bacteria',
    testMethods: ['gpt', 'environmentalMonitoring'],
    listPrice: 130,
    goldPrice: 110.5,
    distributorPrice: 92,
    imageSrc: MB_IMG.epower,
    matchTerms: ['pseudomonas', '9027'],
  }),
  seed({
    id: 'p-0443e7',
    title: 'Candida albicans derived from ATCC® 10231™',
    description: 'Yeast reference strain for fungal QC and environmental monitoring.',
    catalogNumber: '0443E7',
    href: `${MB_BASE}search?q=0443E7`,
    productFormat: 'ezCfuOneStep',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical', 'foodSafety'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp61'],
    taxonomy: 'fungi',
    testMethods: ['gpt', 'environmentalMonitoring'],
    listPrice: 135,
    goldPrice: 114.75,
    distributorPrice: 95.5,
    imageSrc: MB_IMG.ezCfu,
    matchTerms: ['candida', 'yeast', '10231'],
  }),
  seed({
    id: 'p-0371e7',
    title: 'Salmonella enterica derived from ATCC® 14028™',
    description: 'Food safety and pharmaceutical compendial reference material.',
    catalogNumber: '0371E7',
    href: `${MB_BASE}search?q=0371E7`,
    productFormat: 'ezCfuOneStep',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['foodSafety', 'pharmaceutical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp62', 'fdaBam'],
    taxonomy: 'bacteria',
    testMethods: ['compendial', 'gpt'],
    listPrice: 125,
    goldPrice: 106.25,
    distributorPrice: 88.5,
    imageSrc: MB_IMG.epower,
    matchTerms: ['salmonella', '14028', 'food safety'],
  }),
  seed({
    id: 'p-hm10wr',
    title: 'SARS-CoV-2 (inactivated) Molecular Diagnostics Control',
    description: 'Heliyon™ wrapped molecular control for RT-PCR verification programs.',
    catalogNumber: 'HM-10WR',
    href: `${MB_BASE}search?q=HM-10WR`,
    productFormat: 'helixElite',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['clinical', 'pharmaceutical'],
    instrumentKits: ['respiratoryPanel'],
    molecularSyndromic: 'yes',
    standards: ['clsi'],
    taxonomy: 'molecular',
    testMethods: ['molecularQc'],
    listPrice: 245,
    goldPrice: 208.25,
    distributorPrice: 174,
    imageSrc: MB_IMG.helix,
    matchTerms: ['sars-cov-2', 'covid', 'molecular', 'rt-pcr'],
    restricted: 'emea-distributor-hidden',
  }),
  seed({
    id: 'p-sk0asp61',
    title: 'EZ-Accu Shot™ Select Pack — USP <61> Panel',
    description: 'Multi-organism compendial panel — E. coli, S. aureus, P. aeruginosa, Salmonella, C. albicans.',
    catalogNumber: 'SK-0ASP61',
    href: `${MB_BASE}search?q=SK-0ASP61`,
    productFormat: 'selectPack',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp61', 'usp62'],
    taxonomy: 'panel',
    testMethods: ['gpt', 'compendial'],
    listPrice: 475,
    goldPrice: 403.75,
    distributorPrice: 338,
    imageSrc: MB_IMG.ezAccu,
    matchTerms: ['panel', 'usp 61', 'select pack'],
    demoUserTaxonomy: 'Laboratory Procurement Manager',
  }),
  seed({
    id: 'p-0511p',
    title: 'Acetobacter aceti derived from ATCC® 15973™',
    description: 'KWIK-STIK™ 2 Pack qualitative reference strain.',
    catalogNumber: '0511P',
    href: `${MB_BASE}search?q=0511P`,
    productFormat: 'kwikStik2Pack',
    biosafetyLevel: 'bsl1',
    antibioticResistant: 'no',
    industryTypes: ['education', 'foodSafety'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['aoac'],
    taxonomy: 'bacteria',
    testMethods: ['gpt'],
    listPrice: 98,
    goldPrice: 83.3,
    distributorPrice: 69.5,
    imageSrc: MB_IMG.kwikStik,
    matchTerms: ['acetobacter', 'kwik-stik', '15973'],
  }),
  seed({
    id: 'p-0511k',
    title: 'Acetobacter aceti derived from ATCC® 15973™',
    description: 'KWIK-STIK™ 6 Pack qualitative reference strain.',
    catalogNumber: '0511K',
    href: `${MB_BASE}search?q=0511K`,
    productFormat: 'kwikStik6Pack',
    biosafetyLevel: 'bsl1',
    antibioticResistant: 'no',
    industryTypes: ['education', 'foodSafety'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['aoac'],
    taxonomy: 'bacteria',
    testMethods: ['gpt'],
    listPrice: 245,
    goldPrice: 208.25,
    distributorPrice: 174,
    imageSrc: MB_IMG.kwikStik,
    matchTerms: ['acetobacter', 'kwik-stik 6 pack'],
  }),
  seed({
    id: 'p-0511l',
    title: 'Acetobacter aceti derived from ATCC® 15973™',
    description: 'LYFO DISK™ qualitative lyophilized pellets in glass vial.',
    catalogNumber: '0511L',
    href: `${MB_BASE}search?q=0511L`,
    productFormat: 'lyfoDisk',
    biosafetyLevel: 'bsl1',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['iso11133'],
    taxonomy: 'bacteria',
    testMethods: ['gpt'],
    listPrice: 112,
    goldPrice: 95.2,
    distributorPrice: 79.5,
    imageSrc: MB_IMG.lyfo,
    matchTerms: ['lyfo disk', 'acetobacter'],
  }),
  seed({
    id: 'p-0357p',
    title: 'Acinetobacter baumannii derived from ATCC® 19606™',
    description: 'KWIK-STIK™ 2 Pack — antibiotic-resistant strain option for advanced QC programs.',
    catalogNumber: '0357P',
    href: `${MB_BASE}search?q=0357P`,
    productFormat: 'kwikStik2Pack',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'yes',
    industryTypes: ['clinical', 'pharmaceutical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['clsi', 'eucast'],
    taxonomy: 'bacteria',
    testMethods: ['gpt', 'compendial'],
    listPrice: 118,
    goldPrice: 100.3,
    distributorPrice: 84,
    imageSrc: MB_IMG.kwikStik,
    matchTerms: ['acinetobacter', 'drug resistant', '19606'],
  }),
  seed({
    id: 'p-01156me4',
    title: 'Acholeplasma laidlawii derived from NCTC 10116',
    description: 'Enumerated Mycoplasma for USP <63> growth promotion testing.',
    catalogNumber: '01156ME4',
    href: `${MB_BASE}search?q=01156ME4`,
    productFormat: 'enumeratedMycoplasma',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp62'],
    taxonomy: 'mycoplasma',
    testMethods: ['gpt', 'compendial'],
    listPrice: 385,
    goldPrice: 327.25,
    distributorPrice: 274,
    imageSrc: MB_IMG.ezAccu,
    matchTerms: ['mycoplasma', 'acholeplasma', 'usp 63'],
  }),
  seed({
    id: 'p-sl40-10',
    title: 'Acid Fast Control Slide',
    description: 'Microbiology slide control for acid-fast staining QC.',
    catalogNumber: 'SL40-10',
    href: `${MB_BASE}search?q=SL40-10`,
    productFormat: 'microbiologySlide',
    biosafetyLevel: 'bsl1',
    antibioticResistant: 'no',
    industryTypes: ['clinical', 'education'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['clsi'],
    taxonomy: 'bacteria',
    testMethods: ['compendial'],
    listPrice: 165,
    goldPrice: 140.25,
    distributorPrice: 117.5,
    imageSrc: MB_IMG.kwikStik,
    matchTerms: ['acid fast', 'slide', 'staining'],
  }),
  seed({
    id: 'p-hf0611',
    title: '1.2 ml Hydrating Fluid for EZ-Accu Shot',
    description: 'Rehydration fluid for EZ-Accu Shot™ quantitative pellets.',
    catalogNumber: 'HF0611',
    href: `${MB_BASE}search?q=HF0611`,
    productFormat: 'hydratingFluid',
    biosafetyLevel: 'notApplicable',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp61'],
    taxonomy: 'bacteria',
    testMethods: ['gpt'],
    listPrice: 45,
    goldPrice: 38.25,
    distributorPrice: 32,
    imageSrc: MB_IMG.ezAccu,
    matchTerms: ['hydrating fluid', 'ez-accu shot'],
  }),
  seed({
    id: 'p-hf0612',
    title: '2.0 ml Hydrating Fluid',
    description: 'Rehydration fluid for EZ-CFU™ and related quantitative formats.',
    catalogNumber: 'HF0612',
    href: `${MB_BASE}search?q=HF0612`,
    productFormat: 'hydratingFluid',
    biosafetyLevel: 'notApplicable',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp61'],
    taxonomy: 'bacteria',
    testMethods: ['gpt'],
    listPrice: 52,
    goldPrice: 44.2,
    distributorPrice: 37,
    imageSrc: MB_IMG.ezAccu,
    matchTerms: ['hydrating fluid', 'ez-cfu'],
  }),
  seed({
    id: 'p-gs0001',
    title: 'GI Parasite QC Pellets',
    description: 'Parasite QC material for gastrointestinal testing verification.',
    catalogNumber: 'GS-0001',
    href: `${MB_BASE}search?q=GS-0001`,
    productFormat: 'selectPack',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['clinical'],
    instrumentKits: ['giParasite'],
    molecularSyndromic: 'no',
    standards: ['clsi'],
    taxonomy: 'parasites',
    testMethods: ['compendial'],
    listPrice: 520,
    goldPrice: 442,
    distributorPrice: 370,
    imageSrc: MB_IMG.ezAccu,
    matchTerms: ['parasite', 'gi', 'gastrointestinal'],
  }),
  seed({
    id: 'doc-8247',
    title: '8247 Respiratory Control Panel (22 Targets) IFU',
    description: 'Instructions for Use document for respiratory syndromic control panel.',
    catalogNumber: '8247-IFU',
    href: `${MB_BASE}search?q=8247`,
    productFormat: 'document',
    biosafetyLevel: 'notApplicable',
    documentLanguage: 'english',
    documentCategory: 'technicalPublications',
    antibioticResistant: 'no',
    industryTypes: ['clinical', 'pharmaceutical'],
    instrumentKits: ['respiratoryPanel'],
    molecularSyndromic: 'yes',
    standards: ['clsi'],
    taxonomy: 'molecular',
    testMethods: ['molecularQc'],
    listPrice: null,
    goldPrice: null,
    distributorPrice: null,
    isDocument: true,
    matchTerms: ['ifu', 'respiratory', '8247'],
    demoUserTaxonomy: 'Regulatory Professional',
  }),
  seed({
    id: 'doc-8254',
    title: '8254 Blood Culture Identification Control Panel IFU',
    description: 'Instructions for Use — blood culture identification control panel.',
    catalogNumber: '8254-IFU',
    href: `${MB_BASE}search?q=8254`,
    productFormat: 'document',
    biosafetyLevel: 'notApplicable',
    documentLanguage: 'english',
    documentCategory: 'technicalPublications',
    antibioticResistant: 'no',
    industryTypes: ['clinical'],
    instrumentKits: ['bloodCultureId'],
    molecularSyndromic: 'yes',
    standards: ['clsi'],
    taxonomy: 'molecular',
    testMethods: ['molecularQc'],
    listPrice: null,
    goldPrice: null,
    distributorPrice: null,
    isDocument: true,
    matchTerms: ['blood culture', 'ifu', '8254'],
    demoUserTaxonomy: 'Regulatory Professional',
  }),
  seed({
    id: 'doc-sds-0681',
    title: 'Safety Data Sheet — E. coli ATCC 8739 (0681E7)',
    description: 'SDS for Epower™ E. coli reference material.',
    catalogNumber: '0681E7-SDS',
    href: `${MB_BASE}search?q=0681E7+SDS`,
    productFormat: 'document',
    biosafetyLevel: 'bsl2',
    documentLanguage: 'english',
    documentCategory: 'sds',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp61'],
    taxonomy: 'bacteria',
    testMethods: ['gpt'],
    listPrice: null,
    goldPrice: null,
    distributorPrice: null,
    isDocument: true,
    matchTerms: ['sds', 'safety data sheet', '0681'],
    demoUserTaxonomy: 'Regulatory Professional',
  }),
  seed({
    id: 'doc-qs-iso',
    title: 'ISO 17025 CRM Certificate Overview — Quality Systems',
    description: 'Quality systems document describing CRM certification scope.',
    catalogNumber: 'QS-ISO17025',
    href: `${MB_BASE}search?q=ISO+17025`,
    productFormat: 'document',
    biosafetyLevel: 'notApplicable',
    documentLanguage: 'english',
    documentCategory: 'qualitySystems',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['iso11133'],
    taxonomy: 'bacteria',
    testMethods: ['compendial'],
    listPrice: null,
    goldPrice: null,
    distributorPrice: null,
    isDocument: true,
    matchTerms: ['iso 17025', 'quality systems', 'crm'],
    demoUserTaxonomy: 'Regulatory Professional',
  }),
  seed({
    id: 'p-oem',
    title: 'OEM Custom Formulation — Private Label QC Set',
    description: 'Private label OEM QC formulations — sales engagement required.',
    catalogNumber: 'OEM-CUSTOM-001',
    href: `${MB_BASE}contact`,
    productFormat: 'selectPack',
    biosafetyLevel: 'notApplicable',
    antibioticResistant: 'no',
    industryTypes: ['pharmaceutical', 'personalCare'],
    instrumentKits: ['customPanel'],
    molecularSyndromic: 'no',
    standards: ['usp61'],
    taxonomy: 'panel',
    testMethods: ['compendial'],
    listPrice: null,
    goldPrice: null,
    distributorPrice: null,
    restricted: 'oem',
    matchTerms: ['oem', 'private label'],
  }),
  seed({
    id: 'p-promo-us',
    title: 'Direct Customer Q1 Promotional Bundle — US Only',
    description: 'Limited-time direct-only promotional bundle for hospital lab accounts.',
    catalogNumber: 'PROMO-US-Q1',
    href: `${MB_BASE}search?q=promo`,
    productFormat: 'selectPack',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: ['clinical'],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: ['usp61'],
    taxonomy: 'panel',
    testMethods: ['gpt'],
    listPrice: 399,
    goldPrice: 339.15,
    distributorPrice: null,
    imageSrc: MB_IMG.ezAccu,
    matchTerms: ['promotional', 'bundle', 'direct'],
    restricted: 'direct-only-promo',
    demoUserTaxonomy: 'Laboratory Procurement Manager',
  }),
];

export function itemMetadataLine(item: SearchResultItem): string {
  const format = searchFacetLabels.productFormat[item.productFormat];
  return `Catalog No. ${item.catalogNumber} · ${format}`;
}

/** Legacy export — import map may reference this; returns null for Microbiologics demo. */
export function selectAiSearchInsight() {
  return null;
}
