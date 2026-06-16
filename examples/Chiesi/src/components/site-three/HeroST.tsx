'use client';

import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';

interface Fields {
  Eyebrow: Field<string>;
  Title: Field<string>;
  Image1: ImageField;
  Image2: ImageField;
  Link1: LinkField;
  Link2: LinkField;
}

/**
 * Full-bleed hero backgrounds use `object-cover` so the image always fills the hero box.
 * Cropping is expected when the image aspect ratio differs from the rendered hero.
 *
 * Vertical band: mobile ~400–600px, laptop (md) ~500–600px, desktop (lg+) ~600–800px.
 * Next/Image `width`/`height` (e.g. 1920×1080) are intrinsic aspect hints; that resolution stays a
 * solid choice for crisp wide layouts even when the rendered hero is shorter.
 */
const HERO_BG_IMAGE_CLASS = 'h-full w-full object-cover object-center';
const HERO_BG_LAYER_CLASS = 'absolute inset-0 z-10 bg-muted';

/** Responsive hero content column / split row height band */
const HERO_CONTENT_BAND_CLASS =
  'min-h-[400px] max-h-[600px] md:min-h-[500px] md:max-h-[600px] lg:min-h-[600px] lg:max-h-[800px]';

/** Main headline scale (smaller than previous display sizes for shorter hero band) */
const HERO_TITLE_CLASS = 'text-3xl md:text-4xl lg:text-5xl';

/** Looping hero video for WithVideoSplit (Microbiologics homepage). */
const HERO_VIDEO_SPLIT_SRC =
  'https://mrfbasech.sitecoresandbox.cloud/api/public/content/8c0a176cff5244e38a1532274aff3648?v=6030d7ad';

const HERO_FOCUS_AREAS = [
  {
    title: 'Microbiology',
    description:
      'Leaders in microbiological reference materials and anti-infective drug testing services',
    iconBgClass: 'bg-[#273692]',
    iconFgClass: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 8v6M24 34v6M8 24h6M34 24h6M12.7 12.7l4.2 4.2M31.1 31.1l4.2 4.2M12.7 35.3l4.2-4.2M31.1 16.9l4.2-4.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Molecular Diagnostics',
    description:
      'Bringing precision to infectious disease and oncology molecular diagnostics',
    iconBgClass: 'bg-[#6DCCE1]',
    iconFgClass: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
        <path
          d="M14 8c0 8 4 12 10 12s10-4 10-12M14 40c0-8 4-12 10-12s10 4 10 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M18 14l6 20M30 14l-6 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Virology',
    description:
      'Go-to collaborators for BSL-2 & BSL-3 high-titer viral stocks and antiviral assay services',
    iconBgClass: 'bg-white',
    iconFgClass: 'text-[#10112D]',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 6v4M24 38v4M6 24h4M38 24h4M10.3 10.3l2.8 2.8M34.9 34.9l2.8 2.8M10.3 37.7l2.8-2.8M34.9 13.1l2.8-2.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

function HeroVideoSplitDecorativeOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute -bottom-6 -left-6 flex -rotate-[28deg] flex-col gap-2.5">
        <div className="h-3 w-28 rounded-full bg-[#6DCCE1] opacity-95 sm:w-36" />
        <div className="ml-6 h-3 w-32 rounded-full bg-[#4754A2] opacity-95 sm:w-44" />
        <div className="ml-2 h-3 w-24 rounded-full bg-white opacity-90 sm:w-32" />
        <div className="ml-10 h-3 w-36 rounded-full bg-[#273692] opacity-95 sm:w-48" />
        <div className="ml-4 h-3 w-20 rounded-full bg-[#E6E7E8] opacity-90 sm:w-28" />
      </div>
    </div>
  );
}

/** Light text over dark hero imagery (theme token — typically white / near-white). */
const HERO_TEXT_ON_DARK_IMAGE_CLASS = 'text-primary-foreground';

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: Fields;
};

