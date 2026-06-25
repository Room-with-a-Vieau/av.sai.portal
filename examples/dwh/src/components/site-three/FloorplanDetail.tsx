'use client';

import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  Image as ContentSdkImage,
  Field,
  ImageField,
  RichTextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import {
  Bath,
  BedDouble,
  Building2,
  Car,
  FileText,
  Heart,
  Printer,
  ShieldCheck,
  Share2,
  Wallet,
} from 'lucide-react';
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

type NumberLikeField = Field<string> | Field<number>;

interface FloorplanDetailFields {
  'Plan Name'?: Field<string>;
  PlanID?: Field<string>;
  'Plan Address'?: Field<string>;
  Stores?: NumberLikeField;
  Bedrooms?: NumberLikeField;
  'Full Baths'?: NumberLikeField;
  'Car Garage'?: NumberLikeField;
  'sq footage'?: Field<string>;
  price?: Field<string>;
  status?: Field<string>;
  Overview?: RichTextField | Field<string>;
  Image1?: ImageField;
  Image2?: ImageField;
  Image3?: ImageField;
  'First Floor'?: ImageField;
  'Second Floor'?: ImageField;
  Basement?: ImageField;
}

type FloorplanDetailProps = {
  params: { [key: string]: string };
  fields?: FloorplanDetailFields;
};

const PLAN_ACTIONS = [
  { id: 'share', label: 'Share Plan', Icon: Share2 },
  { id: 'save', label: 'Save Plan', Icon: Heart },
  { id: 'print', label: 'Print with Plan Options', Icon: Printer },
  { id: 'financing', label: 'Financing', Icon: Wallet },
  { id: 'warranty', label: 'Warranty', Icon: ShieldCheck },
  { id: 'brochure', label: 'Request a Brochure', Icon: FileText },
] as const;

function mergeFields(
  componentFields?: FloorplanDetailFields,
  routeFields?: Record<string, unknown>,
): FloorplanDetailFields {
  return {
    ...(routeFields as FloorplanDetailFields),
    ...(componentFields ?? {}),
  };
}

function fieldText(field?: NumberLikeField): string {
  const value = field?.value;
  if (value === undefined || value === null) return '';
  return String(value);
}

function getImageSrc(image?: ImageField): string | undefined {
  return image?.value?.src;
}

/** Formats a raw price string (e.g. "527990") into currency (e.g. "$527,990"). */
function formatPrice(value?: string): string {
  if (!value?.trim()) return '';
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return value.trim();
  return `$${Number(digits).toLocaleString('en-US')}`;
}

