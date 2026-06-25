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
  /** Area / neighborhood shown in the marker callout bubble. */
  area?: string;
  /** Starting price shown in the marker callout bubble. */
  priceFrom?: number;
  /** Destination for the community callout link. */
  href?: string;
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

/** Default market shown when no `market` query param is present. */
export const DEFAULT_MARKET_SLUG = 'austin';

export type MapBounds = { left: number; bottom: number; right: number; top: number };

export type MarketMapConfig = {
  center: { lat: number; lng: number };
  zoom: number;
  /** OpenStreetMap bbox (left,bottom,right,top) used by the no-API-key fallback. */
  osmBbox: string;
  /** OpenStreetMap marker coordinate (lat,lng) used by the fallback. */
  osmMarker: string;
  /** Numeric bounds matching osmBbox; used to project marker pins on the fallback map. */
  bounds: MapBounds;
};

const MARKET_MAP_CONFIGS: Record<string, MarketMapConfig> = {
  austin: {
    center: { lat: 30.3217, lng: -97.7431 },
    zoom: 9,
    osmBbox: '-98.25%2C29.85%2C-97.20%2C30.85',
    osmMarker: '30.3217%2C-97.7431',
    bounds: { left: -98.25, bottom: 29.85, right: -97.2, top: 30.85 },
  },
  portland: {
    center: HOME_SEARCH_MAP_CENTER,
    zoom: HOME_SEARCH_MAP_ZOOM,
    osmBbox: '-122.7827%2C45.4949%2C-122.4726%2C45.7821',
    osmMarker: '45.6387%2C-122.6615',
    bounds: { left: -122.7827, bottom: 45.4949, right: -122.4726, top: 45.7821 },
  },
};

export function getMarketMapConfig(marketSlug: string): MarketMapConfig {
  return MARKET_MAP_CONFIGS[marketSlug] ?? MARKET_MAP_CONFIGS[DEFAULT_MARKET_SLUG]!;
}

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
  // Austin, TX market — David Weekley Homes
  // @see https://www.davidweekleyhomes.com/new-homes/tx/austin
  {
    id: 'double-creek-crossing',
    name: 'Double Creek Crossing',
    city: 'Austin',
    state: 'TX',
    region: 'north',
    marketSlug: 'austin',
    listings: [
      listing('double-creek-classic', 'Classic Series', 379990, 1601, 2890, 9, 3, 0),
      listing('double-creek-cottage', 'Cottage Series', 359990, 1400, 2410, 5, 2, 1),
    ],
  },
  {
    id: 'easton-park',
    name: 'Easton Park',
    city: 'Austin',
    state: 'TX',
    region: 'east',
    marketSlug: 'austin',
    listings: [
      listing('easton-garden', 'Garden Collection', 449990, 1500, 2800, 6, 2, 2),
      listing('easton-signature', 'Signature Series', 559990, 2012, 3210, 4, 1, 3),
    ],
  },
  {
    id: 'sweetwater',
    name: 'Sweetwater',
    city: 'Austin',
    state: 'TX',
    region: 'south',
    marketSlug: 'austin',
    listings: [
      listing('sweetwater-signature', 'Signature Series', 629990, 2100, 3400, 5, 1, 4),
    ],
  },
  {
    id: 'leander-estates',
    name: 'Leander Estates',
    city: 'Leander',
    state: 'TX',
    region: 'north',
    marketSlug: 'austin',
    listings: [
      listing('leander-classic', 'Classic Series', 525990, 1875, 3586, 8, 2, 5),
      listing('leander-cottage', 'Cottage Series', 489990, 1620, 2740, 5, 1, 0),
    ],
  },
  {
    id: 'wolf-ranch',
    name: 'Wolf Ranch',
    city: 'Georgetown',
    state: 'TX',
    region: 'north',
    marketSlug: 'austin',
    listings: [
      listing('wolf-ranch-cottage', 'Cottage Series', 489990, 1600, 2700, 6, 3, 1),
    ],
  },
];

/**
 * Austin-area community pins. Each pin references one of the live Austin
 * communities so clicking it surfaces a callout bubble (e.g. Double Creek
 * Crossing, Easton Park). Spread across the Austin metro to suggest broad
 * home availability.
 */
const AUSTIN_COMMUNITY_BUBBLES: Record<string, { name: string; priceFrom: number }> = {
  'double-creek-crossing': { name: 'Double Creek Crossing', priceFrom: 359990 },
  'easton-park': { name: 'Easton Park', priceFrom: 449990 },
  sweetwater: { name: 'Sweetwater', priceFrom: 629990 },
  'leander-estates': { name: 'Leander Estates', priceFrom: 489990 },
  'wolf-ranch': { name: 'Wolf Ranch', priceFrom: 489990 },
};

type AustinAreaSeed = [area: string, lat: number, lng: number, communityId: string, count: number];

