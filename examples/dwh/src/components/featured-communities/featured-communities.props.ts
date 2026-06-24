import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';
import type { ReferenceField } from '@/types/ReferenceField.props';

export interface FeaturedCommunitiesParams {
  styles?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Fields authored on each referenced Community Page item.
 * `Overview` is a Sitecore Rich Text field; only a short preview is shown in the listing.
 */
export type CommunityItem = {
  Name: Field<string>;
  Overview: Field<string>;
  Image1: ImageField;
};

export type CommunityItemReferenceField = ReferenceField & {
  fields: CommunityItem;
};

export interface FeaturedCommunitiesFields {
  titleOptional?: Field<string>;
  descriptionOptional?: Field<string>;
  linkOptional?: LinkField;
  featuredContent?: CommunityItemReferenceField[];
}

export interface FeaturedCommunitiesProps extends ComponentProps {
  params: FeaturedCommunitiesParams;
  fields?: FeaturedCommunitiesFields;
  isPageEditing?: boolean;
}
