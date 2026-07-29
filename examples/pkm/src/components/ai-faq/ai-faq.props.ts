import type { Field } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';

export type AiFaqFields = {
  Question?: Field<string>;
  Answer?: Field<string>;
};

export type AiFaqProps = ComponentProps & {
  fields?: AiFaqFields;
};
