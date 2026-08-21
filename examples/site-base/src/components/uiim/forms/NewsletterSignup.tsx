'use client';
import type React from 'react';
import { useState } from 'react';
import {
  RichText as ContentSdkRichText,
  Text,
  type Field,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
interface Fields {
  Title?: Field<string>;
  Description?: RichTextField;
  PlaceholderText?: Field<string>;
  ButtonText?: Field<string>;
  SuccessMessage?: Field<string>;
}
type Props = ComponentProps & { fields?: Fields };
const Empty = (): React.JSX.Element => (
  <div className="component newsletter-signup">
    <span className="is-empty-hint">NewsletterSignup</span>
  </div>
);
function View({
  props,
  variant,
}: {
  props: Props;
  variant: 'default' | 'banner' | 'compact';
}): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  if (!props.fields) return <Empty />;
  const editing = props.page?.mode?.isEditing;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component newsletter-signup px-6 py-12',
        variant === 'banner' && 'bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]',
        props.params.styles
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-4xl',
          variant !== 'compact' && 'md:grid md:grid-cols-2 md:items-center md:gap-8'
        )}
      >
        {variant !== 'compact' && (
          <div>
            <Text field={props.fields.Title} tag="h2" className="text-3xl font-bold" />
            <ContentSdkRichText field={props.fields.Description} className="mt-3" />
          </div>
        )}
        {submitted ? (
          <div
            role="status"
            className="rounded-md bg-[var(--brand-muted)] p-4 text-[var(--brand-fg)]"
          >
            <Text field={props.fields.SuccessMessage} />
          </div>
        ) : (
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label
              className="sr-only"
              htmlFor={`${props.params.RenderingIdentifier ?? 'newsletter'}-email`}
            >
              Email address
            </label>
            <input
              id={`${props.params.RenderingIdentifier ?? 'newsletter'}-email`}
              type="email"
              required
              placeholder={String(props.fields.PlaceholderText?.value ?? '')}
              className="min-w-0 flex-1 rounded-[var(--brand-button-radius)] border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--brand-fg)]"
            />
            <button
              type="submit"
              className="rounded-[var(--brand-button-radius)] bg-[var(--brand-accent)] px-5 py-3 font-semibold text-[var(--brand-accent-foreground)]"
            >
              <Text field={props.fields.ButtonText} />
            </button>
          </form>
        )}
        {(props.fields.PlaceholderText?.value || editing) && (
          <span className="sr-only">
            <Text field={props.fields.PlaceholderText} />
          </span>
        )}
      </div>
    </section>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} variant="default" />;
export const Banner: React.FC<Props> = (props) => <View props={props} variant="banner" />;
export const Compact: React.FC<Props> = (props) => <View props={props} variant="compact" />;
