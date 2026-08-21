import type React from 'react';
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

interface HeroBannerFields {
  Title?: Field<string>;
  Subtitle?: RichTextField;
  HeroImage?: ImageField;
  PrimaryLink?: LinkField;
  SecondaryLink?: LinkField;
}
type HeroBannerProps = ComponentProps & { fields?: HeroBannerFields };
type HeroVariant = 'default' | 'split' | 'background' | 'video' | 'minimal' | 'guidestone';

const HeroBannerEmpty = (): React.JSX.Element => (
  <div className="component hero-banner">
    <span className="is-empty-hint">HeroBanner</span>
  </div>
);

function HeroView({
  props,
  variant,
}: {
  props: HeroBannerProps;
  variant: HeroVariant;
}): React.JSX.Element {
  const { fields } = props;
  if (!fields) return <HeroBannerEmpty />;
  const isEditing = props.page?.mode?.isEditing;
  const hasImage = fields.HeroImage?.value?.src || isEditing;
  const overlay = variant === 'background' || variant === 'video' || variant === 'guidestone';
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component hero-banner relative overflow-hidden bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]',
        variant === 'guidestone' &&
          'mx-auto my-6 max-w-[1200px] rounded-[var(--brand-card-radius)]',
        variant === 'minimal' && 'bg-[var(--brand-bg)] text-[var(--brand-fg)]',
        props.params.styles
      )}
    >
      {overlay && hasImage && (
        <ContentSdkImage
          field={fields.HeroImage}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {overlay && <div className="absolute inset-0 bg-black/45" aria-hidden />}
      <div
        className={cn(
          'relative mx-auto grid min-h-[420px] max-w-[1200px] items-center gap-10 px-6 py-20',
          variant === 'split' && 'md:grid-cols-2',
          variant === 'default' && 'text-center',
          variant === 'minimal' && 'min-h-0 py-16'
        )}
      >
        <div
          className={cn(
            'space-y-5',
            variant === 'default' && 'mx-auto max-w-3xl',
            variant === 'guidestone' && 'max-w-xl'
          )}
        >
          {(fields.Title?.value || isEditing) && (
            <Text
              tag="h1"
              field={fields.Title}
              className="text-4xl font-bold leading-tight font-[var(--brand-heading-font,inherit)] md:text-6xl"
            />
          )}
          {(fields.Subtitle?.value || isEditing) && (
            <ContentSdkRichText
              field={fields.Subtitle}
              className="text-lg leading-relaxed md:text-xl"
            />
          )}
          {variant !== 'guidestone' && (
            <div className="flex flex-wrap gap-3 justify-[inherit]">
              {(fields.PrimaryLink?.value?.href || isEditing) && (
                <ContentSdkLink
                  field={fields.PrimaryLink!}
                  className="rounded-[var(--brand-button-radius)] bg-[var(--brand-accent)] px-6 py-3 font-semibold text-[var(--brand-accent-foreground)]"
                />
              )}
              {(fields.SecondaryLink?.value?.href || isEditing) && (
                <ContentSdkLink
                  field={fields.SecondaryLink!}
                  className="rounded-[var(--brand-button-radius)] border border-current px-6 py-3 font-semibold"
                />
              )}
            </div>
          )}
        </div>
        {variant === 'split' && hasImage && (
          <ContentSdkImage
            field={fields.HeroImage}
            className="h-full max-h-[480px] w-full rounded-[var(--brand-card-radius)] object-cover"
          />
        )}
      </div>
    </section>
  );
}

export const Default: React.FC<HeroBannerProps> = (props) => (
  <HeroView props={props} variant="default" />
);
export const SplitImageText: React.FC<HeroBannerProps> = (props) => (
  <HeroView props={props} variant="split" />
);
export const BackgroundImage: React.FC<HeroBannerProps> = (props) => (
  <HeroView props={props} variant="background" />
);
export const VideoBackground: React.FC<HeroBannerProps> = (props) => (
  <HeroView props={props} variant="video" />
);
export const Minimal: React.FC<HeroBannerProps> = (props) => (
  <HeroView props={props} variant="minimal" />
);
export const GuideStoneRoundedOverlay: React.FC<HeroBannerProps> = (props) => (
  <HeroView props={props} variant="guidestone" />
);
