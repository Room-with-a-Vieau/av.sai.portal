'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
interface Slide {
  id?: string;
  slideTitle?: JsonField<Field<string>>;
  slideSubtitle?: JsonField<RichTextField>;
  slideImage?: JsonField<ImageField>;
  primaryLink?: JsonField<LinkField>;
  secondaryLink?: JsonField<LinkField>;
}
interface CarouselDatasource {
  title?: JsonField<Field<string>>;
  children?: { results?: Slide[] };
}
type HeroBannerCarouselProps = ComponentProps & {
  fields?: { data?: { datasource?: CarouselDatasource } };
};
const HeroBannerCarouselEmpty = (): React.JSX.Element => (
  <div className="component hero-banner-carousel">
    <span className="is-empty-hint">HeroBannerCarousel</span>
  </div>
);

function CarouselView({
  props,
  thumbnails,
}: {
  props: HeroBannerCarouselProps;
  thumbnails: boolean;
}): React.JSX.Element {
  const [active, setActive] = useState(0);
  const datasource = props.fields?.data?.datasource;
  const slides = datasource?.children?.results ?? [];
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);
  if (!datasource) return <HeroBannerCarouselEmpty />;
  const slide = slides[active];
  const isEditing = props.page?.mode?.isEditing;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component hero-banner-carousel bg-[var(--brand-dark)] text-[var(--brand-dark-foreground)]',
        props.params.styles
      )}
      aria-label={String(datasource.title?.jsonValue?.value ?? 'Hero carousel')}
    >
      <span className="sr-only">
        <Text field={datasource.title?.jsonValue} />
      </span>
      {slide && (
        <div className="relative min-h-[520px] overflow-hidden">
          {(slide.slideImage?.jsonValue?.value?.src || isEditing) && (
            <ContentSdkImage
              field={slide.slideImage?.jsonValue}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative mx-auto flex min-h-[520px] max-w-[1200px] items-center px-6 py-20">
            <div className="max-w-2xl space-y-5">
              <Text
                tag="h1"
                field={slide.slideTitle?.jsonValue}
                className="text-4xl font-bold md:text-6xl"
              />
              <ContentSdkRichText field={slide.slideSubtitle?.jsonValue} className="text-lg" />
              <div className="flex gap-3">
                {slide.primaryLink?.jsonValue && (
                  <ContentSdkLink
                    field={slide.primaryLink.jsonValue}
                    className="rounded-[var(--brand-button-radius)] bg-[var(--brand-primary)] px-6 py-3 font-semibold"
                  />
                )}
                {slide.secondaryLink?.jsonValue && (
                  <ContentSdkLink
                    field={slide.secondaryLink.jsonValue}
                    className="rounded-[var(--brand-button-radius)] border px-6 py-3 font-semibold"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {slides.length > 1 && (
        <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-3 px-6 py-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setActive((active - 1 + slides.length) % slides.length)}
          >
            <ChevronLeft />
          </button>
          {slides.map((item, index) => (
            <button
              key={item.id ?? index}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={active === index}
              onClick={() => setActive(index)}
              className={cn(
                thumbnails ? 'h-14 w-24 overflow-hidden rounded' : 'h-2.5 w-2.5 rounded-full',
                active === index ? 'bg-[var(--brand-primary)] ring-2 ring-white' : 'bg-white/50'
              )}
            >
              {thumbnails && (
                <ContentSdkImage
                  field={item.slideImage?.jsonValue}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setActive((active + 1) % slides.length)}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
export const Default: React.FC<HeroBannerCarouselProps> = (props) => (
  <CarouselView props={props} thumbnails={false} />
);
export const WithThumbnails: React.FC<HeroBannerCarouselProps> = (props) => (
  <CarouselView props={props} thumbnails />
);
