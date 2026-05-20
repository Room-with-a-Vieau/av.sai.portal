'use client';

import type { BassProNavCategory } from './bass-pro-navigation';
import { cn } from '@/lib/utils';

type CommerceHeaderMegaMenuProps = {
  category: BassProNavCategory;
  isOpen?: boolean;
};

export function CommerceHeaderMegaMenu({
  category,
  isOpen = true,
}: CommerceHeaderMegaMenuProps): React.ReactElement {
  const { promo, quickLinks, columns, shopAllHref, label } = category;

  return (
    <div
      id={`bps-mega-${category.id}`}
      role="region"
      aria-label={`${label} menu`}
      aria-hidden={!isOpen}
      className={cn('bps-mega-panel', !isOpen && 'hidden', '[.partial-editing-mode_&]:!block')}
    >
      <div className="mx-auto max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
          <div>
            <h2 className="bps-mega-panel__category-title mb-5 border-b border-[#e5e5e5] pb-3">
              {label}
            </h2>

            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {columns.map((column) => (
                <div key={column.title}>
                  {column.href ? (
                    <a href={column.href} className="bps-mega-panel__column-title mb-2 block hover:text-[#c41230]">
                      {column.title}
                    </a>
                  ) : (
                    <p className="bps-mega-panel__column-title mb-2">{column.title}</p>
                  )}
                  <ul className="space-y-1.5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className="bps-mega-panel__link block hover:underline">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#e5e5e5] pt-4">
              <a
                href={shopAllHref}
                className="text-sm font-bold uppercase text-[#222] hover:text-[#c41230] hover:underline"
              >
                Shop All {label}
              </a>
            </div>
          </div>

          {(promo || (quickLinks && quickLinks.length > 0)) && (
            <aside className="border-t border-[#e5e5e5] pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              {promo && (
                <div className="mb-5">
                  <div className="mb-3 flex aspect-square max-h-40 items-end bg-gradient-to-br from-[#c41230] to-[#8b0f24] p-4 text-white">
                    <div>
                      <p className="text-lg font-bold uppercase leading-tight">{promo.headline}</p>
                      <a
                        href={promo.ctaHref}
                        className="bps-mega-panel__promo-cta mt-3 inline-block px-4 py-2 hover:bg-[#f5f5f5]"
                      >
                        {promo.ctaLabel}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {quickLinks && quickLinks.length > 0 && (
                <ul className="space-y-3 text-sm font-bold uppercase tracking-wide">
                  {quickLinks.map((link) => {
                    const isSale = /bargain cave/i.test(link.label);
                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className={cn(
                            'hover:underline',
                            isSale ? 'bps-mega-panel__quick-link--sale' : 'text-[#222] hover:text-[#c41230]',
                          )}
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
