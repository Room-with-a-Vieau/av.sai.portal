import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

/** Legacy dealer-locator fields (zip / Google Maps variants). */
export interface DealershipFields {
  dealershipName: { jsonValue: Field<string> };
  dealershipAddress: { jsonValue: Field<string> };
  dealershipCity: { jsonValue: Field<string> };
  dealershipState: { jsonValue: Field<string> };
  dealershipZipCode: { jsonValue: Field<string> };
}

export interface Dealership extends DealershipFields {
  distance?: number;
  latitude?: number;
  longitude?: number;
}

/** Sitecore Location template ({0A93F003-2EF3-4A66-9FB6-95C10B95532B}) under Data/Locations. */
export interface LocationItemFields {
  id: string;
  itemName?: string;
  name?: { jsonValue: Field<string> };
  streetAddress?: { jsonValue: Field<string> };
  city?: { jsonValue: Field<string> };
  state?: { jsonValue: Field<string> };
  zip?: { jsonValue: Field<string> };
  geo?: { jsonValue: Field<string> };
  locationType?: { jsonValue: Field<string> };
}

export interface LocationPoint {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  locationType: string;
  latitude: number;
  longitude: number;
}

export interface LocationSearchParams {
  [key: string]: string | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CompatibleLocationSearchParams = LocationSearchParams & Record<string, any>;

export interface LocationSearchDatasourceFields {
  title?: { jsonValue: Field<string> };
  companiesCount?: { jsonValue: Field<string> };
  statesCount?: { jsonValue: Field<string> };
  locationsCount?: { jsonValue: Field<string> };
  /** Legacy dealer-locator datasource fields */
  googleMapsApiKey?: string;
  defaultZipCode?: string;
}

export interface LocationSearchProps extends Omit<ComponentProps, 'params'> {
  isPageEditing?: boolean;
  params: CompatibleLocationSearchParams & ComponentProps['params'];
  fields?: {
    data?: {
      datasource?: LocationSearchDatasourceFields & {
        id?: string;
        children?: {
          results?: LocationItemFields[];
        };
      };
      dealerships?: {
        results: DealershipFields[];
      };
    };
  };
  defaultZipCode?: string;
  googleMapsApiKey?: string;
}

export interface LocationSearchItemProps {
  dealership: Dealership;
  isSelected: boolean;
  onSelect: (dealership: Dealership) => void;
}
