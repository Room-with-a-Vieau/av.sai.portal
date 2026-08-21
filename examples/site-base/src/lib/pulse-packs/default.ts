import type { PulseSitePack } from './types';

/**
 * Empty fallback pack used until a demo site registers its own Pulse pack.
 * Do not hardcode client content trees here.
 */
export const DEFAULT_PULSE_PACK: PulseSitePack = {
  siteName: 'default',
  brandName: 'this site',
  homePath: '',
  homeRootId: '',
  enableStatePersona: false,
  typeLabels: {
    default: 'Page',
  },
  starterPrompts: [],
  intents: [],
};
