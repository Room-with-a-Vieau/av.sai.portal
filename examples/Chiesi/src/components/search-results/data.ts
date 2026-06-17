/**
 * Mock search catalog for Chiesi Global Rare Diseases (chiesirarediseases.com).
 * Persona-aware results for HCPs, advocates, caregivers, and patients.
 */

import type { DemoUserTaxonomy } from '@/lib/demo-taxonomy';
import { parseDemoUserTaxonomy } from '@/lib/demo-taxonomy';

export type { DemoUserTaxonomy };
export { parseDemoUserTaxonomy };

export const CHIESI_BASE = 'https://chiesirarediseases.com/';
export const RESULTS_PAGE_SIZE = 12;

export type ContentType =
  | 'product'
  | 'diseaseInformation'
  | 'treatmentGuide'
  | 'clinicalResource'
  | 'patientSupport'
  | 'advocacyResource'
  | 'newsEvent'
  | 'faq';

export type TherapeuticArea =
  | 'epidermolysisBullosa'
  | 'alpha1AntitrypsinDeficiency'
  | 'alphaMannosidosis'
  | 'cysticFibrosis'
  | 'primaryCiliaryDyskinesia'
  | 'bronchiolitisObliterans'
  | 'neonatalRareDisease'
  | 'generalRareDisease';

export type AudienceTag =
  | 'healthcareProfessional'
  | 'patientAdvocate'
  | 'caregiver'
  | 'rareDiseasePatient'
  | 'generalPublic';

export type ResourceFormat =
  | 'webPage'
  | 'pdf'
  | 'video'
  | 'webinar'
  | 'infographic'
  | 'patientBrochure'
  | 'clinicalPublication';

export type ContentLanguage = 'english' | 'italian' | 'french' | 'german' | 'spanish';

export type AccessTier = 'public' | 'authenticated' | 'hcpOnly';

export type DocumentType = 'Patient Leaflet' | 'Prescribing Info' | 'SmPC' | 'Clinical Brief';

export type ContentDocuments = {
  patientLeaflet: boolean;
  prescribingInfo: boolean;
  smpc: boolean;
  clinicalBrief: boolean;
};

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  /** Extended summary shown in expanded result cards */
  summary: string;
  contentId: string;
  href: string;
  contentType: ContentType;
  therapeuticArea: TherapeuticArea;
  audienceTags: AudienceTag[];
  resourceFormat: ResourceFormat;
  language: ContentLanguage;
  accessTier: AccessTier;
  keyHighlights: string[];
  lastUpdated: string;
  readTimeMinutes?: number;
  imageSrc?: string;
  isDocument?: boolean;
  documents?: ContentDocuments;
  matchTerms?: string[];
  /** Primary persona boost when signed in */
  demoUserTaxonomy?: DemoUserTaxonomy;
  /** Hidden or limited by persona rules */
  restricted?: 'hcpInternal' | 'advocateBriefing' | 'patientPortalOnly';
};

/** Demo content IDs — search these to showcase persona-specific access. */
export const DEMO_CONTENT_IDS = [
  { contentId: 'FILSUVEZ-HCP-PI', label: 'Filsuvez Prescribing Information (HCP)' },
  { contentId: 'EB-PATIENT-GUIDE', label: 'Living with EB — Patient & Caregiver Guide' },
  { contentId: 'AATD-CLINICAL-BRIEF', label: 'Alpha-1 Deficiency — Clinical Overview' },
  { contentId: 'CHIESI-SUPPORT-2025', label: 'Chiesi Care Rare Support Program' },
  { contentId: 'ADVOCACY-POLICY-BRIEF', label: 'Rare Disease Policy Brief (Advocates)' },
  { contentId: 'LAMZEDE-HCP-SMPC', label: 'Lamzede SmPC — HCP Document' },
] as const;

export type AccessDisplay =
  | { kind: 'public' }
  | { kind: 'signIn' }
  | { kind: 'hcpOnly' }
  | { kind: 'personalized'; label: string };

export const searchFacetLabels = {
  contentType: {
    product: 'Product',
    diseaseInformation: 'Disease Information',
    treatmentGuide: 'Treatment Guide',
    clinicalResource: 'Clinical Resource',
    patientSupport: 'Patient Support',
    advocacyResource: 'Advocacy & Policy',
    newsEvent: 'News & Events',
    faq: 'FAQ',
  },
  therapeuticArea: {
    epidermolysisBullosa: 'Epidermolysis Bullosa (EB)',
    alpha1AntitrypsinDeficiency: 'Alpha-1 Antitrypsin Deficiency',
    alphaMannosidosis: 'Alpha-Mannosidosis',
    cysticFibrosis: 'Cystic Fibrosis',
    primaryCiliaryDyskinesia: 'Primary Ciliary Dyskinesia',
    bronchiolitisObliterans: 'Bronchiolitis Obliterans Syndrome',
    neonatalRareDisease: 'Neonatal Rare Disease',
    generalRareDisease: 'General Rare Disease',
  },
  audienceTag: {
    healthcareProfessional: 'Healthcare Professional',
    patientAdvocate: 'Patient Advocate',
    caregiver: 'Caregiver',
    rareDiseasePatient: 'Rare Disease Patient',
    generalPublic: 'General Public',
  },
  resourceFormat: {
    webPage: 'Web Page',
    pdf: 'PDF Download',
    video: 'Video',
    webinar: 'Webinar / Recording',
    infographic: 'Infographic',
    patientBrochure: 'Patient Brochure',
    clinicalPublication: 'Clinical Publication',
  },
  contentLanguage: {
    english: 'English',
    italian: 'Italian',
    french: 'French',
    german: 'German',
    spanish: 'Spanish',
  },
  accessTier: {
    public: 'Public — no sign-in',
    authenticated: 'Signed-in members',
    hcpOnly: 'Healthcare professionals only',
  },
} as const;

export const popularSearches = [
  'Filsuvez',
  'epidermolysis bullosa',
  'alpha-1',
  'patient support',
  'caregiver guide',
  'clinical trial',
  'Lamzede',
  'rare disease advocacy',
];

