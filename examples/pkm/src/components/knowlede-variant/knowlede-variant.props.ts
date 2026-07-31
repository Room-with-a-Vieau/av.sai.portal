import type { RichTextField } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';

export type KnowledeVariantFields = {
  Content?: RichTextField;
};

export type KnowledeVariantProps = ComponentProps & {
  fields?: KnowledeVariantFields;
};
