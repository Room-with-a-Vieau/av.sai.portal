import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

/** Child location item from datasource.children.results (ComponentQuery or Edge fetch). */
export interface LocationItemFields {
  id: string;
  Name?: Field<string>;
  name?: Field<string>;
  StreetAddress?: Field<string>;
  City?: Field<string>;
  State?: Field<string>;
  GEO?: Field<string>;
  geo?: Field<string>;
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

export function resolveDatasource(
  fields: LocationSearchFields | undefined
): LocationDatasourceShape | undefined {
  if (!fields) return undefined;
  if (fields.data?.datasource) return fields.data.datasource;
  if (fields.datasource) return fields.datasource;
  if (fields.children?.results) return { children: fields.children };
  return undefined;
}

export function resolveLocationItems(
  datasource: LocationDatasourceShape | undefined
): LocationItemFields[] {
  return datasource?.children?.results ?? [];
}

export function resolveStringField(
  item: LocationItemFields,
  keys: (keyof LocationItemFields)[]
): Field<string> | undefined {
  for (const key of keys) {
    const field = item[key];
    if (field == null) continue;
    if (typeof field === 'string') return { value: field };
    if (typeof field === 'object' && 'value' in field) return field as Field<string>;
  }
  return undefined;
}
