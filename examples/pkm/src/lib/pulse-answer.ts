import type { PulseAskResponse, PulseSource, PulseStateCode } from '@/lib/pulse-types';

const TYPE_LABEL: Record<PulseSource['type'], string> = {
  'knowledge-article': 'Knowledge Article',
  'people-and-teams': 'People & Teams',
  product: 'Product',
  'shared-content': 'Shared Content',
  other: 'Content',
};

const STATE_NAME: Record<PulseStateCode, string> = {
  FL: 'Florida',
  NC: 'North Carolina',
};

function sentenceFromExcerpt(excerpt?: string): string {
  if (!excerpt?.trim()) return '';
  const cleaned = excerpt.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 160) return cleaned;
  const cut = cleaned.slice(0, 160);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/**
 * Build a demoworthy, citation-backed answer from retrieved sources only.
 * Does not invent facts beyond titles/excerpts returned from the index/Edge.
 */
export function composePulseAnswer(
  question: string,
  sources: PulseSource[],
  stateCode?: PulseStateCode | null
): PulseAskResponse {
  const personaState = stateCode ?? null;

  if (!sources.length) {
    return {
      answer:
        `I searched indexed Progressive Knowledge content for “${question.trim()}” and didn’t find a strong match. ` +
        `Try a more specific term (for example a KB topic, peril, or team name), or open site search for a broader look.`,
      sources: [],
      stateCallout: null,
      personaState,
    };
  }

  const stateHits = personaState
    ? sources.filter((s) => s.stateCode === personaState)
    : [];
  const sharedHits = sources.filter((s) => s.type === 'shared-content');
  const primary = stateHits[0] || sources[0];
  const supporting = sources.filter((s) => s.id !== primary.id).slice(0, 3);

  const lines: string[] = [];

  lines.push(
    `Based on indexed site content, here’s what applies to your question about “${question.trim()}”.`
  );

  const primaryBit = sentenceFromExcerpt(primary.excerpt);
  lines.push(
    primaryBit
      ? `**${primary.title}** (${TYPE_LABEL[primary.type]}) is the strongest match. ${primaryBit}`
      : `**${primary.title}** (${TYPE_LABEL[primary.type]}) is the strongest match from the knowledge index.`
  );

  if (supporting.length) {
    const names = supporting.map((s) => `**${s.title}** (${TYPE_LABEL[s.type]})`).join('; ');
    lines.push(`Related indexed sources: ${names}.`);
  }

  if (personaState && stateHits.length) {
    lines.push(
      `Because you’re licensed in ${STATE_NAME[personaState]}, Pulse prioritized Shared Content under StateSpecific/${personaState}.`
    );
  } else if (personaState && sharedHits.length === 0) {
    lines.push(
      `You’re licensed in ${STATE_NAME[personaState]}; open the cited articles for any state-specific Shared Content variants on those pages.`
    );
  }

  lines.push('Open the sources below to verify details in the published content.');

  let stateCallout: string | null = null;
  if (personaState && stateHits.length) {
    stateCallout = `Highlighted for ${STATE_NAME[personaState]} (Shared Content)`;
  }

  return {
    answer: lines.join('\n\n'),
    sources,
    stateCallout,
    personaState,
  };
}
