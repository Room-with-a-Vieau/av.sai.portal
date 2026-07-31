'use client';

import type React from 'react';
import { Link, RichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

import { TopicIconChip } from '@/components/taxonomy/TopicIconChip';
import { resolveTopicList } from '@/lib/taxonomy-topic';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

import type { KnowledeVariantProps } from './knowlede-variant.props';

function resolveSourceDocument(fields: KnowledeVariantProps['fields']): LinkField | undefined {
  if (!fields) return undefined;
  return fields.sourceDocument ?? fields.SourceDocument ?? fields['Source Document'];
}

function hasLink(field?: LinkField): boolean {
  return Boolean(field?.value?.href?.trim() || field?.value?.id);
}

/**
 * KnowledgeChunks datasource — Source Document link + LOB/Peril chips above Content.
 */
export const Default: React.FC<KnowledeVariantProps> = (props) => {
  const { fields, params } = props;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  if (!fields) {
    return <NoDataFallback componentName="KnowledeVariant" />;
  }

  const { Content } = fields;
  const sourceDocument = resolveSourceDocument(fields);
  const lob = resolveTopicList(fields as Record<string, unknown>, [
    'SourceDocumentLOB',
    'sourceDocumentLOB',
  ]);
  const perils = resolveTopicList(fields as Record<string, unknown>, [
    'SourceDocumentPerils',
    'sourceDocumentPerils',
  ]);

  const hasContent = Boolean(Content?.value?.trim());
  const hasSource = hasLink(sourceDocument);
  const hasTopics = lob.length > 0 || perils.length > 0;

  if (!hasContent && !hasSource && !isEditing) {
    return <NoDataFallback componentName="KnowledeVariant" />;
  }

  return (
    <div
      className={cn(
        'knowlede-variant @container text-foreground flex flex-col gap-3',
        params?.styles
      )}
      data-component="KnowledeVariant"
    >
      {(hasSource || hasTopics || isEditing) && (
        <div className="flex flex-col gap-2">
          {(hasSource || isEditing) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Source
              </span>
              <Link
                field={sourceDocument}
                className="text-primary text-sm font-medium underline-offset-4 hover:underline"
              />
            </div>
          )}
          {hasTopics && (
            <div className="flex flex-wrap gap-1.5" aria-label="Source document topics">
              {lob.map((topic) => (
                <TopicIconChip key={topic.id || topic.name} topic={topic} size="sm" />
              ))}
              {perils.map((topic) => (
                <TopicIconChip key={topic.id || topic.name} topic={topic} size="sm" />
              ))}
            </div>
          )}
          {isEditing && !hasTopics && (
            <p className="text-muted-foreground text-xs">
              Select Source Document LOB and Perils to show topic chips.
            </p>
          )}
        </div>
      )}

      {(hasContent || isEditing) && (
        <RichText
          field={Content}
          className="knowlede-variant__content prose prose-neutral max-w-none"
        />
      )}
    </div>
  );
};
