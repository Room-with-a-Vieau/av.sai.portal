'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import type { LocationSearchProps } from './location-search.props';
import { buildLocationStats, mapLocationFieldsToPoint } from './location-item.utils';

const UsNationwideMap = dynamic(
  () => import('./UsNationwideMap.dev').then((mod) => mod.UsNationwideMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] w-full items-center justify-center text-white/80">
        Loading map…
      </div>
    ),
  }
);

interface StatRowProps {
  value: string;
  label: string;
  showArrow?: boolean;
  className?: string;
}

const StatRow: React.FC<StatRowProps> = ({ value, label, showArrow, className }) => (
  <div className={cn('border-b border-[#1b6eb8] pb-4', className)}>
    <div className="flex items-center gap-3">
      <p className="font-heading text-4xl font-bold leading-none md:text-5xl">{value}</p>
      {showArrow && (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1b6eb8] text-white">
          <ChevronRight className="h-5 w-5" aria-hidden />
        </span>
      )}
    </div>
    <p className="font-heading mt-2 text-xl font-bold md:text-2xl">{label}</p>
  </div>
);

export const LocationSearchNationwide: React.FC<LocationSearchProps> = (props) => {
  const { fields, isPageEditing } = props ?? {};
  const datasource = fields?.data?.datasource;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const locations = useMemo(() => {
    const results = datasource?.children?.results ?? [];
    return results
      .map(mapLocationFieldsToPoint)
      .filter((location): location is NonNullable<typeof location> => location !== null);
  }, [datasource?.children?.results]);

  const computedStats = useMemo(() => buildLocationStats(locations), [locations]);

  const titleField = datasource?.title?.jsonValue;
  const companiesCount =
    datasource?.companiesCount?.jsonValue?.value?.trim() ||
    String(computedStats.companiesCount);
  const statesCount =
    datasource?.statesCount?.jsonValue?.value?.trim() || String(computedStats.statesCount);
  const locationsCount =
    datasource?.locationsCount?.jsonValue?.value?.trim() ||
    `${computedStats.locationsCount}${computedStats.locationsCount >= 500 ? '+' : ''}`;

  if (!datasource) {
    return <NoDataFallback componentName="LocationSearch" />;
  }

  const hasTitle = Boolean(titleField?.value);

  return (
    <section data-component="LocationSearch" className="bg-[#6d7d8c] py-12 text-white md:py-16">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        {isPageEditing || hasTitle ? (
          <Text
            tag="h2"
            field={titleField}
            className="font-heading mb-8 max-w-3xl text-3xl font-bold leading-tight md:text-4xl"
          />
        ) : (
          <h2 className="font-heading mb-8 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
            Explore our nationwide reach
          </h2>
        )}

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            {locations.length > 0 ? (
              <UsNationwideMap
                locations={locations}
                selectedId={selectedId}
                onSelect={(location) => setSelectedId(location?.id ?? null)}
              />
            ) : (
              <p className="text-white/80">
                {isPageEditing
                  ? 'Add Location items under the datasource folder with GEO coordinates.'
                  : 'No locations available.'}
              </p>
            )}
          </div>

          <aside className="flex flex-col gap-6 pt-2">
            <StatRow value={companiesCount} label="Companies" showArrow />
            <StatRow value={statesCount} label="States" />
            <StatRow value={locationsCount} label="Locations" />
          </aside>
        </div>

        {isPageEditing && locations.length > 0 && (
          <ul className="mt-8 grid gap-2 text-sm text-white/90 md:grid-cols-2">
            {locations.map((location) => (
              <li key={location.id}>
                {location.name} — {location.city}, {location.state}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