export const Default = (props: FloorplanDetailProps) => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const routeFields = page.layout?.sitecore?.route?.fields as Record<string, unknown> | undefined;
  const fields = mergeFields(props.fields, routeFields);

  const {
    'Plan Name': planName,
    PlanID: planId,
    'Plan Address': planAddress,
    Stores: stores,
    Bedrooms: bedrooms,
    'Full Baths': fullBaths,
    'Car Garage': carGarage,
    'sq footage': squareFootage,
    price,
    status,
    Overview,
    Image1,
    Image2,
    Image3,
    'First Floor': firstFloor,
    'Second Floor': secondFloor,
    Basement: basement,
  } = fields;

  const formattedPrice = formatPrice(price?.value);

  const stats = useMemo(
    () => [
      { id: 'stores', label: 'Stories', value: fieldText(stores), Icon: Building2 },
      { id: 'bedrooms', label: 'Bedrooms', value: fieldText(bedrooms), Icon: BedDouble },
      { id: 'full-baths', label: 'Full Baths', value: fieldText(fullBaths), Icon: Bath },
      { id: 'car-garage', label: 'Car Garage', value: fieldText(carGarage), Icon: Car },
    ],
    [stores, bedrooms, fullBaths, carGarage],
  );

  const carouselImages = useMemo(
    () =>
      [Image1, Image2, Image3]
        .map((image, index) => ({
          id: `plan-image-${index + 1}`,
          field: image,
          src: getImageSrc(image),
        }))
        .filter((image) => image.src || isEditing),
    [Image1, Image2, Image3, isEditing],
  );

  const floors = useMemo(
    () =>
      [
        { id: 'first-floor', label: '1st Floor', field: firstFloor },
        { id: 'second-floor', label: '2nd Floor', field: secondFloor },
        { id: 'basement', label: 'Basement', field: basement },
      ].filter((floor) => getImageSrc(floor.field) || isEditing),
    [firstFloor, secondFloor, basement, isEditing],
  );

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(1);
  const [activeFloorId, setActiveFloorId] = useState<string>('');

  useEffect(() => {
    if (floors.length && !floors.some((floor) => floor.id === activeFloorId)) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

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

  const activeFloor = floors.find((floor) => floor.id === activeFloorId) ?? floors[0];

  return (
    <section
      className={cn('bg-white', props.params?.styles)}
      data-class-change
      data-component="floorplan-detail"
    >
      {/* Hero image carousel */}
      {(carouselImages.length > 0 || isEditing) && (
        <div className="relative h-[280px] overflow-hidden sm:h-[360px] lg:h-[420px]">
          <Carousel
            opts={{ loop: carouselImages.length > 1, align: 'center' }}
            setApi={setCarouselApi}
            className="h-full"
          >
            <CarouselContent fullWidth className="h-full">
              {carouselImages.map((image) => (
                <CarouselItem
                  key={image.id}
                  className={cn(
                    'h-[280px] sm:h-[360px] lg:h-[420px]',
                    carouselImages.length === 1
                      ? 'basis-full'
                      : 'basis-[85%] sm:basis-[75%] lg:basis-[68%]',
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

      {/* Plan header */}
      <div className="border-b border-[#e8e3dc] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-6 lg:py-8">
          <div className="min-w-0">
            {(planId?.value || isEditing) && (
              <p className="mb-1 text-sm text-[#6f6a64]">
                Plan {planId?.value || (isEditing ? '#' : '')}
              </p>
            )}
            {(planName?.value || isEditing) && (
              <h1 className="font-serif text-3xl font-medium text-[#2f2f2d] md:text-4xl">
                <ContentSdkText field={planName} />
              </h1>
            )}
          </div>

          <div className="flex items-end gap-10">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[#6f6a64]">Price</p>
              <p className="text-lg font-medium text-[#2f2f2d]">
                {isEditing ? <ContentSdkText field={price} /> : formattedPrice}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[#6f6a64]">Sq Ft</p>
              <p className="text-lg font-medium text-[#2f2f2d]">
                <ContentSdkText field={squareFootage} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan action links */}
      <nav aria-label="Plan actions" className="border-b border-[#e8e3dc] bg-white">
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 lg:px-6">
          {PLAN_ACTIONS.map(({ id, label, Icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-[#6f6a64] transition-colors hover:text-[#f2894f]"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Stats + overview */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
              {stats.map(({ id, label, value, Icon }) => (
                <div key={id} className="flex flex-col items-start">
                  <Icon className="mb-2 h-7 w-7 text-[#2f2f2d]" strokeWidth={1.25} aria-hidden />
                  <p className="text-lg font-medium text-[#2f2f2d]">{value || (isEditing ? '0' : '')}</p>
                  <p className="text-xs uppercase tracking-wide text-[#6f6a64]">{label}</p>
                </div>
              ))}
            </div>

            {(planAddress?.value || isEditing) && (
              <p className="mt-8 text-base font-medium text-[#2f2f2d]">
                <ContentSdkText field={planAddress} />
              </p>
            )}

            {(status?.value || isEditing) && (
              <button
                type="button"
                className="mt-4 w-full rounded bg-[#3b7dc9] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#336cb0] sm:w-auto"
              >
                {status?.value || 'Ready Now'}
              </button>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between gap-6">
              <h2 className="mb-4 font-serif text-2xl font-medium text-[#2f2f2d]">Overview</h2>
              <a
                href="#tour"
                className="btn btn-outline shrink-0 border-[#f2894f] px-5 text-[#f2894f] hover:bg-[#f2894f]/10"
              >
                360 Tour
              </a>
            </div>
            {(Overview?.value || isEditing) && (
              <div className="prose prose-neutral max-w-none text-[#4a4a48]">
                <ContentSdkRichText field={Overview as RichTextField} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floor plans */}
      {(floors.length > 0 || isEditing) && (
        <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-6 lg:pb-16" id="floorplans">
          {floors.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Floor plans">
              {floors.map((floor) => {
                const isActive = floor.id === activeFloor?.id;
                return (
                  <button
                    key={floor.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFloorId(floor.id)}
                    className={cn(
                      'rounded px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#f2894f] text-white'
                        : 'bg-[#f1ede7] text-[#2f2f2d] hover:bg-[#e3ddd3]',
                    )}
                  >
                    {floor.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-center rounded bg-[#cfe0ef] p-4 lg:p-8">
            {activeFloor?.field ? (
              <ContentSdkImage
                field={activeFloor.field}
                className="h-auto max-h-[760px] w-auto max-w-full object-contain"
              />
            ) : (
              <div className="flex h-[400px] w-full items-center justify-center text-sm text-[#6f6a64]">
                {isEditing ? 'Add floor plan images' : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
