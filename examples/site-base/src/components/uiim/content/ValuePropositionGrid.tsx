import type React from 'react';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  type Field,
  type ImageField,
  type LinkField,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
type J<T> = { jsonValue?: T };
interface Item {
  id?: string;
  itemTitle?: J<Field<string>>;
  itemDescription?: J<RichTextField>;
  itemIcon?: J<ImageField>;
  itemLink?: J<LinkField>;
}
interface DS {
  title?: J<Field<string>>;
  description?: J<RichTextField>;
  children?: { results?: Item[] };
}
type Props = ComponentProps & { fields?: { data?: { datasource?: DS } } };
const Empty = (): React.JSX.Element => (
  <div className="component value-proposition-grid">
    <span className="is-empty-hint">ValuePropositionGrid</span>
  </div>
);
function View({
  props,
  columns,
  horizontal = false,
}: {
  props: Props;
  columns: string;
  horizontal?: boolean;
}): React.JSX.Element {
  const ds = props.fields?.data?.datasource;
  if (!ds) return <Empty />;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn('component value-proposition-grid px-6 py-16', props.params.styles)}
    >
      <div className="mx-auto max-w-[1200px]">
        <Text field={ds.title?.jsonValue} tag="h2" className="text-center text-3xl font-bold" />
        <ContentSdkRichText
          field={ds.description?.jsonValue}
          className="mx-auto mt-4 max-w-3xl text-center"
        />
        <div className={cn('mt-10 grid gap-8', columns)}>
          {(ds.children?.results ?? []).map((item, i) => (
            <article
              key={item.id ?? i}
              className={cn(
                'rounded-[var(--brand-card-radius)] p-6',
                horizontal && 'grid grid-cols-[64px_1fr] gap-5'
              )}
            >
              <ContentSdkImage
                field={item.itemIcon?.jsonValue}
                className="mb-4 h-14 w-14 object-contain"
              />
              <div>
                <Text field={item.itemTitle?.jsonValue} tag="h3" className="text-xl font-bold" />
                <ContentSdkRichText field={item.itemDescription?.jsonValue} className="mt-2" />
                {item.itemLink?.jsonValue && (
                  <ContentSdkLink
                    field={item.itemLink.jsonValue}
                    className="mt-4 inline-flex font-semibold text-[var(--brand-primary)]"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} columns="md:grid-cols-3" />;
export const TwoColumn: React.FC<Props> = (props) => (
  <View props={props} columns="md:grid-cols-2" />
);
export const FourColumn: React.FC<Props> = (props) => (
  <View props={props} columns="md:grid-cols-2 lg:grid-cols-4" />
);
export const Horizontal: React.FC<Props> = (props) => (
  <View props={props} columns="grid-cols-1" horizontal />
);
