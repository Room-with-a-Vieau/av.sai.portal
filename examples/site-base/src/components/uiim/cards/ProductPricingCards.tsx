import type React from 'react';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  type Field,
  type ImageField,
  type LinkField,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';

type JsonField<T> = { jsonValue?: T };
interface PricingCard {
  id?: string;
  cardTitle?: JsonField<Field<string>>;
  cardDescription?: JsonField<RichTextField>;
  cardImage?: JsonField<ImageField>;
  badgeText?: JsonField<Field<string>>;
  priceText?: JsonField<Field<string>>;
  cardLink?: JsonField<LinkField>;
}
interface PricingDatasource {
  title?: JsonField<Field<string>>;
  description?: JsonField<RichTextField>;
  children?: { results?: PricingCard[] };
}
type ProductPricingCardsProps = ComponentProps & {
  fields?: { data?: { datasource?: PricingDatasource } };
};
const ProductPricingCardsEmpty = (): React.JSX.Element => (
  <div className="component product-pricing-cards">
    <span className="is-empty-hint">ProductPricingCards</span>
  </div>
);

function PricingView({
  props,
  variant,
}: {
  props: ProductPricingCardsProps;
  variant: 'default' | 'horizontal' | 'compact' | 'highlighted';
}): React.JSX.Element {
  const datasource = props.fields?.data?.datasource;
  if (!datasource) return <ProductPricingCardsEmpty />;
  const cards = datasource.children?.results ?? [];
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component product-pricing-cards bg-[var(--brand-bg)] px-6 py-16 text-[var(--brand-fg)]',
        props.params.styles
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10 max-w-3xl">
          <Text
            tag="h2"
            field={datasource.title?.jsonValue}
            className="text-3xl font-bold md:text-4xl"
          />
          <ContentSdkRichText field={datasource.description?.jsonValue} className="mt-4" />
        </header>
        <div
          className={cn(
            'grid gap-6',
            variant === 'horizontal' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {cards.map((card, index) => (
            <article
              key={card.id ?? index}
              className={cn(
                'overflow-hidden rounded-[var(--brand-card-radius)] border border-[var(--brand-border)] bg-white p-6',
                variant === 'horizontal' && 'grid items-center gap-6 md:grid-cols-[240px_1fr]',
                variant === 'highlighted' && index === 0 && 'ring-2 ring-[var(--brand-primary)]'
              )}
            >
              {variant !== 'compact' && (
                <ContentSdkImage
                  field={card.cardImage?.jsonValue}
                  className="mb-5 aspect-video w-full rounded-lg object-cover"
                />
              )}
              <div>
                {card.badgeText?.jsonValue && (
                  <Text
                    field={card.badgeText.jsonValue}
                    tag="span"
                    className="mb-3 inline-flex rounded-full bg-[var(--brand-muted)] px-3 py-1 text-xs font-semibold"
                  />
                )}
                <Text tag="h3" field={card.cardTitle?.jsonValue} className="text-2xl font-bold" />
                <ContentSdkRichText field={card.cardDescription?.jsonValue} className="mt-3" />
                <Text
                  field={card.priceText?.jsonValue}
                  tag="p"
                  className="mt-5 text-xl font-bold text-[var(--brand-primary)]"
                />
                {card.cardLink?.jsonValue && (
                  <ContentSdkLink
                    field={card.cardLink.jsonValue}
                    className="mt-5 inline-flex rounded-[var(--brand-button-radius)] bg-[var(--brand-primary)] px-5 py-3 font-semibold text-[var(--brand-primary-foreground)]"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export const Default: React.FC<ProductPricingCardsProps> = (props) => (
  <PricingView props={props} variant="default" />
);
export const Horizontal: React.FC<ProductPricingCardsProps> = (props) => (
  <PricingView props={props} variant="horizontal" />
);
export const Compact: React.FC<ProductPricingCardsProps> = (props) => (
  <PricingView props={props} variant="compact" />
);
export const Highlighted: React.FC<ProductPricingCardsProps> = (props) => (
  <PricingView props={props} variant="highlighted" />
);
