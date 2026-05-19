import type { Field } from '@sitecore-content-sdk/nextjs';
import { resolveStringField, type LocationItemFields } from './location-search.types';

export interface LocationMapPoint {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

/** Parses Sitecore GEO text: "latitude,longitude" (e.g. 25.8125,-80.3209). */
export function parseGeoCoordinates(geo: string): { latitude?: number; longitude?: number } {
  if (!geo.trim()) return {};

  const parts = geo.split(',').map((part) => part.trim());
  if (parts.length < 2) return {};

  const latitude = Number.parseFloat(parts[0]);
  const longitude = Number.parseFloat(parts[1]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return {};
  }

  return { latitude, longitude };
}

export function mapItemToLocationPoint(item: LocationItemFields): LocationMapPoint | null {
  const geoText = resolveStringField(item, ['GEO', 'geo'])?.value ?? '';
  const { latitude, longitude } = parseGeoCoordinates(geoText);

  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  const name =
    resolveStringField(item, ['Name', 'name'])?.value?.trim() ||
    (item.id ? `Location ${item.id.slice(0, 8)}` : 'Location');

  return {
    id: item.id,
    name,
    streetAddress: resolveStringField(item, ['StreetAddress'])?.value?.trim() ?? '',
    city: resolveStringField(item, ['City'])?.value?.trim() ?? '',
    state: resolveStringField(item, ['State'])?.value?.trim() ?? '',
    latitude,
    longitude,
  };
}

export function mapItemsToLocationPoints(items: LocationItemFields[]): LocationMapPoint[] {
  return items
    .map(mapItemToLocationPoint)
    .filter((point): point is LocationMapPoint => point !== null);
}

export function buildLocationStats(items: LocationItemFields[], mapPoints: LocationMapPoint[]) {
  const states = new Set(
    items
      .map((item) => resolveStringField(item, ['State'])?.value?.trim())
      .filter((state): state is string => Boolean(state))
  );

  return {
    companiesCount: items.length,
    statesCount: states.size,
    locationsCount: mapPoints.length,
  };
}
