import {
  DEFAULT_SEARCH_PACK,
  getSearchPack,
  listSearchPackSiteNames,
  resolveSearchSiteName,
  toSiteAwareHref,
} from '@/lib/search-packs';

jest.mock('lucide-react', () => {
  const Icon = () => null;
  return new Proxy(
    {},
    {
      get: () => Icon,
    }
  );
});

describe('search pack registry', () => {
  it('starts with no client packs registered', () => {
    expect(listSearchPackSiteNames()).toEqual([]);
  });

  it('falls back to the empty default pack', () => {
    const pack = getSearchPack(null);
    expect(pack).toBe(DEFAULT_SEARCH_PACK);
    expect(pack.catalog).toEqual([]);
    expect(pack.siteName).toBe('default');
  });

  it('does not resolve former client catalogs', () => {
    expect(getSearchPack('quanex').catalog).toEqual([]);
    expect(getSearchPack('pillsburylaw').brandName).toBe('Search');
  });
});

describe('resolveSearchSiteName (shared editing host)', () => {
  const known = ['acme', 'northwind'];

  it('prefers a known URL site over a mismatched Sitecore siteName', () => {
    expect(
      resolveSearchSiteName({
        sitecoreSite: 'northwind',
        pathname: '/acme/en/Search-Results',
        knownSites: known,
      })
    ).toBe('acme');
  });

  it('uses Sitecore siteName on custom-domain content paths', () => {
    expect(
      resolveSearchSiteName({
        sitecoreSite: 'acme',
        pathname: '/Products/Example',
        knownSites: known,
      })
    ).toBe('acme');
  });

  it('honors an explicit override', () => {
    expect(
      resolveSearchSiteName({
        override: 'northwind',
        sitecoreSite: 'acme',
        pathname: '/acme/en/search',
        knownSites: known,
      })
    ).toBe('northwind');
  });
});

describe('toSiteAwareHref', () => {
  const known = ['acme'];

  it('prefixes catalog hrefs on a shared-host /site/locale URL and hyphenates spaces', () => {
    expect(toSiteAwareHref('/Products/Example Item', '/acme/en/Search-Results', known)).toBe(
      '/acme/en/Products/Example-Item'
    );
  });

  it('leaves content-root hrefs unchanged on custom domains', () => {
    expect(toSiteAwareHref('/Products/Example Item', '/Search-Results', known)).toBe(
      '/Products/Example-Item'
    );
  });
});
