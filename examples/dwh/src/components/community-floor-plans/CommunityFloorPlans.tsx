'use client';

import React from 'react';
import Image from 'next/image';
import { Link, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { EditableButton as Button } from '@/components/button-component/ButtonComponent';
import type { CommunityFloorPlansProps } from './community-floor-plans.props';

interface TransformedFloorPlan {
  link: string;
  image: string;
  name: string;
  overview: string;
}

/** Strips HTML tags from a Rich Text value to produce a clean card preview. */
function toPlainText(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const normalizeKey = (key: string): string => key.replace(/[\s_-]+/g, '').toLowerCase();

/** Resolves an image src from item fields, tolerant of casing/spacing (image1 / Image1 / Image 1). */
function findImageSrc(fields: Record<string, unknown>, candidates: string[]): string {
  const wanted = new Set(candidates.map(normalizeKey));
  for (const [key, value] of Object.entries(fields)) {
    if (wanted.has(normalizeKey(key)) && value && typeof value === 'object') {
      const src = (value as { value?: { src?: string } }).value?.src;
      if (src) return src;
    }
  }
  return '';
}

export const Default: React.FC<CommunityFloorPlansProps> = ({
  fields,
  params,
  isPageEditing: propIsEditing,
  page,
}) => {
  const { titleOptional, descriptionOptional, linkOptional, FloorPlans = [] } = fields || {};
  const contextIsEditing = page.mode.isEditing;

  const isPageEditing = propIsEditing !== undefined ? propIsEditing : contextIsEditing;

  const plans: TransformedFloorPlan[] = React.useMemo(() => {
    if (!FloorPlans?.length) return [];

    return FloorPlans.map((plan) => ({
      link: plan.url || '',
      image: findImageSrc(plan.fields as unknown as Record<string, unknown>, [
        'image1',
        'Image1',
        'Image 1',
      ]),
      name: plan.fields['Plan Name']?.value || '',
      overview: toPlainText(plan.fields.Overview?.value),
    }));
  }, [FloorPlans]);

  const sectionId = 'community-floor-plans-section';

  return (
    <section
      data-component="CommunityFloorPlans"
      className="@container"
      {...(titleOptional?.value && { 'aria-labelledby': sectionId })}
    >
      <div className={cn('w-full', params?.styles)}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {(titleOptional || linkOptional?.value?.href || isPageEditing) && (
            <div className="@md:flex-row @md:justify-between @md:items-center mb-12 flex flex-col">
              {titleOptional && (
                <div className="@md:mb-0 mb-4">
                  <Text
                    tag="h2"
                    id={sectionId}
                    field={titleOptional}
                    className="font-heading @md:text-5xl text-primary text-4xl font-normal leading-[1.20] tracking-tighter"
                  />

                  {descriptionOptional && (
                    <Text
                      tag="p"
                      field={descriptionOptional}
                      className="text-muted-foreground font-body mt-[20px] max-w-3xl text-lg font-normal leading-relaxed"
                    />
                  )}
                </div>
              )}

              {(linkOptional?.value?.href || isPageEditing) && (
                <div>
                  <Button
                    buttonLink={
                      linkOptional || {
                        value: {
                          href: '',
                          text: 'Add link',
                          linktype: 'external',
                          url: '',
                          anchor: '',
                          target: '',
                        },
                      }
                    }
                    isPageEditing={isPageEditing}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  />
                </div>
              )}
            </div>
          )}

          <div className="@sm:grid-cols-2 @lg:grid-cols-3 grid gap-8">
            {plans.map((plan, index) => (
              <article
                key={index}
                className="border-border bg-card group/plan flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
              >
                {isPageEditing ? (
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image src={plan.image} alt={plan.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div
                    className="relative aspect-[3/2] w-full cursor-pointer overflow-hidden"
                    onClick={() => (window.location.href = plan.link)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && (window.location.href = plan.link)}
                  >
                    <Image
                      src={plan.image}
                      alt={plan.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover/plan:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  {isPageEditing ? (
                    <h3 className="font-heading text-card-foreground text-xl font-medium leading-snug tracking-tight">
                      {plan.name}
                    </h3>
                  ) : (
                    <Link field={{ value: { href: plan.link } }} className="block">
                      <h3 className="font-heading text-card-foreground text-xl font-medium leading-snug tracking-tight decoration-1 underline-offset-4 group-hover/plan:underline group-focus/plan:underline">
                        {plan.name}
                      </h3>
                    </Link>
                  )}
                  <p className="text-secondary-foreground mt-3 line-clamp-3 text-base leading-[1.5] tracking-tight">
                    {plan.overview}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
