import type React from 'react';
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
interface Stat {
  id?: string;
  statValue?: J<Field<string>>;
  statLabel?: J<Field<string>>;
  statDescription?: J<RichTextField>;
  statIcon?: J<ImageField>;
}
interface DS {
  title?: J<Field<string>>;
  eyebrowText?: J<Field<string>>;
  children?: { results?: Stat[] };
}
type Props = ComponentProps & { fields?: { data?: { datasource?: DS } } };
const Empty = (): React.JSX.Element => (
  <div className="component trust-stats-row">
    <span className="is-empty-hint">TrustStatsRow</span>
  </div>
);
function View({
  props,
  variant,
}: {
  props: Props;
  variant: 'default' | 'icons' | 'logos';
}): React.JSX.Element {
  const ds = props.fields?.data?.datasource;
  if (!ds) return <Empty />;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component trust-stats-row bg-[var(--brand-muted)] px-6 py-14',
        props.params.styles
      )}
    >
      <div className="mx-auto max-w-[1200px] text-center">
        <Text
          field={ds.eyebrowText?.jsonValue}
          tag="p"
          className="font-semibold uppercase text-[var(--brand-primary)]"
        />
        <Text field={ds.title?.jsonValue} tag="h2" className="mt-2 text-3xl font-bold" />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(ds.children?.results ?? []).map((stat, i) => (
            <article key={stat.id ?? i}>
              {variant !== 'default' && (
                <ContentSdkImage
                  field={stat.statIcon?.jsonValue}
                  className={cn(
                    'mx-auto mb-4 object-contain',
                    variant === 'logos' ? 'h-14 w-36' : 'h-12 w-12'
                  )}
                />
              )}
              {variant !== 'logos' && (
                <Text
                  field={stat.statValue?.jsonValue}
                  tag="p"
                  className="text-4xl font-bold text-[var(--brand-primary)]"
                />
              )}
              <Text field={stat.statLabel?.jsonValue} tag="h3" className="mt-2 font-semibold" />
              <ContentSdkRichText
                field={stat.statDescription?.jsonValue}
                className="mt-2 text-sm text-[var(--brand-muted-foreground)]"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} variant="default" />;
export const WithIcons: React.FC<Props> = (props) => <View props={props} variant="icons" />;
export const LogoRow: React.FC<Props> = (props) => <View props={props} variant="logos" />;
