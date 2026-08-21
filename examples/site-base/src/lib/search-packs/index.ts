import { DEFAULT_SEARCH_PACK } from './default';
import type { SearchSitePack } from './types';

export type {
  AiCitation,
  AiSearchInsight,
  SearchFacetLabels,
  SearchInsightRule,
  SearchPackCopy,
  SearchResultItem,
  SearchSitePack,
  SearchTip,
} from './types';
export {
  RESULTS_PAGE_SIZE,
  detectSearchBuckets,
  itemMatchesQuery,
  itemMetadataLine,
  itemVisibleForDemoUser,
  normalizeQuery,
  relevanceScore,
  resolveSearchSiteName,
  selectAiSearchInsight,
  toSiteAwareHref,
} from './helpers';
export { DEFAULT_SEARCH_PACK } from './default';

/** Registry of mock SearchResults catalogs. Keys match Sitecore site names. */
export const SEARCH_SITE_PACKS: Readonly<Record<string, SearchSitePack>> = {};

export function normalizeSearchSiteName(siteName?: string | null): string {
  return (siteName || '').toLowerCase().trim();
}

/**
 * Resolve a SearchResults pack for the current site.
 * Unknown sites fall back to NEXT_PUBLIC_DEFAULT_SITE_NAME, then the empty default pack.
 */
export function getSearchPack(siteName?: string | null): SearchSitePack {
  const key = normalizeSearchSiteName(siteName);
  if (key && SEARCH_SITE_PACKS[key]) return SEARCH_SITE_PACKS[key];

  const envDefault = normalizeSearchSiteName(process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME);
  if (envDefault && SEARCH_SITE_PACKS[envDefault]) {
    return SEARCH_SITE_PACKS[envDefault];
  }

  return DEFAULT_SEARCH_PACK;
}

export function listSearchPackSiteNames(): string[] {
  return Object.keys(SEARCH_SITE_PACKS);
}
