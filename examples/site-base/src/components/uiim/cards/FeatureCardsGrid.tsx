'use client';

import type React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
interface FeatureCard {
  id?: string;
  cardTitle?: JsonField<Field<string>>;
  cardDescription?: JsonField<RichTextField>;
  cardImage?: JsonField<ImageField>;
  cardLink?: JsonField<LinkField>;
}
interface FeatureDatasource {
  title?: JsonField<Field<string>>;
  description?: JsonField<RichTextField>;
  children?: { results?: FeatureCard[] };
}
type FeatureCardsGridProps = ComponentProps & {
  fields?: { data?: { datasource?: FeatureDatasource } };
};
type Variant = 'default' | 'two' | 'images' | 'carousel' | 'news' | 'services' | 'help';
const FeatureCardsGridEmpty = (): React.JSX.Element => (
  <div className="component feature-cards-grid">
    <span className="is-empty-hint">FeatureCardsGrid</span>
  </div>
);

function FeatureGrid({
  props,
  variant,
}: {
  props: FeatureCardsGridProps;
  variant: Variant;
}): React.JSX.Element {
  const [active, setActive] = useState(0);
  const datasource = props.fields?.data?.datasource;
  if (!datasource) return <FeatureCardsGridEmpty />;
  const allCards = datasource.children?.results ?? [];
  const cards = variant === 'carousel' ? allCards.slice(active, active + 3) : allCards;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component feature-cards-grid px-6 py-16 text-[var(--brand-fg)]',
        variant === 'help' ? 'bg-[#DDEFFA]' : 'bg-[var(--brand-bg)]',
        props.params.styles
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10">
          <Text
            tag="h2"
            field={datasource.title?.jsonValue}
            className="text-3xl font-bold md:text-4xl"
          />
          <ContentSdkRichText
            field={datasource.description?.jsonValue}
            className="mt-4 max-w-3xl"
          />
        </header>
        <div
          className={cn(
            'grid gap-6',
            variant === 'two' ? 'md:grid-cols-2' : 'md:grid-cols-3',
            (variant === 'services' || variant === 'help') && 'grid-cols-1 md:grid-cols-1'
          )}
        >
          {cards.map((card, index) => (
            <article
              key={card.id ?? index}
              className={cn(
                'rounded-[var(--brand-card-radius)] border border-[var(--brand-border)] bg-white p-6',
                variant === 'services' &&
                  'grid items-center gap-6 md:grid-cols-[auto_1fr_auto] md:p-8',
                variant === 'help' &&
                  'border-0 border-r bg-transparent text-center last:border-r-0',
                variant === 'news' && 'border-0 bg-[var(--brand-muted)]'
              )}
            >
              {variant === 'news' && (
                <Sparkles className="mb-5 text-[var(--brand-primary)]" aria-hidden />
              )}
              {(variant === 'images' || variant === 'carousel') && (
                <ContentSdkImage
                  field={card.cardImage?.jsonValue}
                  className="mb-5 aspect-[4/3] w-full rounded-lg object-cover"
                />
              )}
              <div>
                <Text tag="h3" field={card.cardTitle?.jsonValue} className="text-xl font-bold" />
                <ContentSdkRichText field={card.cardDescription?.jsonValue} className="mt-3" />
              </div>
              {card.cardLink?.jsonValue && (
                <ContentSdkLink
                  field={card.cardLink.jsonValue}
                  className="mt-5 inline-flex font-semibold text-[var(--brand-primary)] underline underline-offset-4"
                />
              )}
            </article>
          ))}
        </div>
        {variant === 'carousel' && allCards.length > 3 && (
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              aria-label="Previous cards"
              onClick={() => setActive(Math.max(0, active - 1))}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next cards"
              onClick={() => setActive(Math.min(allCards.length - 3, active + 1))}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
export const Default: React.FC<FeatureCardsGridProps> = (props) => (
  <FeatureGrid props={props} variant="default" />
);
export const TwoColumn: React.FC<FeatureCardsGridProps> = (props) => (
  <FeatureGrid props={props} variant="two" />
);
export const WithImages: React.FC<FeatureCardsGridProps> = (props) => (
  <FeatureGrid props={props} variant="images" />
);
export const Carousel: React.FC<FeatureCardsGridProps> = (props) => (
  <FeatureGrid props={props} variant="carousel" />
);
export const GuideStoneNewsHighlights: React.FC<FeatureCardsGridProps> = (props) => (
  <FeatureGrid props={props} variant="news" />
);
export const GuideStoneServiceLongCards: React.FC<FeatureCardsGridProps> = (props) => (
  <FeatureGrid props={props} variant="services" />
);
export const GuideStoneHelpStrip: React.FC<FeatureCardsGridProps> = (props) => (
  <FeatureGrid props={props} variant="help" />
);
