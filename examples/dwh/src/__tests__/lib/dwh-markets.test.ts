import {
  DWH_MARKETS,
  DWH_DEFAULT_MARKET,
  buildDwhMarketSearchUrl,
  findDwhMarketByLabel,
  findDwhMarketBySlug,
} from '@/lib/dwh-markets';

describe('dwh-markets', () => {
  it('includes all requested markets', () => {
    expect(DWH_MARKETS).toHaveLength(20);
    expect(DWH_MARKETS.map((market) => market.label)).toEqual([
      'Atlanta, GA',
      'Austin, TX',
      'Charleston, SC',
      'Charlotte, NC',
      'Colorado Springs, CO',
      'Dallas-Fort Worth, TX',
      'Denver, CO',
      'Houston, TX',
      'Indianapolis, IN',
      'Jacksonville, FL',
      'Minneapolis, MN',
      'Nashville, TN',
      'Orlando, FL',
      'Phoenix, AZ',
      'Portland, OR',
      'Raleigh-Durham, NC',
      'Salt Lake City, UT',
      'San Antonio, TX',
      'Sherman-Ada, TX-OK',
      'Tampa, FL',
    ]);
  });

  it('defaults to the first market', () => {
    expect(DWH_DEFAULT_MARKET.label).toBe('Atlanta, GA');
  });

  it('finds markets by label and slug', () => {
    expect(findDwhMarketByLabel('Tampa, FL')?.slug).toBe('tampa');
    expect(findDwhMarketBySlug('sherman-ada')?.label).toBe('Sherman-Ada, TX-OK');
  });

  it('builds fallback and base search URLs', () => {
    expect(buildDwhMarketSearchUrl(undefined, 'austin')).toBe('/find-a-home?market=austin');
    expect(buildDwhMarketSearchUrl('https://www.davidweekleyhomes.com/browse', 'denver')).toBe(
      '/browse?market=denver'
    );
  });
});
