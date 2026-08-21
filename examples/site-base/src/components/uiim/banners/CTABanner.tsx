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

interface CTABannerFields {
  Title?: Field<string>;
  Description?: RichTextField;
  PrimaryLink?: LinkField;
  SecondaryLink?: LinkField;
  BackgroundImage?: ImageField;
}
type CTABannerProps = ComponentProps & { fields?: CTABannerFields };
type Variant = 'default' | 'image' | 'split' | 'minimal';
const CTABannerEmpty = (): React.JSX.Element => (
  <div className="component cta-banner">
    <span className="is-empty-hint">CTABanner</span>
  </div>
);

function CTAView({
  props,
  variant,
}: {
  props: CTABannerProps;
  variant: Variant;
}): React.JSX.Element {
  if (!props.fields) return <CTABannerEmpty />;
  const { fields, page, params } = props;
  const isEditing = page?.mode?.isEditing;
  return (
    <section
      id={params.RenderingIdentifier}
      className={cn(
        'component cta-banner relative overflow-hidden bg-[var(--brand-primary)] px-6 py-16 text-[var(--brand-primary-foreground)]',
        variant === 'minimal' && 'bg-[var(--brand-muted)] text-[var(--brand-fg)]',
        params.styles
      )}
    >
      {variant === 'image' && (fields.BackgroundImage?.value?.src || isEditing) && (
        <ContentSdkImage
          field={fields.BackgroundImage}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {variant === 'image' && <div className="absolute inset-0 bg-black/55" />}
      <div
        className={cn(
          'relative mx-auto max-w-[1200px]',
          variant === 'split'
            ? 'grid items-center gap-8 md:grid-cols-[1fr_auto]'
            : 'max-w-3xl text-center'
        )}
      >
        <div>
          <Text
            tag="h2"
            field={fields.Title}
            className="text-3xl font-bold font-[var(--brand-heading-font,inherit)] md:text-4xl"
          />
          <ContentSdkRichText field={fields.Description} className="mt-4 text-lg" />
        </div>
        <div
          className={cn(
            'mt-6 flex flex-wrap justify-center gap-3',
            variant === 'split' && 'md:mt-0'
          )}
        >
          {(fields.PrimaryLink?.value?.href || isEditing) && (
            <ContentSdkLink
              field={fields.PrimaryLink!}
              className={cn(
                'font-semibold',
                variant === 'minimal'
                  ? 'text-[var(--brand-primary)] underline'
                  : 'rounded-[var(--brand-button-radius)] bg-[var(--brand-accent)] px-6 py-3 text-[var(--brand-accent-foreground)]'
              )}
            />
          )}
          {(fields.SecondaryLink?.value?.href || isEditing) && (
            <ContentSdkLink
              field={fields.SecondaryLink!}
              className="rounded-[var(--brand-button-radius)] border border-current px-6 py-3 font-semibold"
            />
          )}
        </div>
        {(fields.BackgroundImage?.value?.src || isEditing) && variant !== 'image' && (
          <span className="sr-only">
            <ContentSdkImage field={fields.BackgroundImage} />
          </span>
        )}
      </div>
    </section>
  );
}
export const Default: React.FC<CTABannerProps> = (props) => (
  <CTAView props={props} variant="default" />
);
export const WithImage: React.FC<CTABannerProps> = (props) => (
  <CTAView props={props} variant="image" />
);
export const Split: React.FC<CTABannerProps> = (props) => <CTAView props={props} variant="split" />;
export const Minimal: React.FC<CTABannerProps> = (props) => (
  <CTAView props={props} variant="minimal" />
);
