import {
  DWH_BUYER_PERSONAS,
  parseDemoUserTaxonomy,
} from '@/lib/dwh-buyer-personas';

describe('dwh-buyer-personas', () => {
  it('includes the DWH buyer persona list', () => {
    expect(DWH_BUYER_PERSONAS.map((persona) => persona.label)).toEqual([
      'First-time homebuyers',
      'Move-up Families',
      'Empty Nesters',
    ]);
  });

  it('parses stored persona values', () => {
    expect(parseDemoUserTaxonomy('Move-up Families')).toBe('Move-up Families');
    expect(parseDemoUserTaxonomy('Unknown')).toBeNull();
  });
});
