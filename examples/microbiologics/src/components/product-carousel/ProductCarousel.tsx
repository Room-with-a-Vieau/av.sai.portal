'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import { parseProductCarouselData } from './product-carousel.fields';
import type { ProductCarouselProps } from './product-carousel.props';
import type { ProductCarouselItem } from './product-carousel.types';

const SLIDE_CLASS =
  'min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4';

function ProductCarouselCard({ product }: { product: ProductCarouselItem }) {
  const content = (
    <div className="flex h-full min-h-[9.5rem] gap-4 border border-white/10 bg-white/5 p-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-white/10">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt ?? product.title}
            fill
            sizes="96px"
            className="object-contain object-center p-1"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-white/60">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-lg font-bold leading-snug text-primary-foreground">
          {product.title}
        </h3>
        <p className="mt-2 text-sm leading-snug text-primary-foreground/90">{product.description}</p>
      </div>
    </div>
  );

  if (product.href) {
    return (
      <Link
        href={product.href}
        className="group block h-full transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6DCCE1]"
        prefetch={false}
      >
        {content}
      </Link>
    );
  }

  return content;
}

export const Default = (props: ProductCarouselProps) => {
  const carouselData = useMemo(() => parseProductCarouselData(props.fields), [props.fields]);
  const { title, products } = carouselData;

  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!products.length) {
    return (
      <section
        className={cn('bg-[#233184] px-4 py-12 text-primary-foreground', props.params?.styles)}
        data-component="product-carousel"
      >
        <p className="text-center text-sm text-primary-foreground/80">No products configured.</p>
      </section>
    );
  }

  return (
    <section
      className={cn('relative overflow-hidden bg-[#233184] py-10 text-primary-foreground md:py-12', props.params?.styles)}
      data-class-change
      data-component="product-carousel"
      aria-roledescription="carousel"
      aria-label={title ?? 'Product carousel'}
    >
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <div className="mb-8 max-w-4xl">
          <div className="mb-3 h-1 w-14 bg-[#6DCCE1]" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide md:text-3xl">
            {title}
          </h2>
        </div>

        <div className="relative">
          <button
            type="button"
            className={cn(
              'absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 p-2 text-[#6DCCE1] transition-opacity md:inline-flex',
              !canScrollPrev && 'cursor-not-allowed opacity-40'
            )}
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous products"
          >
            <ChevronLeft className="h-10 w-10" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            className={cn(
              'absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 p-2 text-[#6DCCE1] transition-opacity md:inline-flex',
              !canScrollNext && 'cursor-not-allowed opacity-40'
            )}
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next products"
          >
            <ChevronRight className="h-10 w-10" strokeWidth={1.5} />
          </button>

          <div className="overflow-hidden px-0 md:px-10" ref={viewportRef}>
            <div className="-ml-4 flex touch-pan-y">
              {products.map((product) => (
                <div key={product.id} className={SLIDE_CLASS} role="group" aria-roledescription="slide">
                  <ProductCarouselCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 px-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  'h-2.5 w-2.5 rounded-full border-2 border-[#6DCCE1] transition-colors',
                  selectedIndex === index ? 'bg-[#6DCCE1]' : 'bg-transparent'
                )}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selectedIndex === index ? 'true' : undefined}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
            <button
              type="button"
              className={cn(
                'inline-flex p-2 text-[#6DCCE1]',
                !canScrollPrev && 'cursor-not-allowed opacity-40'
              )}
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous products"
            >
              <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className={cn(
                'inline-flex p-2 text-[#6DCCE1]',
                !canScrollNext && 'cursor-not-allowed opacity-40'
              )}
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next products"
            >
              <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
