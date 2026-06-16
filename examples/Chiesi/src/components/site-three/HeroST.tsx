'use client';

import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  ImageField,
  Field,
  LinkField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';

interface Fields {
  Eyebrow: Field<string>;
  Title: Field<string>;
  Callout?: Field<string>;
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

/**
 * Chiesi hero accents — white top-left wedge + primary (magenta) bottom-right wedge.
 * Decorative only (no carousel controls on HeroST).
 */
function HeroChiesiCornerAccents() {
  return (
    <>
      <div
        className="herost-corner-accent herost-corner-accent-tl pointer-events-none absolute left-0 top-0 z-[15] h-16 w-16 bg-background sm:h-20 sm:w-20 lg:h-24 lg:w-24"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        aria-hidden="true"
      />
      <div
        className="herost-corner-accent herost-corner-accent-br pointer-events-none absolute bottom-0 right-0 z-[15] h-[42%] w-[48%] min-h-[8rem] min-w-[9rem] max-h-[16rem] max-w-[22rem] bg-primary sm:h-[40%] sm:w-[44%] md:max-h-[18rem] md:max-w-[20rem] lg:h-[38%] lg:w-[40%]"
        style={{ clipPath: 'polygon(72% 100%, 100% 100%, 100% 62%)' }}
        aria-hidden="true"
      />
    </>
  );
}

const HERO_PHOTO_SECTION_CLASS = 'relative flex items-center overflow-hidden border-8 lg:border-16 border-background';

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

const CALLOUT_FIELD_KEYS = ['Callout', 'callout'] as const;
const TITLE_FIELD_KEYS = ['Title', 'title'] as const;

function hasLayoutData(
  fields: unknown
): fields is { data: { datasource?: Record<string, unknown> } } {
  if (typeof fields !== 'object' || fields === null || !('data' in fields)) return false;
  const data = (fields as { data: unknown }).data;
  return typeof data === 'object' && data !== null;
}

function unwrapTextField(cell: unknown): Field<string> | undefined {
  if (cell == null) return undefined;
  if (typeof cell === 'object' && 'jsonValue' in cell && cell.jsonValue !== undefined) {
    return cell.jsonValue as Field<string>;
  }
  if (typeof cell === 'object' && 'value' in cell) {
    return cell as Field<string>;
  }
  return undefined;
}

function pickTextField(
  keys: readonly string[],
  ...bags: Array<Record<string, unknown> | undefined>
): Field<string> | undefined {
  for (const bag of bags) {
    if (!bag) continue;
    for (const key of keys) {
      const field = unwrapTextField(bag[key]);
      if (field !== undefined) {
        return field;
      }
    }
  }
  return undefined;
}

function hasTextFieldValue(field?: Field<string>): boolean {
  return String(field?.value ?? '').trim().length > 0;
}

/** Layout service and GraphQL may use different casings or nest fields under data.datasource. */
function resolveHeroSTFields(rawFields: PageHeaderSTProps['fields'] | undefined): Fields {
  if (!rawFields) {
    return {} as Fields;
  }

  const flat = { ...(rawFields as Record<string, unknown>) };
  delete flat.data;
  const datasource = hasLayoutData(rawFields)
    ? ((rawFields.data.datasource ?? {}) as Record<string, unknown>)
    : {};

  const resolved = { ...rawFields } as Fields;
  const title = pickTextField(TITLE_FIELD_KEYS, flat, datasource);
  const callout = pickTextField(CALLOUT_FIELD_KEYS, flat, datasource);

  if (title !== undefined) {
    resolved.Title = title;
  }
  if (callout !== undefined) {
    resolved.Callout = callout;
  }

  return resolved;
}

function heroTitleOverPhotoClass(darkImage: boolean): string {
  return cn(
    HERO_TITLE_CLASS,
    darkImage ? HERO_TEXT_ON_DARK_IMAGE_CLASS : 'text-primary'
  );
}

function splitTitleForAccent(text: string): { lead: string; accent: string } | null {
  const trimmed = text.trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace <= 0) return null;
  return {
    lead: trimmed.slice(0, lastSpace),
    accent: trimmed.slice(lastSpace + 1),
  };
}

type HeroStylizedTitleProps = {
  field?: Field<string>;
  darkImage: boolean;
  className?: string;
};

