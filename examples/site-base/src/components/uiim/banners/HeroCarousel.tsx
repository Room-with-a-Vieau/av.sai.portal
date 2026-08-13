'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';
import { ComponentProps } from '@/lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { IGQLImageField, IGQLLinkField, IGQLTextField } from 'src/types/igql';

interface HeroCarouselSlideFields {
  id: string;
  slideName?: IGQLTextField;
  description?: IGQLTextField;
  summary?: IGQLTextField;
  image?: IGQLImageField;
  link?: IGQLLinkField;
  isIntroSlide?: IGQLTextField;
}

interface HeroCarouselFields {
  data?: {
    datasource?: {
      contactLink?: IGQLLinkField;
      children?: {
        results?: HeroCarouselSlideFields[];
      };
    };
  };
}

export type HeroCarouselProps = ComponentProps & {
  fields?: HeroCarouselFields;
};

function isChecked(field?: IGQLTextField | null): boolean {
  const value = field?.jsonValue?.value as unknown;
  return value === true || value === '1' || value === 'true';
}

function hasImage(field?: IGQLImageField | null): boolean {
  const value = field?.jsonValue?.value as
    | string
    | { src?: string; href?: string; url?: string }
    | undefined;
  if (!value) return false;
  if (typeof value === 'string') {
    return /src=["'][^"']+["']/i.test(value) || /^https?:\/\//i.test(value.trim());
  }
  return Boolean(value.src || value.href || value.url);
}

