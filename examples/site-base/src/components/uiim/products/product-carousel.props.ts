import type { ComponentProps } from '@/lib/component-props';
import type { IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';

export type ProductCarouselProductItem = {
  id: string;
  name?: string;
  path?: string;
  url?: { path?: string };
  pageTitle?: IGQLTextField;
  pageHeaderTitle?: IGQLTextField;
  categoryLabel?: IGQLTextField;
  description?: IGQLRichTextField;
  imageUrl?: IGQLTextField;
  imageSecondaryUrl?: IGQLTextField;
  specSheetLink?: IGQLLinkField;
};

export type ProductCarouselDatasource = {
  title?: IGQLTextField;
  backgroundImageUrl?: IGQLTextField;
  ctaLabel?: IGQLTextField;
  showOptionsHint?: IGQLTextField;
  products?: {
    targetItems?: ProductCarouselProductItem[];
  };
};

export type ProductCarouselFields = {
  data?: {
    datasource?: ProductCarouselDatasource;
  };
};

export type ProductCarouselProps = ComponentProps & {
  fields?: ProductCarouselFields;
  isPageEditing?: boolean;
};
