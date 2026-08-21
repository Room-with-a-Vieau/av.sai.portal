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

interface LegalFields {
  Title?: Field<string>;
  Description?: RichTextField;
  BannerImage?: ImageField;
  PrimaryLink?: LinkField;
}
type LegalProps = ComponentProps & { fields?: LegalFields };
const LegalEmpty = (): React.JSX.Element => (
  <div className="component legal-compliance-banner">
    <span className="is-empty-hint">LegalComplianceBanner</span>
  </div>
);
function LegalView({ props, image }: { props: LegalProps; image: boolean }): React.JSX.Element {
  if (!props.fields) return <LegalEmpty />;
  const isEditing = props.page?.mode?.isEditing;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component legal-compliance-banner bg-[var(--brand-muted)] px-6 py-14 text-[var(--brand-fg)]',
        props.params.styles
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-4xl text-center',
          image && 'grid items-center gap-8 text-left md:grid-cols-[180px_1fr]'
        )}
      >
        {image && (props.fields.BannerImage?.value?.src || isEditing) && (
          <ContentSdkImage
            field={props.fields.BannerImage}
            className="mx-auto h-40 w-40 object-contain"
          />
        )}
        <div>
          <Text field={props.fields.Title} tag="h2" className="text-3xl font-bold" />
          <ContentSdkRichText field={props.fields.Description} className="mt-4" />
          {props.fields.PrimaryLink && (
            <ContentSdkLink
              field={props.fields.PrimaryLink}
              className="mt-5 inline-flex font-semibold text-[var(--brand-primary)] underline"
            />
          )}
        </div>
        {!image && (props.fields.BannerImage?.value?.src || isEditing) && (
          <span className="sr-only">
            <ContentSdkImage field={props.fields.BannerImage} />
          </span>
        )}
      </div>
    </section>
  );
}
export const Default: React.FC<LegalProps> = (props) => <LegalView props={props} image={false} />;
export const WithImage: React.FC<LegalProps> = (props) => <LegalView props={props} image />;