function hasText(field?: IGQLTextField | null): boolean {
  const value = field?.jsonValue?.value;
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

function hasLink(field?: IGQLLinkField | null): boolean {
  const value = field?.jsonValue?.value as { href?: string; text?: string; url?: string } | undefined;
  return Boolean(value?.href || value?.url || value?.text);
}

function resolveIsIntro(
  slide: HeroCarouselSlideFields,
  index: number,
  slides: HeroCarouselSlideFields[]
): boolean {
  if (isChecked(slide.isIntroSlide)) return true;
  const anyExplicitIntro = slides.some((item) => isChecked(item.isIntroSlide));
  return !anyExplicitIntro && index === 0;
}

const HeroCarouselEmpty: React.FC = () => (
  <div className="bg-primary text-primary-foreground flex min-h-[28rem] w-full items-center justify-center p-8">
    <p className="text-sm uppercase tracking-widest opacity-80">Add hero carousel slides</p>
  </div>
);

export const Default: React.FC<HeroCarouselProps> = (props) => {
  const { fields, params } = props;
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing;
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const datasource = fields?.data?.datasource;
  const slides = datasource?.children?.results ?? [];
  const contactLink = datasource?.contactLink;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const id = params?.RenderingIdentifier;
  const styles = cn('component hero-carousel relative w-full', params?.styles);

  useEffect(() => {
    if (prefersReducedMotion || !isPlaying || isFocused || slides.length <= 1 || isEditing) {
      return;
    }
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, isPlaying, isFocused, slides.length, isEditing, currentSlide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!carouselRef.current?.contains(document.activeElement)) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setCurrentSlide(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        setCurrentSlide(slides.length - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  if (!datasource) {
    return <NoDataFallback componentName="HeroCarousel" />;
  }

  if (!slides.length && !isEditing) {
    return <HeroCarouselEmpty />;
  }

  const activeIndex = slides.length ? Math.min(currentSlide, slides.length - 1) : 0;
  const activeSlide = slides[activeIndex];
  const isIntro = activeSlide ? resolveIsIntro(activeSlide, activeIndex, slides) : true;

  return (
    <section
      ref={carouselRef}
      id={id}
      className={styles}
      data-class-change
      aria-roledescription="carousel"
      aria-label="Hero carousel"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="relative min-h-[32rem] w-full overflow-hidden md:min-h-[40rem] lg:min-h-[44rem]">
        {slides.map((slide, index) => {
          const intro = resolveIsIntro(slide, index, slides);
          const isActive = index === activeIndex;
          const showImage = hasImage(slide.image) && !intro;

          return (
            <div
              key={slide.id || `slide-${index}`}
              className={cn(
                'absolute inset-0 transition-opacity duration-700',
                isActive ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
              )}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
              role="group"
            >
              {/* Background */}
              <div
                className={cn(
                  'absolute inset-0',
                  intro
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
                aria-hidden="true"
              >
                {intro && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 70%, black) 0%, transparent 42%, transparent 58%, color-mix(in oklab, var(--color-primary) 55%, black) 100%)',
                      clipPath:
                        'polygon(0 0, 18% 0, 0 55%, 0 100%, 22% 100%, 0 40%, 100% 100%, 100% 60%, 78% 100%, 100% 100%, 100% 0, 82% 0, 100% 45%)',
                    }}
                  />
                )}
                {showImage && (
                  <ContentSdkImage
                    field={slide.image?.jsonValue}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Intro / brand layout */}
              {intro && (
                <div className="relative z-10 flex h-full min-h-[32rem] items-center justify-center px-6 py-16 pr-16 text-center text-primary-foreground md:min-h-[40rem] md:pr-20 lg:min-h-[44rem]">
                  <div className="mx-auto max-w-4xl">
                    {(hasText(slide.slideName) || isEditing) && (
                      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
                        <Text field={slide.slideName?.jsonValue} />
                      </h1>
                    )}
                    {(hasText(slide.description) || isEditing) && (
                      <p className="mt-3 text-lg font-light md:mt-4 md:text-2xl">
                        <Text field={slide.description?.jsonValue} />
                      </p>
                    )}
                    {(hasText(slide.summary) || isEditing) && (
                      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] md:mt-10 md:text-sm">
                        <Text field={slide.summary?.jsonValue} />
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Image + left CTA card layout */}
              {!intro && (
                <div className="relative z-10 flex h-full min-h-[32rem] items-stretch px-4 py-10 pr-16 md:min-h-[40rem] md:px-8 md:py-14 md:pr-20 lg:min-h-[44rem] lg:px-12">
                  <div className="bg-primary text-primary-foreground flex w-full max-w-md flex-col justify-between p-8 shadow-none md:max-w-lg md:p-10 lg:max-w-xl">
                    <div>
                      {(hasText(slide.slideName) || isEditing) && (
                        <h2 className="text-2xl font-semibold uppercase tracking-wide md:text-3xl lg:text-4xl">
                          <Text field={slide.slideName?.jsonValue} />
                        </h2>
                      )}
                      {(hasText(slide.description) || isEditing) && (
                        <p className="mt-6 text-sm leading-relaxed md:text-base">
                          <Text field={slide.description?.jsonValue} />
                        </p>
                      )}
                      {(hasText(slide.summary) || isEditing) && (
                        <p className="mt-4 text-xs uppercase tracking-widest opacity-90">
                          <Text field={slide.summary?.jsonValue} />
                        </p>
                      )}
                    </div>
                    {(hasLink(slide.link) || isEditing) && (
                      <div className="mt-10">
                        <ContentSdkLink
                          field={slide.link?.jsonValue}
                          className="inline-flex items-center border border-primary-foreground px-5 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
                          prefetch={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Right vertical rail: Contact + dots */}
        <div className="absolute inset-y-0 right-0 z-20 flex w-12 flex-col items-center bg-primary/95 text-primary-foreground md:w-14">
          {(hasLink(contactLink) || isEditing) && (
            <ContentSdkLink
              field={contactLink?.jsonValue}
              className="mt-4 flex h-40 w-full items-center justify-center bg-primary text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:bg-primary-hover"
              prefetch={false}
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            />
          )}

          {slides.length > 0 && (
            <div
              className="mt-auto mb-8 flex flex-col items-center gap-3"
              role="tablist"
              aria-label="Slide selection"
            >
              {slides.map((slide, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={`dot-${slide.id || index}`}
                    type="button"
                    role="tab"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-selected={selected}
                    aria-controls={`hero-carousel-slide-${index}`}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      'h-2.5 w-2.5 rounded-full border border-primary-foreground transition-colors',
                      selected
                        ? 'bg-primary-foreground'
                        : 'bg-transparent hover:bg-primary-foreground/40'
                    )}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        {isIntro ? 'Brand introduction slide' : 'Product slide'} {activeIndex + 1} of{' '}
        {slides.length || 0}
      </div>
    </section>
  );
};
