'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from 'react-simple-maps';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LocationPoint } from './location-search.props';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

/** Approximate state label positions (lng, lat) for Dycom-style abbreviations. */
const STATE_LABELS: Array<{ code: string; coordinates: [number, number] }> = [
  { code: 'WA', coordinates: [-120.5, 47.5] },
  { code: 'OR', coordinates: [-122.5, 44.2] },
  { code: 'CA', coordinates: [-119.5, 37.2] },
  { code: 'NV', coordinates: [-116.5, 39.3] },
  { code: 'ID', coordinates: [-114.5, 44.2] },
  { code: 'MT', coordinates: [-109.5, 47.0] },
  { code: 'WY', coordinates: [-107.5, 43.0] },
  { code: 'UT', coordinates: [-111.5, 39.5] },
  { code: 'AZ', coordinates: [-111.5, 34.2] },
  { code: 'CO', coordinates: [-105.5, 39.0] },
  { code: 'NM', coordinates: [-106.0, 34.5] },
  { code: 'ND', coordinates: [-100.5, 47.5] },
  { code: 'SD', coordinates: [-100.0, 44.5] },
  { code: 'NE', coordinates: [-99.5, 41.5] },
  { code: 'KS', coordinates: [-98.0, 38.5] },
  { code: 'OK', coordinates: [-97.5, 35.5] },
  { code: 'TX', coordinates: [-99.5, 31.5] },
  { code: 'MN', coordinates: [-94.5, 46.0] },
  { code: 'IA', coordinates: [-93.5, 42.0] },
  { code: 'MO', coordinates: [-92.5, 38.5] },
  { code: 'AR', coordinates: [-92.5, 34.8] },
  { code: 'LA', coordinates: [-91.8, 31.0] },
  { code: 'WI', coordinates: [-89.5, 44.6] },
  { code: 'IL', coordinates: [-89.2, 40.0] },
  { code: 'MS', coordinates: [-89.7, 32.8] },
  { code: 'MI', coordinates: [-85.5, 44.3] },
  { code: 'IN', coordinates: [-86.2, 39.8] },
  { code: 'AL', coordinates: [-86.8, 32.8] },
  { code: 'OH', coordinates: [-82.8, 40.4] },
  { code: 'TN', coordinates: [-86.0, 35.8] },
  { code: 'KY', coordinates: [-85.5, 37.5] },
  { code: 'GA', coordinates: [-83.5, 32.7] },
  { code: 'FL', coordinates: [-81.5, 28.5] },
  { code: 'SC', coordinates: [-80.9, 33.9] },
  { code: 'NC', coordinates: [-79.5, 35.5] },
  { code: 'VA', coordinates: [-78.8, 37.5] },
  { code: 'WV', coordinates: [-80.5, 38.6] },
  { code: 'PA', coordinates: [-77.5, 41.0] },
  { code: 'NY', coordinates: [-75.5, 43.0] },
  { code: 'ME', coordinates: [-69.0, 45.5] },
  { code: 'NH', coordinates: [-71.5, 43.7] },
  { code: 'VT', coordinates: [-72.6, 44.1] },
  { code: 'MA', coordinates: [-71.8, 42.3] },
  { code: 'RI', coordinates: [-71.5, 41.7] },
  { code: 'CT', coordinates: [-72.7, 41.6] },
  { code: 'NJ', coordinates: [-74.5, 40.1] },
  { code: 'DE', coordinates: [-75.5, 39.0] },
  { code: 'MD', coordinates: [-76.8, 39.0] },
];

interface UsNationwideMapProps {
  locations: LocationPoint[];
  selectedId?: string | null;
  onSelect: (location: LocationPoint | null) => void;
}

export const UsNationwideMap: React.FC<UsNationwideMapProps> = ({
  locations,
  selectedId,
  onSelect,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId ?? selectedId ?? null;
  const activeLocation = useMemo(
    () => locations.find((location) => location.id === activeId) ?? null,
    [activeId, locations]
  );

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoAlbersUsa"
        className="h-auto w-full"
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1b6eb8"
                stroke="#ffffff"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#2080cc', outline: 'none' },
                  pressed: { fill: '#1b6eb8', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {STATE_LABELS.map(({ code, coordinates }) => (
          <Annotation
            key={code}
            subject={coordinates}
            dx={0}
            dy={0}
            connectorProps={{}}
          >
            <text
              x={0}
              y={0}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="fill-white font-sans text-[9px] font-semibold md:text-[10px]"
              style={{ pointerEvents: 'none' }}
            >
              {code}
            </text>
          </Annotation>
        ))}

        {locations.map((location) => {
          const isActive = location.id === activeId;
          const isHub = location.locationType.toLowerCase() === 'hub';

          if (isHub) {
            return (
              <Marker
                key={location.id}
                coordinates={[location.longitude, location.latitude]}
              >
                <g
                  className="cursor-pointer"
                  onClick={() => onSelect(isActive ? null : location)}
                  onMouseEnter={() => setHoveredId(location.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={location.name}
                >
                  <MapPin
                    className={cn(
                      'h-5 w-5 -translate-x-1/2 -translate-y-full text-[#6abf4b] transition-transform',
                      isActive && 'scale-125'
                    )}
                    fill="currentColor"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </g>
              </Marker>
            );
          }

          return (
            <Marker
              key={location.id}
              coordinates={[location.longitude, location.latitude]}
            >
              <circle
                r={isActive ? 5 : 4}
                className="cursor-pointer"
                fill="#e8dcc8"
                stroke="#ffffff"
                strokeWidth={1}
                onClick={() => onSelect(isActive ? null : location)}
                onMouseEnter={() => setHoveredId(location.id)}
                onMouseLeave={() => setHoveredId(null)}
                role="button"
                tabIndex={0}
                aria-label={location.name}
              />
            </Marker>
          );
        })}
      </ComposableMap>

      {activeLocation && (
        <div
          className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-xs rounded-md border border-white/20 bg-white px-4 py-3 text-[#1a1a1a] shadow-lg"
          role="status"
          aria-live="polite"
        >
          <p className="font-heading text-lg font-bold leading-tight">{activeLocation.name}</p>
          {(activeLocation.streetAddress || activeLocation.city) && (
            <p className="mt-1 text-sm leading-snug text-[#333333]">
              {[activeLocation.streetAddress, activeLocation.city, activeLocation.state, activeLocation.zip]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