/** Sitecore checkbox rendering parameters often arrive as 1 / true / yes / on (strings). */
function isCheckboxParamEnabled(value: string | undefined): boolean {
  if (value == null || typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

/**
 * Rendering parameter "Dark Image" (checkbox). Matches keys regardless of spacing/casing
 * (e.g. DarkImage, Dark Image, darkImage).
 */
function isDarkImageHero(params: PageHeaderSTProps['params'] | undefined): boolean {
  if (!params) return false;
  for (const [key, value] of Object.entries(params)) {
    const normalized = key.replace(/[\s_-]/g, '').toLowerCase();
    if (normalized === 'darkimage' && isCheckboxParamEnabled(value)) {
      return true;
    }
  }
  return false;
}

function heroEyebrowOverPhotoClass(darkImage: boolean): string {
  return cn(
    'text-xl lg:text-3xl pb-4',
    darkImage ? HERO_TEXT_ON_DARK_IMAGE_CLASS : 'text-primary'
  );
}

function heroTitleOverPhotoClass(darkImage: boolean): string {
  return cn(
    HERO_TITLE_CLASS,
    darkImage ? HERO_TEXT_ON_DARK_IMAGE_CLASS : 'text-primary'
  );
}

export const Default = (props: PageHeaderSTProps) => {
  const darkImage = isDarkImageHero(props.params);
  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className={HERO_BG_LAYER_CLASS}>
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className={HERO_BG_IMAGE_CLASS}
        />
      </div>
        <div className="relative z-20 mx-auto w-full lg:container lg:flex">
          <div
            className={`flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
          >
            <div className="lg:max-w-3xl">
              <h1 className={heroEyebrowOverPhotoClass(darkImage)}>
                <ContentSdkText field={props?.fields?.Eyebrow} />
              </h1>
              <h1 className={heroTitleOverPhotoClass(darkImage)}>
                <ContentSdkText field={props?.fields?.Title} />
              </h1>
              <div className="mt-8">
                <ContentSdkLink
                  field={props?.fields?.Link1}
                  prefetch={false}
                  className="btn btn-primary mr-4"
                />
                <ContentSdkLink
                  field={props?.fields?.Link2}
                  prefetch={false}
                  className="btn btn-secondary"
                />
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export const Right = (props: PageHeaderSTProps) => {
  const darkImage = isDarkImageHero(props.params);
  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className={HERO_BG_LAYER_CLASS}>
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className={HERO_BG_IMAGE_CLASS}
        />
      </div>
      <div className="relative z-20 mx-auto w-full lg:container lg:flex lg:flex-row-reverse">
        <div
          className={`flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
        >
          <div className="lg:max-w-3xl lg:ml-auto text-right">
            <h1 className={heroEyebrowOverPhotoClass(darkImage)}>
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </h1>
            <h1 className={heroTitleOverPhotoClass(darkImage)}>
              <ContentSdkText field={props?.fields?.Title} />
            </h1>
            <div className="mt-8">
              <ContentSdkLink
                field={props?.fields?.Link1}
                prefetch={false}
                className="btn btn-primary mr-4"
              />
              <ContentSdkLink
                field={props?.fields?.Link2}
                prefetch={false}
                className="btn btn-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Centered = (props: PageHeaderSTProps) => {
  const darkImage = isDarkImageHero(props.params);
  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className={HERO_BG_LAYER_CLASS}>
        <ContentSdkImage
          field={props?.fields?.Image1}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className={HERO_BG_IMAGE_CLASS}
        />
      </div>
      <div className="relative z-20 mx-auto w-full lg:container lg:flex">
        <div
          className={`lg:relative lg:left-1/6 flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
        >
          <div className="lg:max-w-3xl lg:mx-auto text-center">
            <h1 className={heroEyebrowOverPhotoClass(darkImage)}>
              <ContentSdkText field={props?.fields?.Eyebrow} />
            </h1>
            <h1 className={heroTitleOverPhotoClass(darkImage)}>
              <ContentSdkText field={props?.fields?.Title} />
            </h1>
            <div className="mt-8">
              <ContentSdkLink
                field={props?.fields?.Link1}
                prefetch={false}
                className="btn btn-primary mr-4"
              />
              <ContentSdkLink
                field={props?.fields?.Link2}
                prefetch={false}
                className="btn btn-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SplitScreen = (props: PageHeaderSTProps) => {

  return (
    <section
      className={`relative bg-primary border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className={`flex flex-col lg:flex-row ${HERO_CONTENT_BAND_CLASS}`}>
        <div className="p-8 lg:basis-full lg:self-center lg:p-14">
          <h1 className="text-xl lg:text-3xl pb-4">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </h1>
          <h1 className={HERO_TITLE_CLASS}>
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-secondary mr-4"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-secondary"
            />
          </div>
        </div>
        <div className="relative aspect-3/2 min-h-[16rem] w-full bg-muted lg:basis-full lg:aspect-auto lg:min-h-0">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            priority={true}
            fetchPriority="high"
            className={`absolute inset-0 ${HERO_BG_IMAGE_CLASS}`}
          />
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: PageHeaderSTProps) => {

  return (
    <section
      className={`relative flex flex-col bg-primary lg:flex-row lg:items-center lg:bg-transparent ${HERO_CONTENT_BAND_CLASS} ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className="container px-4 mx-auto">
        <div className="relative lg:w-1/2 px-6 py-12 bg-primary z-20">
          <h1 className="text-xl lg:text-3xl pb-4">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </h1>
          <h1 className={HERO_TITLE_CLASS}>
            <ContentSdkText field={props?.fields?.Title} />
          </h1>
          <div className="mt-8">
            <ContentSdkLink
              field={props?.fields?.Link1}
              prefetch={false}
              className="btn btn-secondary mr-4"
            />
            <ContentSdkLink
              field={props?.fields?.Link2}
              prefetch={false}
              className="btn btn-secondary"
            />
          </div>
        </div>
      </div>
      <div className="relative aspect-3/2 lg:absolute lg:aspect-auto inset-0 flex z-10 bg-muted">
        <div className="relative w-1/3">
          <ContentSdkImage
            field={props?.fields?.Image2}
            width={1920}
            height={1080}
            className={`absolute inset-0 ${HERO_BG_IMAGE_CLASS}`}
          />
        </div>
        <div className="relative w-2/3">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={1920}
            height={1080}
            className={`absolute inset-0 z-10 ${HERO_BG_IMAGE_CLASS}`}
          />
        </div>
      </div>
    </section>
  );
};

/**
 * Microbiologics-style split hero: looping video (left) and navy content panel (right).
 * Title and Eyebrow are CMS fields; focus-area cards are hardcoded for now.
 */
export const WithVideoSplit = (props: PageHeaderSTProps) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-8 border-background lg:border-16',
        props?.params?.styles
      )}
      data-class-change
      data-hero-variant="with-video-split"
    >
      <div className={cn('flex flex-col lg:flex-row', HERO_CONTENT_BAND_CLASS)}>
        <div className="relative aspect-4/3 min-h-[18rem] w-full bg-muted lg:aspect-auto lg:min-h-0 lg:w-1/2">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            preload="auto"
          >
            <source src={HERO_VIDEO_SPLIT_SRC} type="video/mp4" />
          </video>
          <HeroVideoSplitDecorativeOverlay />
        </div>

        <div className="flex w-full flex-col justify-center bg-primary px-6 py-10 text-primary-foreground lg:w-1/2 lg:px-12 lg:py-14 xl:px-16">
          <ContentSdkText
            field={props?.fields?.Title}
            tag="h1"
            className={cn(HERO_TITLE_CLASS, 'font-bold leading-tight')}
          />
          <div className="mt-4 h-1 w-14 bg-primary-foreground" aria-hidden="true" />
          <p className="mt-4 text-lg font-bold md:text-xl">
            <ContentSdkText field={props?.fields?.Eyebrow} />
          </p>

          <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {HERO_FOCUS_AREAS.map((area) => (
              <li key={area.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <div
                  className={cn(
                    'mb-4 flex h-20 w-20 shrink-0 items-center justify-center rounded-full',
                    area.iconBgClass,
                    area.iconFgClass
                  )}
                >
                  {area.icon}
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wide">{area.title}</h2>
                <p className="mt-2 text-sm leading-snug text-primary-foreground/90">{area.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
