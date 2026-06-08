import {
  FILTER_SHOW_ALL,
  filterHomeCommunities,
  homeSearchCommunities,
  resolveMarketDisplay,
} from '@/components/search-results/home-search-data';

describe('home-search-data', () => {
  it('resolves Vancouver display for the Portland metro market', () => {
    expect(resolveMarketDisplay('portland')).toEqual({
      label: 'Vancouver, WA',
      breadcrumb: ['HOME', 'FIND A HOME', 'WA', 'VANCOUVER'],
    });
  });

  it('filters communities by market slug', () => {
    const portlandResults = filterHomeCommunities(homeSearchCommunities, {
      zipCode: '',
      price: FILTER_SHOW_ALL,
      city: FILTER_SHOW_ALL,
      region: FILTER_SHOW_ALL,
      marketSlug: 'portland',
    });

    expect(portlandResults).toHaveLength(4);

    const charlotteResults = filterHomeCommunities(homeSearchCommunities, {
      zipCode: '',
      price: FILTER_SHOW_ALL,
      city: FILTER_SHOW_ALL,
      region: FILTER_SHOW_ALL,
      marketSlug: 'charlotte',
    });

    expect(charlotteResults).toHaveLength(1);
    expect(charlotteResults[0]?.name).toBe('Encore at Streamside');
  });
});
