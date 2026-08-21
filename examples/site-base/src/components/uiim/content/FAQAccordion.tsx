'use client';
import type React from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  RichText as ContentSdkRichText,
  Text,
  type Field,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
type J<T> = { jsonValue?: T };
interface FAQ {
  id?: string;
  question?: J<Field<string>>;
  answer?: J<RichTextField>;
}
interface DS {
  title?: J<Field<string>>;
  description?: J<RichTextField>;
  children?: { results?: FAQ[] };
}
type Props = ComponentProps & { fields?: { data?: { datasource?: DS } } };
const Empty = (): React.JSX.Element => (
  <div className="component faq-accordion">
    <span className="is-empty-hint">FAQAccordion</span>
  </div>
);
function View({
  props,
  variant,
}: {
  props: Props;
  variant: 'default' | 'open' | 'two';
}): React.JSX.Element {
  const ds = props.fields?.data?.datasource;
  const [open, setOpen] = useState<number | null>(variant === 'open' ? 0 : null);
  if (!ds) return <Empty />;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn('component faq-accordion px-6 py-16', props.params.styles)}
    >
      <div className="mx-auto max-w-4xl">
        <Text field={ds.title?.jsonValue} tag="h2" className="text-3xl font-bold" />
        <ContentSdkRichText field={ds.description?.jsonValue} className="mt-4" />
        <div className={cn('mt-8 grid gap-4', variant === 'two' && 'md:grid-cols-2')}>
          {(ds.children?.results ?? []).map((faq, i) => {
            const expanded = variant === 'open' || open === i;
            return (
              <article
                key={faq.id ?? i}
                className="rounded-[var(--brand-card-radius)] border border-[var(--brand-border)]"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : i)}
                >
                  <Text field={faq.question?.jsonValue} />
                  <ChevronDown className={cn('shrink-0 transition', expanded && 'rotate-180')} />
                </button>
                {expanded && (
                  <ContentSdkRichText field={faq.answer?.jsonValue} className="px-5 pb-5" />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} variant="default" />;
export const AllOpen: React.FC<Props> = (props) => <View props={props} variant="open" />;
export const TwoColumn: React.FC<Props> = (props) => <View props={props} variant="two" />;
