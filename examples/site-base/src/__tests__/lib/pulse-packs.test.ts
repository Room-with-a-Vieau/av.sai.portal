import {
  DEFAULT_PULSE_PACK,
  getPulsePack,
  getPulseStarterPrompts,
  listPulsePackSiteNames,
  matchPulseIntentForSite,
  normalizePulseSiteName,
} from '@/lib/pulse-packs';
import { composePulseAnswer } from '@/lib/pulse-answer';
import type { PulseSource } from '@/lib/pulse-types';

describe('pulse pack registry', () => {
  it('starts with no client packs registered', () => {
    expect(listPulsePackSiteNames()).toEqual([]);
  });

  it('falls back to the empty default pack', () => {
    const pack = getPulsePack(null);
    expect(pack).toBe(DEFAULT_PULSE_PACK);
    expect(pack.intents).toEqual([]);
    expect(pack.starterPrompts).toEqual([]);
  });

  it('does not resolve former client site names', () => {
    expect(getPulsePack('quanex')).toBe(DEFAULT_PULSE_PACK);
    expect(getPulsePack('pillsburylaw')).toBe(DEFAULT_PULSE_PACK);
  });

  it('normalizes site names', () => {
    expect(normalizePulseSiteName('  Acme ')).toBe('acme');
    expect(normalizePulseSiteName(undefined)).toBe('');
  });

  it('returns no starter prompts until a pack is registered', () => {
    expect(getPulseStarterPrompts('acme')).toEqual([]);
  });
});

describe('pulse pack intent matching', () => {
  it('matches nothing against the empty default pack', () => {
    expect(matchPulseIntentForSite('insulating glass spacers', 'quanex')).toBeNull();
    expect(matchPulseIntentForSite('Saudi Arabia export-control', 'pillsburylaw')).toBeNull();
  });
});

describe('composePulseAnswer (default pack)', () => {
  const productSources: PulseSource[] = [
    {
      id: '{11111111-1111-1111-1111-111111111111}',
      title: 'Products',
      url: '/Products',
      path: '/sitecore/content/example/example/Home/Products',
      excerpt: 'Example product hub.',
      type: 'product',
      score: 1000,
    },
  ];

  it('uses the generic brand fallback', () => {
    const pack = getPulsePack(null);
    const result = composePulseAnswer('products', productSources, { pack });
    expect(result.answer).toMatch(/this site/i);
    expect(result.sources[0].url).toBe('/Products');
  });

  it('returns Edge-aware no-match message with generic brand', () => {
    const pack = getPulsePack(null);
    const result = composePulseAnswer('xyzzy unknown topic', [], { pack });
    expect(result.answer).toMatch(/this site/i);
    expect(result.answer).toMatch(/Experience Edge/i);
    expect(result.sources).toEqual([]);
  });
});
