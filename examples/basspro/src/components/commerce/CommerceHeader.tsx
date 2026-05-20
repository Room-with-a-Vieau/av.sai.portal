'use client';

/**
 * CommerceHeader — Bass Pro Shops header replica for Sitecore XM Cloud POC.
 *
 * Drop into a SitecoreAI Partial Design (`headless-header` or dedicated placeholder).
 * All commerce links target https://www.basspro.com so navigation matches production behavior.
 *
 * Sitecore registration: component name `CommerceHeader`, export `Default`.
 */

import type React from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BASS_PRO_MAIN_NAV, BASS_PRO_SIMPLE_NAV } from './bass-pro-navigation';
import {
  BASS_PRO_ACCOUNT_LINKS,
  BASS_PRO_CART_URL,
  BASS_PRO_CREATE_ACCOUNT_URL,
  BASS_PRO_CUSTOMER_SERVICE_ICON,
  BASS_PRO_CUSTOMER_SERVICE_URL,
  BASS_PRO_FREE_SHIPPING_URL,
  BASS_PRO_HOME_URL,
  BASS_PRO_LOGO_DESKTOP,
  BASS_PRO_LOGO_MOBILE,
  BASS_PRO_PROMO,
  BASS_PRO_SEARCH_ACTION,
  BASS_PRO_SIGN_IN_URL,
  BASS_PRO_STORES_URL,
  BASS_PRO_UTILITY_LINKS,
} from './commerce-header.constants';
import { CommerceHeaderMegaMenu } from './CommerceHeaderMegaMenu';
import type { CommerceHeaderProps } from './commerce-header.props';
import './commerce-header.css';

