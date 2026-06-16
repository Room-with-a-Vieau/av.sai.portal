import type { Field } from '@sitecore-content-sdk/nextjs';

import bundledCatalog from './netsuite-product-catalog.json';
import type { NetSuiteProductCatalog, NetSuiteProductRecord } from './product-detail.types';

const CATALOG_NUMBER_KEYS = [
  'catalogNumber',
  'CatalogNumber',
  'catalogNo',
  'CatalogNo',
  'sku',
  'SKU',
] as const;

const JSON_CATALOG_KEYS = ['jsonCatalog', 'JsonCatalog', 'jsonCatalogData', 'JsonCatalogData'] as const;

function flatFieldsWithoutData(fields: unknown): Record<string, unknown> {
  if (!fields || typeof fields !== 'object') return {};
  const obj = { ...(fields as Record<string, unknown>) };
  delete obj.data;
  return obj;
}

function hasLayoutData(
  fields: unknown,
): fields is { data: { datasource?: Record<string, unknown> } } {
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

function readTextValue(raw: unknown): string | undefined {
  if (typeof raw === 'string') return raw.trim() || undefined;
  const field = unwrapTextField(raw as Field<string> | { jsonValue?: Field<string> });
  const value = field?.value;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function resolveCatalogNumberField(fields: unknown): Field<string> | undefined {
  const flat = flatFieldsWithoutData(fields);
  const ds = hasLayoutData(fields) ? (fields.data.datasource ?? {}) : {};

  for (const key of CATALOG_NUMBER_KEYS) {
    const fromFlat = unwrapTextField(flat[key] as Field<string> | { jsonValue?: Field<string> });
    if (fromFlat) return fromFlat;
    const fromDs = unwrapTextField(ds[key] as Field<string> | { jsonValue?: Field<string> });
    if (fromDs) return fromDs;
  }

  return undefined;
}

export function resolveCatalogNumber(fields: unknown): string | undefined {
  const field = resolveCatalogNumberField(fields);
  const value = field?.value;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function extractJsonCatalogString(fields: unknown): string | undefined {
  const flat = flatFieldsWithoutData(fields);
  const ds = hasLayoutData(fields) ? (fields.data.datasource ?? {}) : {};

  for (const key of JSON_CATALOG_KEYS) {
    const fromFlat = readTextValue(flat[key]);
    if (fromFlat) return fromFlat;
    const fromDs = readTextValue(ds[key]);
    if (fromDs) return fromDs;
  }

  return undefined;
}

function normalizeCatalogNumber(value: string): string {
  return value.trim().toUpperCase();
}

function isNetSuiteProductCatalog(value: unknown): value is NetSuiteProductCatalog {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as NetSuiteProductCatalog).products)
  );
}

export function loadNetSuiteProductCatalog(fields: unknown): NetSuiteProductCatalog {
  const raw = extractJsonCatalogString(fields);
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isNetSuiteProductCatalog(parsed) && parsed.products.length > 0) {
        return parsed;
      }
    } catch {
      // fall through to bundled JSON
    }
  }

  return bundledCatalog as NetSuiteProductCatalog;
}

export function lookupNetSuiteProduct(
  catalogNumber: string | undefined,
  fields: unknown,
): NetSuiteProductRecord | null {
  if (!catalogNumber?.trim()) return null;

  const catalog = loadNetSuiteProductCatalog(fields);
  const key = normalizeCatalogNumber(catalogNumber);

  return (
    catalog.products.find((p) => normalizeCatalogNumber(p.catalogNumber) === key) ?? null
  );
}
