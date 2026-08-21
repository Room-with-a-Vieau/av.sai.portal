import type React from 'react';
import { NextImage as ContentSdkImage, type ImageField } from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';

interface SiteFooterFields {
  BrandLogo?: ImageField;
}
type SiteFooterProps = ComponentProps & { fields?: SiteFooterFields };

const SiteFooterEmpty = (): React.JSX.Element => (
  <div className="component site-footer">
    <span className="is-empty-hint">SiteFooter</span>
  </div>
);

function FooterView({
  props,
  variant,
}: {
  props: SiteFooterProps;
  variant: 'default' | 'minimal' | 'mega' | 'guidestone';
}): React.JSX.Element {
  if (!props.fields) return <SiteFooterEmpty />;
  const isEditing = props.page?.mode?.isEditing;
  const isLarge = variant === 'mega' || variant === 'guidestone';
  return (
    <footer
      id={props.params.RenderingIdentifier}
      className={cn(
        'component site-footer bg-[var(--brand-footer-bg)] px-6 py-10 text-[var(--brand-footer-fg)]',
        isLarge && 'py-16',
        props.params.styles
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <div
          className={cn(
            'flex gap-8',
            isLarge ? 'flex-col lg:grid lg:grid-cols-5' : 'items-center justify-between'
          )}
        >
          <div>
            {(props.fields.BrandLogo?.value?.src || isEditing) && (
              <ContentSdkImage
                field={props.fields.BrandLogo}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            )}
          </div>
          {variant !== 'minimal' &&
            ['Solutions', 'Resources', 'About', 'Support'].map((heading) => (
              <div key={heading}>
                <h2 className="mb-3 font-bold">{heading}</h2>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>Explore</li>
                  <li>Learn more</li>
                  <li>Contact us</li>
                </ul>
              </div>
            ))}
        </div>
        <div className="mt-10 border-t border-white/20 pt-6 text-sm opacity-75">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export const Default: React.FC<SiteFooterProps> = (props) => (
  <FooterView props={props} variant="default" />
);
export const Minimal: React.FC<SiteFooterProps> = (props) => (
  <FooterView props={props} variant="minimal" />
);
export const MegaFooter: React.FC<SiteFooterProps> = (props) => (
  <FooterView props={props} variant="mega" />
);
export const GuideStoneMegaFooter: React.FC<SiteFooterProps> = (props) => (
  <FooterView props={props} variant="guidestone" />
);
