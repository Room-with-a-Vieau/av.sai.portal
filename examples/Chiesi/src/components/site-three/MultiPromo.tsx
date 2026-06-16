'use client';

import { useMemo, useState } from 'react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
} from '@sitecore-content-sdk/nextjs';
import { ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { IGQLImageField, IGQLLinkField, IGQLTextField } from 'types/igql';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

interface Fields {
  data: {
    datasource: {
      title?: IGQLTextField;
      description?: IGQLTextField;
      children: {
        results: SimplePromoFields[];
      };
    };
  };
}

interface SimplePromoFields {
  id: string;
  heading: IGQLTextField;
  description: IGQLTextField;
  image: IGQLImageField;
  link: IGQLLinkField;
}

type MultiPromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type PromoItemProps = SimplePromoFields & {
  isHorizontal?: boolean;
};

const PromoItem = ({ isHorizontal, ...promo }: PromoItemProps) => {
  const { image, heading, description, link } = promo ?? {};

  return (
    <div className={`grid gap-8 ${isHorizontal ? 'lg:grid-cols-[1fr_2fr]' : ''}`}>
      <ContentSdkImage
        field={image?.jsonValue}
        className="w-full h-full aspect-square object-cover shadow-2xl"
      />
      <div>
        <h3 className="text-xl lg:text-2xl mb-2">
          <ContentSdkText field={heading?.jsonValue} />
        </h3>
        <p className="lg:text-lg mb-2">
          <ContentSdkText field={description?.jsonValue} />
        </p>
        <ContentSdkLink field={link?.jsonValue} className="btn btn-ghost" />
      </div>
    </div>
  );
};

const parentBasedGridClasses =
  'grid lg:[.multipromo-2-3_&]:grid-cols-[2fr_3fr] lg:[.multipromo-3-2_&]:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] gap-14';
const parentBasedGridItemClasses =
  '[.multipromo-centered_&]:items-center [.bg-gradient_&]:text-white items-start';

const SIDE_BY_SIDE_MIN_HEIGHT = 'min-h-[22rem] md:min-h-[26rem] lg:min-h-[32rem]';

type SideBySidePanelProps = {
  promo: SimplePromoFields;
};

const sideBySideDescriptionRevealClass =
  'max-h-0 overflow-hidden opacity-0 group-hover/panel:max-h-[24rem] group-hover/panel:opacity-100 group-focus-within/panel:max-h-[24rem] group-focus-within/panel:opacity-100';

/** Sitecore text fields may expose `value` as string or number in GraphQL types. */
function toTrimmedFieldString(value: string | number | undefined | null): string {
  if (value == null) return '';
  return String(value).trim();
}

const SideBySidePanel = ({ promo }: SideBySidePanelProps) => {
  const { image, heading, description, link } = promo ?? {};
  const linkText = toTrimmedFieldString(link?.jsonValue?.value?.text);
  const ctaLabel = linkText || 'Know more';
  const headingLabel = toTrimmedFieldString(heading?.jsonValue?.value) || 'Promo';

  return (
    <article
      className={cn(
        'group/panel multipromo-sidebyside-panel relative flex min-w-0 flex-1 flex-col justify-end overflow-hidden border-b border-white/15 text-left',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-white/80',
        'lg:border-b-0 lg:border-r lg:border-white/20 lg:last:border-r-0',
        SIDE_BY_SIDE_MIN_HEIGHT
      )}
      tabIndex={0}
      aria-label={headingLabel}
    >
      {image?.jsonValue?.value?.src ? (
        <ContentSdkImage
          field={image.jsonValue}
          className="absolute inset-0 z-0 h-full w-full scale-100 object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-primary" aria-hidden />
      )}

      <div className="multipromo-sidebyside-overlay pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="relative z-[2] flex flex-col justify-end p-6 text-white md:p-8 lg:p-10">
        {heading?.jsonValue && (
          <h3 className="font-heading text-2xl font-semibold leading-tight tracking-tight md:text-3xl lg:text-4xl">
            <ContentSdkText field={heading.jsonValue} />
          </h3>
        )}
        {description?.jsonValue && (
          <p
            className={cn(
              'mt-3 max-w-prose text-sm leading-relaxed text-white/95 transition-all duration-300 ease-out md:text-base',
              sideBySideDescriptionRevealClass
            )}
          >
            <ContentSdkText field={description.jsonValue} />
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
          {link?.jsonValue?.value?.href ? (
            <ContentSdkLink
              field={link.jsonValue}
              className="text-inherit no-underline hover:underline"
            />
          ) : (
            <span>{ctaLabel}</span>
          )}
          <ChevronRight className="size-4 shrink-0" aria-hidden />
        </span>
      </div>
    </article>
  );
};

type CardCarouselPanelProps = {
  promo: SimplePromoFields;
  isActive: boolean;
  onActivate: () => void;
};

const CardCarouselPanel = ({ promo, isActive, onActivate }: CardCarouselPanelProps) => {
  const { heading, description, link } = promo ?? {};
  const linkText = toTrimmedFieldString(link?.jsonValue?.value?.text);
  const ctaLabel = linkText || 'Learn more';
  const headingLabel = toTrimmedFieldString(heading?.jsonValue?.value) || 'Promo';

  return (
    <article
      className={cn(
        'group/card flex h-full min-h-[20rem] cursor-pointer flex-col rounded-xl border p-6 transition-colors duration-300 md:min-h-[22rem] md:p-8',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive
          ? 'border-primary bg-primary text-primary-foreground shadow-md'
          : 'border-border bg-card text-foreground hover:border-primary/25'
      )}
      tabIndex={0}
      aria-label={isActive ? `${headingLabel} (selected)` : headingLabel}
      aria-current={isActive ? 'true' : undefined}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      {description?.jsonValue && (
        <p
          className={cn(
            'text-sm leading-relaxed md:text-base',
            isActive ? 'text-primary-foreground/95' : 'text-muted-foreground'
          )}
        >
          <ContentSdkText field={description.jsonValue} />
        </p>
      )}
      <div className="mt-auto flex flex-col gap-4 pt-6">
        {heading?.jsonValue && (
          <h3 className="font-heading text-xl font-bold leading-snug md:text-2xl">
            <ContentSdkText field={heading.jsonValue} />
          </h3>
        )}
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium',
            isActive ? 'text-primary-foreground' : 'text-accent'
          )}
        >
          {link?.jsonValue?.value?.href ? (
            <ContentSdkLink
              field={link.jsonValue}
              className="text-inherit no-underline hover:underline"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span>{ctaLabel}</span>
          )}
          <ChevronRight className="size-4 shrink-0" aria-hidden />
        </span>
      </div>
    </article>
  );
};

export const Default = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section className={`relative ${props.params?.styles || ''}`} data-class-change>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-6 text-2xl lg:text-5xl">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={datasource?.description?.jsonValue} />
            </p>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-12`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const Stacked = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section
        className={`relative ${props.params?.styles || ''} overflow-hidden`}
        data-class-change
      >
        <span className="absolute top-1/3 left-1/3 [.multipromo-3-2_&]:-left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] -rotate-15 [.multipromo-3-2_&]:rotate-15 z-0"></span>
        <div className="relative container mx-auto px-4 py-16 z-10">
          <div className={`${parentBasedGridClasses}`}>
            <div className="lg:[.multipromo-3-2_&]:col-start-1 lg:[.multipromo-2-3_&]:col-start-2 lg:col-start-2 [.multipromo-2-3_&]:text-right">
              <h2 className="mb-6 text-2xl lg:text-5xl">
                <ContentSdkText field={datasource?.title?.jsonValue} />
              </h2>
              <p className="text-lg">
                <ContentSdkText field={datasource?.description?.jsonValue} />
              </p>
            </div>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-30`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return (
                <div
                  key={promo?.id}
                  className="lg:odd:-mt-8 lg:[.multipromo-3-2_&]:even:-mt-8 lg:[.multipromo-3-2_&]:odd:mt-0"
                >
                  <PromoItem {...promo} />
                </div>
              );
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const SingleColumn = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section className={`relative ${props.params?.styles || ''}`} data-class-change>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mb-16">
            <h2 className="mb-6 text-2xl lg:text-5xl">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={datasource?.description?.jsonValue} />
            </p>
          </div>
          <div className="grid gap-14">
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} isHorizontal />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

