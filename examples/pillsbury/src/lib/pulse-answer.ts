import type { PulseAskResponse, PulseSource, PulseStateCode } from '@/lib/pulse-types';

const TYPE_LABEL: Record<PulseSource['type'], string> = {
  'knowledge-article': 'Insight',
  'people-and-teams': 'Lawyer',
  product: 'Capability',
  'shared-content': 'Related',
  other: 'Content',
};

const STATE_NAME: Record<PulseStateCode, string> = {
  FL: 'Florida',
  NC: 'North Carolina',
};

function sentenceFromExcerpt(excerpt?: string): string {
  if (!excerpt?.trim()) return '';
  const cleaned = excerpt.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 180) return cleaned;
  const cut = cleaned.slice(0, 180);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/**
 * Build a demoworthy, citation-backed answer from retrieved sources only.
 * Prefers lawyer bios for Pillsbury visitor demos; falls back to insights/other content.
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
        `I searched indexed Pillsbury content for “${question.trim()}” and didn’t find a strong match. ` +
        `Try describing the situation (industry, geography, or risk), or open site search for a broader look.`,
      sources: [],
      stateCallout: null,
      personaState,
    };
  }

  const peopleHits = sources.filter((s) => s.type === 'people-and-teams');
  const insightHits = sources.filter((s) => s.type === 'knowledge-article');
  const stateHits = personaState
    ? sources.filter((s) => s.stateCode === personaState)
    : [];

  const primary = peopleHits[0] || insightHits[0] || stateHits[0] || sources[0];
  const supporting = sources.filter((s) => s.id !== primary.id).slice(0, 3);

  const lines: string[] = [];

  lines.push(
    `Here’s who I’d start with for “${question.trim()}” — based on indexed lawyer bios and related site content.`
  );

  const primaryBit = sentenceFromExcerpt(primary.excerpt);
  lines.push(
    primaryBit
      ? `**${primary.title}** (${TYPE_LABEL[primary.type]}). ${primaryBit}`
      : `**${primary.title}** (${TYPE_LABEL[primary.type]}) is the strongest match in the citations below.`
  );

  if (supporting.length) {
    const names = supporting
      .map((s) => `**${s.title}** (${TYPE_LABEL[s.type]})`)
      .join('; ');
    lines.push(
      peopleHits.length > 1
        ? `Also consider bringing in: ${names}.`
        : `Related indexed sources: ${names}.`
    );

    for (const extra of supporting.slice(0, 2)) {
      const bit = sentenceFromExcerpt(extra.excerpt);
      if (bit) {
        lines.push(`${bit}`);
      }
    }
  }

  lines.push(
    'Keyword search is weaker for multi-factor asks like this — Pulse can connect practice, geography, and situation in one step. Open a citation card to view the full bio.'
  );

  if (personaState && stateHits.length) {
    lines.push(
      `Context note: results were also weighted toward ${STATE_NAME[personaState]} where applicable.`
    );
  }

  let stateCallout: string | null = null;
  if (personaState && stateHits.length) {
    stateCallout = `Highlighted for ${STATE_NAME[personaState]}`;
  }

  const ordered = [
    ...peopleHits,
    ...insightHits,
    ...sources.filter((s) => s.type !== 'people-and-teams' && s.type !== 'knowledge-article'),
  ].filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  return {
    answer: lines.join('\n\n'),
    sources: ordered,
    stateCallout,
    personaState,
  };
}
