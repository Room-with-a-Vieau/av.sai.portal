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
import { Play } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';

interface FeatureHighlightFields {
  EyebrowText?: Field<string>;
  Title?: Field<string>;
  Description?: RichTextField;
  FeatureImage?: ImageField;
  PrimaryLink?: LinkField;
}
type FeatureHighlightProps = ComponentProps & { fields?: FeatureHighlightFields };
type Variant = 'default' | 'centered' | 'video' | 'icon';
const FeatureHighlightEmpty = (): React.JSX.Element => (
  <div className="component feature-highlight">
    <span className="is-empty-hint">FeatureHighlight</span>
  </div>
);
function FeatureView({
  props,
  variant,
}: {
  props: FeatureHighlightProps;
  variant: Variant;
}): React.JSX.Element {
  if (!props.fields) return <FeatureHighlightEmpty />;
  const { fields } = props;
  const isEditing = props.page?.mode?.isEditing;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component feature-highlight bg-[var(--brand-bg)] px-6 py-16 text-[var(--brand-fg)]',
        props.params.styles
      )}
    >
      <div
        className={cn(
          'mx-auto grid max-w-[1200px] items-center gap-10 md:grid-cols-2',
          variant === 'centered' && 'max-w-3xl grid-cols-1 text-center md:grid-cols-1',
          variant === 'icon' && 'grid-cols-[auto_1fr] md:grid-cols-[auto_1fr]'
        )}
      >
        {variant === 'icon' && (fields.FeatureImage?.value?.src || isEditing) && (
          <ContentSdkImage field={fields.FeatureImage} className="h-20 w-20 object-contain" />
        )}
        <div>
          <Text
            field={fields.EyebrowText}
            tag="p"
            className="mb-3 font-semibold uppercase tracking-wider text-[var(--brand-primary)]"
          />
          <Text field={fields.Title} tag="h2" className="text-3xl font-bold md:text-4xl" />
          <ContentSdkRichText field={fields.Description} className="mt-5 text-lg" />
          {fields.PrimaryLink && (
            <ContentSdkLink
              field={fields.PrimaryLink}
              className="mt-6 inline-flex rounded-[var(--brand-button-radius)] bg-[var(--brand-primary)] px-6 py-3 font-semibold text-[var(--brand-primary-foreground)]"
            />
          )}
        </div>
        {variant !== 'icon' && (
          <div className="relative">
            {(fields.FeatureImage?.value?.src || isEditing) && (
              <ContentSdkImage
                field={fields.FeatureImage}
                className="w-full rounded-[var(--brand-card-radius)] object-cover"
              />
            )}
            {variant === 'video' && (
              <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--brand-primary)]">
                <Play aria-hidden />
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
export const Default: React.FC<FeatureHighlightProps> = (props) => (
  <FeatureView props={props} variant="default" />
);
export const Centered: React.FC<FeatureHighlightProps> = (props) => (
  <FeatureView props={props} variant="centered" />
);
export const WithVideo: React.FC<FeatureHighlightProps> = (props) => (
  <FeatureView props={props} variant="video" />
);
export const IconLeft: React.FC<FeatureHighlightProps> = (props) => (
  <FeatureView props={props} variant="icon" />
);
