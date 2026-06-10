import {
  categoryFilterLabels,
  detectQueryTopics,
  itemMatchesQuery,
  normalizeQuery,
  parseCategoryFilter,
  parseDemoUserTaxonomy,
  relevanceScore,
  searchCatalog,
  selectFeaturedAnswer,
  supplementalResultsForDemoUserTaxonomy,
} from '@/components/search-results/illumina-search-data';

describe('illumina-search-data', () => {
  it('includes enhanced category labels beyond illumina.com defaults', () => {
    expect(categoryFilterLabels.products).toBe('Products');
    expect(categoryFilterLabels.manuals).toBe('Manuals');
    expect(categoryFilterLabels.solutions).toBe('Solutions');
    expect(categoryFilterLabels.software).toBe('Software & Analysis');
  });

  it('parses category filter params', () => {
    expect(parseCategoryFilter('manuals')).toBe('manuals');
    expect(parseCategoryFilter('techSupport')).toBe('techSupport');
    expect(parseCategoryFilter(null)).toBe('all');
  });

  it('matches spatial discovery queries', () => {
    const matches = searchCatalog.filter((item) => itemMatchesQuery(item, 'spatial discovery'));
    expect(matches.some((item) => item.title.includes('StrataMap'))).toBe(true);
    expect(matches.length).toBeGreaterThan(3);
  });

  it('detects StrataMap Spatial topic from the suggested question', () => {
    const query = normalizeQuery('What is Illumina StrataMap Spatial?');
    expect(detectQueryTopics(query)).toContain('stratamap-spatial');
  });

  it('finds StrataMap Spatial results in every category for the suggested question', () => {
    const query = 'What is Illumina StrataMap Spatial?';
    const categories = [
      'products',
      'learn',
      'techSupport',
      'manuals',
      'solutions',
      'software',
      'publications',
      'training',
    ] as const;

    for (const category of categories) {
      const matches = searchCatalog.filter(
        (item) => item.category === category && itemMatchesQuery(item, query)
      );
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it('boosts persona-tagged results in relevance scoring', () => {
    const item = searchCatalog.find((row) => row.demoUserTaxonomy === 'Procurement');
    expect(item).toBeDefined();
    const withPersona = relevanceScore(item!, 'procurement quote', 'Procurement');
    const withoutPersona = relevanceScore(item!, 'procurement quote', null);
    expect(withPersona).toBeGreaterThan(withoutPersona);
  });

  it('returns supplemental rows per persona', () => {
    const rows = supplementalResultsForDemoUserTaxonomy('Molecular Pathologists');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]?.demoUserTaxonomy).toBe('Molecular Pathologists');
  });

  it('selects featured answers for spatial queries', () => {
    const answer = selectFeaturedAnswer('spatial discovery', 'Academic/Research Lab Scientists');
    expect(answer?.question).toContain('StrataMap');
    expect(answer?.displayAnswer).toContain('research labs');
  });

  it('parses demo user taxonomy values', () => {
    expect(parseDemoUserTaxonomy('Operations Managers')).toBe('Operations Managers');
    expect(parseDemoUserTaxonomy('Invalid')).toBeNull();
  });

  it('normalizes query strings', () => {
    expect(normalizeQuery('  Spatial   Discovery  ')).toBe('spatial discovery');
  });
});
