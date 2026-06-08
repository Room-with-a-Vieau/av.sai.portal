/**
 * Mock home search catalog for David Weekley Homes find-a-home results.
 * @see https://www.davidweekleyhomes.com/new-homes/wa/vancouver
 */

import { DWH_MARKETS, findDwhMarketBySlug } from '@/lib/dwh-markets';

export type HomeSearchTab = 'home-search' | 'plan-lookup';

export type MapMarkerType = 'community' | 'design-center';

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  type: MapMarkerType;
  count?: number;
  label: string;
  communityId?: string;
};

export type HomeListing = {
  id: string;
  name: string;
  priceFrom: number;
  sqFtMin: number;
  sqFtMax: number;
  floorPlanCount: number;
  quickMoveInCount: number;
  imageSrc: string;
};

export type HomeCommunity = {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  marketSlug: string;
  listings: HomeListing[];
};

export const HOME_SEARCH_MAP_CENTER = { lat: 45.6387, lng: -122.6615 };
export const HOME_SEARCH_MAP_ZOOM = 10;

export const FILTER_SHOW_ALL = 'show-all';

export const priceFilterOptions = [
  { value: FILTER_SHOW_ALL, label: 'Show All' },
  { value: '400000', label: '$400,000+' },
  { value: '500000', label: '$500,000+' },
  { value: '600000', label: '$600,000+' },
  { value: '700000', label: '$700,000+' },
];

export const regionFilterOptions = [
  { value: FILTER_SHOW_ALL, label: 'Show All' },
  { value: 'northwest', label: 'Northwest' },
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
];

const HOME_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=640&q=80',
];

function listing(
  id: string,
  name: string,
  priceFrom: number,
  sqFtMin: number,
  sqFtMax: number,
  floorPlanCount: number,
  quickMoveInCount: number,
  imageIndex: number
): HomeListing {
  return {
    id,
    name,
    priceFrom,
    sqFtMin,
    sqFtMax,
    floorPlanCount,
    quickMoveInCount,
    imageSrc: HOME_IMAGES[imageIndex % HOME_IMAGES.length]!,
  };
}

export const homeSearchCommunities: HomeCommunity[] = [
  {
    id: 'greely-farms',
    name: 'Greely Farms',
    city: 'Ridgefield',
    state: 'WA',
    region: 'northwest',
    marketSlug: 'portland',
    listings: [
      listing('greely-classic', 'Classic Series', 565990, 1569, 2891, 8, 2, 0),
      listing('greely-cottage', 'Cottage Series', 529990, 1420, 2410, 5, 1, 1),
    ],
  },
  {
    id: 'salmon-creek-estates',
    name: 'Salmon Creek Estates',
    city: 'Vancouver',
    state: 'WA',
    region: 'northwest',
    marketSlug: 'portland',
    listings: [
      listing('salmon-garden', 'Garden Collection', 489990, 1388, 2264, 6, 3, 2),
      listing('salmon-signature', 'Signature Series', 612990, 2012, 3120, 4, 0, 3),
    ],
  },
  {
    id: 'prune-hill-village',
    name: 'Prune Hill Village',
    city: 'Camas',
    state: 'WA',
    region: 'northwest',
    marketSlug: 'portland',
    listings: [
      listing('prune-classic', 'Classic Series', 599990, 1684, 2950, 7, 1, 4),
    ],
  },
  {
    id: 'hockinson-meadows',
    name: 'Hockinson Meadows',
    city: 'Brush Prairie',
    state: 'WA',
    region: 'northwest',
    marketSlug: 'portland',
    listings: [
      listing('hockinson-cottage', 'Cottage Series', 544990, 1510, 2688, 5, 2, 5),
      listing('hockinson-classic', 'Classic Series', 579990, 1622, 2814, 6, 1, 0),
    ],
  },
  {
    id: 'encore-streamside',
    name: 'Encore at Streamside',
    city: 'Waxhaw',
    state: 'NC',
    region: 'south',
    marketSlug: 'charlotte',
    listings: [
      listing('encore-classic', 'Classic Series', 489990, 1488, 2550, 6, 2, 1),
    ],
  },
  {
    id: 'amber-fields',
    name: 'Amber Fields',
    city: 'Rosemount',
    state: 'MN',
    region: 'north',
    marketSlug: 'minneapolis',
    listings: [
      listing('amber-cottage', 'Cottage Homes', 459990, 1360, 2190, 4, 1, 2),
    ],
  },
];

export const homeSearchMapMarkers: MapMarker[] = [
  { id: 'm-greely', lat: 45.815, lng: -122.747, type: 'community', count: 2, label: 'Greely Farms', communityId: 'greely-farms' },
  { id: 'm-salmon', lat: 45.711, lng: -122.649, type: 'community', count: 2, label: 'Salmon Creek Estates', communityId: 'salmon-creek-estates' },
  { id: 'm-prune', lat: 45.601, lng: -122.419, type: 'community', count: 1, label: 'Prune Hill Village', communityId: 'prune-hill-village' },
  { id: 'm-hockinson', lat: 45.738, lng: -122.485, type: 'community', count: 2, label: 'Hockinson Meadows', communityId: 'hockinson-meadows' },
  { id: 'm-design', lat: 45.655, lng: -122.583, type: 'design-center', label: 'Design Center' },
];

export type HomeSearchFilters = {
  zipCode: string;
  price: string;
  city: string;
  region: string;
  marketSlug: string;
};

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function resolveMarketDisplay(marketSlug: string): { label: string; breadcrumb: string[] } {
  if (marketSlug === 'portland') {
    return {
      label: 'Vancouver, WA',
      breadcrumb: ['HOME', 'FIND A HOME', 'WA', 'VANCOUVER'],
    };
  }

  const market = findDwhMarketBySlug(marketSlug);
  if (market) {
    const [city, state] = market.label.split(', ');
    return {
      label: market.label,
      breadcrumb: ['HOME', 'FIND A HOME', state ?? '', (city ?? market.label).toUpperCase()],
    };
  }

  return {
    label: 'Vancouver, WA',
    breadcrumb: ['HOME', 'FIND A HOME', 'WA', 'VANCOUVER'],
  };
}

export function filterHomeCommunities(
  communities: HomeCommunity[],
  filters: HomeSearchFilters
): HomeCommunity[] {
  const zip = filters.zipCode.trim();

  return communities.filter((community) => {
    if (filters.city !== FILTER_SHOW_ALL) {
      if (community.marketSlug !== filters.city) return false;
    } else if (filters.marketSlug && community.marketSlug !== filters.marketSlug) {
      return false;
    }

    if (filters.region !== FILTER_SHOW_ALL && community.region !== filters.region) {
      return false;
    }

    if (filters.price !== FILTER_SHOW_ALL) {
      const minPrice = Number(filters.price);
      const hasListingInRange = community.listings.some((item) => item.priceFrom >= minPrice);
      if (!hasListingInRange) return false;
    }

    if (zip) {
      const haystack = `${community.name} ${community.city} ${community.state}`.toLowerCase();
      if (!haystack.includes(zip.toLowerCase())) return false;
    }

    return true;
  });
}

export function countListings(communities: HomeCommunity[]): number {
  return communities.reduce((total, community) => total + community.listings.length, 0);
}

export const cityFilterOptions = [
  { value: FILTER_SHOW_ALL, label: 'Show All' },
  ...DWH_MARKETS.map((market) => ({ value: market.slug, label: market.label })),
];
