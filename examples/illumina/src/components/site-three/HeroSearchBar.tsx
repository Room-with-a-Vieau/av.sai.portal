'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DWH_DEFAULT_MARKET,
  DWH_MARKETS,
  buildDwhMarketSearchUrl,
  findDwhMarketByLabel,
} from '@/lib/dwh-markets';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type HeroSearchBarProps = {
  className?: string;
  searchBaseHref?: string;
  onSearch?: (marketSlug: string) => void;
};

export function HeroSearchBar({ className, searchBaseHref, onSearch }: HeroSearchBarProps) {
  const [selectedMarket, setSelectedMarket] = useState(DWH_DEFAULT_MARKET.label);

  const handleSearch = () => {
    const market = findDwhMarketByLabel(selectedMarket) ?? DWH_DEFAULT_MARKET;

    if (onSearch) {
      onSearch(market.slug);
      return;
    }

    const targetUrl = buildDwhMarketSearchUrl(searchBaseHref, market.slug);
    window.location.assign(targetUrl);
  };

  return (
    <div
      className={cn(
        'flex w-full overflow-hidden rounded-sm bg-[#f7f3ed] shadow-[0_8px_24px_rgb(47_47_45_/_0.18)]',
        className
      )}
      data-testid="hero-search-bar"
    >
      <div className="w-1 shrink-0 bg-[#f2894f]" aria-hidden />

      <div className="flex w-full flex-col gap-4 p-4 lg:flex-row lg:items-center lg:gap-8 lg:py-4 lg:pl-6 lg:pr-3">
        <p className="shrink-0 px-0 text-lg font-bold leading-tight text-[#2f2f2d] lg:px-4 lg:text-xl xl:text-2xl">
          Find Your New <span className="text-[#f2894f]">Dream Home</span>
        </p>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:gap-0">
          <div className="relative flex min-w-0 flex-1 items-center border-b border-[#d8cfc3] px-1 sm:border-b-0 sm:border-r sm:px-4 lg:min-h-[3.25rem]">
            <MapPin
              className="pointer-events-none absolute left-1 size-4 shrink-0 text-[#f2894f] sm:left-4 lg:left-5"
              aria-hidden
            />
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger
                aria-label="Select a market"
                className="h-11 w-full border-0 bg-transparent pl-8 pr-8 text-sm font-medium text-[#2f2f2d] shadow-none focus:ring-0 focus:ring-offset-0 sm:pl-10 sm:text-base lg:h-12 [&>svg]:text-[#2f2f2d]"
              >
                <SelectValue placeholder="Choose a location" />
              </SelectTrigger>
              <SelectContent className="max-h-72 border-[#d8cfc3] bg-[#f7f3ed]">
                {DWH_MARKETS.map((market) => (
                  <SelectItem
                    key={market.slug}
                    value={market.label}
                    className="text-[#2f2f2d] focus:bg-[#d8cfc3] focus:text-[#2f2f2d]"
                  >
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex shrink-0 items-center p-2 sm:p-3">
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#f2894f] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#e07a42] sm:px-10 lg:px-12"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
