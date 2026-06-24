'use client';

import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  Image as ContentSdkImage,
  Field,
  ImageField,
  RichTextField,
  useSitecore,
  Item,
} from '@sitecore-content-sdk/nextjs';
import { Dumbbell, Home, Play, Waves } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from 'shadcd/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Enum } from 'types/enum';

interface HomeDetailFields {
  Name?: Field<string>;
  Slug?: Field<string>;
  'Community Type'?: Field<string> | Enum[];
  status?: Field<string>;
  Address?: Field<string>;
  'Sales Center'?: Field<string>;
  Image1?: ImageField;
  Image2?: ImageField;
  Image3?: ImageField;
  ammenities?: Item[];
  floorplan?: ImageField;
  'price range'?: Field<string>;
  'square footage'?: Field<string>;
  Overview?: RichTextField | Field<string>;
}

type HomeDetailProps = {
  params: { [key: string]: string };
  fields?: HomeDetailFields;
};

const SECTION_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'homes', label: 'Homes' },
  { id: 'details', label: 'Details' },
  { id: 'offers', label: 'Offers' },
  { id: 'get-connected', label: 'Get Connected' },
] as const;

const AMENITY_ICONS = [Home, Waves, Dumbbell];

function mergeFields(
  componentFields?: HomeDetailFields,
  routeFields?: Record<string, unknown>,
): HomeDetailFields {
  return {
    ...(routeFields as HomeDetailFields),
    ...(componentFields ?? {}),
  };
}

function getCommunityTypeLabels(value?: Field<string> | Enum[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => item.displayName || item.name).filter(Boolean);
  }
  const raw = value.value?.trim();
  if (!raw) return [];
  return raw.split(/[|,]/).map((part) => part.trim()).filter(Boolean);
}

function formatHeaderMeta(address?: Field<string>, communityTypes: string[] = []): string {
  const parts: string[] = [];

  if (address?.value) {
    const segments = address.value.split(',').map((segment) => segment.trim());
    if (segments.length >= 3) {
      const city = segments[segments.length - 2];
      const stateZip = segments[segments.length - 1];
      const state = stateZip.split(/\s+/)[0];
      if (city && state) {
        parts.push(`${city}, ${state}`);
      }
    }
  }

  if (communityTypes.length) {
    parts.push(...communityTypes);
  }

  return parts.join(' | ');
}

function getImageSrc(image?: ImageField): string | undefined {
  return image?.value?.src;
}

