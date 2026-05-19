import { cache } from 'react';
import type { JSX } from 'react';
import { LocationSearchView } from './LocationSearchView';
import { fetchAllLocationItems } from './location-search.fetch';
import {
  hasDatasourceAssigned,
  resolveDatasource,
  resolveLocationItems,
  type LocationItemFields,
  type LocationSearchProps,
} from './location-search.types';

const loadLocationItems = cache(
  async (datasourcePath: string, language: string): Promise<LocationItemFields[]> => {
    return fetchAllLocationItems(datasourcePath, language);
  }
);

async function resolveItems(
  fields: LocationSearchProps['fields'],
  dataSource: string | undefined,
  language: string
): Promise<LocationItemFields[]> {
  const layoutItems = resolveLocationItems(resolveDatasource(fields));
  if (layoutItems.length > 0) return layoutItems;

  const path = dataSource?.trim();
  if (!path) return [];

  try {
    return await loadLocationItems(path, language);
  } catch (error) {
    console.error('[LocationSearch] Failed to load location children:', error);
    return [];
  }
}

/**
 * Server component: layout children from ComponentQuery, with one Edge fetch per request
 * when layout children are empty. Avoids client effects/server actions that retrigger Pages preview.
 */
export const Default = async (props: LocationSearchProps): Promise<JSX.Element> => {
  const dataSource = props.rendering?.dataSource
    ? String(props.rendering.dataSource)
    : undefined;
  const language = props.page?.locale || 'en';
  const items = await resolveItems(props.fields, dataSource, language);

  return (
    <LocationSearchView
      items={items}
      isPageEditing={props.page?.mode?.isEditing ?? false}
      datasourceAssigned={hasDatasourceAssigned(props)}
      dataSource={dataSource}
    />
  );
};
