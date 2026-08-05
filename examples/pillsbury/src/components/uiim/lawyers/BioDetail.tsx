'use client';

import type React from 'react';
import Image from 'next/image';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  useSitecore,
  type Field as SitecoreField,
  type ImageField,
  type LinkField,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { Mail, MapPin, Phone } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

import type { BioDetailFields, BioDetailProps } from './bio-detail.props';
import { resolveBioHeadshotSrc } from './bio-headshots';

type TaxonomyLike = {
  id?: string;
  displayName?: string;
  name?: string;
  fields?: {
    Title?: SitecoreField<string>;
  };
};

function textValue(field?: SitecoreField<string> | null): string {
  return typeof field?.value === 'string' ? field.value.trim() : '';
}

function richHasContent(field?: RichTextField | null): boolean {
  if (!field?.value) return false;
  return field.value.replace(/<[^>]*>/g, '').trim().length > 0;
}

function resolveTaxonomy(raw: unknown): TaxonomyLike[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as TaxonomyLike[];
  return [];
}

function taxonomyLabel(item: TaxonomyLike): string {
  return textValue(item.fields?.Title) || item.displayName || item.name || '';
}

function officeLabel(office: BioDetailFields['Office']): string {
  if (!office) return '';
  if (typeof office === 'object' && 'displayName' in office && office.displayName) {
    return String(office.displayName);
  }
  if (typeof office === 'object' && 'name' in office && office.name) {
    return String(office.name);
  }
  if (typeof office === 'object' && 'value' in office && typeof office.value === 'string') {
    return office.value;
  }
  return '';
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function TaxonomyList({
  label,
  items,
}: {
  label: string;
  items: TaxonomyLike[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-heading text-foreground text-sm font-semibold tracking-wide uppercase">
        {label}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const text = taxonomyLabel(item);
          if (!text) return null;
          return (
            <li
              key={item.id || text}
              className="border-border bg-muted/30 text-foreground rounded-md border px-2.5 py-1 text-sm"
            >
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RichSection({
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
    <section className="mt-10">
      <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert text-foreground mt-4 max-w-none text-base leading-relaxed">
        <ContentSdkRichText field={field} />
      </div>
    </section>
  );
}

export const Default: React.FC<BioDetailProps> = (props) => {
  const { fields: propFields, params, isPageEditing: propEditing } = props;
  const { page } = useSitecore();
  const isEditing = propEditing ?? page.mode.isEditing;

  const routeFields = (page?.layout?.sitecore?.route?.fields ?? {}) as BioDetailFields;
  const fields: BioDetailFields = {
    ...routeFields,
    ...(propFields ?? {}),
  };

  const fullName = textValue(fields.FullName);
  const jobTitle = textValue(fields.JobTitle);
  const summary = textValue(fields.Summary);
  const email = textValue(fields.Email);
  const phone = textValue(fields.Phone);
  const office = officeLabel(fields.Office);
  const routeName = page?.layout?.sitecore?.route?.name ?? '';
  const headshotResolved = resolveBioHeadshotSrc({
    itemName: routeName,
    displayName: fullName || routeName,
    headshotField: fields.Headshot,
  });
  const headshotSrc = headshotResolved.src;
  const headshotAlt = headshotResolved.alt;
  const bypassOptimizer =
    headshotSrc.includes('images.unsplash.com') || headshotSrc.includes('sitecoresandbox.cloud');
  const linkedIn = fields.LinkedIn as LinkField | undefined;

  const practiceAreas = resolveTaxonomy(fields.PracticeAreas);
  const industries = resolveTaxonomy(fields.Industries);
  const barAdmissions = resolveTaxonomy(fields.BarAdmissions);
  const languages = resolveTaxonomy(fields.Languages);
  const education = resolveTaxonomy(fields.Education);
  const awards = resolveTaxonomy(fields.Awards);

  const hasProfile = Boolean(fullName || jobTitle || summary || isEditing);

  if (!hasProfile && !richHasContent(fields.Biography) && !isEditing) {
    return <NoDataFallback componentName="BioDetail" />;
  }

  const sectionId = params?.RenderingIdentifier || 'bio-detail';

  return (
    <article
      id={sectionId}
      data-component="BioDetail"
      className={cn('@container bg-background text-foreground', params?.styles)}
    >
      <div className="border-border border-b">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-14">
          <div className="flex flex-col items-start gap-4">
            <div className="bg-muted text-muted-foreground relative flex size-36 items-center justify-center overflow-hidden rounded-2xl text-2xl font-semibold tracking-wide sm:size-44">
              {headshotSrc ? (
                <Image
                  src={headshotSrc}
                  alt={headshotAlt || fullName || 'Attorney headshot'}
                  fill
                  sizes="176px"
                  className="object-cover"
                  unoptimized={bypassOptimizer}
                />
              ) : isEditing && fields.Headshot ? (
                <ContentSdkImage
                  field={fields.Headshot as ImageField}
                  className="size-full object-cover"
                />
              ) : (
                <span aria-hidden>{initials(fullName || 'LA')}</span>
              )}
            </div>
          </div>

          <div className="min-w-0">
            {(fullName || isEditing) && (
              <Text
                tag="h1"
                field={fields.FullName}
                className="font-heading text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              />
            )}
            {(jobTitle || isEditing) && (
              <Text
                tag="p"
                field={fields.JobTitle}
                className="text-muted-foreground mt-2 text-lg sm:text-xl"
              />
            )}

            <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {office && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {office}
                </span>
              )}
              {(phone || isEditing) && (
                <a
                  href={phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined}
                  className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="size-3.5 shrink-0" aria-hidden />
                  <Text field={fields.Phone} />
                </a>
              )}
              {(email || isEditing) && (
                <a
                  href={email ? `mailto:${email}` : undefined}
                  className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="size-3.5 shrink-0" aria-hidden />
                  <Text field={fields.Email} />
                </a>
              )}
            </div>

            {(summary || isEditing) && (
              <Text
                tag="p"
                field={fields.Summary}
                className="text-foreground/90 mt-6 max-w-3xl text-pretty text-base leading-relaxed sm:text-lg"
              />
            )}

            {linkedIn && (linkedIn.value?.href || isEditing) && (
              <div className="mt-5">
                <ContentSdkLink
                  field={linkedIn}
                  className="text-primary hover:text-primary/80 text-sm font-medium underline-offset-4 hover:underline"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14 lg:px-8 lg:py-14">
        <div className="min-w-0">
          <RichSection title="Biography" field={fields.Biography} isEditing={isEditing} />
          <RichSection
            title="Representative Matters"
            field={fields.RepresentativeMatters}
            isEditing={isEditing}
          />
          <RichSection
            title="Community Involvement"
            field={fields.CommunityInvolvement}
            isEditing={isEditing}
          />
        </div>

        <aside className="border-border bg-muted/15 h-fit rounded-2xl border p-5 lg:sticky lg:top-24">
          <h2 className="font-heading text-foreground text-lg font-semibold tracking-tight">
            Expertise
          </h2>
          <div className="mt-5 space-y-6">
            <TaxonomyList label="Practice areas" items={practiceAreas} />
            <TaxonomyList label="Industries" items={industries} />
            <TaxonomyList label="Bar admissions" items={barAdmissions} />
            <TaxonomyList label="Education" items={education} />
            <TaxonomyList label="Languages" items={languages} />
            <TaxonomyList label="Awards" items={awards} />
            {practiceAreas.length === 0 &&
              industries.length === 0 &&
              barAdmissions.length === 0 &&
              education.length === 0 &&
              languages.length === 0 &&
              awards.length === 0 &&
              isEditing && (
                <p className="text-muted-foreground text-sm">
                  Add taxonomy multilists on this Bio page to populate expertise.
                </p>
              )}
          </div>
        </aside>
      </div>
    </article>
  );
};
