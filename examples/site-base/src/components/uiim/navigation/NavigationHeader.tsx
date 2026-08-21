'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text,
  type Field,
  type ImageField,
  type LinkField,
} from '@sitecore-content-sdk/nextjs';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';

type JsonField<T> = { jsonValue?: T };
interface NavigationLinkItem {
  id?: string;
  linkText?: JsonField<Field<string>>;
  linkUrl?: JsonField<LinkField>;
}
interface NavigationDatasource {
  brandLogo?: JsonField<ImageField>;
  ctaLabel?: JsonField<Field<string>>;
  ctaLink?: JsonField<LinkField>;
  children?: { results?: NavigationLinkItem[] };
}
type NavigationHeaderProps = ComponentProps & {
  fields?: { data?: { datasource?: NavigationDatasource } };
};

const NavigationHeaderEmpty = (): React.JSX.Element => (
  <div className="component navigation-header">
    <span className="is-empty-hint">NavigationHeader</span>
  </div>
);

function Header({
  props,
  mode,
}: {
  props: NavigationHeaderProps;
  mode: 'default' | 'transparent' | 'minimal';
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const datasource = props.fields?.data?.datasource;
  if (!datasource) return <NavigationHeaderEmpty />;
  const items = datasource.children?.results ?? [];
  const isEditing = props.page?.mode?.isEditing;
  return (
    <header
      id={props.params.RenderingIdentifier}
      className={cn(
        'component navigation-header relative z-40 font-[var(--brand-body-font,inherit)]',
        mode === 'transparent'
          ? 'bg-transparent text-white'
          : 'bg-[var(--brand-header-bg)] text-[var(--brand-header-fg)]',
        props.params.styles
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-4">
        {(datasource.brandLogo?.jsonValue?.value?.src || isEditing) && (
          <ContentSdkImage
            field={datasource.brandLogo?.jsonValue}
            className="h-10 w-auto object-contain"
          />
        )}
        {mode !== 'minimal' && (
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {items.map((item, index) =>
              item.linkUrl?.jsonValue ? (
                <ContentSdkLink
                  key={item.id ?? index}
                  field={item.linkUrl.jsonValue}
                  className="font-medium hover:text-[var(--brand-primary)]"
                >
                  <Text field={item.linkText?.jsonValue} />
                </ContentSdkLink>
              ) : null
            )}
          </nav>
        )}
        <div className="flex items-center gap-3">
          {mode !== 'minimal' && (datasource.ctaLink?.jsonValue?.value?.href || isEditing) && (
            <ContentSdkLink
              field={datasource.ctaLink!.jsonValue!}
              className="hidden rounded-[var(--brand-button-radius)] bg-[var(--brand-primary)] px-5 py-3 font-semibold text-[var(--brand-primary-foreground)] sm:inline-flex"
            >
              <Text field={datasource.ctaLabel?.jsonValue} />
            </ContentSdkLink>
          )}
          {mode !== 'minimal' && (
            <button
              type="button"
              className="rounded-md p-2 lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X aria-hidden /> : <Menu aria-hidden />}
            </button>
          )}
        </div>
      </div>
      {open && mode !== 'minimal' && (
        <nav
          className="border-t border-[var(--brand-border)] bg-[var(--brand-header-bg)] px-6 py-4 text-[var(--brand-header-fg)] lg:hidden"
          aria-label="Mobile navigation"
        >
          {items.map((item, index) =>
            item.linkUrl?.jsonValue ? (
              <ContentSdkLink
                key={item.id ?? index}
                field={item.linkUrl.jsonValue}
                className="flex py-2"
              >
                <Text field={item.linkText?.jsonValue} />
              </ContentSdkLink>
            ) : null
          )}
        </nav>
      )}
    </header>
  );
}

export const Default: React.FC<NavigationHeaderProps> = (props) => (
  <Header props={props} mode="default" />
);
export const Transparent: React.FC<NavigationHeaderProps> = (props) => (
  <Header props={props} mode="transparent" />
);
export const Minimal: React.FC<NavigationHeaderProps> = (props) => (
  <Header props={props} mode="minimal" />
);