function getDirectionsUrl(address?: Field<string>): string {
  if (!address?.value?.trim()) return '#';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.value)}`;
}

export const Default = (props: HomeDetailProps) => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const routeFields = page.layout?.sitecore?.route?.fields as Record<string, unknown> | undefined;
  const fields = mergeFields(props.fields, routeFields);

  const {
    Name,
    Address,
    'Community Type': communityType,
    Image1,
    Image2,
    Image3,
    ammenities,
    'price range': priceRange,
    'square footage': squareFootage,
    Overview,
  } = fields;

  const communityTypes = getCommunityTypeLabels(communityType);
  const headerMeta = formatHeaderMeta(Address, communityTypes);

  const carouselImages = useMemo(
    () =>
      [Image1, Image2, Image3]
        .map((image, index) => ({
          id: `community-image-${index + 1}`,
          field: image,
          src: getImageSrc(image),
        }))
        .filter((image) => image.src || isEditing),
    [Image1, Image2, Image3, isEditing],
  );

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(1);

  const onCarouselSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setActiveSlide(api.selectedScrollSnap() + 1);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => onCarouselSelect(carouselApi);
    handleSelect();
    carouselApi.on('select', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi, onCarouselSelect]);

  const amenityItems = ammenities ?? [];
  const directionsUrl = getDirectionsUrl(Address);

  return (
    <section className={cn('bg-white', props.params?.styles)} data-class-change data-component="home-detail">
      {/* Hero image carousel */}
      {(carouselImages.length > 0 || isEditing) && (
        <div className="relative h-[280px] overflow-hidden sm:h-[360px] lg:h-[420px]">
          <Carousel opts={{ loop: carouselImages.length > 1, align: 'center' }} setApi={setCarouselApi} className="h-full">
            <CarouselContent fullWidth className="h-full">
              {carouselImages.map((image) => (
                <CarouselItem
                  key={image.id}
                  className={cn(
                    'h-[280px] sm:h-[360px] lg:h-[420px]',
                    carouselImages.length === 1 ? 'basis-full' : 'basis-[85%] sm:basis-[75%] lg:basis-[68%]',
                  )}
                >
                  {image.field ? (
                    <ContentSdkImage
                      field={image.field}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            {carouselImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4 top-1/2 h-10 w-10 -translate-y-1/2 border-0 bg-white/90 text-[#2f2f2d] shadow hover:bg-white" />
                <CarouselNext className="right-4 top-1/2 h-10 w-10 -translate-y-1/2 border-0 bg-white/90 text-[#2f2f2d] shadow hover:bg-white" />
                <div className="absolute bottom-4 right-4 rounded bg-black/55 px-3 py-1 text-sm text-white">
                  {activeSlide} of {carouselImages.length}
                </div>
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Community header stats */}
      <div className="border-b border-[#e8e3dc] bg-[#f8f8f8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-8">
          <div className="min-w-0">
            {(headerMeta || isEditing) && (
              <p className="mb-2 text-sm text-[#6f6a64]">
                {headerMeta || (isEditing ? 'Community location' : '')}
              </p>
            )}
            {(Name?.value || isEditing) && (
              <h1 className="font-serif text-3xl font-medium text-[#2f2f2d] md:text-4xl">
                <ContentSdkText field={Name} />
              </h1>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="grid grid-cols-3 gap-6 sm:gap-10">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-[#6f6a64]">From the</p>
                <p className="text-lg font-medium text-[#2f2f2d]">
                  <ContentSdkText field={priceRange} />
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-[#6f6a64]">Sq Ft</p>
                <p className="text-lg font-medium text-[#2f2f2d]">
                  <ContentSdkText field={squareFootage} />
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-[#6f6a64]">Amenity Highlights</p>
                <div className="flex items-center gap-3">
                  {amenityItems.length > 0
                    ? amenityItems.map((item, index) => {
                        const Icon = AMENITY_ICONS[index % AMENITY_ICONS.length];
                        return (
                          <span
                            key={item.id}
                            className="inline-flex h-8 w-8 items-center justify-center text-[#2f2f2d]"
                            title={item.displayName || item.name}
                          >
                            <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                            <span className="sr-only">{item.displayName || item.name}</span>
                          </span>
                        );
                      })
                    : isEditing && (
                        <span className="text-sm text-[#6f6a64]">Add amenities</span>
                      )}
                </div>
              </div>
            </div>

            <button type="button" className="btn btn-primary btn-sharp shrink-0 cursor-pointer px-6">
              Schedule a Tour
            </button>
          </div>
        </div>
      </div>

      {/* Section navigation */}
      <nav
        aria-label="Community sections"
        className="border-b border-[#e8e3dc] bg-white"
      >
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 lg:px-6">
          {SECTION_NAV.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'text-xs font-medium uppercase tracking-[0.12em] text-[#2f2f2d] transition-colors hover:text-[#f2894f]',
                  index === 0 && 'border-b-2 border-[#f2894f] pb-1 text-[#2f2f2d]',
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Overview + address */}
      <div id="overview" className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-medium text-[#2f2f2d]">Overview</h2>
            {(Overview?.value || isEditing) && (
              <div className="prose prose-neutral max-w-none text-[#4a4a48]">
                <ContentSdkRichText field={Overview as RichTextField} />
              </div>
            )}
          </div>

          <aside className="lg:pt-1">
            <h2 className="mb-4 font-serif text-2xl font-medium text-[#2f2f2d]">Address</h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-base text-[#4a4a48]">
                <ContentSdkText field={Address} />
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline shrink-0 border-[#f2894f] px-5 text-[#f2894f] hover:bg-[#f2894f]/10"
              >
                Get Directions
              </a>
            </div>

            <hr className="my-8 border-[#e8e3dc]" />

            <a
              href="#videos"
              className="inline-flex items-center gap-3 text-base font-medium text-[#2f2f2d] hover:text-[#f2894f]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1e6bb8] text-white">
                <Play className="h-4 w-4 fill-current" aria-hidden />
              </span>
              View Videos
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
};
