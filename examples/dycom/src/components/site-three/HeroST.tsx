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
 * Background fills the hero layer edge-to-edge (`object-cover`). Uses `bg-muted` only where the
 * image crops (narrow viewports). For rare heroes that must show the full bitmap without cropping,
 * override via `params.styles` on a wrapper or switch to a variant with different image classes.
 *
 * Vertical band: mobile ~400–600px, laptop (md) ~500–600px, desktop (lg+) ~600–800px.
 * Width/height match typical Sitecore hero masters (e.g. 2560×1440) for `sizes` / srcset hints.
 */
const HERO_BG_IMAGE_CLASS = 'h-full w-full object-cover object-center';
const HERO_BG_LAYER_CLASS = 'absolute inset-0 z-10 bg-muted overflow-hidden';
const HERO_IMAGE_WIDTH = 2560;
const HERO_IMAGE_HEIGHT = 1440;

/** Responsive hero content column / split row height band */
const HERO_CONTENT_BAND_CLASS =
  'min-h-[400px] max-h-[600px] md:min-h-[500px] md:max-h-[600px] lg:min-h-[600px] lg:max-h-[800px]';

/** Main headline scale (smaller than previous display sizes for shorter hero band) */
const HERO_TITLE_CLASS = 'text-3xl md:text-4xl lg:text-5xl';

/** Eyebrow on solid primary (SplitScreen / Stacked bands) — light text on brand blue. */
const HERO_EYEBROW_ON_PRIMARY_CLASS = 'text-primary-foreground text-xl lg:text-3xl pb-4';

/** Light text over dark/busy hero imagery — uses theme token (typically white on Dycom). */
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
    darkImage ? HERO_TEXT_ON_DARK_IMAGE_CLASS : 'text-[color:var(--color-primary)]'
  );
}

function heroTitleOverPhotoClass(darkImage: boolean): string {
  return cn(HERO_TITLE_CLASS, darkImage && HERO_TEXT_ON_DARK_IMAGE_CLASS);
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
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
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
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
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
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
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
      className={`relative bg-primary text-primary-foreground border-8 lg:border-16 border-background ${props?.params?.styles || ''}`}
      data-class-change
    >
      <div className={`flex flex-col lg:flex-row ${HERO_CONTENT_BAND_CLASS}`}>
        <div className="p-8 lg:basis-full lg:self-center lg:p-14">
          <h1 className={HERO_EYEBROW_ON_PRIMARY_CLASS}>
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
        <div className="relative aspect-3/2 min-h-[16rem] w-full bg-muted lg:basis-full lg:aspect-auto lg:min-h-0 overflow-hidden">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={HERO_IMAGE_WIDTH}
            height={HERO_IMAGE_HEIGHT}
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
        <div className="relative lg:w-1/2 px-6 py-12 bg-primary text-primary-foreground z-20">
          <h1 className={HERO_EYEBROW_ON_PRIMARY_CLASS}>
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
        <div className="relative w-1/3 overflow-hidden">
          <ContentSdkImage
            field={props?.fields?.Image2}
            width={HERO_IMAGE_WIDTH}
            height={HERO_IMAGE_HEIGHT}
            className={`absolute inset-0 ${HERO_BG_IMAGE_CLASS}`}
          />
        </div>
        <div className="relative w-2/3 overflow-hidden">
          <ContentSdkImage
            field={props?.fields?.Image1}
            width={HERO_IMAGE_WIDTH}
            height={HERO_IMAGE_HEIGHT}
            className={`absolute inset-0 z-10 ${HERO_BG_IMAGE_CLASS}`}
          />
        </div>
      </div>
    </section>
  );
};
