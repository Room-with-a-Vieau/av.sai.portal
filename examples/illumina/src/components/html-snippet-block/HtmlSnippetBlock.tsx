'use client';

import type React from 'react';
import { RichText, useSitecore } from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';

import type { HtmlSnippetBlockProps } from './html-snippet-block.props';

/**
 * Renders a rich HTML `body` field (e.g. mock snippets from `/mock-snippets/`).
 * Prefer this rendering for Sitecore-authored HTML snippets; `PortalPageDetail` is retained for compatibility.
 */
export const Default: React.FC<HtmlSnippetBlockProps> = (props) => {
  const { fields, params } = props;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const body = fields?.body;
  const hasBody = Boolean(body?.value?.trim());

  if (!hasBody && !isEditing) {
    return null;
  }

  return (
    <article
      className={cn(
        'html-snippet-block mx-auto w-full min-w-0 max-w-[100rem] px-4 py-8 md:px-6 md:py-10',
        params?.styles,
      )}
      data-component="html-snippet-block"
    >
      <div
        className={cn(
          'html-snippet-block__body text-foreground not-prose mx-auto w-full min-w-0 max-w-full',
        )}
      >
        <RichText field={body} />
      </div>
    </article>
  );
};
