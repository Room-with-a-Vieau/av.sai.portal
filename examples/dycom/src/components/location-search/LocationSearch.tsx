'use client';

import { useEffect, useMemo, useState, type JSX } from 'react';
import { LocationSearchView } from './LocationSearchView';
import { loadAllLocationItems } from './location-search.actions';
import {
  hasDatasourceAssigned,
  resolveDatasource,
  resolveLocationItems,
  type LocationItemFields,
  type LocationSearchProps,
} from './location-search.types';

/**
 * Lists locations from the datasource folder. Layout ComponentQuery may return only 10 children;
 * we load the full folder via a server action (paginated Edge GraphQL).
 */
export const Default = (props: LocationSearchProps): JSX.Element => {
  const layoutItems = useMemo(
    () => resolveLocationItems(resolveDatasource(props.fields)),
    [props.fields]
  );
  const [items, setItems] = useState<LocationItemFields[]>(layoutItems);

  const dataSource = props.rendering?.dataSource
    ? String(props.rendering.dataSource)
    : undefined;
  const language = props.page?.locale || 'en';

  useEffect(() => {
    setItems(layoutItems);
  }, [layoutItems]);

  useEffect(() => {
    if (!dataSource?.trim()) return;

    let cancelled = false;

    loadAllLocationItems(dataSource, language)
      .then((allItems) => {
        if (!cancelled && allItems.length > 0) {
          setItems(allItems);
        }
      })
      .catch((error) => {
        console.error('[LocationSearch] Failed to load all location children:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [dataSource, language]);

  return (
    <LocationSearchView
      items={items}
      isPageEditing={props.page?.mode?.isEditing ?? false}
      datasourceAssigned={hasDatasourceAssigned(props)}
      dataSource={dataSource}
    />
  );
};
