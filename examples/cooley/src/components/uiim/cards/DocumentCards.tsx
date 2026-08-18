'use client';

import type React from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import {
  Field,
  Image as SitecoreImage,
  ImageField,
  Link as ContentSdkLink,
  LinkField,
  NextImage as ContentSdkImage,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { shouldBypassNextImageOptimizer, withResolvedImageSrc } from '@/lib/sitecore-image-field';
import type { ComponentProps } from '@/lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';

type JsonField<T> = { jsonValue?: T };

type DocumentCardItem = {
  id?: string;
  cardTitle?: JsonField<Field<string>>;
  cardSummary?: JsonField<Field<string>>;
  previewImage?: JsonField<ImageField>;
  documentLink?: JsonField<LinkField>;
  fileType?: JsonField<Field<string>>;
  fileSize?: JsonField<Field<string>>;
  publishedDate?: JsonField<Field<string>>;
  practiceArea?: JsonField<Field<string>>;
  downloadLabel?: JsonField<Field<string>>;
};

type DocumentCardsDatasource = {
  sectionTitle?: JsonField<Field<string>>;
  sectionIntro?: JsonField<Field<string>>;
  children?: {
    results?: DocumentCardItem[];
  };
};

export type DocumentCardsProps = ComponentProps & {
  fields?: {
    data?: {
      datasource?: DocumentCardsDatasource | null;
    };
  };
  isPageEditing?: boolean;
};

const EMPTY_IMAGE_FIELD: ImageField = { value: {} };
const EMPTY_LINK_FIELD: LinkField = { value: { href: '' } };

function fieldString(field?: JsonField<Field<string>> | null): string {
  const value = field?.jsonValue?.value;
  return typeof value === 'string' ? value.trim() : '';
}

function linkHref(field?: JsonField<LinkField> | null): string {
  const value = field?.jsonValue?.value;
  const href = value?.href || value?.url;
  return typeof href === 'string' ? href.trim() : '';
}

function hasLink(field?: JsonField<LinkField> | null): boolean {
  const href = linkHref(field);
  return Boolean(href && href !== 'http://');
}

export function formatSitecoreDate(value?: string): string {
  if (!value) return '';
  const compact = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (compact) {
    const year = Number(compact[1]);
    const month = Number(compact[2]) - 1;
    const day = Number(compact[3]);
    return new Date(year, month, day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isPdfDocument(item: DocumentCardItem): boolean {
  const fileType = fieldString(item.fileType).toLowerCase();
  if (fileType.includes('pdf')) return true;
  return /\.pdf($|\?)/i.test(linkHref(item.documentLink));
}

function itemImageField(item: DocumentCardItem): ImageField {
  return withResolvedImageSrc(item.previewImage) ?? item.previewImage?.jsonValue ?? EMPTY_IMAGE_FIELD;
}

function previewSrc(item: DocumentCardItem): string {
  const src = itemImageField(item)?.value?.src;
  return typeof src === 'string' ? src.trim() : '';
}

function pdfFrameSrc(href: string): string {
  const hashIndex = href.indexOf('#');
  const base = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  return `${base}#toolbar=0&navpanes=0&view=FitH`;
}

const DocumentCardsEmpty: React.FC = () => (
  <div className="border-border bg-muted/20 text-muted-foreground rounded-2xl border border-dashed px-6 py-12 text-center text-sm">
    Add Document Card items under this datasource to preview and download Content Hub PDFs.
  </div>
);

function DocumentMeta({
  item,
  isEditing,
  className,
}: {
  item: DocumentCardItem;
  isEditing: boolean;
  className?: string;
}) {
  const fileType = fieldString(item.fileType);
  const fileSize = fieldString(item.fileSize);
  const practiceArea = fieldString(item.practiceArea);
  const published = formatSitecoreDate(fieldString(item.publishedDate));

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {(fileType || isEditing) && (
        <Badge variant="default" className="rounded-sm tracking-wide uppercase">
          <Text field={item.fileType?.jsonValue} tag="span" />
        </Badge>
      )}
      {(practiceArea || isEditing) && (
        <Badge variant="outline" className="rounded-sm">
          <Text field={item.practiceArea?.jsonValue} tag="span" />
        </Badge>
      )}
      {(published || isEditing) && (
        <span className="text-muted-foreground text-xs">
          {isEditing ? <Text field={item.publishedDate?.jsonValue} tag="span" /> : published}
        </span>
      )}
      {(fileSize || isEditing) && (
        <span className="text-muted-foreground text-xs">
          <Text field={item.fileSize?.jsonValue} tag="span" />
        </span>
      )}
    </div>
  );
}

function DocumentPreview({
  item,
  isEditing,
  className,
  framed = false,
}: {
  item: DocumentCardItem;
  isEditing: boolean;
  className?: string;
  framed?: boolean;
}) {
  const imageField = itemImageField(item);
  const src = previewSrc(item);
  const href = linkHref(item.documentLink);
  const showImage = Boolean(src) || isEditing;
  const showPdfFrame = !isEditing && !src && Boolean(href) && isPdfDocument(item);
  const title = fieldString(item.cardTitle) || 'Document preview';

  return (
    <div
      className={cn(
        'bg-muted relative overflow-hidden',
        framed ? 'aspect-[3/4]' : 'aspect-[4/3]',
        isEditing && 'overflow-visible',
        className
      )}
    >
      {showImage ? (
        isEditing ? (
          <SitecoreImage
            field={imageField}
            className="pointer-events-auto h-full w-full object-cover"
          />
        ) : (
          <ContentSdkImage
            field={imageField}
            className="h-full w-full object-cover"
            unoptimized={shouldBypassNextImageOptimizer(src)}
          />
        )
      ) : showPdfFrame ? (
        <iframe
          src={pdfFrameSrc(href)}
          title={title}
          className="pointer-events-none absolute inset-0 h-[140%] w-full origin-top scale-[0.72]"
          loading="lazy"
          tabIndex={-1}
        />
      ) : (
        <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 bg-neutral-950 px-6 text-white">
          <FileText className="size-10 opacity-80" aria-hidden />
          <span className="font-heading text-sm tracking-[0.2em] uppercase">
            {fieldString(item.fileType) || 'PDF'}
          </span>
        </div>
      )}
    </div>
  );
}

function DocumentActions({
  item,
  isEditing,
  compact = false,
}: {
  item: DocumentCardItem;
  isEditing: boolean;
  compact?: boolean;
}) {
  const href = linkHref(item.documentLink);
  const title = fieldString(item.cardTitle) || 'Document';
  const canPreview = Boolean(href) && isPdfDocument(item) && !isEditing;
  const showDownload = hasLink(item.documentLink) || isEditing;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', compact && 'justify-end')}>
      {canPreview && (
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size={compact ? 'sm' : 'default'}>
              <Eye aria-hidden />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] w-[min(96vw,72rem)] max-w-none gap-3 p-4 sm:rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading pr-8 text-left text-xl font-normal">
                {title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                In-browser preview of {title}
              </DialogDescription>
            </DialogHeader>
            <iframe
              src={pdfFrameSrc(href)}
              title={`${title} preview`}
              className="bg-muted h-[min(72vh,48rem)] w-full rounded-lg border"
            />
          </DialogContent>
        </Dialog>
      )}
      {showDownload && (
        <Button asChild size={compact ? 'sm' : 'default'}>
          <ContentSdkLink field={item.documentLink?.jsonValue ?? EMPTY_LINK_FIELD}>
            <Download aria-hidden />
            {(fieldString(item.downloadLabel) || isEditing) && (
              <Text field={item.downloadLabel?.jsonValue} tag="span" />
            )}
          </ContentSdkLink>
        </Button>
      )}
    </div>
  );
}

function DocumentCardsHeader({
  datasource,
  isEditing,
}: {
  datasource: DocumentCardsDatasource;
  isEditing: boolean;
}) {
  const title = fieldString(datasource.sectionTitle);
  const intro = fieldString(datasource.sectionIntro);

  if (!title && !intro && !isEditing) return null;

  return (
    <header className="mb-10 max-w-3xl">
      {(title || isEditing) && (
        <Text
          field={datasource.sectionTitle?.jsonValue}
          tag="h2"
          className="font-heading text-3xl font-normal tracking-tight md:text-4xl"
        />
      )}
      {(intro || isEditing) && (
        <Text
          field={datasource.sectionIntro?.jsonValue}
          tag="p"
          className="text-muted-foreground mt-3 text-base md:text-lg"
        />
      )}
    </header>
  );
}

function DocumentGridCard({
  item,
  isEditing,
}: {
  item: DocumentCardItem;
  isEditing: boolean;
}) {
  return (
    <Card
      data-item-id={isEditing ? item.id : undefined}
      className="border-border/80 hover:border-border group flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-lg"
    >
      <DocumentPreview item={item} isEditing={isEditing} framed />
      <CardHeader className="space-y-3 pb-3">
        <DocumentMeta item={item} isEditing={isEditing} />
        {(fieldString(item.cardTitle) || isEditing) && (
          <Text
            field={item.cardTitle?.jsonValue}
            tag="h3"
            className="font-heading text-xl font-normal leading-snug"
          />
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        {(fieldString(item.cardSummary) || isEditing) && (
          <Text
            field={item.cardSummary?.jsonValue}
            tag="p"
            className="text-muted-foreground line-clamp-3 text-sm leading-relaxed"
          />
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <DocumentActions item={item} isEditing={isEditing} />
      </CardFooter>
    </Card>
  );
}

function DocumentCardsShell({
  props,
  isEditing,
  children,
}: {
  props: DocumentCardsProps;
  isEditing: boolean;
  children: React.ReactNode;
}) {
  const { fields, params } = props;
  const datasource = fields?.data?.datasource;

  if (!datasource) {
    return <NoDataFallback componentName="DocumentCards" />;
  }

  const items = datasource.children?.results ?? [];

  return (
    <section
      className={cn('component document-cards px-4 py-12 md:py-16', params?.styles)}
      id={params?.RenderingIdentifier}
    >
      <div className="mx-auto max-w-7xl">
        <DocumentCardsHeader datasource={datasource} isEditing={isEditing} />
        {items.length === 0 ? <DocumentCardsEmpty /> : children}
      </div>
    </section>
  );
}

const DocumentCardsDefault: React.FC<DocumentCardsProps> = (props) => {
  const isEditing = Boolean(props.isPageEditing);
  const items = props.fields?.data?.datasource?.children?.results ?? [];

  return (
    <DocumentCardsShell props={props} isEditing={isEditing}>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <DocumentGridCard key={item.id || `document-card-${index}`} item={item} isEditing={isEditing} />
        ))}
      </div>
    </DocumentCardsShell>
  );
};

const DocumentCardsSpotlight: React.FC<DocumentCardsProps> = (props) => {
  const isEditing = Boolean(props.isPageEditing);
  const items = props.fields?.data?.datasource?.children?.results ?? [];
  const [featured, ...rest] = items;

  return (
    <DocumentCardsShell props={props} isEditing={isEditing}>
      {featured ? (
        <article
          data-item-id={isEditing ? featured.id : undefined}
          className="border-border overflow-hidden rounded-2xl border shadow-sm md:grid md:grid-cols-12"
        >
          <DocumentPreview
            item={featured}
            isEditing={isEditing}
            className="md:col-span-7 md:aspect-auto md:min-h-[28rem]"
          />
          <div className="flex flex-col justify-center gap-5 p-6 md:col-span-5 md:p-10">
            <DocumentMeta item={featured} isEditing={isEditing} />
            {(fieldString(featured.cardTitle) || isEditing) && (
              <Text
                field={featured.cardTitle?.jsonValue}
                tag="h3"
                className="font-heading text-3xl font-normal tracking-tight md:text-4xl"
              />
            )}
            {(fieldString(featured.cardSummary) || isEditing) && (
              <Text
                field={featured.cardSummary?.jsonValue}
                tag="p"
                className="text-muted-foreground text-base leading-relaxed"
              />
            )}
            <DocumentActions item={featured} isEditing={isEditing} />
          </div>
        </article>
      ) : null}
      {rest.length > 0 && (
        <ul className="mt-8 divide-y rounded-2xl border">
          {rest.map((item, index) => (
            <li
              key={item.id || `document-spotlight-${index}`}
              data-item-id={isEditing ? item.id : undefined}
              className="hover:bg-muted/30 flex flex-col gap-4 p-5 transition-colors sm:flex-row sm:items-center"
            >
              <DocumentPreview
                item={item}
                isEditing={isEditing}
                className="aspect-[4/3] w-full shrink-0 sm:h-24 sm:w-20 sm:aspect-auto"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <DocumentMeta item={item} isEditing={isEditing} />
                {(fieldString(item.cardTitle) || isEditing) && (
                  <Text
                    field={item.cardTitle?.jsonValue}
                    tag="h4"
                    className="font-heading text-lg font-normal"
                  />
                )}
                {(fieldString(item.cardSummary) || isEditing) && (
                  <Text
                    field={item.cardSummary?.jsonValue}
                    tag="p"
                    className="text-muted-foreground line-clamp-2 text-sm"
                  />
                )}
              </div>
              <DocumentActions item={item} isEditing={isEditing} compact />
            </li>
          ))}
        </ul>
      )}
    </DocumentCardsShell>
  );
};

const DocumentCardsCompactRows: React.FC<DocumentCardsProps> = (props) => {
  const isEditing = Boolean(props.isPageEditing);
  const items = props.fields?.data?.datasource?.children?.results ?? [];

  return (
    <DocumentCardsShell props={props} isEditing={isEditing}>
      <ul className="divide-y overflow-hidden rounded-2xl border">
        {items.map((item, index) => (
          <li
            key={item.id || `document-row-${index}`}
            data-item-id={isEditing ? item.id : undefined}
            className="hover:bg-muted/30 grid gap-4 p-4 transition-colors md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-md">
              <FileText className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              {(fieldString(item.cardTitle) || isEditing) && (
                <Text
                  field={item.cardTitle?.jsonValue}
                  tag="h3"
                  className="font-heading truncate text-lg font-normal"
                />
              )}
              {(fieldString(item.cardSummary) || isEditing) && (
                <Text
                  field={item.cardSummary?.jsonValue}
                  tag="p"
                  className="text-muted-foreground line-clamp-1 text-sm"
                />
              )}
              <DocumentMeta item={item} isEditing={isEditing} />
            </div>
            <DocumentActions item={item} isEditing={isEditing} compact />
          </li>
        ))}
      </ul>
    </DocumentCardsShell>
  );
};

export const Default: React.FC<DocumentCardsProps> = (props) => {
  const { page } = useSitecore();
  return (
    <DocumentCardsDefault
      {...props}
      isPageEditing={Boolean(page?.mode?.isEditing || page?.mode?.isDesignLibrary)}
    />
  );
};

export const Spotlight: React.FC<DocumentCardsProps> = (props) => {
  const { page } = useSitecore();
  return (
    <DocumentCardsSpotlight
      {...props}
      isPageEditing={Boolean(page?.mode?.isEditing || page?.mode?.isDesignLibrary)}
    />
  );
};

export const CompactRows: React.FC<DocumentCardsProps> = (props) => {
  const { page } = useSitecore();
  return (
    <DocumentCardsCompactRows
      {...props}
      isPageEditing={Boolean(page?.mode?.isEditing || page?.mode?.isDesignLibrary)}
    />
  );
};
