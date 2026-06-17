import type { Field } from '@sitecore-content-sdk/nextjs';

import type { ArticleHeaderFields, ArticleHeaderProps } from './article-header.props';

function flatFieldsWithoutData(fields: unknown): Record<string, unknown> {
  if (!fields || typeof fields !== 'object') return {};
  const obj = { ...(fields as Record<string, unknown>) };
  delete obj.data;
  return obj;
}

function hasLayoutData(
  fields: unknown,
): fields is { data: { datasource?: Record<string, unknown>; externalFields?: Record<string, unknown> } } {
  if (typeof fields !== 'object' || fields === null || !('data' in fields)) return false;
  const data = (fields as { data: unknown }).data;
  return typeof data === 'object' && data !== null;
}

function unwrapTextField(
  cell: Field<string> | { jsonValue?: Field<string> } | undefined,
): Field<string> | undefined {
  if (cell == null) return undefined;
  if (typeof cell === 'object' && 'jsonValue' in cell && cell.jsonValue !== undefined) {
    return cell.jsonValue;
  }
  return cell as Field<string>;
}

function hasText(field?: Field<string>) {
  return Boolean(field?.value?.trim());
}

/** Sitecore template field is often `Eyebrow`; component prop is `eyebrowOptional`. */
const EYEBROW_FIELD_KEYS = ['eyebrowOptional', 'Eyebrow', 'eyebrow'] as const;

const CTA_FIELD_KEYS = ['cta', 'Cta', 'CTA'] as const;

const SUMMARY_FIELD_KEYS = ['summary', 'Summary'] as const;

const PAGE_HEADER_TITLE_KEYS = ['pageHeaderTitle', 'PageHeaderTitle', 'HeaderTitle'] as const;

function pickTextField(
  keys: readonly string[],
  requireNonEmpty: boolean,
  ...bags: Array<Record<string, unknown> | undefined>
): Field<string> | undefined {
  for (const bag of bags) {
    if (!bag) continue;
    for (const key of keys) {
      const raw = bag[key];
      if (raw == null) continue;
      const field = unwrapTextField(raw as Field<string> | { jsonValue?: Field<string> });
      if (field === undefined) continue;
      if (requireNonEmpty && !hasText(field)) continue;
      return field;
    }
  }
  return undefined;
}

function pickEyebrowField(
  requireNonEmpty: boolean,
  ...bags: Array<Record<string, unknown> | undefined>
): Field<string> | undefined {
  return pickTextField(EYEBROW_FIELD_KEYS, requireNonEmpty, ...bags);
}

function resolveTextField(
  keys: readonly string[],
  isEditing: boolean,
  ...bags: Array<Record<string, unknown> | undefined>
): Field<string> | undefined {
  const withContent = pickTextField(keys, true, ...bags);
  if (withContent) return withContent;
  if (isEditing) return pickTextField(keys, false, ...bags);
  return undefined;
}

/**
 * GraphQL / Content SDK often sends component fields under `fields.data.datasource`
 * (same as PageHeader). ArticleHeader historically read only flat `fields.*`.
 */
export function resolveArticleHeaderFields(rawFields: unknown, isEditing = false): ArticleHeaderFields {
  const flat = flatFieldsWithoutData(rawFields) as Record<string, unknown>;
  const ds: Record<string, unknown> = hasLayoutData(rawFields)
    ? ((rawFields.data.datasource ?? {}) as Record<string, unknown>)
    : {};

  const merged = { ...ds, ...flat } as ArticleHeaderFields;
  const eyebrow = resolveTextField(EYEBROW_FIELD_KEYS, isEditing, flat, ds);
  if (eyebrow !== undefined) {
    merged.eyebrowOptional = eyebrow;
  }
  const cta = resolveTextField(CTA_FIELD_KEYS, isEditing, flat, ds);
  if (cta !== undefined) {
    merged.cta = cta;
  }
  const summary = resolveTextField(SUMMARY_FIELD_KEYS, isEditing, flat, ds);
  if (summary !== undefined) {
    merged.summary = summary;
  }
  return merged;
}

function asFieldBag(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as Record<string, unknown>;
}

/** Page-level fields (title) from externalFields prop or layout `fields.data.externalFields`. */
export function resolveArticleHeaderPageFields(
  props: Pick<ArticleHeaderProps, 'fields' | 'externalFields'>,
  isEditing = false,
): { pageHeaderTitle?: Field<string> } {
  const bags: Record<string, unknown>[] = [];
  const externalBag = asFieldBag(props.externalFields);
  if (externalBag) {
    bags.push(externalBag);
  }
  if (hasLayoutData(props.fields) && props.fields.data.externalFields) {
    bags.push(props.fields.data.externalFields);
  }

  const pageHeaderTitle = resolveTextField(PAGE_HEADER_TITLE_KEYS, isEditing, ...bags);
  return { pageHeaderTitle };
}