export const Default: React.FC<CommerceHeaderProps> = (props) => {
  const { params } = props;
  const navId = useId();
  const headerRef = useRef<HTMLElement>(null);

  const [activeMegaId, setActiveMegaId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMegaId, setMobileMegaId] = useState<string | null>(null);

  const closeMega = useCallback(() => setActiveMegaId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMega();
        setMobileOpen(false);
        setAccountOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeMega]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className={cn('bps-header sticky top-0 z-[60] w-full', params?.styles)}
      data-component="commerce-header"
      role="banner"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-[#1a3d2b]"
      >
        Skip to main content
      </a>

      {/* Promo strip */}
      <div className="bps-header__promo-bar">
        <div className="mx-auto flex max-w-[100rem] items-center justify-center gap-2 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wider sm:text-sm">
          <a href={BASS_PRO_PROMO.href} className="!text-white hover:!underline">
            {BASS_PRO_PROMO.label}
            <span className="mx-2 opacity-70">|</span>
            {BASS_PRO_PROMO.cta}
          </a>
        </div>
      </div>

      {/* Utility row */}
      <div className="bps-header__utility-bar hidden lg:block">
        <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-4 px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1 !text-white hover:!underline"
              aria-label="Select a store"
              onClick={() => window.open(BASS_PRO_STORES_URL, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              <span className="font-semibold">My Store:</span>
              <span className="font-normal">Select a Store</span>
            </button>
          </div>
          <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
            {BASS_PRO_UTILITY_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={BASS_PRO_FREE_SHIPPING_URL} className="shrink-0 font-bold !text-white hover:!underline">
            <span className="font-extrabold">FREE</span> Shipping on Orders $50+
          </a>
        </div>
      </div>

      {/* Logo + search + account + cart */}
      <div className="bps-header__main-bar">
        <div className="mx-auto flex max-w-[100rem] items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-[#1a3d2b] lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls={`${navId}-mobile`}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <a href={BASS_PRO_HOME_URL} className="shrink-0" aria-label="Bass Pro Shops home">
            <Image
              src={BASS_PRO_LOGO_DESKTOP}
              alt="Bass Pro Shops"
              width={220}
              height={56}
              className="hidden h-12 w-auto max-w-[220px] object-contain sm:h-14 lg:block"
              priority
              unoptimized
            />
            <Image
              src={BASS_PRO_LOGO_MOBILE}
              alt="Bass Pro Shops"
              width={120}
              height={40}
              className="h-9 w-auto object-contain lg:hidden"
              priority
              unoptimized
            />
          </a>

          <form
            action={BASS_PRO_SEARCH_ACTION}
            method="get"
            role="search"
            className={cn(
              'mx-auto hidden max-w-xl flex-1 lg:flex',
              searchOpen && 'flex !max-w-none basis-full lg:max-w-xl',
            )}
          >
            <label htmlFor={`${navId}-search`} className="sr-only">
              Search Bass Pro Shops
            </label>
            <div className="relative flex w-full">
              <input
                id={`${navId}-search`}
                name="searchTerm"
                type="search"
                placeholder="Search"
                className="bps-header__search-input h-10 w-full rounded-sm border-r-0 pr-12 pl-3 text-sm"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center bg-[#1a3d2b] text-white hover:bg-[#2f5c3f]"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <ul className="ml-auto flex list-none items-center gap-0 p-0">
            <li className="lg:hidden">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-[#1a3d2b]"
                aria-label="Search"
                onClick={() => setSearchOpen((s) => !s)}
              >
                <Search className="h-5 w-5" />
              </button>
            </li>
            <li className="relative hidden sm:block">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[#1a3d2b]"
                aria-expanded={accountOpen}
                aria-haspopup="true"
                onClick={() => setAccountOpen((o) => !o)}
              >
                <Image
                  src={BASS_PRO_CUSTOMER_SERVICE_ICON}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  unoptimized
                />
                <span className="hidden md:inline">Sign In</span>
                <ChevronDown className="h-4 w-4" aria-hidden />
              </button>
              {accountOpen && (
                <div className="bps-header__account-panel absolute right-0 top-full z-50 min-w-[14rem] py-2">
                  <ul className="text-sm">
                    <li>
                      <a
                        href={BASS_PRO_SIGN_IN_URL}
                        className="block px-4 py-2 font-bold text-[#1a3d2b] hover:bg-[#f5f0e1]"
                      >
                        Sign In
                      </a>
                    </li>
                    <li>
                      <a
                        href={BASS_PRO_CREATE_ACCOUNT_URL}
                        className="block px-4 py-2 font-bold text-[#1a3d2b] hover:bg-[#f5f0e1]"
                      >
                        Create Account
                      </a>
                    </li>
                    <li className="my-1 border-t border-[#eee]" />
                    {BASS_PRO_ACCOUNT_LINKS.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className="block px-4 py-2 text-[#333] hover:bg-[#f5f0e1]">
                          {link.label}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href={BASS_PRO_CUSTOMER_SERVICE_URL}
                        className="block px-4 py-2 text-[#333] hover:bg-[#f5f0e1]"
                      >
                        Customer Service
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <a
                href={BASS_PRO_CART_URL}
                className="relative flex items-center gap-1 px-3 py-2 text-[#1a3d2b]"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="bps-header__cart-badge absolute -top-0.5 -right-0.5 flex h-4 items-center justify-center rounded-full px-1">
                  0
                </span>
              </a>
            </li>
          </ul>
        </div>

        {searchOpen && (
          <div className="border-t border-[#eee] px-4 pb-3 lg:hidden">
            <form action={BASS_PRO_SEARCH_ACTION} method="get" role="search">
              <label htmlFor={`${navId}-search-mobile`} className="sr-only">
                Search
              </label>
              <div className="relative flex">
                <input
                  id={`${navId}-search-mobile`}
                  name="searchTerm"
                  type="search"
                  placeholder="Search"
                  className="bps-header__search-input h-10 w-full rounded-sm pl-3 text-sm"
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center bg-[#1a3d2b] text-white"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Desktop primary navigation */}
      <nav
        className="bps-header__nav-bar relative hidden lg:block"
        aria-label="Primary"
        onMouseLeave={closeMega}
      >
        <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-8">
          <ul className="flex list-none flex-wrap items-stretch gap-0 p-0">
            {BASS_PRO_MAIN_NAV.map((category) => (
              <li
                key={category.id}
                className="bps-header__nav-item relative"
                onMouseEnter={() => setActiveMegaId(category.id)}
              >
                <button
                  type="button"
                  className="flex h-11 items-center gap-0.5 px-3 py-2"
                  aria-expanded={activeMegaId === category.id}
                  aria-controls={`bps-mega-${category.id}`}
                  onClick={() =>
                    setActiveMegaId((id) => (id === category.id ? null : category.id))
                  }
                >
                  {category.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-80" aria-hidden />
                </button>
                <CommerceHeaderMegaMenu
                  category={category}
                  isOpen={activeMegaId === category.id}
                  onClose={closeMega}
                />
              </li>
            ))}
            {BASS_PRO_SIMPLE_NAV.map((link) => (
              <li key={link.href} className="bps-header__nav-item">
                <a href={link.href} className="flex h-11 items-center px-3 py-2">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div
          id={`${navId}-mobile`}
          className="bps-header__mobile-drawer fixed inset-x-0 bottom-0 top-[var(--bps-mobile-top,8rem)] z-50 overflow-y-auto border-t border-[#c4b896] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <div className="px-4 py-3">
            <a
              href={BASS_PRO_FREE_SHIPPING_URL}
              className="mb-3 block text-center text-sm font-bold text-[#1a3d2b]"
            >
              FREE Shipping on Orders $50+
            </a>
            <ul className="space-y-0 border border-[#d9d0bc] bg-white">
              {BASS_PRO_MAIN_NAV.map((category) => (
                <li key={category.id} className="border-b border-[#eee]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-[#1a3d2b]"
                    aria-expanded={mobileMegaId === category.id}
                    onClick={() =>
                      setMobileMegaId((id) => (id === category.id ? null : category.id))
                    }
                  >
                    {category.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        mobileMegaId === category.id && 'rotate-180',
                      )}
                    />
                  </button>
                  {mobileMegaId === category.id && (
                    <div className="bg-[#f5f0e1] px-4 py-3">
                      <a
                        href={category.shopAllHref}
                        className="mb-3 block text-sm font-bold text-[#8b2942]"
                      >
                        Shop All {category.label}
                      </a>
                      {category.columns.map((col) => (
                        <div key={col.title} className="mb-4">
                          <a href={col.href ?? category.shopAllHref} className="text-sm font-bold text-[#1a3d2b]">
                            {col.title}
                          </a>
                          <ul className="mt-1 space-y-1 pl-2">
                            {col.links.slice(0, 5).map((link) => (
                              <li key={link.href}>
                                <a href={link.href} className="text-sm text-[#444]">
                                  {link.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              {BASS_PRO_SIMPLE_NAV.map((link) => (
                <li key={link.href} className="border-b border-[#eee]">
                  <a href={link.href} className="block px-4 py-3 font-semibold text-[#1a3d2b]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 text-sm">
              <a href={BASS_PRO_SIGN_IN_URL} className="block font-bold text-[#1a3d2b]">
                Sign In
              </a>
              <a href={BASS_PRO_CUSTOMER_SERVICE_URL} className="block text-[#444]">
                Customer Service
              </a>
              <a href={BASS_PRO_STORES_URL} className="flex items-center gap-1 text-[#444]">
                <MapPin className="h-4 w-4" /> Find a Store
              </a>
            </div>
          </div>
        </div>
      )}

      {accountOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 lg:block"
          aria-label="Close account menu"
          onClick={() => setAccountOpen(false)}
        />
      )}
    </header>
  );
};

export default Default;
