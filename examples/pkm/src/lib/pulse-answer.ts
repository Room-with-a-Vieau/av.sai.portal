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
 * Prefers Knowledge Article citations; layers state Shared Content when present.
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

  const knowledgeHits = sources.filter((s) => s.type === 'knowledge-article');
  const stateHits = personaState
    ? sources.filter((s) => s.stateCode === personaState)
    : [];
  const sharedHits = sources.filter((s) => s.type === 'shared-content');

  // Prefer Knowledge Article as the primary citation so demos always link to a KA page
  const primary =
    knowledgeHits[0] ||
    stateHits[0] ||
    sources[0];
  const stateShared = stateHits.find((s) => s.type === 'shared-content');
  const supporting = sources
    .filter((s) => s.id !== primary.id)
    .slice(0, 3);

  const lines: string[] = [];

  lines.push(
    `Based on indexed Progressive Knowledge content, here’s what applies to “${question.trim()}”.`
  );

  const primaryBit = sentenceFromExcerpt(primary.excerpt);
  lines.push(
    primaryBit
      ? `See **${primary.title}** (${TYPE_LABEL[primary.type]}). ${primaryBit}`
      : `See **${primary.title}** (${TYPE_LABEL[primary.type]}) in the citations below.`
  );

  if (stateShared && stateShared.id !== primary.id) {
    const sharedBit = sentenceFromExcerpt(stateShared.excerpt);
    lines.push(
      sharedBit
        ? `State-specific Shared Content (**${stateShared.title}**): ${sharedBit}`
        : `State-specific Shared Content is cited as **${stateShared.title}**.`
    );
  }

  if (supporting.length && !stateShared) {
    const names = supporting.map((s) => `**${s.title}** (${TYPE_LABEL[s.type]})`).join('; ');
    lines.push(`Related indexed sources: ${names}.`);
  }

  if (personaState && stateHits.length) {
    lines.push(
      `Because you’re licensed in ${STATE_NAME[personaState]}, Pulse prioritized Shared Content under StateSpecific/${personaState}. Open the Knowledge Article link below to read the full guidance with that state’s variant.`
    );
  } else if (personaState && sharedHits.length === 0) {
    lines.push(
      `You’re licensed in ${STATE_NAME[personaState]}; open the cited Knowledge Article for any state-specific Shared Content on that page.`
    );
  }

  lines.push('Use the citation cards below to open the Knowledge Article.');

  let stateCallout: string | null = null;
  if (personaState && stateHits.length) {
    stateCallout = `Highlighted for ${STATE_NAME[personaState]} (Shared Content)`;
  }

  // Ensure Knowledge Articles appear first in the citation list for clickable demos
  const ordered = [
    ...knowledgeHits,
    ...sources.filter((s) => s.type !== 'knowledge-article'),
  ].filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  return {
    answer: lines.join('\n\n'),
    sources: ordered,
    stateCallout,
    personaState,
  };
}
