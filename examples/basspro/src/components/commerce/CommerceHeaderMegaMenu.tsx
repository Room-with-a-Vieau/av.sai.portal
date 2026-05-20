'use client';

import type { BassProNavCategory } from './bass-pro-navigation';
import { cn } from '@/lib/utils';

type CommerceHeaderMegaMenuProps = {
  category: BassProNavCategory;
  isOpen: boolean;
  onClose: () => void;
};

export function CommerceHeaderMegaMenu({
  category,
  isOpen,
  onClose,
}: CommerceHeaderMegaMenuProps): React.ReactElement {
  const { promo, quickLinks, columns, shopAllHref, label } = category;

  return (
    <div
      id={`bps-mega-${category.id}`}
      role="region"
      aria-label={`${label} menu`}
      className={cn(
        'bps-mega-panel absolute left-0 right-0 top-full z-50 border-t border-[#c4b896] bg-[#f5f0e1] shadow-lg',
        'transition-all duration-200',
        isOpen
          ? 'pointer-events-auto visible opacity-100'
          : 'pointer-events-none invisible opacity-0',
        '[.partial-editing-mode_&]:!visible [.partial-editing-mode_&]:!opacity-100 [.partial-editing-mode_&]:!pointer-events-auto',
      )}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8">
        {promo && (
          <div className="mb-4 flex flex-wrap items-baseline gap-3 border-b border-[#d9d0bc] pb-4">
            <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a3d2b]">
              {promo.headline}
            </h2>
            <a
              href={promo.ctaHref}
              className="text-sm font-bold uppercase text-[#8b2942] hover:underline"
            >
              {promo.ctaLabel}
            </a>
          </div>
        )}

        {quickLinks && quickLinks.length > 0 && (
          <ul className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-semibold text-[#1a3d2b] hover:text-[#8b2942] hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              {column.href ? (
                <a
                  href={column.href}
                  className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#1a3d2b] hover:text-[#8b2942]"
                >
                  {column.title}
                </a>
              ) : (
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[#1a3d2b]">
                  {column.title}
                </p>
              )}
              <ul className="space-y-1.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-[#333] hover:text-[#8b2942] hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-[#d9d0bc] pt-4">
          <a
            href={shopAllHref}
            className="text-sm font-bold uppercase text-[#1a3d2b] hover:text-[#8b2942] hover:underline"
          >
            Shop All {label}
          </a>
        </div>
      </div>
    </div>
  );
}
