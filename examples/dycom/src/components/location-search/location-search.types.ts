import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';
import type { IGQLTextField } from '@/types/igql';

type LocationTextField = Field<string> | IGQLTextField | string;

/** Child location item from datasource.children.results (ComponentQuery or Edge fetch). */
export interface LocationItemFields {
  id: string;
  Name?: LocationTextField;
  name?: LocationTextField;
  StreetAddress?: LocationTextField;
  City?: LocationTextField;
  State?: LocationTextField;
  GEO?: LocationTextField;
  geo?: LocationTextField;
}

export interface LocationDatasourceShape {
  id?: string;
  children?: {
    results?: LocationItemFields[];
  };
}

export interface LocationSearchFields {
  data?: {
    datasource?: LocationDatasourceShape;
  };
  datasource?: LocationDatasourceShape;
  children?: {
    results?: LocationItemFields[];
  };
}

export type LocationSearchProps = ComponentProps & {
  fields?: LocationSearchFields;
};

export function hasDatasourceAssigned(props: LocationSearchProps): boolean {
  const dataSource = props.rendering?.dataSource;
  return Boolean(dataSource && String(dataSource).trim());
}

function childrenResultsFromUnknown(
  value: unknown
): LocationItemFields[] | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const children = (value as { children?: { results?: unknown } }).children;
  const results = children?.results;
  return Array.isArray(results) ? (results as LocationItemFields[]) : undefined;
}

export function resolveDatasource(
  fields: LocationSearchFields | undefined
): LocationDatasourceShape | undefined {
  if (!fields) return undefined;
  if (fields.data?.datasource) return fields.data.datasource;
  if (fields.datasource) return fields.datasource;

  const fromDataChildren = childrenResultsFromUnknown(fields.data);
  if (fromDataChildren) return { children: { results: fromDataChildren } };

  if (fields.children?.results) return { children: fields.children };
  return undefined;
}

export function resolveLocationItems(
  datasource: LocationDatasourceShape | undefined
): LocationItemFields[] {
  return datasource?.children?.results ?? [];
}

/** Reads Sitecore text fields from ComponentQuery (`value`) or IGQL (`jsonValue`) shapes. */
export function resolveStringField(
  item: LocationItemFields,
  keys: (keyof LocationItemFields)[]
): Field<string> | undefined {
  for (const key of keys) {
    const field = item[key];
    if (field == null) continue;
    if (typeof field === 'string') return { value: field };

    if (typeof field === 'object' && 'jsonValue' in field) {
      const jsonValue = (field as IGQLTextField).jsonValue;
      if (typeof jsonValue === 'string') return { value: jsonValue };
      if (jsonValue && typeof jsonValue === 'object' && 'value' in jsonValue) {
        return jsonValue as Field<string>;
      }
    }

    if (typeof field === 'object' && 'value' in field) {
      return field as Field<string>;
    }
  }
  return undefined;
}
