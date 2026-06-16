'use client';

import type React from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';

import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { cn } from '@/lib/utils';
import { normalizeImageFieldSrc, unwrapImageField } from '@/lib/sitecore-image-field';
import { NoDataFallback } from '@/utils/NoDataFallback';

import { resolveArticleHeaderFields } from './article-header.fields';
import type { ArticleHeaderProps } from './article-header.props';

const TEAL = '#00788A';
const CARD_BG = '#1c2536';

export const ArticleHeaderCard: React.FC<ArticleHeaderProps> = ({ fields, externalFields, page }) => {
  const { imageRequired, cta, summary } = resolveArticleHeaderFields(fields);
  const heroImage = normalizeImageFieldSrc(unwrapImageField(imageRequired));
  const { pageHeaderTitle } = externalFields || {};
  const isPageEditing = page.mode.isEditing;
  const titleText = pageHeaderTitle?.value || 'Article header image';

  if (!fields) {
    return <NoDataFallback componentName="ArticleHeader" />;
  }

  return (
    <header className={cn('@container article-header article-header-card relative w-full')} data-variant="card">
      <div className="relative min-h-[280px] w-full overflow-hidden @md:min-h-[360px] @lg:min-h-[420px]">
        <ImageWrapper
          image={heroImage}
          alt={titleText}
          className="h-full w-full object-cover"
          wrapperClass="relative h-full min-h-[280px] w-full @md:min-h-[360px] @lg:min-h-[420px]"
          width={1920}
          height={720}
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
          aria-hidden
        />
        {(pageHeaderTitle?.value || isPageEditing) && (
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-8 pt-16 @md:px-10 @md:pb-10 @lg:px-12 @lg:pb-12">
            <Text
              tag="h1"
              field={pageHeaderTitle}
              className="font-heading max-w-4xl text-pretty text-3xl font-bold leading-tight tracking-tight text-white @md:text-4xl @lg:text-5xl"
            />
          </div>
        )}
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
