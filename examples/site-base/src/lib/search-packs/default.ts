import type { SearchSitePack } from './types';

/**
 * Empty fallback catalog used until a demo site registers its own Search pack.
 * Do not hardcode client content here.
 */
export const DEFAULT_SEARCH_PACK: SearchSitePack = {
  siteName: 'default',
  brandName: 'Search',
  catalog: [],
  facetLabels: {
    lob: {},
    peril: {},
    topic: {},
  },
  bucketSynonyms: {},
  popularSearches: [],
  insightRules: [],
  copy: {
    kicker: 'Site search',
    headingEmpty: 'Search this site',
    intro: 'Search published pages and resources for this site.',
    placeholder: 'Search…',
    emptyHint: 'Try a page or product name from this site.',
    resultsHint: '',
    aiHeading: 'Guidance',
    citationsHeading: 'Related pages',
    facetLob: 'Type',
    facetPeril: 'Area',
    facetTopic: 'Topic',
    tips: [],
  },
  ctaByLob: {},
  defaultCta: 'Learn more',
  iconByLob: {},
};
