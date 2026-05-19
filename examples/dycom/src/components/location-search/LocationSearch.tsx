'use client';

import { useMemo, useRef, type JSX } from 'react';
import { LocationSearchView } from './LocationSearchView';
import {
  hasDatasourceAssigned,
  resolveDatasource,
  resolveLocationItems,
  type LocationItemFields,
  type LocationSearchFields,
  type LocationSearchProps,
} from './location-search.types';

/**
 * Keeps the last non-empty children list when Sitecore Pages sends transient empty
 * layout payloads between editor refreshes (avoids flash + setState loops).
 */
function useStickyLocationItems(
  fields: LocationSearchFields | undefined
): LocationItemFields[] {
  const layoutItems = useMemo(
    () => resolveLocationItems(resolveDatasource(fields)),
    [fields]
  );
  const stickyRef = useRef<LocationItemFields[]>(layoutItems);

  if (layoutItems.length > 0) {
    stickyRef.current = layoutItems;
  }

  return layoutItems.length > 0 ? layoutItems : stickyRef.current;
}

/**
 * Location rows from datasource.children.results (ComponentQuery in Sitecore CM).
 * Configure children(first: N) on the rendering query — see location-search.query.ts.
 */
export const Default = (props: LocationSearchProps): JSX.Element => {
  const items = useStickyLocationItems(props.fields);

  const dataSource = props.rendering?.dataSource
    ? String(props.rendering.dataSource)
    : undefined;

  return (
    <LocationSearchView
      items={items}
      isPageEditing={props.page?.mode?.isEditing ?? false}
      datasourceAssigned={hasDatasourceAssigned(props)}
      dataSource={dataSource}
    />
  );
};