export const contentTypes = Object.keys(searchFacetLabels.contentType) as ContentType[];
export const therapeuticAreas = Object.keys(searchFacetLabels.therapeuticArea) as TherapeuticArea[];
export const audienceTags = Object.keys(searchFacetLabels.audienceTag) as AudienceTag[];
export const resourceFormats = Object.keys(searchFacetLabels.resourceFormat) as ResourceFormat[];
export const contentLanguages = Object.keys(searchFacetLabels.contentLanguage) as ContentLanguage[];
export const accessTiers = Object.keys(searchFacetLabels.accessTier) as AccessTier[];

function unsplashPhoto(path: string): string {
  return `https://images.unsplash.com/${path}?auto=format&fit=crop&w=400&h=300&q=80`;
}

const CHIESI_IMG = {
  hero: unsplashPhoto('photo-1576091160399-112ba8d25d1d'),
  patient: unsplashPhoto('photo-1584515933487-779824d29309'),
  /** Clinical / HCP resources — pulmonary & lab imagery */
  research: unsplashPhoto('photo-1576091160550-2173dba999ef'),
  advocacy: unsplashPhoto('photo-1529156069898-49953e39b3ac'),
  product: unsplashPhoto('photo-1584308666744-24d5c474f2ae'),
  caregiver: unsplashPhoto('photo-1519494026892-80bbd2d6fd0d'),
  /** Alpha-1 / respiratory clinical overview */
  aatd: unsplashPhoto('photo-1576091160550-2173dba999ef'),
};

export function getDefaultCardImage(): string {
  return CHIESI_IMG.hero;
}

export function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function itemVisibleForDemoUser(
  item: SearchResultItem,
  user: DemoUserTaxonomy | null
): boolean {
  if (item.restricted === 'hcpInternal' && user !== 'Healthcare Professional') return false;
  if (item.restricted === 'advocateBriefing' && user !== 'Patient Advocate') return false;
  if (
    item.restricted === 'patientPortalOnly' &&
    user !== 'Rare disease Patient' &&
    user !== 'Caregiver'
  ) {
    return false;
  }
  return true;
}

export function isAuthenticatedDemoUser(user: DemoUserTaxonomy | null): user is DemoUserTaxonomy {
  return user != null;
}

export function productHasAttachedDocuments(item: SearchResultItem): boolean {
  if (item.isDocument || !item.documents) return false;
  const { patientLeaflet, prescribingInfo, smpc, clinicalBrief } = item.documents;
  return patientLeaflet || prescribingInfo || smpc || clinicalBrief;
}

export function canAccessDocument(
  item: SearchResultItem,
  docType: DocumentType,
  user: DemoUserTaxonomy | null
): boolean {
  if (!item.documents) return false;

  if (docType === 'Patient Leaflet') return item.documents.patientLeaflet;

  if (!isAuthenticatedDemoUser(user)) return false;

  if (docType === 'Clinical Brief') {
    return (
      item.documents.clinicalBrief &&
      (user === 'Healthcare Professional' || user === 'Patient Advocate')
    );
  }

  if (docType === 'Prescribing Info' || docType === 'SmPC') {
    return (
      (docType === 'Prescribing Info' ? item.documents.prescribingInfo : item.documents.smpc) &&
      user === 'Healthcare Professional'
    );
  }

  return false;
}

export function documentRequiresLogin(docType: DocumentType): boolean {
  return docType !== 'Patient Leaflet';
}

export function documentRequiresHcp(docType: DocumentType): boolean {
  return docType === 'Prescribing Info' || docType === 'SmPC';
}

export function documentPreviewContent(item: SearchResultItem, docType: DocumentType) {
  return {
    title: `${docType} — ${item.title}`,
    contentId: item.contentId,
    version: `v${item.lastUpdated.replace(/-/g, '.')}`,
    summary:
      docType === 'Patient Leaflet'
        ? 'Plain-language overview of treatment benefits, administration steps, and when to contact your care team.'
        : docType === 'Prescribing Info'
          ? 'Full prescribing information including indications, dosing, contraindications, warnings, and clinical pharmacology.'
          : docType === 'SmPC'
            ? 'Summary of Product Characteristics for EU markets — authorized indication, posology, and safety profile.'
            : 'Clinical brief summarizing trial endpoints, patient populations studied, and practical treatment considerations.',
    approvedBy: 'Chiesi Global Rare Diseases — Medical Information Services',
  };
}

export function resolveAccessDisplay(
  item: SearchResultItem,
  user: DemoUserTaxonomy | null
): AccessDisplay {
  if (item.accessTier === 'public') return { kind: 'public' };
  if (!user) {
    if (item.accessTier === 'hcpOnly') return { kind: 'hcpOnly' };
    return { kind: 'signIn' };
  }
  if (item.accessTier === 'hcpOnly' && user !== 'Healthcare Professional') {
    return { kind: 'hcpOnly' };
  }
  if (item.demoUserTaxonomy === user) {
    return { kind: 'personalized', label: `Recommended for ${user}` };
  }
  return { kind: 'public' };
}

export function personaSearchHint(user: DemoUserTaxonomy | null): string {
  if (!user) {
    return 'Public resources available · Sign in for personalized rare disease content and secure documents';
  }
  switch (user) {
    case 'Healthcare Professional':
      return 'Clinical resources, prescribing information, and trial data prioritized for your profile';
    case 'Patient Advocate':
      return 'Policy briefs, community programs, and advocacy toolkits prioritized for your profile';
    case 'Caregiver':
      return 'Practical care guides, administration support, and financial assistance prioritized for your profile';
    case 'Rare disease Patient':
      return 'Patient-friendly disease information, support programs, and treatment guides prioritized for your profile';
    default:
      return '';
  }
}

const QUERY_STOP = new Set(['and', 'or', 'the', 'for', 'with', 'from', 'about']);

