'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Home, MapPin, Search, Star } from 'lucide-react';

import type { ComponentProps } from '@/lib/component-props';
import { DWH_MARKETS } from '@/lib/dwh-markets';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { HomeSearchMap } from './HomeSearchMap';
import {
  cityFilterOptions,
  countListings,
  FILTER_SHOW_ALL,
  filterHomeCommunities,
  formatPrice,
  homeSearchCommunities,
  homeSearchMapMarkers,
  priceFilterOptions,
  regionFilterOptions,
  resolveMarketDisplay,
  type HomeCommunity,
  type HomeListing,
  type HomeSearchTab,
} from './home-search-data';

export type SearchResultsProps = {
  className?: string;
  disableUrlSync?: boolean;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#f2894f]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn('size-4', index < Math.floor(rating) ? 'fill-current' : 'fill-none')}
          aria-hidden
        />
      ))}
    </div>
  );
}

function HomeListingRow({
  community,
  listing,
}: {
  community: HomeCommunity;
  listing: HomeListing;
}) {
  return (
    <article className="grid gap-4 border-t border-[#d8cfc3]/80 py-6 md:grid-cols-[9rem_minmax(0,1fr)_12rem] md:items-center">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f3ed]">
        <Image
          src={listing.imageSrc}
          alt={listing.name}
          fill
          className="object-cover"
          sizes="144px"
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#2f2f2d]">
          {community.name} <span className="text-[#a7a09a]">&gt;</span>
        </p>
        <h3 className="mt-1 text-lg font-bold text-[#2f2f2d]">{listing.name}</h3>
        <p className="mt-1 text-sm text-[#2f2f2d]">
          From {formatPrice(listing.priceFrom)}
        </p>
        <p className="text-sm text-[#a7a09a]">
          {listing.sqFtMin.toLocaleString()} - {listing.sqFtMax.toLocaleString()} Sq. Ft.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-[#328ac9]">
          <a href="#floor-plans" className="hover:underline">
            View {listing.floorPlanCount} Floor Plans
          </a>
          <a href="#quick-move-ins" className="hover:underline">
            View {listing.quickMoveInCount} Quick Move-ins
          </a>
          <a href="#share" className="hover:underline">
            Share Community
          </a>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 md:items-end">
        <button
          type="button"
          className="bg-[#f2894f] px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#e07a42]"
        >
          Schedule Model Home Tour
        </button>
        <label className="flex items-center gap-2 text-xs text-[#2f2f2d]">
          <Checkbox id={`compare-${listing.id}`} />
          <span>Select to Compare</span>
        </label>
      </div>
    </article>
  );
}

function CommunitySection({ community }: { community: HomeCommunity }) {
  return (
    <section className="border-b border-[#d8cfc3]">
      <div className="flex flex-col gap-1 border-b border-[#d8cfc3]/70 bg-[#faf8f5] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-0">
        <h2 className="font-serif text-2xl font-medium text-[#2f2f2d]">{community.name}</h2>
        <p className="text-sm text-[#a7a09a]">
          {community.city}, {community.state} | {community.region.replace(/^./, (c) => c.toUpperCase())}
        </p>
      </div>
      <div className="px-0">
        {community.listings.map((listing) => (
          <HomeListingRow key={listing.id} community={community} listing={listing} />
        ))}
      </div>
    </section>
  );
}

