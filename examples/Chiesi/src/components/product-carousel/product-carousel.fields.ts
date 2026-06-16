import type { Field } from '@sitecore-content-sdk/nextjs';

import defaultProductCarouselJson from './default-product-carousel.json';
import type { ProductCarouselData, ProductCarouselItem } from './product-carousel.types';

const JSON_FIELD_KEYS = [
  'jsonDatasource',
  'JsonDatasource',
  'JSONDatasource',
  'jsonDataSource',
  'dataSource',
  'DataSource',
] as const;

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

function readJsonString(raw: unknown): string | undefined {
  if (typeof raw === 'string') return raw;
  const field = unwrapTextField(raw as Field<string> | { jsonValue?: Field<string> });
  const value = field?.value;
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function extractJsonDatasourceString(fields: unknown): string | undefined {
  const flat = flatFieldsWithoutData(fields);
  const ds = hasLayoutData(fields) ? (fields.data.datasource ?? {}) : {};

  for (const key of JSON_FIELD_KEYS) {
    const fromFlat = readJsonString(flat[key]);
    if (fromFlat) return fromFlat;
    const fromDs = readJsonString(ds[key]);
    if (fromDs) return fromDs;
  }

  return undefined;
}

function slugifyId(value: string, index: number): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || `product-${index + 1}`;
}

function normalizeProduct(item: ProductCarouselItem, index: number): ProductCarouselItem {
  return {
    id: item.id?.trim() || slugifyId(item.title, index),
    title: item.title?.trim() ?? '',
    description: item.description?.trim() ?? '',
    imageSrc: item.imageSrc?.trim() || undefined,
    imageAlt: item.imageAlt?.trim() || item.title?.trim() || undefined,
    href: item.href?.trim() || undefined,
  };
}

function normalizeProductCarouselData(data: ProductCarouselData): ProductCarouselData {
  const products = (data.products ?? [])
    .filter((item) => item?.title?.trim())
    .map((item, index) => normalizeProduct(item, index));

  return {
    title: data.title?.trim() || defaultProductCarouselJson.title,
    products,
  };
}

function isProductCarouselData(value: unknown): value is ProductCarouselData {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as ProductCarouselData).products)
  );
}

export function parseProductCarouselData(fields: unknown): ProductCarouselData {
  const raw = extractJsonDatasourceString(fields);
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isProductCarouselData(parsed) && parsed.products.length > 0) {
        return normalizeProductCarouselData(parsed);
      }
    } catch {
      // Fall back to bundled default JSON below.
    }
  }

  return normalizeProductCarouselData(defaultProductCarouselJson as ProductCarouselData);
}