export function itemMatchesQuery(item: SearchResultItem, q: string): boolean {
  const n = normalizeQuery(q);
  if (!n) return true;
  const hay = [
    item.title,
    item.description,
    item.summary,
    item.contentId,
    searchFacetLabels.contentType[item.contentType],
    searchFacetLabels.therapeuticArea[item.therapeuticArea],
    ...(item.keyHighlights ?? []),
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
  let score = 0;

  if (n) {
    const words = n.split(' ').filter(Boolean);
    const title = item.title.toLowerCase();
    const desc = item.description.toLowerCase();
    const summary = item.summary.toLowerCase();
    const cid = item.contentId.toLowerCase();
    const extra = (item.matchTerms ?? []).join(' ').toLowerCase();
    for (const w of words) {
      if (title.includes(w)) score += 8;
      if (cid.includes(w)) score += 10;
      if (desc.includes(w)) score += 4;
      if (summary.includes(w)) score += 3;
      if (extra.includes(w)) score += 5;
    }
  }

  if (activeDemoUserTaxonomy) {
    if (item.demoUserTaxonomy === activeDemoUserTaxonomy) score += 25;
    if (item.audienceTags.includes(audienceTagForPersona(activeDemoUserTaxonomy))) score += 12;
  }

  if (item.isDocument) score -= 1;
  return score;
}

function audienceTagForPersona(persona: DemoUserTaxonomy): AudienceTag {
  switch (persona) {
    case 'Healthcare Professional':
      return 'healthcareProfessional';
    case 'Patient Advocate':
      return 'patientAdvocate';
    case 'Caregiver':
      return 'caregiver';
    case 'Rare disease Patient':
      return 'rareDiseasePatient';
    default:
      return 'generalPublic';
  }
}

const DOC_HCP_FULL: ContentDocuments = {
  patientLeaflet: true,
  prescribingInfo: true,
  smpc: true,
  clinicalBrief: true,
};

const DOC_PATIENT: ContentDocuments = {
  patientLeaflet: true,
  prescribingInfo: false,
  smpc: false,
  clinicalBrief: false,
};

const DOC_CLINICAL: ContentDocuments = {
  patientLeaflet: true,
  prescribingInfo: false,
  smpc: false,
  clinicalBrief: true,
};

export function supplementalResultsForDemoUserTaxonomy(
  persona: DemoUserTaxonomy
): SearchResultItem[] {
  const code =
    persona === 'Healthcare Professional'
      ? 'hcp'
      : persona === 'Patient Advocate'
        ? 'adv'
        : persona === 'Caregiver'
          ? 'cg'
          : 'pt';

  const rows: Omit<SearchResultItem, 'id' | 'demoUserTaxonomy'>[] =
    persona === 'Healthcare Professional'
      ? [
          {
            title: 'Filsuvez® (birch triterpenes) — Prescribing Information',
            description:
              'Authorized indication, dosing, wound application technique, and safety monitoring for epidermolysis bullosa.',
            summary:
              'Complete HCP prescribing information for Filsuvez gel including mechanism of action (birch triterpenes), approved EB indication, application frequency, contraindications, and pooled safety data from clinical development.',
            contentId: 'FILSUVEZ-HCP-PI',
            href: `${CHIESI_BASE}products/filsuvez`,
            contentType: 'clinicalResource',
            therapeuticArea: 'epidermolysisBullosa',
            audienceTags: ['healthcareProfessional'],
            resourceFormat: 'pdf',
            language: 'english',
            accessTier: 'hcpOnly',
            keyHighlights: [
              'EB-specific wound management protocol',
              'Application steps for fragile skin',
              'Drug interaction checklist',
            ],
            lastUpdated: '2025-11-15',
            readTimeMinutes: 18,
            imageSrc: CHIESI_IMG.product,
            documents: DOC_HCP_FULL,
            matchTerms: ['filsuvez', 'prescribing', 'birch triterpenes', 'hcp', 'pi'],
          },
        ]
      : persona === 'Patient Advocate'
        ? [
            {
              title: 'Rare Disease Policy Brief — Access & Reimbursement 2025',
              description:
                'Advocacy toolkit covering orphan drug access, payer engagement, and community coalition building.',
              summary:
                'Prepared for patient advocacy leaders: EU and US policy landscape for ultra-rare therapies, template letters for legislators, payer meeting preparation guides, and coalition-building frameworks used by EB and AATD communities.',
              contentId: 'ADVOCACY-POLICY-BRIEF',
              href: `${CHIESI_BASE}community/advocacy`,
              contentType: 'advocacyResource',
              therapeuticArea: 'generalRareDisease',
              audienceTags: ['patientAdvocate'],
              resourceFormat: 'pdf',
              language: 'english',
              accessTier: 'authenticated',
              keyHighlights: [
                'Orphan drug access talking points',
                'Legislative engagement templates',
                'Coalition event planning checklist',
              ],
              lastUpdated: '2025-09-01',
              readTimeMinutes: 22,
              imageSrc: CHIESI_IMG.advocacy,
              documents: { patientLeaflet: false, prescribingInfo: false, smpc: false, clinicalBrief: true },
              matchTerms: ['advocacy', 'policy', 'reimbursement', 'access', 'advocate'],
              restricted: 'advocateBriefing',
            },
          ]
        : persona === 'Caregiver'
          ? [
              {
                title: 'Caregiver Guide — Daily Wound Care & Treatment Routines for EB',
                description:
                  'Step-by-step practical guide for family caregivers managing epidermolysis bullosa at home.',
                summary:
                  'Written for parents and family caregivers: morning skin assessment routines, painless dressing changes, Filsuvez application tips from nurse educators, school communication templates, respite care resources, and emergency contact workflows.',
                contentId: 'EB-CAREGIVER-DAILY',
                href: `${CHIESI_BASE}support/caregivers`,
                contentType: 'treatmentGuide',
                therapeuticArea: 'epidermolysisBullosa',
                audienceTags: ['caregiver', 'rareDiseasePatient'],
                resourceFormat: 'patientBrochure',
                language: 'english',
                accessTier: 'authenticated',
                keyHighlights: [
                  'Dressing change photo guide',
                  'School nurse communication letter',
                  'Burn-out prevention resources',
                ],
                lastUpdated: '2025-08-20',
                readTimeMinutes: 15,
                imageSrc: CHIESI_IMG.caregiver,
                documents: DOC_PATIENT,
                matchTerms: ['caregiver', 'wound care', 'daily routine', 'eb', 'family'],
              },
            ]
          : [
              {
                title: 'Your Rare Disease Journey — Patient Starter Kit',
                description:
                  'Personalized onboarding for newly diagnosed rare disease patients and their families.',
                summary:
                  'A welcoming first step: understanding your diagnosis, questions to ask at your next appointment, connecting with Chiesi Care Rare support, finding peer communities, and navigating insurance — written in plain language without medical jargon.',
                contentId: 'PATIENT-STARTER-KIT',
                href: `${CHIESI_BASE}support/patients`,
                contentType: 'patientSupport',
                therapeuticArea: 'generalRareDisease',
                audienceTags: ['rareDiseasePatient', 'caregiver'],
                resourceFormat: 'webPage',
                language: 'english',
                accessTier: 'authenticated',
                keyHighlights: [
                  'Diagnosis glossary in plain language',
                  'Appointment question checklist',
                  'Peer community directory',
                ],
                lastUpdated: '2025-10-01',
                readTimeMinutes: 10,
                imageSrc: CHIESI_IMG.patient,
                documents: DOC_PATIENT,
                matchTerms: ['patient', 'journey', 'starter', 'newly diagnosed', 'support'],
                restricted: 'patientPortalOnly',
              },
            ];

  return rows.map((row, i) => ({
    ...row,
    id: `sup-${code}-${i + 1}`,
    demoUserTaxonomy: persona,
  }));
}

function seed(partial: Omit<SearchResultItem, 'id'> & { id: string }): SearchResultItem {
  return {
    imageSrc: partial.imageSrc ?? getDefaultCardImage(),
    ...partial,
  };
}

export const searchCatalog: SearchResultItem[] = [
  seed({
    id: 'p-filsuvez',
    title: 'Filsuvez® (birch triterpenes) — Epidermolysis Bullosa Treatment',
    description:
      'Topical gel indicated for wound management in patients with dystrophic and junctional EB.',
    summary:
      'Filsuvez is a birch triterpenes-containing topical gel approved for partial-thickness wounds associated with dystrophic and junctional epidermolysis bullosa in patients six months and older. Explore mechanism of action, clinical evidence, application videos, and access programs.',
    contentId: 'FILSUVEZ-001',
    href: `${CHIESI_BASE}products/filsuvez`,
    contentType: 'product',
    therapeuticArea: 'epidermolysisBullosa',
    audienceTags: ['healthcareProfessional', 'rareDiseasePatient', 'caregiver', 'generalPublic'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Approved EB indication', 'Topical gel formulation', 'Patient support available'],
    lastUpdated: '2025-12-01',
    readTimeMinutes: 8,
    imageSrc: CHIESI_IMG.product,
    documents: DOC_HCP_FULL,
    matchTerms: ['filsuvez', 'birch triterpenes', 'eb', 'epidermolysis bullosa', 'wound gel'],
    demoUserTaxonomy: 'Healthcare Professional',
  }),
  seed({
    id: 'p-lamzede',
    title: 'Lamzede® (velmanase alfa) — Alpha-Mannosidosis Enzyme Replacement',
    description:
      'Enzyme replacement therapy for non-neurological manifestations of alpha-mannosidosis.',
    summary:
      'Lamzede (velmanase alfa) is a recombinant human alpha-mannosidase indicated for treating non-neurological manifestations in mild to moderate alpha-mannosidosis. Review dosing by body weight, infusion guidance, and long-term outcomes data.',
    contentId: 'LAMZEDE-001',
    href: `${CHIESI_BASE}products/lamzede`,
    contentType: 'product',
    therapeuticArea: 'alphaMannosidosis',
    audienceTags: ['healthcareProfessional', 'caregiver', 'rareDiseasePatient'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['ERT for alpha-mannosidosis', 'Weight-based dosing', 'Home infusion support'],
    lastUpdated: '2025-11-20',
    readTimeMinutes: 10,
    imageSrc: CHIESI_IMG.product,
    documents: DOC_HCP_FULL,
    matchTerms: ['lamzede', 'velmanase alfa', 'alpha-mannosidosis', 'ert', 'enzyme replacement'],
    demoUserTaxonomy: 'Healthcare Professional',
  }),
  seed({
    id: 'd-eb-overview',
    title: 'Understanding Epidermolysis Bullosa (EB) — Disease Overview',
    description:
      'Comprehensive guide to EB subtypes, symptoms, diagnosis pathway, and multidisciplinary care.',
    summary:
      'Epidermolysis bullosa comprises a group of rare genetic disorders causing fragile skin and mucous membranes. This overview explains dystrophic, junctional, and simplex subtypes; genetic testing pathways; wound care principles; and the role of specialized EB centers.',
    contentId: 'EB-OVERVIEW',
    href: `${CHIESI_BASE}diseases/epidermolysis-bullosa`,
    contentType: 'diseaseInformation',
    therapeuticArea: 'epidermolysisBullosa',
    audienceTags: ['generalPublic', 'rareDiseasePatient', 'caregiver', 'healthcareProfessional'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['EB subtypes explained', 'Genetic testing guide', 'Multidisciplinary care team'],
    lastUpdated: '2025-10-15',
    readTimeMinutes: 12,
    imageSrc: CHIESI_IMG.patient,
    matchTerms: ['eb', 'epidermolysis bullosa', 'blistering', 'fragile skin', 'dystrophic'],
    demoUserTaxonomy: 'Rare disease Patient',
  }),
  seed({
    id: 'd-aatd-overview',
    title: 'Alpha-1 Antitrypsin Deficiency (AATD) — Clinical Overview',
    description:
      'Pathophysiology, diagnosis criteria, and management of alpha-1 antitrypsin deficiency.',
    summary:
      'Alpha-1 antitrypsin deficiency is an inherited disorder that can cause lung disease and liver disease. Learn about SERPINA1 mutations, serum AAT thresholds, spirometry monitoring, augmentation therapy eligibility, and referral to specialist centers.',
    contentId: 'AATD-CLINICAL-BRIEF',
    href: `${CHIESI_BASE}diseases/alpha-1`,
    contentType: 'clinicalResource',
    therapeuticArea: 'alpha1AntitrypsinDeficiency',
    audienceTags: ['healthcareProfessional'],
    resourceFormat: 'clinicalPublication',
    language: 'english',
    accessTier: 'authenticated',
    keyHighlights: ['Diagnostic algorithm', 'Augmentation therapy criteria', 'Liver involvement screening'],
    lastUpdated: '2025-09-28',
    readTimeMinutes: 16,
    imageSrc: CHIESI_IMG.aatd,
    documents: DOC_CLINICAL,
    matchTerms: ['alpha-1', 'aatd', 'antitrypsin', 'copd', 'serpina1', 'augmentation'],
    demoUserTaxonomy: 'Healthcare Professional',
  }),
  seed({
    id: 'tg-eb-patient',
    title: 'Living with EB — Patient & Caregiver Treatment Guide',
    description:
      'Plain-language guide to daily skin care, pain management, nutrition, and treatment options.',
    summary:
      'Designed for patients and families: understanding your EB type, building a daily skin care routine, nutrition for wound healing, pain and itch management strategies, when to call your care team, and overview of available treatments including topical therapies.',
    contentId: 'EB-PATIENT-GUIDE',
    href: `${CHIESI_BASE}support/eb-patient-guide`,
    contentType: 'treatmentGuide',
    therapeuticArea: 'epidermolysisBullosa',
    audienceTags: ['rareDiseasePatient', 'caregiver'],
    resourceFormat: 'patientBrochure',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Daily skin care checklist', 'Pain management tips', 'Nutrition guidance'],
    lastUpdated: '2025-08-05',
    readTimeMinutes: 14,
    imageSrc: CHIESI_IMG.caregiver,
    documents: DOC_PATIENT,
    matchTerms: ['living with eb', 'patient guide', 'caregiver', 'daily care', 'treatment options'],
    demoUserTaxonomy: 'Caregiver',
  }),
  seed({
    id: 'ps-chiesi-care',
    title: 'Chiesi Care Rare — Patient Support Program',
    description:
      'Financial assistance, nurse support lines, and treatment access navigation for eligible patients.',
    summary:
      'Chiesi Care Rare provides personalized support for patients prescribed Chiesi rare disease therapies: benefit verification, co-pay assistance for eligible patients, nurse educator callbacks, shipment coordination, and connection to independent charitable foundations.',
    contentId: 'CHIESI-SUPPORT-2025',
    href: `${CHIESI_BASE}support/chiesi-care-rare`,
    contentType: 'patientSupport',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['rareDiseasePatient', 'caregiver'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Co-pay assistance', 'Nurse support line', 'Benefit verification'],
    lastUpdated: '2025-11-01',
    readTimeMinutes: 6,
    imageSrc: CHIESI_IMG.patient,
    matchTerms: ['chiesi care', 'patient support', 'financial assistance', 'copay', 'nurse line'],
    demoUserTaxonomy: 'Rare disease Patient',
  }),
  seed({
    id: 'adv-coalition',
    title: 'Building Rare Disease Coalitions — Advocate Playbook',
    description:
      'Framework for launching and sustaining patient advocacy coalitions across therapeutic areas.',
    summary:
      'A practical playbook for patient advocates: forming steering committees, engaging clinicians and researchers, planning awareness months, drafting policy positions, measuring coalition impact, and sustaining volunteer engagement over multi-year campaigns.',
    contentId: 'ADVOCACY-COALITION',
    href: `${CHIESI_BASE}community/coalition-playbook`,
    contentType: 'advocacyResource',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['patientAdvocate'],
    resourceFormat: 'pdf',
    language: 'english',
    accessTier: 'authenticated',
    keyHighlights: ['Steering committee templates', 'Awareness month toolkit', 'Impact metrics'],
    lastUpdated: '2025-07-12',
    readTimeMinutes: 20,
    imageSrc: CHIESI_IMG.advocacy,
    matchTerms: ['advocacy', 'coalition', 'awareness', 'policy', 'advocate playbook'],
    demoUserTaxonomy: 'Patient Advocate',
  }),
  seed({
    id: 'cr-filsuvez-trial',
    title: 'Filsuvez Phase III EASE Trial — Clinical Results Summary',
    description:
      'Primary and secondary endpoints from the EASE study in dystrophic epidermolysis bullosa.',
    summary:
      'Summary of the EASE Phase III randomized trial: patient population, wound target selection, primary endpoint (complete wound closure), key secondary endpoints, adverse event profile, and clinical implications for dermatologists and EB centers.',
    contentId: 'FILSUVEZ-EASE-TRIAL',
    href: `${CHIESI_BASE}clinical/filsuvez-ease`,
    contentType: 'clinicalResource',
    therapeuticArea: 'epidermolysisBullosa',
    audienceTags: ['healthcareProfessional'],
    resourceFormat: 'clinicalPublication',
    language: 'english',
    accessTier: 'hcpOnly',
    keyHighlights: ['Phase III EASE data', 'Wound closure endpoints', 'Safety profile summary'],
    lastUpdated: '2025-06-18',
    readTimeMinutes: 25,
    imageSrc: CHIESI_IMG.research,
    documents: DOC_CLINICAL,
    matchTerms: ['ease trial', 'clinical trial', 'phase 3', 'filsuvez', 'wound closure'],
    demoUserTaxonomy: 'Healthcare Professional',
    restricted: 'hcpInternal',
  }),
  seed({
    id: 'doc-lamzede-smpc',
    title: 'Lamzede® — Summary of Product Characteristics (SmPC)',
    description: 'EU SmPC for velmanase alfa enzyme replacement therapy.',
    summary:
      'Authorized SmPC including indication, posology and method of administration, contraindications, special warnings, interactions, fertility/pregnancy/lactation, and adverse reaction summary for healthcare professionals in EU markets.',
    contentId: 'LAMZEDE-HCP-SMPC',
    href: `${CHIESI_BASE}hcp/lamzede-smpc`,
    contentType: 'clinicalResource',
    therapeuticArea: 'alphaMannosidosis',
    audienceTags: ['healthcareProfessional'],
    resourceFormat: 'pdf',
    language: 'english',
    accessTier: 'hcpOnly',
    keyHighlights: ['EU authorized label', 'Infusion posology', 'Adverse reactions table'],
    lastUpdated: '2025-05-22',
    isDocument: true,
    documents: { patientLeaflet: false, prescribingInfo: false, smpc: true, clinicalBrief: false },
    matchTerms: ['lamzede', 'smpc', 'velmanase', 'eu label'],
    demoUserTaxonomy: 'Healthcare Professional',
  }),
  seed({
    id: 'd-cf-overview',
    title: 'Cystic Fibrosis — Understanding the Disease',
    description:
      'Overview of CFTR mutations, pulmonary manifestations, and evolving treatment landscape.',
    summary:
      'Cystic fibrosis affects multiple organ systems with progressive pulmonary disease as the primary morbidity. This resource covers CFTR genotype-phenotype relationships, newborn screening, modulator therapies, airway clearance techniques, and transition from pediatric to adult care.',
    contentId: 'CF-OVERVIEW',
    href: `${CHIESI_BASE}diseases/cystic-fibrosis`,
    contentType: 'diseaseInformation',
    therapeuticArea: 'cysticFibrosis',
    audienceTags: ['generalPublic', 'healthcareProfessional', 'rareDiseasePatient'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['CFTR mutations', 'Modulator therapies', 'Transition of care'],
    lastUpdated: '2025-04-10',
    readTimeMinutes: 11,
    imageSrc: CHIESI_IMG.patient,
    matchTerms: ['cystic fibrosis', 'cftr', 'pulmonary', 'modulator'],
  }),
  seed({
    id: 'd-pcd-overview',
    title: 'Primary Ciliary Dyskinesia (PCD) — Diagnosis & Management',
    description:
      'Guidance on recognizing PCD, confirmatory testing, and long-term respiratory care.',
    summary:
      'PCD is a rare genetic disorder of motile cilia leading to chronic respiratory tract infections, situs abnormalities, and infertility. Covers clinical red flags, nasal nitric oxide screening, genetic panels, daily airway clearance, and monitoring for bronchiectasis.',
    contentId: 'PCD-OVERVIEW',
    href: `${CHIESI_BASE}diseases/pcd`,
    contentType: 'diseaseInformation',
    therapeuticArea: 'primaryCiliaryDyskinesia',
    audienceTags: ['healthcareProfessional', 'caregiver', 'rareDiseasePatient'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Diagnostic red flags', 'Genetic testing panels', 'Airway clearance protocols'],
    lastUpdated: '2025-03-08',
    readTimeMinutes: 13,
    imageSrc: CHIESI_IMG.research,
    matchTerms: ['pcd', 'primary ciliary dyskinesia', 'cilia', 'bronchiectasis'],
  }),
  seed({
    id: 'tg-infusion-caregiver',
    title: 'Caregiver Guide — Home Infusion for Rare Disease Therapies',
    description:
      'Preparing for home infusion visits, managing side effects, and coordinating with infusion nurses.',
    summary:
      'For caregivers of patients receiving enzyme replacement or biologic infusions at home: pre-infusion checklists, creating a comfortable infusion space, recognizing infusion reactions, medication storage requirements, and communicating with home health agencies.',
    contentId: 'CG-HOME-INFUSION',
    href: `${CHIESI_BASE}support/home-infusion-caregiver`,
    contentType: 'treatmentGuide',
    therapeuticArea: 'alphaMannosidosis',
    audienceTags: ['caregiver'],
    resourceFormat: 'patientBrochure',
    language: 'english',
    accessTier: 'authenticated',
    keyHighlights: ['Pre-infusion checklist', 'Reaction recognition guide', 'Storage requirements'],
    lastUpdated: '2025-02-14',
    readTimeMinutes: 9,
    imageSrc: CHIESI_IMG.caregiver,
    documents: DOC_PATIENT,
    matchTerms: ['home infusion', 'caregiver', 'infusion nurse', 'enzyme replacement'],
    demoUserTaxonomy: 'Caregiver',
  }),
  seed({
    id: 'adv-rare-day',
    title: 'Rare Disease Day 2026 — Community Activation Kit',
    description:
      'Social media assets, event planning guides, and media templates for Rare Disease Day.',
    summary:
      'Everything advocates need for Rare Disease Day: downloadable graphics, press release templates, virtual event run-of-show, patient story interview guides, legislator meeting scheduling tips, and hashtag strategy for global coordination.',
    contentId: 'RDD-2026-KIT',
    href: `${CHIESI_BASE}community/rare-disease-day-2026`,
    contentType: 'advocacyResource',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['patientAdvocate', 'generalPublic'],
    resourceFormat: 'infographic',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Social media toolkit', 'Press release templates', 'Virtual event guide'],
    lastUpdated: '2025-01-20',
    readTimeMinutes: 7,
    imageSrc: CHIESI_IMG.advocacy,
    matchTerms: ['rare disease day', 'advocacy', 'awareness', 'community event'],
    demoUserTaxonomy: 'Patient Advocate',
  }),
  seed({
    id: 'faq-insurance',
    title: 'FAQ — Insurance Coverage for Rare Disease Treatments',
    description:
      'Answers to common questions about prior authorization, appeals, and patient assistance.',
    summary:
      'Frequently asked questions about navigating insurance for orphan drugs: understanding prior authorization, step therapy appeals, specialty pharmacy requirements, Medicare/Medicaid considerations, and how Chiesi Care Rare can help with benefit investigation.',
    contentId: 'FAQ-INSURANCE',
    href: `${CHIESI_BASE}support/faq/insurance`,
    contentType: 'faq',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['rareDiseasePatient', 'caregiver'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Prior authorization tips', 'Appeals process', 'Specialty pharmacy FAQ'],
    lastUpdated: '2025-11-08',
    readTimeMinutes: 5,
    imageSrc: CHIESI_IMG.patient,
    matchTerms: ['insurance', 'coverage', 'prior authorization', 'appeals', 'faq'],
    demoUserTaxonomy: 'Rare disease Patient',
  }),
  seed({
    id: 'news-rdd-summit',
    title: 'Chiesi Rare Summit 2025 — Highlights & On-Demand Sessions',
    description:
      'Recap of keynote presentations, patient panels, and scientific sessions from the annual summit.',
    summary:
      'Catch up on Chiesi Rare Summit 2025: keynote on personalized medicine in rare diseases, patient panel on diagnostic odyssey, scientific sessions on EB wound healing and alpha-mannosidosis outcomes, and networking sessions for advocates and clinicians.',
    contentId: 'NEWS-SUMMIT-2025',
    href: `${CHIESI_BASE}news/rare-summit-2025`,
    contentType: 'newsEvent',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['healthcareProfessional', 'patientAdvocate', 'generalPublic'],
    resourceFormat: 'webinar',
    language: 'english',
    accessTier: 'authenticated',
    keyHighlights: ['On-demand recordings', 'Patient panel replay', 'Scientific session slides'],
    lastUpdated: '2025-10-28',
    readTimeMinutes: 45,
    imageSrc: CHIESI_IMG.advocacy,
    matchTerms: ['summit', 'conference', 'webinar', 'news', '2025'],
  }),
  seed({
    id: 'cr-respiratory-rare',
    title: 'Rare Respiratory Diseases — HCP Resource Hub',
    description:
      'Clinical pathways for BOS, PCD, and AATD with referral criteria and monitoring schedules.',
    summary:
      'Centralized hub for pulmonologists and respiratory therapists: diagnostic algorithms for bronchiolitis obliterans syndrome, PCD referral criteria, AATD augmentation monitoring, pulmonary rehabilitation considerations, and links to specialist center directories.',
    contentId: 'RESP-HCP-HUB',
    href: `${CHIESI_BASE}hcp/respiratory-rare`,
    contentType: 'clinicalResource',
    therapeuticArea: 'bronchiolitisObliterans',
    audienceTags: ['healthcareProfessional'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'hcpOnly',
    keyHighlights: ['BOS diagnostic pathway', 'Specialist referral criteria', 'Monitoring schedules'],
    lastUpdated: '2025-09-15',
    readTimeMinutes: 20,
    imageSrc: CHIESI_IMG.research,
    documents: DOC_CLINICAL,
    matchTerms: ['respiratory', 'pulmonology', 'bos', 'aatd', 'pcd', 'hcp hub'],
    demoUserTaxonomy: 'Healthcare Professional',
  }),
  seed({
    id: 'pt-peer-stories',
    title: 'Patient Stories — Voices from the Rare Disease Community',
    description:
      'Video testimonials from patients and caregivers sharing diagnosis journeys and daily life.',
    summary:
      'Real stories from the community: a teenager with EB describing school accommodations, a parent navigating alpha-mannosidosis diagnosis, an adult with AATD discussing augmentation therapy, and an advocate reflecting on policy wins — with captions and transcript downloads.',
    contentId: 'PATIENT-STORIES',
    href: `${CHIESI_BASE}community/patient-stories`,
    contentType: 'patientSupport',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['rareDiseasePatient', 'caregiver', 'patientAdvocate', 'generalPublic'],
    resourceFormat: 'video',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Video testimonials', 'Downloadable transcripts', 'Community voices'],
    lastUpdated: '2025-08-30',
    readTimeMinutes: 30,
    imageSrc: CHIESI_IMG.patient,
    matchTerms: ['patient stories', 'testimonial', 'community', 'video', 'journey'],
    demoUserTaxonomy: 'Rare disease Patient',
  }),
  seed({
    id: 'doc-filsuvez-leaflet',
    title: 'Filsuvez® — Patient Information Leaflet',
    description: 'Plain-language patient leaflet for Filsuvez topical gel.',
    summary:
      'Patient-facing leaflet explaining what Filsuvez is, how to apply the gel, what to expect during treatment, possible side effects in everyday language, and contact information for questions between clinic visits.',
    contentId: 'FILSUVEZ-PATIENT-LEAFLET',
    href: `${CHIESI_BASE}support/filsuvez-patient-leaflet`,
    contentType: 'treatmentGuide',
    therapeuticArea: 'epidermolysisBullosa',
    audienceTags: ['rareDiseasePatient', 'caregiver'],
    resourceFormat: 'pdf',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Application instructions', 'Side effects in plain language', 'Support contacts'],
    lastUpdated: '2025-07-01',
    isDocument: true,
    documents: DOC_PATIENT,
    matchTerms: ['patient leaflet', 'filsuvez', 'pil', 'patient information'],
    demoUserTaxonomy: 'Rare disease Patient',
  }),
  seed({
    id: 'adv-policy-brief',
    title: 'Rare Disease Policy Brief — Access & Reimbursement 2025',
    description:
      'Legislative landscape and advocacy priorities for orphan drug access in the US and EU.',
    summary:
      'Detailed policy analysis for advocacy organizations: orphan drug designation trends, HTA reform in EU5, US state-level step therapy laws, Medicaid best-price implications, and recommended advocacy priorities for the 2025–2026 legislative cycle.',
    contentId: 'ADVOCACY-POLICY-BRIEF',
    href: `${CHIESI_BASE}community/policy-brief-2025`,
    contentType: 'advocacyResource',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['patientAdvocate'],
    resourceFormat: 'pdf',
    language: 'english',
    accessTier: 'authenticated',
    keyHighlights: ['US & EU policy comparison', 'HTA reform analysis', 'Advocacy priority list'],
    lastUpdated: '2025-09-01',
    readTimeMinutes: 22,
    imageSrc: CHIESI_IMG.advocacy,
    documents: { patientLeaflet: false, prescribingInfo: false, smpc: false, clinicalBrief: true },
    matchTerms: ['policy brief', 'reimbursement', 'orphan drug', 'advocacy', 'legislative'],
    demoUserTaxonomy: 'Patient Advocate',
    restricted: 'advocateBriefing',
  }),
  seed({
    id: 'd-neonatal-rare',
    title: 'Neonatal Rare Disease Screening — What Parents Should Know',
    description:
      'Guide to newborn screening, follow-up testing, and early intervention for rare conditions.',
    summary:
      'For expectant and new parents: how newborn screening works, what a positive screen means, confirmatory testing timelines, early intervention services, genetic counseling resources, and emotional support during the diagnostic waiting period.',
    contentId: 'NEONATAL-SCREENING',
    href: `${CHIESI_BASE}diseases/neonatal-screening`,
    contentType: 'diseaseInformation',
    therapeuticArea: 'neonatalRareDisease',
    audienceTags: ['caregiver', 'rareDiseasePatient', 'generalPublic'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Newborn screening explained', 'Follow-up testing timeline', 'Genetic counseling links'],
    lastUpdated: '2025-06-05',
    readTimeMinutes: 8,
    imageSrc: CHIESI_IMG.caregiver,
    matchTerms: ['newborn screening', 'neonatal', 'new parents', 'early intervention'],
    demoUserTaxonomy: 'Caregiver',
  }),
  seed({
    id: 'faq-clinical-trials',
    title: 'FAQ — Participating in Rare Disease Clinical Trials',
    description:
      'How to find trials, understand eligibility, and prepare for site visits as a patient or caregiver.',
    summary:
      'Answers for patients and caregivers considering clinical trials: ClinicalTrials.gov navigation, inclusion/exclusion criteria in plain language, informed consent essentials, travel reimbursement, placebo concerns, and questions to ask the study coordinator.',
    contentId: 'FAQ-CLINICAL-TRIALS',
    href: `${CHIESI_BASE}support/faq/clinical-trials`,
    contentType: 'faq',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['rareDiseasePatient', 'caregiver', 'patientAdvocate'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'public',
    keyHighlights: ['Finding trials', 'Eligibility explained', 'Questions for coordinators'],
    lastUpdated: '2025-05-18',
    readTimeMinutes: 7,
    imageSrc: CHIESI_IMG.patient,
    matchTerms: ['clinical trial', 'faq', 'enrollment', 'clinicaltrials.gov'],
    demoUserTaxonomy: 'Rare disease Patient',
  }),
  seed({
    id: 'cr-hcp-webinar-eb',
    title: 'On-Demand Webinar — Advances in EB Wound Management',
    description:
      'CME-eligible webinar featuring dermatologists and nurse specialists on EB care best practices.',
    summary:
      'Recorded webinar (CME credit available): evidence-based wound bed preparation in EB, pain-adapted dressing strategies, role of topical therapies, case discussions from EB centers of excellence, and Q&A on multidisciplinary team coordination.',
    contentId: 'WEBINAR-EB-WOUNDS',
    href: `${CHIESI_BASE}hcp/webinars/eb-wound-management`,
    contentType: 'clinicalResource',
    therapeuticArea: 'epidermolysisBullosa',
    audienceTags: ['healthcareProfessional'],
    resourceFormat: 'webinar',
    language: 'english',
    accessTier: 'hcpOnly',
    keyHighlights: ['CME credit available', 'Case discussions', 'Multidisciplinary team tips'],
    lastUpdated: '2025-04-22',
    readTimeMinutes: 60,
    imageSrc: CHIESI_IMG.research,
    matchTerms: ['webinar', 'cme', 'eb wounds', 'dermatology', 'hcp'],
    demoUserTaxonomy: 'Healthcare Professional',
  }),
  seed({
    id: 'lang-it-filsuvez',
    title: 'Filsuvez® — Informazioni per il paziente (Italiano)',
    description: 'Scheda paziente in italiano per Filsuvez gel topico.',
    summary:
      'Risorse per pazienti e famiglie italofone: indicazioni approvate, istruzioni per l\'applicazione del gel, effetti collaterali comuni, numeri di contatto Chiesi Care Rare Italia, e link alla comunità DEBRA Italia.',
    contentId: 'FILSUVEZ-IT-PATIENT',
    href: `${CHIESI_BASE}it/prodotti/filsuvez`,
    contentType: 'treatmentGuide',
    therapeuticArea: 'epidermolysisBullosa',
    audienceTags: ['rareDiseasePatient', 'caregiver'],
    resourceFormat: 'patientBrochure',
    language: 'italian',
    accessTier: 'public',
    keyHighlights: ['Scheda paziente italiana', 'Contatti supporto Italia', 'Link comunità DEBRA'],
    lastUpdated: '2025-03-15',
    imageSrc: CHIESI_IMG.product,
    documents: DOC_PATIENT,
    matchTerms: ['filsuvez', 'italiano', 'italian', 'paziente'],
  }),
];

export function itemMetadataLine(item: SearchResultItem): string {
  const type = searchFacetLabels.contentType[item.contentType];
  const area = searchFacetLabels.therapeuticArea[item.therapeuticArea];
  return `${type} · ${area} · ID ${item.contentId}`;
}

/** Legacy export — import map may reference this; returns null for Chiesi demo. */
export function selectAiSearchInsight() {
  return null;
}

/** @deprecated Use resolveAccessDisplay — kept for product-detail compatibility */
export function resolvePriceDisplay(): { kind: 'hidden' } {
  return { kind: 'hidden' };
}

export function formatPrice(amount: number, currency: 'USD' | 'EUR'): string {
  return new Intl.NumberFormat(currency === 'EUR' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/** @deprecated NetSuite product bridge — maps legacy document keys for ProductDetail */
export type LegacyProductDocuments = {
  coa: boolean;
  sds: boolean;
  ifu: boolean;
};

export function mapLegacyDocuments(docs: LegacyProductDocuments): ContentDocuments {
  return {
    patientLeaflet: docs.coa,
    smpc: docs.sds,
    prescribingInfo: docs.ifu,
    clinicalBrief: false,
  };
}

export function searchCatalogForLegacyBridge(item: {
  catalogNumber: string;
  productName: string;
  shortDescription: string;
  documents: LegacyProductDocuments;
}): SearchResultItem {
  return {
    id: item.catalogNumber,
    title: item.productName,
    contentId: item.catalogNumber,
    description: item.shortDescription,
    summary: item.shortDescription,
    href: '#',
    contentType: 'product',
    therapeuticArea: 'generalRareDisease',
    audienceTags: ['healthcareProfessional'],
    resourceFormat: 'webPage',
    language: 'english',
    accessTier: 'authenticated',
    keyHighlights: [],
    lastUpdated: '2025-01-01',
    documents: mapLegacyDocuments(item.documents),
  };
}

/** Legacy import-map / Microbiologics re-exports — retained for generated import maps */
export const MB_BASE = CHIESI_BASE;
export const DEMO_CATALOG_NUMBERS = DEMO_CONTENT_IDS;
export const biosafetyLevels: string[] = [];
export const productFormats = resourceFormats;
export const documentLanguages = contentLanguages;
export const documentCategories = contentTypes;
export const antibioticResistantOptions: string[] = [];
export const industryTypes = therapeuticAreas;
export const instrumentKits: string[] = [];
export const molecularSyndromicOptions: string[] = [];
export const standardGuidelines: string[] = [];
export const taxonomyGroups = therapeuticAreas;
export const testMethods: string[] = [];