const AUSTIN_AREA_SEEDS: AustinAreaSeed[] = [
  // North / Northwest
  ['Round Rock', 30.5083, -97.6789, 'double-creek-crossing', 8],
  ['Georgetown', 30.6333, -97.677, 'wolf-ranch', 11],
  ['Pflugerville', 30.4394, -97.62, 'double-creek-crossing', 6],
  ['Hutto', 30.5427, -97.5467, 'double-creek-crossing', 9],
  ['Leander', 30.5788, -97.8531, 'leander-estates', 12],
  ['Cedar Park', 30.5052, -97.8203, 'leander-estates', 7],
  ['Liberty Hill', 30.6649, -97.9225, 'leander-estates', 5],
  ['Jonestown', 30.4946, -97.9242, 'leander-estates', 3],
  // Central Austin
  ['Downtown Austin', 30.2672, -97.7431, 'easton-park', 6],
  ['Mueller', 30.298, -97.706, 'easton-park', 5],
  ['East Austin', 30.264, -97.71, 'easton-park', 7],
  ['South Congress', 30.248, -97.751, 'easton-park', 4],
  ['Crestview', 30.338, -97.724, 'easton-park', 5],
  ['Allandale', 30.355, -97.739, 'easton-park', 4],
  // South / Southeast
  ['Buda', 30.0855, -97.8403, 'sweetwater', 8],
  ['Kyle', 29.9891, -97.8772, 'sweetwater', 6],
  ['San Marcos', 29.8833, -97.9414, 'sweetwater', 5],
  ['Del Valle', 30.173, -97.608, 'easton-park', 6],
  ['Manchaca', 30.133, -97.84, 'sweetwater', 4],
  // West / Southwest
  ['Lakeway', 30.3635, -97.9789, 'sweetwater', 7],
  ['Bee Cave', 30.3079, -97.9461, 'sweetwater', 5],
  ['Dripping Springs', 30.1902, -98.0867, 'sweetwater', 6],
  ['Spicewood', 30.4783, -98.1581, 'leander-estates', 3],
  ['Sunset Valley', 30.236, -97.82, 'sweetwater', 4],
  // East
  ['Manor', 30.3402, -97.5572, 'double-creek-crossing', 7],
  ['Bastrop', 30.1105, -97.3153, 'double-creek-crossing', 5],
  ['Elgin', 30.3499, -97.37, 'double-creek-crossing', 4],
];

function buildAustinAreaMarkers(): MapMarker[] {
  return AUSTIN_AREA_SEEDS.map(([area, lat, lng, communityId, count], index) => {
    const bubble = AUSTIN_COMMUNITY_BUBBLES[communityId]!;
    return {
      id: `m-austin-${index}`,
      lat,
      lng,
      type: 'community' as const,
      count,
      label: bubble.name,
      communityId,
      area,
      priceFrom: bubble.priceFrom,
      href: buildCommunitySiteHref(bubble.name, 'austin'),
    };
  });
}

export const homeSearchMapMarkers: MapMarker[] = [
  { id: 'm-greely', lat: 45.815, lng: -122.747, type: 'community', count: 2, label: 'Greely Farms', communityId: 'greely-farms' },
  { id: 'm-salmon', lat: 45.711, lng: -122.649, type: 'community', count: 2, label: 'Salmon Creek Estates', communityId: 'salmon-creek-estates' },
  { id: 'm-prune', lat: 45.601, lng: -122.419, type: 'community', count: 1, label: 'Prune Hill Village', communityId: 'prune-hill-village' },
  { id: 'm-hockinson', lat: 45.738, lng: -122.485, type: 'community', count: 2, label: 'Hockinson Meadows', communityId: 'hockinson-meadows' },
  { id: 'm-design', lat: 45.655, lng: -122.583, type: 'design-center', label: 'Design Center' },
  // Austin, TX market markers
  ...buildAustinAreaMarkers(),
];

export type HomeSearchFilters = {
  zipCode: string;
  price: string;
  city: string;
  region: string;
  marketSlug: string;
};

/**
 * Builds the Sitecore community page URL, e.g. Double Creek Crossing (Austin
 * market) -> `/Sites/Austin/Double-Creek-Crossing`. Spaces become dashes.
 */
export function buildCommunitySiteHref(name: string, marketSlug: string): string {
  const { label } = resolveMarketDisplay(marketSlug);
  const city = (label.split(',')[0] ?? '').trim().replace(/\s+/g, '-');
  const slug = name.trim().replace(/\s+/g, '-');
  return `/Sites/${city}/${slug}`;
}

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
    label: 'Austin, TX',
    breadcrumb: ['HOME', 'FIND A HOME', 'TX', 'AUSTIN'],
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
      const marketLabel = findDwhMarketBySlug(community.marketSlug)?.label ?? '';
      const haystack =
        `${community.name} ${community.city} ${community.state} ${marketLabel}`.toLowerCase();
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
