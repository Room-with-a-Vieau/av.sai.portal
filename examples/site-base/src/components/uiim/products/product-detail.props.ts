import type {
  Field,
  ImageField,
  LinkField,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';

export type ProductDetailFields = {
  pageTitle?: Field<string>;
  pageHeaderTitle?: Field<string>;
  CategoryLabel?: Field<string>;
  SpecSheetLink?: LinkField;
  image?: ImageField;
  ImageSecondary?: ImageField;
  Description?: RichTextField;
  Detail?: RichTextField;
  TechnicalData?: RichTextField;
  StylesAvailable?: RichTextField;
  Benefits?: RichTextField;
};

export type ProductDetailProps = ComponentProps & {
  fields?: ProductDetailFields;
  isPageEditing?: boolean;
};
