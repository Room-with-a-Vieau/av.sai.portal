'use client';

import type React from 'react';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  useSitecore,
  type ImageField,
  type LinkField,
  type RichTextField,
  type Field as SitecoreField,
} from '@sitecore-content-sdk/nextjs';
import { FileText } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

import type { ProductDetailFields, ProductDetailProps } from './product-detail.props';

function textValue(field?: SitecoreField<string> | null): string {
  return typeof field?.value === 'string' ? field.value.trim() : '';
}

function richHasContent(field?: RichTextField | null): boolean {
  if (!field?.value) return false;
  return field.value.replace(/<[^>]*>/g, '').trim().length > 0;
}

function imageHasSrc(field?: ImageField | null): boolean {
  return Boolean(field?.value?.src);
}

function linkHasHref(field?: LinkField | null): boolean {
  return Boolean(field?.value?.href);
}

function ProductDetailEmpty(): React.JSX.Element {
  return <NoDataFallback componentName="ProductDetail" />;
}

function RichColumn({
  title,
  field,
  isEditing,
}: {
  title: string;
  field?: RichTextField;
  isEditing: boolean;
}) {
  if (!richHasContent(field) && !isEditing) return null;

  return (
    <section>
      <h2 className="font-heading text-primary text-sm font-semibold tracking-[0.14em] uppercase">
        {title}
      </h2>
      <div className="prose prose-neutral dark:prose-invert text-foreground mt-4 max-w-none text-base leading-relaxed">
        <ContentSdkRichText field={field} />
      </div>
    </section>
  );
}

export const Default: React.FC<ProductDetailProps> = (props) => {
  const { fields: propFields, params, isPageEditing: propEditing } = props;
  const { page } = useSitecore();
  const isEditing = propEditing ?? page.mode.isEditing;

  const routeFields = (page?.layout?.sitecore?.route?.fields ?? {}) as ProductDetailFields;
  const fields: ProductDetailFields = {
    ...routeFields,
    ...(propFields ?? {}),
  };

  const titleField = fields.pageHeaderTitle?.value
    ? fields.pageHeaderTitle
    : fields.pageTitle;
  const titleText = textValue(titleField);
  const categoryLabel = textValue(fields.CategoryLabel);
  const descriptionField = richHasContent(fields.Description)
    ? fields.Description
    : fields.Detail;
  const mainImage = fields.image;
  const secondaryImage = fields.ImageSecondary;
  const specSheet = fields.SpecSheetLink;

  const hasContent =
    Boolean(titleText) ||
    Boolean(categoryLabel) ||
    richHasContent(descriptionField) ||
    richHasContent(fields.TechnicalData) ||
    richHasContent(fields.StylesAvailable) ||
    richHasContent(fields.Benefits) ||
    imageHasSrc(mainImage) ||
    linkHasHref(specSheet);

  if (!hasContent && !isEditing) {
    return <ProductDetailEmpty />;
  }

  const sectionId = params?.RenderingIdentifier || 'product-detail';

  return (
    <article
      id={sectionId}
      data-component="ProductDetail"
      className={cn('@container bg-background text-foreground', params?.styles)}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-14">
          <div className="min-w-0">
            {(categoryLabel || isEditing) && (
              <Text
                tag="p"
                field={fields.CategoryLabel}
                className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase"
              />
            )}

            {(titleText || isEditing) && (
              <Text
                tag="h1"
                field={titleField}
                className="font-heading text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              />
            )}

            {(linkHasHref(specSheet) || isEditing) && (
              <div className="mt-5">
                <ContentSdkLink
                  field={specSheet}
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
                >
                  <FileText className="size-4 shrink-0" aria-hidden />
                  <span>{specSheet?.value?.text || 'Print a Spec Sheet'}</span>
                </ContentSdkLink>
              </div>
            )}

            {(richHasContent(descriptionField) || isEditing) && (
              <div className="prose prose-neutral dark:prose-invert text-foreground mt-8 max-w-none text-base leading-relaxed sm:text-lg">
                <ContentSdkRichText field={descriptionField} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {(imageHasSrc(mainImage) || isEditing) && (
              <div className="bg-muted/30 overflow-hidden rounded-2xl border border-border">
                <ContentSdkImage
                  field={mainImage}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
            {(imageHasSrc(secondaryImage) || (isEditing && secondaryImage)) && (
              <div className="bg-muted/20 max-w-[12rem] overflow-hidden rounded-xl border border-border">
                <ContentSdkImage
                  field={secondaryImage}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-border pt-10 lg:mt-16 lg:grid-cols-2 lg:gap-14 lg:pt-14">
          <div className="space-y-10">
            <RichColumn title="Technical Data" field={fields.TechnicalData} isEditing={isEditing} />
            <RichColumn
              title="Styles Available"
              field={fields.StylesAvailable}
              isEditing={isEditing}
            />
          </div>
          <RichColumn title="Benefits" field={fields.Benefits} isEditing={isEditing} />
        </div>
      </div>
    </article>
  );
};