/**
 * Side-by-side promos: equal columns, each with its own image.
 * Hover (or keyboard focus) darkens the column and reveals its description.
 */
export const SideBySide = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );
  const promos = useMemo(
    () => datasource?.children?.results?.filter(Boolean) ?? [],
    [datasource?.children?.results]
  );

  if (props.fields) {
    if (promos.length === 0) {
      return (
        <section
          className={cn('relative', props.params?.styles)}
          data-class-change
          data-multipromo-variant="sidebyside"
        >
          <div className="container mx-auto px-4 py-16">
            {datasource?.title?.jsonValue && (
              <h2 className="mb-4 text-2xl lg:text-4xl">
                <ContentSdkText field={datasource.title.jsonValue} />
              </h2>
            )}
            {datasource?.description?.jsonValue && (
              <p className="text-lg">
                <ContentSdkText field={datasource.description.jsonValue} />
              </p>
            )}
          </div>
        </section>
      );
    }

    return (
      <section
        className={cn('relative w-full overflow-hidden', props.params?.styles)}
        data-class-change
        data-multipromo-variant="sidebyside"
      >
        <div
          className={cn(
            'relative flex w-full flex-col lg:flex-row',
            SIDE_BY_SIDE_MIN_HEIGHT
          )}
        >
          {promos.map((promo, index) => (
            <SideBySidePanel key={promo.id ?? index} promo={promo} />
          ))}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="MultiPromo" />;
};

/**
 * Horizontal card carousel: all promos in one row with prev/next arrows.
 * Hover or click activates a card (dark primary background, white text).
 */
export const CardCarousel = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );
  const promos = useMemo(
    () => datasource?.children?.results?.filter(Boolean) ?? [],
    [datasource?.children?.results]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (props.fields) {
    return (
      <section
        className={cn('relative w-full', props.params?.styles)}
        data-class-change
        data-multipromo-variant="cardcarousel"
      >
        <div className="container mx-auto px-4 py-16 md:py-20">
          {(datasource?.title?.jsonValue || datasource?.description?.jsonValue) && (
            <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
              {datasource?.title?.jsonValue && (
                <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                  <ContentSdkText field={datasource.title.jsonValue} />
                </h2>
              )}
              {datasource?.description?.jsonValue && (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  <ContentSdkText field={datasource.description.jsonValue} />
                </p>
              )}
            </div>
          )}

          {promos.length > 0 ? (
            <Carousel
              opts={{
                align: 'start',
                loop: false,
              }}
              className="relative w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {promos.map((promo, index) => (
                  <CarouselItem
                    key={promo.id ?? index}
                    className="basis-[88%] pl-4 sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.75rem)] md:pl-6 lg:basis-[calc(33.333%-0.75rem)]"
                  >
                    <CardCarouselPanel
                      promo={promo}
                      isActive={activeIndex === index}
                      onActivate={() => setActiveIndex(index)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="mt-8 flex items-center justify-center gap-4 md:mt-10">
                <CarouselPrevious
                  className="static inset-auto size-10 translate-x-0 translate-y-0 border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                  aria-label="Previous promos"
                />
                <CarouselNext
                  className="static inset-auto size-10 translate-x-0 translate-y-0 border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                  aria-label="Next promos"
                />
              </div>
            </Carousel>
          ) : null}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="MultiPromo" />;
};
