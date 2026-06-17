'use client';

import type React from 'react';
import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';

import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { JsonWrappedImageField } from '@/lib/sitecore-image-field';
import { normalizeImageFieldSrc, unwrapImageField } from '@/lib/sitecore-image-field';
import { NoDataFallback } from '@/utils/NoDataFallback';

import type { ArticleHeaderProps } from './article-header.props';

const TEAL = '#00788A';
const CARD_BG = '#1c2536';

export type ArticleHeaderCardResolvedFields = {
  imageRequired?: ImageField | JsonWrappedImageField;
  eyebrowOptional?: Field<string>;
  cta?: Field<string>;
  summary?: Field<string>;
  pageHeaderTitle?: Field<string>;
};

export type ArticleHeaderCardProps = ArticleHeaderProps & {
  isPageEditing: boolean;
  cardFields: ArticleHeaderCardResolvedFields;
};

export const ArticleHeaderCard: React.FC<ArticleHeaderCardProps> = ({
  fields,
  isPageEditing,
  cardFields,
}) => {
  const { imageRequired, eyebrowOptional, cta, summary, pageHeaderTitle } = cardFields;
  const heroImage = normalizeImageFieldSrc(unwrapImageField(imageRequired));
  const titleText = pageHeaderTitle?.value || 'Article header image';

  if (!fields) {
    return <NoDataFallback componentName="ArticleHeader" />;
  }

  return (
    <header
      className={cn('@container article-header-card relative mb-0 w-full overflow-hidden')}
      data-variant="card"
      style={{ backgroundColor: CARD_BG }}
    >
      <div className="relative h-[320px] w-full @md:h-[400px] @lg:h-[480px]">
        <ImageWrapper
          image={heroImage}
          alt={titleText}
          fill
          className="object-cover object-center"
          wrapperClass="absolute inset-0 h-full w-full"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-6 pb-8 pt-12 @md:px-10 @md:pb-10 @lg:px-12 @lg:pb-12">
          {(eyebrowOptional?.value || isPageEditing) && eyebrowOptional ? (
            <Badge className="mb-4 inline-block bg-[#00788A] text-xs font-medium uppercase tracking-wide text-white hover:bg-[#00788A]">
              <Text field={eyebrowOptional} />
            </Badge>
          ) : null}
          {(pageHeaderTitle?.value || isPageEditing) && pageHeaderTitle ? (
            <Text
              tag="h1"
              field={pageHeaderTitle}
              className="font-heading max-w-4xl text-pretty text-3xl font-bold leading-tight tracking-tight text-white @md:text-4xl @lg:text-5xl"
            />
          ) : null}
        </div>
      </div>

      <div className="w-full text-white" style={{ backgroundColor: CARD_BG }}>
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 @md:grid-cols-12 @md:gap-10 @md:px-10 @md:py-14 @lg:px-12 @lg:py-16">
          <div className="@md:col-span-4 @lg:col-span-3">
            <div className="mb-6 h-1 w-12 rounded-full" style={{ backgroundColor: TEAL }} aria-hidden />
            {(cta?.value || isPageEditing) && cta ? (
              <Text
                tag="p"
                field={cta}
                className="text-sm font-bold uppercase leading-snug tracking-[0.12em] text-white @md:text-base"
              />
            ) : null}
          </div>
          <div className="@md:col-span-8 @lg:col-span-9">
            {(summary?.value || isPageEditing) && summary ? (
              <Text
                tag="p"
                field={summary}
                className="text-base leading-relaxed text-white/90 @md:text-lg @md:leading-relaxed"
              />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
