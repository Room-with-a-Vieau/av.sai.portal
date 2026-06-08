/**
 * David Weekley Homes market list — shared across hero search, locators, and other DWH components.
 * @see https://www.davidweekleyhomes.com/
 */

export type DwhMarket = {
  /** Display label shown in location selectors */
  label: string;
  /** URL-safe slug for routing and query params */
  slug: string;
};

export const DWH_MARKETS: readonly DwhMarket[] = [
  { label: 'Atlanta, GA', slug: 'atlanta' },
  { label: 'Austin, TX', slug: 'austin' },
  { label: 'Charleston, SC', slug: 'charleston' },
  { label: 'Charlotte, NC', slug: 'charlotte' },
  { label: 'Colorado Springs, CO', slug: 'colorado-springs' },
  { label: 'Dallas-Fort Worth, TX', slug: 'dallas-fort-worth' },
  { label: 'Denver, CO', slug: 'denver' },
  { label: 'Houston, TX', slug: 'houston' },
  { label: 'Indianapolis, IN', slug: 'indianapolis' },
  { label: 'Jacksonville, FL', slug: 'jacksonville' },
  { label: 'Minneapolis, MN', slug: 'minneapolis' },
  { label: 'Nashville, TN', slug: 'nashville' },
  { label: 'Orlando, FL', slug: 'orlando' },
  { label: 'Phoenix, AZ', slug: 'phoenix' },
  { label: 'Portland, OR', slug: 'portland' },
  { label: 'Raleigh-Durham, NC', slug: 'raleigh-durham' },
  { label: 'Salt Lake City, UT', slug: 'salt-lake-city' },
  { label: 'San Antonio, TX', slug: 'san-antonio' },
  { label: 'Sherman-Ada, TX-OK', slug: 'sherman-ada' },
  { label: 'Tampa, FL', slug: 'tampa' },
] as const;

export const DWH_MARKET_LABELS = DWH_MARKETS.map((market) => market.label);

export const DWH_DEFAULT_MARKET = DWH_MARKETS[0];

export function findDwhMarketByLabel(label: string): DwhMarket | undefined {
  return DWH_MARKETS.find((market) => market.label === label);
}

export function findDwhMarketBySlug(slug: string): DwhMarket | undefined {
  return DWH_MARKETS.find((market) => market.slug === slug);
}

/** Builds a market search URL from an optional Sitecore CTA base href. */
export function buildDwhMarketSearchUrl(baseHref: string | undefined, slug: string): string {
  if (!baseHref || baseHref === 'http://' || baseHref === '#') {
    return `/find-a-home?market=${slug}`;
  }

  try {
    const url = new URL(baseHref, 'https://www.davidweekleyhomes.com');
    url.searchParams.set('market', slug);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return `/find-a-home?market=${slug}`;
  }
}
