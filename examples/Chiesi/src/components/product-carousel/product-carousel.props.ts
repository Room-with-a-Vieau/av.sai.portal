import type { Field } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';

export type ProductCarouselParams = {
  [key: string]: string | undefined;
  styles?: string;
};

/** JSON datasource field on the rendering (Multi-Line Text). */
export type ProductCarouselFields = {
  jsonDatasource?: Field<string>;
  JsonDatasource?: Field<string>;
  JSONDatasource?: Field<string>;
};

export type ProductCarouselFieldsFromLayout = {
  data: {
    datasource?: Partial<ProductCarouselFields>;
  };
};

export type ProductCarouselProps = ComponentProps & {
  params: ProductCarouselParams;
  fields?: ProductCarouselFields | ProductCarouselFieldsFromLayout;
};
