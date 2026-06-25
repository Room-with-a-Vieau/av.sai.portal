'use client';

import React from 'react';
import Image from 'next/image';
import { Link, Text } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import { Bath, BedDouble, Building2, Car, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableButton as Button } from '@/components/button-component/ButtonComponent';
import type {
  CommunityFloorPlansFields,
  CommunityFloorPlansProps,
  FloorPlanItem,
} from './community-floor-plans.props';

interface TransformedFloorPlan {
  link: string;
  image: string;
  name: string;
  overview: string;
  price: string;
  stats: { id: string; label: string; value: string }[];
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

/** Icons keyed by stat id, used to visually represent each floor-plan metric. */
const STAT_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  stores: Building2,
  bedrooms: BedDouble,
  'full-baths': Bath,
  'car-garage': Car,
  'sq-footage': Ruler,
};

/** Reads a Sitecore number/text field value as a display string. */
function fieldValue(field?: Field<string> | Field<number>): string {
  const value = field?.value;
  if (value === undefined || value === null) return '';
  return String(value);
}

/** Formats a raw price string (e.g. "527990") into currency (e.g. "$527,990"). */
function formatPrice(value?: string): string {
  if (!value?.trim()) return '';
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return value.trim();
  return `$${Number(digits).toLocaleString('en-US')}`;
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

/**
 * Merges datasource fields (from `props.fields`) with the page item's route fields,
 * so the component can use the page item itself as its data source (no datasource required).
 * Datasource values take precedence when both are present.
 */
function mergeFields(
  componentFields?: CommunityFloorPlansFields,
  routeFields?: Record<string, unknown>,
): CommunityFloorPlansFields {
  return {
    ...(routeFields as CommunityFloorPlansFields),
    ...(componentFields ?? {}),
  };
}

export const Default: React.FC<CommunityFloorPlansProps> = ({
  fields,
  params,
  isPageEditing: propIsEditing,
  page,
}) => {
  const routeFields = page.layout?.sitecore?.route?.fields as Record<string, unknown> | undefined;
  const mergedFields = mergeFields(fields, routeFields);
  const { titleOptional, descriptionOptional, linkOptional, FloorPlans = [] } = mergedFields;
  const contextIsEditing = page.mode.isEditing;

  const isPageEditing = propIsEditing !== undefined ? propIsEditing : contextIsEditing;

  const plans: TransformedFloorPlan[] = React.useMemo(() => {
    if (!FloorPlans?.length) return [];

    return FloorPlans.map((plan) => {
      const planFields = plan.fields as FloorPlanItem;
      const stats = [
        { id: 'stores', label: 'Stories', value: fieldValue(planFields.Stores) },
        { id: 'bedrooms', label: 'Bedrooms', value: fieldValue(planFields.Bedrooms) },
        { id: 'full-baths', label: 'Full Baths', value: fieldValue(planFields['Full Baths']) },
        { id: 'car-garage', label: 'Car Garage', value: fieldValue(planFields['Car Garage']) },
        { id: 'sq-footage', label: 'Sq Ft', value: fieldValue(planFields['sq footage']) },
      ].filter((stat) => stat.value);

      return {
        link: plan.url || '',
        image: findImageSrc(plan.fields as unknown as Record<string, unknown>, [
          'image1',
          'Image1',
          'Image 1',
        ]),
        name: planFields['Plan Name']?.value || '',
        overview: toPlainText(planFields.Overview?.value),
        price: formatPrice(planFields.price?.value),
        stats,
      };
    });
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
                  {plan.price && (
                    <p className="text-card-foreground mt-2 text-lg font-medium">{plan.price}</p>
                  )}

                  <p className="text-secondary-foreground mt-3 line-clamp-3 text-base leading-[1.5] tracking-tight">
                    {plan.overview}
                  </p>

                  {plan.stats.length > 0 && (
                    <dl className="border-border mt-4 flex flex-wrap gap-x-5 gap-y-3 border-t pt-4">
                      {plan.stats.map((stat) => {
                        const Icon = STAT_ICONS[stat.id];
                        return (
                          <div key={stat.id} className="flex items-center gap-2" title={stat.label}>
                            {Icon && (
                              <Icon
                                className="text-muted-foreground h-5 w-5 shrink-0"
                                strokeWidth={1.5}
                              />
                            )}
                            <div className="leading-tight">
                              <dd className="text-card-foreground text-sm font-medium">
                                {stat.value}
                              </dd>
                              <dt className="text-muted-foreground text-xs">{stat.label}</dt>
                            </div>
                          </div>
                        );
                      })}
                    </dl>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
