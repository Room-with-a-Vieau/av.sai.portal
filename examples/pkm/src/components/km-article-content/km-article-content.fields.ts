import type { Field, Page, RichTextField } from '@sitecore-content-sdk/nextjs';

import { resolveTopicList, topicLabel, type TaxonomyTopicReference } from '@/lib/taxonomy-topic';

import type { KmArticleContentFields, KmArticleContentProps, KmTopicReference } from './km-article-content.props';

export { topicLabel };
export type { TaxonomyTopicReference };

function unwrapCell<T>(cell: T | { jsonValue?: T } | undefined): T | undefined {
  if (!cell) return undefined;
  if (typeof cell === 'object' && cell !== null && 'jsonValue' in cell && cell.jsonValue !== undefined) {
    return cell.jsonValue;
  }
  return cell as T;
}

function pickText(
  bag: Record<string, unknown> | undefined,
  names: string[],
  requireNonEmpty: boolean
): Field<string> | undefined {
  if (!bag) return undefined;
  for (const name of names) {
    const field = unwrapCell(bag[name] as Field<string> | { jsonValue?: Field<string> } | undefined);
    if (!field) continue;
    if (!requireNonEmpty || Boolean(field.value?.trim())) return field;
  }
  return undefined;
}

function pickRichText(
  bag: Record<string, unknown> | undefined,
  names: string[],
  requireNonEmpty: boolean
): RichTextField | undefined {
  if (!bag) return undefined;
  for (const name of names) {
    const field = unwrapCell(bag[name] as RichTextField | { jsonValue?: RichTextField } | undefined);
    if (!field) continue;
    if (!requireNonEmpty || Boolean(field.value?.trim())) return field;
  }
  return undefined;
}

function pickTopics(
  bag: Record<string, unknown> | undefined,
  names: string[]
): KmTopicReference[] {
  return resolveTopicList(bag, names);
}

function readBag(bag: Record<string, unknown> | undefined, requireNonEmpty: boolean): KmArticleContentFields {
  if (!bag) return {};
  return {
    'KB-ID': pickText(bag, ['KB-ID', 'kbId', 'KbId'], requireNonEmpty),
    Title: pickText(bag, ['Title', 'title'], requireNonEmpty),
    LOB: pickTopics(bag, ['LOB', 'lob']),
    'Peril type': pickTopics(bag, ['Peril type', 'perilType', 'PerilType']),
    Purpose: pickRichText(bag, ['Purpose', 'purpose'], requireNonEmpty),
    'Intake Triggers': pickRichText(bag, ['Intake Triggers', 'intakeTriggers'], requireNonEmpty),
    'Core Triage Questions': pickRichText(
      bag,
      ['Core Triage Questions', 'coreTriageQuestions'],
      requireNonEmpty
    ),
    'General Escalation Rules': pickRichText(
      bag,
      ['General Escalation Rules', 'generalEscalationRules'],
      requireNonEmpty
    ),
    'Standard Site Inspection Rules': pickRichText(
      bag,
      ['Standard Site Inspection Rules', 'standardSiteInspectionRules'],
      requireNonEmpty
    ),
    'Photo Video Standards': pickRichText(
      bag,
      ['Photo Video Standards', 'photoVideoStandards'],
      requireNonEmpty
    ),
    'General Mitigation': pickRichText(bag, ['General Mitigation', 'generalMitigation'], requireNonEmpty),
    'Baseline Reserve Guidelines': pickRichText(
      bag,
      ['Baseline Reserve Guidelines', 'baselineReserveGuidelines'],
      requireNonEmpty
    ),
    'General Payment Triggers': pickRichText(
      bag,
      ['General Payment Triggers', 'generalPaymentTriggers'],
      requireNonEmpty
    ),
    'Common Scenarios': pickRichText(bag, ['Common Scenarios', 'commonScenarios'], requireNonEmpty),
  };
}

function mergeBags(bags: (Record<string, unknown> | undefined)[], isEditing: boolean): KmArticleContentFields {
  const filled = readBag({}, false);
  const keys: (keyof KmArticleContentFields)[] = [
    'KB-ID',
    'Title',
    'LOB',
    'Peril type',
    'Purpose',
    'Intake Triggers',
    'Core Triage Questions',
    'General Escalation Rules',
    'Standard Site Inspection Rules',
    'Photo Video Standards',
    'General Mitigation',
    'Baseline Reserve Guidelines',
    'General Payment Triggers',
    'Common Scenarios',
  ];

  for (const key of keys) {
    if (key === 'LOB' || key === 'Peril type') {
      for (const bag of bags) {
        const topics = pickTopics(bag, key === 'LOB' ? ['LOB', 'lob'] : ['Peril type', 'perilType', 'PerilType']);
        if (topics.length) {
          filled[key] = topics;
          break;
        }
      }
      continue;
    }

    for (const bag of bags) {
      const partial = readBag(bag, true);
      const value = partial[key];
      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (filled as any)[key] = value;
        break;
      }
    }
    if (!filled[key] && isEditing) {
      for (const bag of bags) {
        const partial = readBag(bag, false);
        const value = partial[key];
        if (value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (filled as any)[key] = value;
          break;
        }
      }
    }
  }

  return filled;
}

function routeFields(page: Page): Record<string, unknown> | undefined {
  return page.layout?.sitecore?.route?.fields as Record<string, unknown> | undefined;
}

/**
 * Resolve Knowledge Article fields from rendering props and/or the current route.
 */
export function mergeKmArticleContentFields(
  props: KmArticleContentProps,
  isEditing: boolean
): KmArticleContentFields {
  const { fields, page } = props;
  const flat = fields ? ({ ...fields } as Record<string, unknown>) : undefined;
  if (flat) delete flat.data;

  const nestedExternal =
    fields && typeof fields === 'object' && 'data' in fields
      ? ((fields as { data?: { externalFields?: Record<string, unknown> } }).data?.externalFields as
          | Record<string, unknown>
          | undefined)
      : undefined;

  return mergeBags([flat, nestedExternal, routeFields(page)], isEditing);
}

export function hasRichText(field?: RichTextField): boolean {
  return Boolean(field?.value?.trim());
}

export function hasText(field?: Field<string>): boolean {
  return Boolean(field?.value?.trim());
}
