'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text,
  type Field,
  type LinkField,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';

type JsonField<T> = { jsonValue?: T };
interface TabItem {
  id?: string;
  tabLabel?: JsonField<Field<string>>;
  tabLink?: JsonField<LinkField>;
  tabContent?: JsonField<RichTextField>;
}
interface TabDatasource {
  title?: JsonField<Field<string>>;
  children?: { results?: TabItem[] };
}
type TabNavigationProps = ComponentProps & { fields?: { data?: { datasource?: TabDatasource } } };

const TabNavigationEmpty = (): React.JSX.Element => (
  <div className="component tab-navigation">
    <span className="is-empty-hint">TabNavigationSection</span>
  </div>
);

function TabsView({
  props,
  variant,
}: {
  props: TabNavigationProps;
  variant: 'pill' | 'underline' | 'boxed' | 'audience';
}): React.JSX.Element {
  const [active, setActive] = useState(0);
  const datasource = props.fields?.data?.datasource;
  if (!datasource) return <TabNavigationEmpty />;
  const items = datasource.children?.results ?? [];
  const activeItem = items[active];
  const isEditing = props.page?.mode?.isEditing;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component tab-navigation bg-[var(--brand-bg)] px-6 py-12 text-[var(--brand-fg)]',
        props.params.styles
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        {(datasource.title?.jsonValue?.value || isEditing) && (
          <Text
            tag="h2"
            field={datasource.title?.jsonValue}
            className="mb-6 text-3xl font-bold font-[var(--brand-heading-font,inherit)]"
          />
        )}
        <div
          role="tablist"
          className={cn(
            'flex flex-wrap gap-2',
            variant === 'audience' && 'mx-auto w-fit rounded-full bg-[var(--brand-muted)] p-1'
          )}
        >
          {items.map((item, index) => (
            <button
              key={item.id ?? index}
              type="button"
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
              className={cn(
                'px-5 py-2.5 font-semibold transition',
                variant === 'pill' && 'rounded-full',
                variant === 'underline' && 'border-b-2',
                variant === 'boxed' && 'rounded-md border',
                variant === 'audience' && 'rounded-full',
                active === index
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]'
                  : 'border-transparent'
              )}
            >
              {<Text field={item.tabLabel?.jsonValue} />}
            </button>
          ))}
        </div>
        {activeItem && (
          <div role="tabpanel" className="mt-6">
            <ContentSdkRichText field={activeItem.tabContent?.jsonValue} />
            {(activeItem.tabLink?.jsonValue?.value?.href || isEditing) && (
              <ContentSdkLink
                field={activeItem.tabLink!.jsonValue!}
                className="mt-4 inline-flex font-semibold text-[var(--brand-primary)] underline"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export const Default: React.FC<TabNavigationProps> = (props) => (
  <TabsView props={props} variant="pill" />
);
export const Underline: React.FC<TabNavigationProps> = (props) => (
  <TabsView props={props} variant="underline" />
);
export const Boxed: React.FC<TabNavigationProps> = (props) => (
  <TabsView props={props} variant="boxed" />
);
export const GuideStoneAudienceToggle: React.FC<TabNavigationProps> = (props) => (
  <TabsView props={props} variant="audience" />
);
