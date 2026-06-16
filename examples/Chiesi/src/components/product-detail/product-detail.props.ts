import type { Field } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';

export type ProductDetailParams = {
  [key: string]: string | undefined;
  styles?: string;
};

/** Sitecore datasource fields — catalog number drives NetSuite lookup. */
export type ProductDetailFields = {
  catalogNumber?: Field<string>;
  CatalogNumber?: Field<string>;
  /** Optional override of bundled NetSuite mock JSON (Multi-Line Text). */
  jsonCatalog?: Field<string>;
  JsonCatalog?: Field<string>;
};

export type ProductDetailFieldsFromLayout = {
  data: {
    datasource?: Partial<ProductDetailFields>;
  };
};

export type ProductDetailProps = ComponentProps & {
  params: ProductDetailParams;
  fields?: ProductDetailFields | ProductDetailFieldsFromLayout;
};
