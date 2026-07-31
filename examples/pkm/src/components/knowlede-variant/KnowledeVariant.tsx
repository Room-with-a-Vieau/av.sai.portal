'use client';

import type React from 'react';
import { RichText, useSitecore } from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

import type { KnowledeVariantProps } from './knowlede-variant.props';

/**
 * KnowledgeChunks datasource — displays the Rich Text Content field.
 */
export const Default: React.FC<KnowledeVariantProps> = (props) => {
  const { fields, params } = props;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  if (!fields) {
    return <NoDataFallback componentName="KnowledeVariant" />;
  }

  const { Content } = fields;
  const hasContent = Boolean(Content?.value?.trim());

  if (!hasContent && !isEditing) {
    return <NoDataFallback componentName="KnowledeVariant" />;
  }

  return (
    <div
      className={cn(
        'knowlede-variant prose prose-neutral max-w-none',
        'text-foreground',
        params?.styles
      )}
    >
      {(hasContent || isEditing) && (
        <RichText field={Content} className="knowlede-variant__content" />
      )}
    </div>
  );
};
