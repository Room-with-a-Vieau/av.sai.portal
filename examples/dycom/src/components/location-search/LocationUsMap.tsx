'use client';

import { useMemo, useState, type JSX } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { cn } from '@/lib/utils';
import type { LocationMapPoint } from './location-geo.utils';

const US_STATES_GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export type LocationUsMapProps = {
  locations: LocationMapPoint[];
  className?: string;
};

export function LocationUsMap({ locations, className }: LocationUsMapProps): JSX.Element {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => locations.find((location) => location.id === selectedId) ?? null,
    [locations, selectedId]
  );

  return (
    <div className={cn('relative w-full', className)}>
      <ComposableMap
        projection="geoAlbersUsa"
        className="h-auto w-full"
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={US_STATES_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1b6eb8"
                stroke="#ffffff"
                strokeWidth={0.6}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#2589d4', outline: 'none', cursor: 'default' },
                  pressed: { fill: '#1b6eb8', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {locations.map((location) => {
          const isSelected = location.id === selectedId;

          return (
            <Marker
              key={location.id}
              coordinates={[location.longitude, location.latitude]}
              onClick={() => setSelectedId(isSelected ? null : location.id)}
            >
              <g className="cursor-pointer" aria-hidden>
                {isSelected ? (
                  <path
                    d="M0,-14 C-5,-14 -9,-9 -9,-4 C-9,2 0,12 0,12 C0,12 9,2 9,-4 C9,-9 5,-14 0,-14 Z"
                    fill="#22c55e"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ) : (
                  <circle r={5} fill="#f5f0e6" stroke="#ffffff" strokeWidth={1.5} />
                )}
                <circle
                  cx={0}
                  cy={isSelected ? -4 : 0}
                  r={isSelected ? 2.5 : 0}
                  fill="#ffffff"
                  pointerEvents="none"
                />
              </g>
            </Marker>
          );
        })}
      </ComposableMap>

      {selected ? (
        <div
          role="status"
          className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 mx-auto max-w-sm rounded-xl border border-white/20 bg-[#0f3d66]/95 px-4 py-3 text-white shadow-lg backdrop-blur-sm sm:left-6 sm:right-auto"
        >
          <p className="font-heading text-lg font-semibold leading-tight">{selected.name}</p>
          {selected.streetAddress ? (
            <p className="mt-1 text-sm text-white/85">{selected.streetAddress}</p>
          ) : null}
          {(selected.city || selected.state) && (
            <p className="text-sm text-white/75">
              {[selected.city, selected.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      ) : (
        <p className="pointer-events-none absolute bottom-4 left-4 text-sm text-white/70">
          Click a location marker to view details
        </p>
      )}
    </div>
  );
}
