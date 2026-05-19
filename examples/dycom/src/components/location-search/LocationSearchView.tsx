'use client';

import { useMemo, type JSX } from 'react';
import dynamic from 'next/dynamic';
import { ChevronRight } from 'lucide-react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { buildLocationStats, mapItemsToLocationPoints } from './location-geo.utils';
import type { LocationItemFields } from './location-search.types';

export type { LocationItemFields };

const LocationUsMap = dynamic(
  () => import('./LocationUsMap').then((mod) => mod.LocationUsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] w-full items-center justify-center text-white/80">
        Loading map…
      </div>
    ),
  }
);

export type LocationSearchViewProps = {
  items: LocationItemFields[];
  isPageEditing: boolean;
  datasourceAssigned: boolean;
  dataSource?: string;
};

function StatRow({
  value,
  label,
  showArrow,
}: {
  value: string;
  label: string;
  showArrow?: boolean;
}) {
  return (
    <div className="border-b border-[#1b6eb8] pb-4">
      <div className="flex items-center gap-3">
        <p className="font-heading text-4xl font-bold leading-none md:text-5xl">{value}</p>
        {showArrow ? (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1b6eb8] text-white">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="font-heading mt-2 text-xl font-bold md:text-2xl">{label}</p>
    </div>
  );
}

export function LocationSearchView(props: LocationSearchViewProps): JSX.Element {
  const { items, isPageEditing: isEditing, datasourceAssigned, dataSource } = props;

  const mapPoints = useMemo(() => mapItemsToLocationPoints(items), [items]);
  const stats = useMemo(() => buildLocationStats(items, mapPoints), [items, mapPoints]);

  if (!datasourceAssigned) {
    return <NoDataFallback componentName="LocationSearch" />;
  }

  if (items.length === 0) {
    return (
      <section
        data-component="LocationSearch"
        className="bg-[#6d7d8c] py-12 text-white md:py-16"
      >
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <p className="text-white/80">
            {isEditing
              ? 'Datasource is assigned, but no location items were returned.'
              : 'No locations to display.'}
          </p>
          {isEditing && dataSource ? (
            <p className="mt-2 text-sm text-white/70">Datasource: {dataSource}</p>
          ) : null}
        </div>
      </section>
    );
  }

  const locationsLabel =
    stats.locationsCount >= 500 ? '500+' : String(stats.locationsCount);

  return (
    <section data-component="LocationSearch" className="bg-[#6d7d8c] py-12 text-white md:py-16">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="font-heading mb-8 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
          Explore our nationwide reach
        </h2>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            {mapPoints.length > 0 ? (
              <LocationUsMap locations={mapPoints} />
            ) : (
              <div className="space-y-2 text-white/80">
                <p>
                  {isEditing
                    ? 'Add GEO coordinates on location items (e.g. 25.8125,-80.3209) to show them on the map.'
                    : 'No locations with valid coordinates.'}
                </p>
                <p className="text-sm text-white/70">
                  {items.length} item{items.length === 1 ? '' : 's'} loaded, 0 with valid GEO.
                </p>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6 pt-2">
            <StatRow value={String(stats.companiesCount)} label="Companies" showArrow />
            <StatRow value={String(stats.statesCount)} label="States" />
            <StatRow value={locationsLabel} label="Locations" />
          </aside>
        </div>

        {isEditing && (
          <p className="mt-8 text-sm text-white/70">
            Showing {items.length} item{items.length === 1 ? '' : 's'}, {mapPoints.length} on map.
            {items.length > mapPoints.length
              ? ' Items without GEO are omitted from the map.'
              : ''}
          </p>
        )}
      </div>
    </section>
  );
}



