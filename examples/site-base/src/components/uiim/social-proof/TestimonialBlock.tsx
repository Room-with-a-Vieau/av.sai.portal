'use client';
import type React from 'react';
import { useState } from 'react';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  type Field,
  type ImageField,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
type J<T> = { jsonValue?: T };
interface Testimonial {
  id?: string;
  quoteText?: J<RichTextField>;
  authorName?: J<Field<string>>;
  authorRole?: J<Field<string>>;
  authorImage?: J<ImageField>;
  companyName?: J<Field<string>>;
  companyLogo?: J<ImageField>;
}
interface DS {
  sectionTitle?: J<Field<string>>;
  children?: { results?: Testimonial[] };
}
type Props = ComponentProps & { fields?: { data?: { datasource?: DS } } };
const Empty = (): React.JSX.Element => (
  <div className="component testimonial-block">
    <span className="is-empty-hint">TestimonialBlock</span>
  </div>
);
function Card({ item, photo }: { item: Testimonial; photo: boolean }): React.JSX.Element {
  return (
    <blockquote
      className={cn(
        'rounded-[var(--brand-card-radius)] border border-[var(--brand-border)] bg-white p-8',
        photo && 'grid items-center gap-8 md:grid-cols-[220px_1fr]'
      )}
    >
      {photo && (
        <ContentSdkImage
          field={item.authorImage?.jsonValue}
          className="aspect-square w-full rounded-[var(--brand-card-radius)] object-cover"
        />
      )}
      <div>
        <ContentSdkRichText field={item.quoteText?.jsonValue} className="text-xl leading-relaxed" />
        <footer className="mt-5">
          <Text field={item.authorName?.jsonValue} tag="cite" className="not-italic font-bold" />
          <Text
            field={item.authorRole?.jsonValue}
            tag="p"
            className="text-sm text-[var(--brand-muted-foreground)]"
          />
          <Text field={item.companyName?.jsonValue} tag="p" className="text-sm font-semibold" />
          <ContentSdkImage
            field={item.companyLogo?.jsonValue}
            className="mt-3 h-8 w-auto object-contain"
          />
        </footer>
      </div>
    </blockquote>
  );
}
function View({
  props,
  variant,
}: {
  props: Props;
  variant: 'default' | 'carousel' | 'grid' | 'photo' | 'guidestone';
}): React.JSX.Element {
  const ds = props.fields?.data?.datasource;
  const [active, setActive] = useState(0);
  if (!ds) return <Empty />;
  const items = ds.children?.results ?? [];
  const shown = variant === 'grid' ? items : items.slice(active, active + 1);
  const photo = variant === 'photo' || variant === 'guidestone';
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component testimonial-block bg-[var(--brand-muted)] px-6 py-16',
        props.params.styles
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <Text
          field={ds.sectionTitle?.jsonValue}
          tag="h2"
          className="mb-10 text-center text-3xl font-bold"
        />
        <div className={cn(variant === 'grid' && 'grid gap-6 md:grid-cols-2 lg:grid-cols-3')}>
          {shown.map((item, i) => (
            <Card key={item.id ?? i} item={item} photo={photo} />
          ))}
        </div>
        {(variant === 'carousel' || variant === 'guidestone') && items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.id ?? i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  active === i ? 'bg-[var(--brand-primary)]' : 'bg-[var(--brand-border)]'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} variant="default" />;
export const Carousel: React.FC<Props> = (props) => <View props={props} variant="carousel" />;
export const Grid: React.FC<Props> = (props) => <View props={props} variant="grid" />;
export const WithPhoto: React.FC<Props> = (props) => <View props={props} variant="photo" />;
export const GuideStoneTestimonialCarousel: React.FC<Props> = (props) => (
  <View props={props} variant="guidestone" />
);
