import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';
import type { ReferenceField } from '@/types/ReferenceField.props';

export interface CommunityFloorPlansParams {
  styles?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Fields authored on each referenced Floor Plan item (from the `FloorPlans` treelist).
 * `Overview` is a Sitecore Rich Text field; only a short preview is shown on the card.
 */
export type FloorPlanItem = {
  'Plan Name': Field<string>;
  Overview: Field<string>;
  image1: ImageField;
};

export type FloorPlanItemReferenceField = ReferenceField & {
  fields: FloorPlanItem;
};

export interface CommunityFloorPlansFields {
  titleOptional?: Field<string>;
  descriptionOptional?: Field<string>;
  linkOptional?: LinkField;
  /** Treelist of Floor Plan items authored on the content item. */
  FloorPlans?: FloorPlanItemReferenceField[];
}

export interface CommunityFloorPlansProps extends ComponentProps {
  params: CommunityFloorPlansParams;
  fields?: CommunityFloorPlansFields;
  isPageEditing?: boolean;
}
