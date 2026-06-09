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
import { HeroSearchBar } from '@/components/site-three/HeroSearchBar';

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

/** Light text over dark hero imagery — explicit white so DWH / Sitecore field spans stay readable. */
const HERO_TEXT_ON_DARK_IMAGE_CLASS = 'text-white [&_*]:text-inherit';

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const HERO_DARK_IMAGE_PARAM_KEY = 'darkimage';

/** Normalize Sitecore param keys (spaces, underscores, encoded spaces). */
function normalizeHeroParamKey(key: string): string {
  return key.replace(/_x0020_/gi, ' ').replace(/[\s_-]/g, '').toLowerCase();
}

/** Sitecore checkbox rendering parameters often arrive as 1 / true / yes / on (strings or booleans). */
function isCheckboxParamEnabled(value: unknown): boolean {
  if (value == null) return false;
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (!v || v === '0' || v === 'false' || v === 'no' || v === 'off') return false;
    return v === '1' || v === 'true' || v === 'yes' || v === 'on' || v === 'checked';
  }
  return false;
}

/** Sitecore Styles parameter may add a `dark-image` (or similar) utility class to params.styles. */
function stylesIncludeDarkImage(styles: string | undefined): boolean {
  if (!styles?.trim()) return false;
  const normalized = styles.toLowerCase().replace(/[\s_-]/g, '');
  return normalized.includes(HERO_DARK_IMAGE_PARAM_KEY);
}

/**
 * Rendering parameter "Dark Image" (checkbox) or Styles class. Matches keys regardless of
 * spacing/casing (e.g. DarkImage, Dark Image, Dark_x0020_Image).
 */
function isDarkImageHero(params: PageHeaderSTProps['params'] | undefined): boolean {
  if (!params) return false;

  if (stylesIncludeDarkImage(params.styles)) {
    return true;
  }

  for (const [key, value] of Object.entries(params)) {
    if (normalizeHeroParamKey(key) === HERO_DARK_IMAGE_PARAM_KEY && isCheckboxParamEnabled(value)) {
      return true;
    }
  }

  return false;
}

function heroSectionClassName(darkImage: boolean, styles?: string): string {
  return cn(
    'relative flex items-center border-8 lg:border-16 border-background',
    darkImage && 'hero-st-dark-image',
    styles
  );
}

const HERO_DARK_IMAGE_CONTENT_STYLE = { color: '#ffffff' } as const;

function heroEyebrowOverPhotoClass(darkImage: boolean): string {
  return cn(
    'text-xl lg:text-3xl pb-4',
    darkImage ? HERO_TEXT_ON_DARK_IMAGE_CLASS : 'text-primary'
  );
}

function heroTitleOverPhotoClass(darkImage: boolean): string {
  return cn(HERO_TITLE_CLASS, darkImage && HERO_TEXT_ON_DARK_IMAGE_CLASS);
}

function heroFieldTextClass(darkImage: boolean): string | undefined {
  return darkImage ? 'text-inherit !text-white' : undefined;
}

export const Default = (props: PageHeaderSTProps) => {
  const darkImage = isDarkImageHero(props.params);
  return (
    <section
      className={heroSectionClassName(darkImage, props?.params?.styles)}
      data-class-change
      {...(darkImage ? { 'data-hero-dark-image': '' } : {})}
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
            <div
              className="lg:max-w-3xl"
              style={darkImage ? HERO_DARK_IMAGE_CONTENT_STYLE : undefined}
            >
              <h1 className={heroEyebrowOverPhotoClass(darkImage)}>
                <ContentSdkText
                  field={props?.fields?.Eyebrow}
                  className={heroFieldTextClass(darkImage)}
                />
              </h1>
              <h1 className={heroTitleOverPhotoClass(darkImage)}>
                <ContentSdkText
                  field={props?.fields?.Title}
                  className={heroFieldTextClass(darkImage)}
                />
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
      className={heroSectionClassName(darkImage, props?.params?.styles)}
      data-class-change
      {...(darkImage ? { 'data-hero-dark-image': '' } : {})}
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
          <div
            className="lg:max-w-3xl lg:ml-auto text-right"
            style={darkImage ? HERO_DARK_IMAGE_CONTENT_STYLE : undefined}
          >
            <h1 className={heroEyebrowOverPhotoClass(darkImage)}>
              <ContentSdkText
                field={props?.fields?.Eyebrow}
                className={heroFieldTextClass(darkImage)}
              />
            </h1>
            <h1 className={heroTitleOverPhotoClass(darkImage)}>
              <ContentSdkText
                field={props?.fields?.Title}
                className={heroFieldTextClass(darkImage)}
              />
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
      className={heroSectionClassName(darkImage, props?.params?.styles)}
      data-class-change
      {...(darkImage ? { 'data-hero-dark-image': '' } : {})}
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
          <div
            className="lg:max-w-3xl lg:mx-auto text-center"
            style={darkImage ? HERO_DARK_IMAGE_CONTENT_STYLE : undefined}
          >
            <h1 className={heroEyebrowOverPhotoClass(darkImage)}>
              <ContentSdkText
                field={props?.fields?.Eyebrow}
                className={heroFieldTextClass(darkImage)}
              />
            </h1>
            <h1 className={heroTitleOverPhotoClass(darkImage)}>
              <ContentSdkText
                field={props?.fields?.Title}
                className={heroFieldTextClass(darkImage)}
              />
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

/** Hero with market search bar overlaid at the bottom (davidweekleyhomes.com homepage pattern). */
export const withSearch = (props: PageHeaderSTProps) => {
  const searchBaseHref = props?.fields?.Link1?.value?.href;

  return (
    <section
      className={cn(
        'relative flex min-h-[600px] items-end border-8 border-background lg:border-16',
        props?.params?.styles
      )}
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

      <div className="relative z-20 mx-auto w-full px-4 pb-6 md:px-6 md:pb-8 lg:container lg:pb-10">
        <HeroSearchBar searchBaseHref={searchBaseHref} className="mx-auto max-w-6xl" />
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
