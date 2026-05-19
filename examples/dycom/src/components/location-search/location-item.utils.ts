import type { Field } from '@sitecore-content-sdk/nextjs';
import type { LocationItemFields, LocationPoint } from './location-search.props';

function getTextValue(field?: { jsonValue?: Field<string> }): string {
  const value = field?.jsonValue?.value;
  return typeof value === 'string' ? value.trim() : '';
}

export function parseGeoCoordinates(geo?: string): { latitude?: number; longitude?: number } {
  if (!geo) {
    return {};
  }

  const [latRaw, lngRaw] = geo.split(',').map((part) => part.trim());
  const latitude = Number.parseFloat(latRaw);
  const longitude = Number.parseFloat(lngRaw);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return {};
  }

  return { latitude, longitude };
}

export function mapLocationFieldsToPoint(item: LocationItemFields): LocationPoint | null {
  const name = getTextValue(item.name) || item.itemName?.trim() || '';
  const geoValue = getTextValue(item.geo);
  const { latitude, longitude } = parseGeoCoordinates(geoValue);

  if (!name || latitude === undefined || longitude === undefined) {
    return null;
  }

  return {
    id: item.id,
    name,
    streetAddress: getTextValue(item.streetAddress),
    city: getTextValue(item.city),
    state: getTextValue(item.state),
    zip: getTextValue(item.zip),
    locationType: getTextValue(item.locationType),
    latitude,
    longitude,
  };
}

export function buildLocationStats(locations: LocationPoint[]) {
  const states = new Set(
    locations.map((location) => location.state).filter((state) => state.length > 0)
  );

  return {
    companiesCount: locations.length,
    statesCount: states.size,
    locationsCount: locations.length,
  };
}

/** Sitecore item names may only contain letters, numbers, and spaces. */
export function sanitizeSitecoreItemName(value: string): string {
  return value.replace(/[^a-zA-Z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}