/** Chiesi-style title: light sans-serif lead + script accent on the last word. */
function HeroStylizedTitle({ field, darkImage, className }: HeroStylizedTitleProps) {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const titleClass = cn('herost-stylized-title leading-none', heroTitleOverPhotoClass(darkImage), className);
  const parts = field?.value ? splitTitleForAccent(String(field.value)) : null;

  if (isEditing || !parts) {
    return (field?.value || isEditing) ? (
      <ContentSdkText field={field} tag="h1" className={titleClass} />
    ) : null;
  }

  return (
    <h1 className={titleClass}>
      <span className="herost-title-lead text-3xl font-light md:text-4xl lg:text-5xl">{parts.lead} </span>
      <span className="herost-title-accent text-5xl font-semibold md:text-6xl lg:text-7xl">{parts.accent}</span>
    </h1>
  );
}

type HeroCalloutProps = {
  field?: Field<string>;
  darkImage: boolean;
  className?: string;
};

function HeroCallout({ field, darkImage, className }: HeroCalloutProps) {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  if (!hasTextFieldValue(field) && !isEditing) return null;

  return (
    <p
      className={cn(
        'herost-callout mt-4 max-w-xl text-base leading-relaxed md:text-lg',
        darkImage ? 'text-primary-foreground' : 'text-black',
        className
      )}
    >
      <ContentSdkText field={field} tag="span" className="whitespace-pre-line" />
    </p>
  );
}

type HeroPhotoCopyBlockProps = {
  fields: Fields;
  darkImage: boolean;
  align?: 'left' | 'right' | 'center';
};

function HeroPhotoCopyBlock({ fields, darkImage, align = 'left' }: HeroPhotoCopyBlockProps) {
  const alignClass =
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={cn('lg:max-w-3xl', align === 'right' && 'lg:ml-auto', alignClass)}>
      <HeroStylizedTitle field={fields?.Title} darkImage={darkImage} />
      <HeroCallout
        field={fields?.Callout}
        darkImage={darkImage}
        className={align === 'center' ? 'mx-auto' : undefined}
      />
      <div
        className={cn(
          'mt-8',
          align === 'center' && 'flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-0'
        )}
      >
        <ContentSdkLink
          field={fields?.Link1}
          prefetch={false}
          className={cn('btn btn-primary', align !== 'center' && 'mr-4')}
        />
        <ContentSdkLink field={fields?.Link2} prefetch={false} className="btn btn-secondary" />
      </div>
    </div>
  );
}

export const Default = (props: PageHeaderSTProps) => {
  const darkImage = isDarkImageHero(props.params);
  const fields = resolveHeroSTFields(props.fields);
  return (
    <section
      className={`${HERO_PHOTO_SECTION_CLASS} ${props?.params?.styles || ''}`}
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
      <HeroChiesiCornerAccents />
      <div className="relative z-20 mx-auto w-full lg:container lg:flex">
        <div
          className={`flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
        >
          <HeroPhotoCopyBlock fields={fields} darkImage={darkImage} />
        </div>
      </div>
    </section>
  );
};

export const Right = (props: PageHeaderSTProps) => {
  const darkImage = isDarkImageHero(props.params);
  const fields = resolveHeroSTFields(props.fields);
  return (
    <section
      className={`${HERO_PHOTO_SECTION_CLASS} ${props?.params?.styles || ''}`}
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
      <HeroChiesiCornerAccents />
      <div className="relative z-20 mx-auto w-full lg:container lg:flex lg:flex-row-reverse">
        <div
          className={`flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
        >
          <HeroPhotoCopyBlock fields={fields} darkImage={darkImage} align="right" />
        </div>
      </div>
    </section>
  );
};

export const Centered = (props: PageHeaderSTProps) => {
  const darkImage = isDarkImageHero(props.params);
  const fields = resolveHeroSTFields(props.fields);
  return (
    <section
      className={`${HERO_PHOTO_SECTION_CLASS} ${props?.params?.styles || ''}`}
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
      <HeroChiesiCornerAccents />
      <div className="relative z-20 mx-auto w-full lg:container lg:flex">
        <div
          className={`lg:relative lg:left-1/6 flex flex-col justify-center px-4 py-8 lg:w-2/3 lg:p-8 ${HERO_CONTENT_BAND_CLASS}`}
        >
          <div className="lg:max-w-3xl lg:mx-auto">
            <HeroPhotoCopyBlock fields={fields} darkImage={darkImage} align="center" />
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