export const SearchResults: FC<SearchResultsProps> = ({ className, disableUrlSync = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const marketFromUrl = searchParams.get('market') ?? 'portland';

  const [activeTab, setActiveTab] = useState<HomeSearchTab>('home-search');
  const [zipCode, setZipCode] = useState('');
  const [price, setPrice] = useState(FILTER_SHOW_ALL);
  const [city, setCity] = useState(FILTER_SHOW_ALL);
  const [region, setRegion] = useState(FILTER_SHOW_ALL);
  const [planQuery, setPlanQuery] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedMarketSlug, setSelectedMarketSlug] = useState(marketFromUrl);

  useEffect(() => {
    if (disableUrlSync) return;
    const slug = searchParams.get('market');
    if (slug) setSelectedMarketSlug(slug);
  }, [disableUrlSync, searchParams]);

  const syncMarketUrl = useCallback(
    (slug: string) => {
      if (disableUrlSync) return;
      const params = new URLSearchParams(searchParams.toString());
      if (slug) params.set('market', slug);
      else params.delete('market');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [disableUrlSync, pathname, router, searchParams]
  );

  const marketDisplay = useMemo(
    () => resolveMarketDisplay(selectedMarketSlug),
    [selectedMarketSlug]
  );

  const filteredCommunities = useMemo(
    () =>
      filterHomeCommunities(homeSearchCommunities, {
        zipCode,
        price,
        city,
        region,
        marketSlug: selectedMarketSlug,
      }),
    [zipCode, price, city, region, selectedMarketSlug]
  );

  const communityCount = filteredCommunities.length;
  const listingCount = countListings(filteredCommunities);

  const visibleMarkers = useMemo(() => {
    const communityIds = new Set(filteredCommunities.map((community) => community.id));
    return homeSearchMapMarkers.filter(
      (marker) =>
        marker.type === 'design-center' ||
        (marker.communityId && communityIds.has(marker.communityId))
    );
  }, [filteredCommunities]);

  const handleCityChange = (value: string) => {
    setCity(value);
    if (value !== FILTER_SHOW_ALL) {
      setSelectedMarketSlug(value);
      syncMarketUrl(value);
    }
  };

  const handleMarketSelect = (slug: string) => {
    setSelectedMarketSlug(slug);
    setCity(slug);
    syncMarketUrl(slug);
  };

  return (
    <section className={cn('bg-white text-[#2f2f2d]', className)} aria-label="Find a home search results">
      <div className="border-b border-[#d8cfc3]">
        <HomeSearchMap markers={visibleMarkers} className="h-[320px] w-full sm:h-[380px] lg:h-[420px]" />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-3 text-xs text-[#2f2f2d]">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-5 items-center justify-center rounded-sm bg-[#2f5f8f] text-[10px] font-bold text-white">
              <Home className="size-3" aria-hidden />
            </span>
            <span>Communities</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#dc2626] text-white">
              ★
            </span>
            <span>Design Center</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-wide text-[#a7a09a]">
          <ol className="flex flex-wrap items-center gap-2">
            {marketDisplay.breadcrumb.map((crumb, index) => (
              <li key={`${crumb}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden>/</span> : null}
                <span className={index === marketDisplay.breadcrumb.length - 1 ? 'text-[#2f2f2d]' : ''}>
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <h1 className="font-serif text-4xl font-medium text-[#2f2f2d]">Find a Home</h1>
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-[#d8cfc3] px-4 py-2 text-sm font-medium text-[#2f2f2d] hover:bg-[#f7f3ed]"
            >
              About the {marketDisplay.label.split(',')[0]} Market
              <ChevronDown className="size-4" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="text-xs font-bold uppercase tracking-wider text-[#a7a09a]">113 Reviews</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#2f2f2d]">4.8</span>
              <StarRating rating={4.8} />
            </div>
            <button
              type="button"
              className="bg-[#f2894f] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e07a42]"
            >
              Read Reviews
            </button>
          </div>
        </div>

        <div className="mt-8 border-b border-[#d8cfc3]">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setActiveTab('home-search')}
              className={cn(
                'border-b-2 pb-3 text-xs font-bold uppercase tracking-wider',
                activeTab === 'home-search'
                  ? 'border-[#f2894f] text-[#2f2f2d]'
                  : 'border-transparent text-[#a7a09a]'
              )}
            >
              Home Search
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('plan-lookup')}
              className={cn(
                'border-b-2 pb-3 text-xs font-bold uppercase tracking-wider',
                activeTab === 'plan-lookup'
                  ? 'border-[#f2894f] text-[#2f2f2d]'
                  : 'border-transparent text-[#a7a09a]'
              )}
            >
              Plan Lookup
            </button>
          </div>
        </div>

        {activeTab === 'home-search' ? (
          <>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2f2f2d]">
                  Zip Code
                </span>
                <div className="flex overflow-hidden border border-[#d8cfc3]">
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(event) => setZipCode(event.target.value)}
                    placeholder="Enter zip"
                    className="h-11 min-w-0 flex-1 bg-white px-3 text-sm outline-none"
                  />
                  <button
                    type="button"
                    className="flex w-12 items-center justify-center bg-[#f2894f] text-white hover:bg-[#e07a42]"
                    aria-label="Search by zip code"
                  >
                    <Search className="size-4" aria-hidden />
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2f2f2d]">
                  Price
                </span>
                <Select value={price} onValueChange={setPrice}>
                  <SelectTrigger className="h-11 rounded-none border-[#d8cfc3] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2f2f2d]">
                  City
                </span>
                <Select value={city} onValueChange={handleCityChange}>
                  <SelectTrigger className="h-11 rounded-none border-[#d8cfc3] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {cityFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2f2f2d]">
                  Region
                </span>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-11 rounded-none border-[#d8cfc3] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regionFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <button
                type="button"
                onClick={() => setShowMoreFilters((open) => !open)}
                className="h-11 bg-[#f2894f] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e07a42] lg:mb-0"
              >
                More Filters
              </button>
            </div>

            {showMoreFilters ? (
              <div className="mt-4 grid gap-4 border border-[#d8cfc3] bg-[#f7f3ed] p-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Bedrooms</span>
                  <Select defaultValue={FILTER_SHOW_ALL}>
                    <SelectTrigger className="h-10 rounded-none border-[#d8cfc3] bg-white">
                      <SelectValue placeholder="Select your option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FILTER_SHOW_ALL}>Show All</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Bathrooms</span>
                  <Select defaultValue={FILTER_SHOW_ALL}>
                    <SelectTrigger className="h-10 rounded-none border-[#d8cfc3] bg-white">
                      <SelectValue placeholder="Select your option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FILTER_SHOW_ALL}>Show All</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Stories</span>
                  <Select defaultValue={FILTER_SHOW_ALL}>
                    <SelectTrigger className="h-10 rounded-none border-[#d8cfc3] bg-white">
                      <SelectValue placeholder="Select your option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FILTER_SHOW_ALL}>Show All</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Owner&apos;s Retreat</span>
                  <Select defaultValue={FILTER_SHOW_ALL}>
                    <SelectTrigger className="h-10 rounded-none border-[#d8cfc3] bg-white">
                      <SelectValue placeholder="Select your option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FILTER_SHOW_ALL}>Show All</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex bg-[#f2894f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                {communityCount} {communityCount === 1 ? 'Community' : 'Communities'}
              </span>

              <div className="flex items-center gap-2 text-sm text-[#a7a09a]">
                <MapPin className="size-4 text-[#f2894f]" aria-hidden />
                <span>Selected market:</span>
                <Select value={selectedMarketSlug} onValueChange={handleMarketSelect}>
                  <SelectTrigger className="h-9 w-[14rem] rounded-none border-[#d8cfc3] bg-white text-[#2f2f2d]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {DWH_MARKETS.map((market) => (
                      <SelectItem key={market.slug} value={market.slug}>
                        {market.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="mt-6 max-w-4xl text-sm leading-relaxed text-[#2f2f2d]">
              David Weekley Homes has new homes for sale in the {marketDisplay.label.split(',')[0]} area.
              Browse communities, compare floor plans, and schedule a model home tour to experience the
              David Weekley Difference.
            </p>

            {filteredCommunities.length > 0 ? (
              <div className="mt-4">
                {filteredCommunities.map((community) => (
                  <CommunitySection key={community.id} community={community} />
                ))}
              </div>
            ) : (
              <div className="mt-10 border border-dashed border-[#d8cfc3] bg-[#f7f3ed] px-6 py-12 text-center">
                <p className="text-sm font-medium text-[#2f2f2d]">
                  No matching homes were found for the selected search criteria.
                </p>
                <p className="mt-2 text-sm text-[#a7a09a]">
                  Try modifying your filter selections to view more homes.
                </p>
              </div>
            )}

            <p className="mt-8 text-xs leading-relaxed text-[#a7a09a]">
              Figures reflecting size, square footage, and other dimensions are estimates; actual
              construction may vary. Prices, plans, dimensions, features, and availability of homes or
              communities are subject to change without notice or obligation.
            </p>
          </>
        ) : (
          <div className="mt-8 max-w-xl">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2f2f2d]">
                Plan Name or Number
              </span>
              <div className="flex overflow-hidden border border-[#d8cfc3]">
                <input
                  type="search"
                  value={planQuery}
                  onChange={(event) => setPlanQuery(event.target.value)}
                  placeholder="Search plans"
                  className="h-11 min-w-0 flex-1 bg-white px-3 text-sm outline-none"
                />
                <button
                  type="button"
                  className="bg-[#f2894f] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e07a42]"
                >
                  Search
                </button>
              </div>
            </label>
            <p className="mt-4 text-sm text-[#a7a09a]">
              {listingCount} floor plans available in the selected market.
            </p>
          </div>
        )}

        <section className="mt-12 border-t border-[#d8cfc3] pt-10 text-center">
          <h2 className="font-serif text-2xl text-[#2f2f2d]">
            We&apos;re here to help you find your new home
          </h2>
          <button
            type="button"
            className="mt-4 bg-[#f2894f] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e07a42]"
          >
            Contact Us
          </button>
        </section>
      </div>
    </section>
  );
};

export const Default = (props: ComponentProps) => (
  <SearchResults className={typeof props.params?.styles === 'string' ? props.params.styles : undefined} />
);
