'use client';

import React from 'react';
import Image from 'next/image';
import { Link, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { EditableButton as Button } from '@/components/button-component/ButtonComponent';
import type { FeaturedCommunitiesProps } from './featured-communities.props';

interface TransformedCommunity {
  link: string;
  image: string;
  name: string;
  overview: string;
}

/** Strips HTML tags from a Rich Text value to produce a clean listing preview. */
function toPlainText(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export const Default: React.FC<FeaturedCommunitiesProps> = ({
  fields,
  params,
  isPageEditing: propIsEditing,
  page,
}) => {
  const { titleOptional, descriptionOptional, linkOptional, featuredContent = [] } = fields || {};
  const contextIsEditing = page.mode.isEditing;

  const isPageEditing = propIsEditing !== undefined ? propIsEditing : contextIsEditing;

  const communities: TransformedCommunity[] = React.useMemo(() => {
    if (!featuredContent?.length) return [];

    return featuredContent.map((community) => ({
      link: community.url || '',
      image: community.fields.Image1?.value?.src || '',
      name: community.fields.Name?.value || '',
      overview: toPlainText(community.fields.Overview?.value),
    }));
  }, [featuredContent]);

  const featuredCommunities = communities.slice(0, 2);
  const regularCommunities = communities.slice(2);

  const sectionId = 'featured-communities-section';

  return (
    <section
      data-component="FeaturedCommunities"
      className="@container"
      {...(titleOptional?.value && { 'aria-labelledby': sectionId })}
    >
      <div className={cn('w-full', params?.styles)}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {(titleOptional || linkOptional?.value?.href || isPageEditing) && (
            <div className="@md:flex-row @md:justify-between @md:items-center mb-20 flex flex-col">
              {titleOptional && (
                <div className="@md:mb-0 mb-4">
                  <Text
                    tag="h2"
                    id={sectionId}
                    field={titleOptional}
                    className="font-heading @md:text-6xl text-primary text-4xl font-normal leading-[1.20] tracking-tighter"
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

          <div className="@md:grid-cols-2 mb-[28px] grid gap-8">
            {featuredCommunities.map((community, index) => (
              <article key={index} className="@md:mb-0 group/community mb-6">
                {isPageEditing ? (
                  <div className="rounded-default @md:mb-0 relative mb-4 aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-default @md:mb-0 relative mb-4 aspect-[3/2] w-full cursor-pointer overflow-hidden"
                    onClick={() => (window.location.href = community.link)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && (window.location.href = community.link)}
                  >
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover/community:scale-105"
                    />
                  </div>
                )}
                <div className="@md:p-8">
                  {isPageEditing ? (
                    <h3 className="font-heading text-card-foreground text-3xl font-medium leading-[1.30] -tracking-[0.9px]">
                      {community.name}
                    </h3>
                  ) : (
                    <Link field={{ value: { href: community.link } }} className="block">
                      <h3 className="font-heading text-card-foreground text-3xl font-medium leading-[1.30] -tracking-[0.9px] decoration-1 underline-offset-4 group-hover/community:underline group-focus/community:underline">
                        {community.name}
                      </h3>
                    </Link>
                  )}
                  <p className="text-secondary-foreground text-normal mt-4 line-clamp-2 text-lg leading-[1.5] tracking-tighter">
                    {community.overview}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="@sm:grid-cols-2 @lg:grid-cols-3 grid gap-8">
            {regularCommunities.map((community, index) => (
              <article
                key={index}
                className="@md:p-8 rounded-default hover:bg-tertiary-hover focus:ring-accent group/community flex h-full flex-col p-4 transition-colors focus:outline-none focus:ring-2"
              >
                <div>
                  {isPageEditing ? (
                    <h3 className="font-heading text-card-foreground text-2xl font-medium leading-normal tracking-tighter">
                      {community.name}
                    </h3>
                  ) : (
                    <Link field={{ value: { href: community.link } }} className="block">
                      <h3 className="font-heading text-card-foreground text-2xl font-medium leading-normal tracking-tighter decoration-1 underline-offset-4 group-hover/community:underline group-focus/community:underline">
                        {community.name}
                      </h3>
                    </Link>
                  )}
                  <p className="text-secondary-foreground mt-3 line-clamp-3 text-base leading-[1.5] tracking-tight">
                    {community.overview}
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
