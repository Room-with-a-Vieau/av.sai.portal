import {
  ILLUMINA_USER_PERSONAS,
  parseIlluminaUserTaxonomy,
} from '@/lib/illumina-user-personas';

describe('illumina-user-personas', () => {
  it('includes the Illumina user persona list', () => {
    expect(ILLUMINA_USER_PERSONAS.map((persona) => persona.label)).toEqual([
      'Academic/Research Lab Scientists',
      'Clinical Lab Directors',
      'Molecular Pathologists',
      'Lab Directors',
      'Operations Managers',
      'Procurement',
    ]);
  });

  it('parses stored persona values', () => {
    expect(parseIlluminaUserTaxonomy('Molecular Pathologists')).toBe('Molecular Pathologists');
    expect(parseIlluminaUserTaxonomy('Procurement')).toBe('Procurement');
    expect(parseIlluminaUserTaxonomy('Unknown')).toBeNull();
  });
});
