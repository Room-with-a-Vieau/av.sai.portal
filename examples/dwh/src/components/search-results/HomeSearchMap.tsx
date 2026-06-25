'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { MapBounds, MapMarker } from './home-search-data';
import { HOME_SEARCH_MAP_CENTER, HOME_SEARCH_MAP_ZOOM } from './home-search-data';

declare global {
  interface Window {
    google: any;
    initHomeSearchMap: () => void;
  }
}

type HomeSearchMapProps = {
  markers: MapMarker[];
  className?: string;
  onMarkerSelect?: (markerId: string) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  osmBbox?: string;
  osmMarker?: string;
  bounds?: MapBounds;
  regionLabel?: string;
};

function formatPriceFrom(value?: number): string {
  if (!value) return '';
  return `From ${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function bubbleHtml(marker: MapMarker): string {
  const price = formatPriceFrom(marker.priceFrom);
  return `
    <div style="min-width:170px;font-family:inherit">
      <div style="font-weight:700;color:#2f2f2d;font-size:14px;line-height:1.2">${marker.label}</div>
      ${marker.area ? `<div style="color:#6b7280;font-size:12px;margin-top:2px">${marker.area}, TX</div>` : ''}
      ${price ? `<div style="color:#2f2f2d;font-size:12px;margin-top:6px">${price}</div>` : ''}
      ${
        marker.count
          ? `<div style="color:#f2894f;font-size:11px;font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:.04em">${marker.count} homes available</div>`
          : ''
      }
    </div>`;
}

/**
 * Replicates Leaflet `fitBounds` for the OSM embed: the requested bbox is shown
 * fully and centered, expanding the longer axis to fill the frame. Returns the
 * visible bounds so overlay pins line up with the rendered map.
 */
function computeVisibleBounds(bounds: MapBounds, width: number, height: number): MapBounds {
  if (!width || !height) return bounds;
  const centerLat = (bounds.top + bounds.bottom) / 2;
  const cosLat = Math.cos((centerLat * Math.PI) / 180) || 1;

  const bboxWidth = (bounds.right - bounds.left) * cosLat;
  const bboxHeight = bounds.top - bounds.bottom;
  const frameAspect = width / height;
  const bboxAspect = bboxWidth / bboxHeight;

  if (frameAspect > bboxAspect) {
    const visibleWidth = bboxHeight * frameAspect;
    const extraLng = (visibleWidth - bboxWidth) / 2 / cosLat;
    return {
      left: bounds.left - extraLng,
      right: bounds.right + extraLng,
      top: bounds.top,
      bottom: bounds.bottom,
    };
  }

  const visibleHeight = bboxWidth / frameAspect;
  const extraLat = (visibleHeight - bboxHeight) / 2;
  return {
    left: bounds.left,
    right: bounds.right,
    top: bounds.top + extraLat,
    bottom: bounds.bottom - extraLat,
  };
}

export function HomeSearchMap({
  markers,
  className,
  onMarkerSelect,
  center,
  zoom,
  osmBbox,
  osmMarker,
  bounds,
  regionLabel,
}: HomeSearchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(
    Boolean(typeof window !== 'undefined' && window.google && window.google.maps)
  );
  const [fallbackSize, setFallbackSize] = useState({ width: 0, height: 0 });
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const mapCenter = center ?? HOME_SEARCH_MAP_CENTER;
  const mapZoom = zoom ?? HOME_SEARCH_MAP_ZOOM;

  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-home-search';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initHomeSearchMap`;
    script.async = true;
    script.defer = true;

    window.initHomeSearchMap = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      window.initHomeSearchMap = () => {};
    };
  }, [apiKey]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google || !window.google.maps) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    });

    const infoWindow = new window.google.maps.InfoWindow();
    const googleMarkers: any[] = [];

    markers.forEach((marker) => {
      const icon =
        marker.type === 'design-center'
          ? {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#dc2626',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 10,
            }
          : {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#2f5f8f',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 14,
            };

      const googleMarker = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map,
        title: marker.label,
        icon,
        label:
          marker.type === 'community' && marker.count
            ? { text: String(marker.count), color: '#ffffff', fontWeight: '700', fontSize: '11px' }
            : undefined,
      });

      googleMarker.addListener('click', () => {
        if (marker.type === 'community') {
          infoWindow.setContent(bubbleHtml(marker));
          infoWindow.open({ map, anchor: googleMarker });
        }
        onMarkerSelect?.(marker.id);
      });

      googleMarkers.push(googleMarker);
    });

    return () => {
      infoWindow.close();
      googleMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [isLoaded, markers, onMarkerSelect, mapCenter, mapZoom]);

  useEffect(() => {
    if (apiKey) return;
    const element = fallbackRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setFallbackSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [apiKey]);

  const fallbackPins = useMemo(() => {
    if (apiKey || !bounds || !fallbackSize.width || !fallbackSize.height) return [];
    const visible = computeVisibleBounds(bounds, fallbackSize.width, fallbackSize.height);
    const spanLng = visible.right - visible.left;
    const spanLat = visible.top - visible.bottom;
    if (!spanLng || !spanLat) return [];

    return markers
      .map((marker) => ({
        marker,
        x: ((marker.lng - visible.left) / spanLng) * 100,
        y: ((visible.top - marker.lat) / spanLat) * 100,
      }))
      .filter((pin) => pin.x >= -2 && pin.x <= 102 && pin.y >= -2 && pin.y <= 102);
  }, [apiKey, bounds, fallbackSize, markers]);

  if (!apiKey) {
    const bbox = osmBbox ?? '-122.7827%2C45.4949%2C-122.4726%2C45.7821';
    const marker = osmMarker ?? '45.6387%2C-122.6615';
    const activePin = fallbackPins.find((pin) => pin.marker.id === activeMarkerId);

    return (
      <div
        ref={fallbackRef}
        className={cn('relative overflow-hidden bg-[#e8edf2]', className)}
        onClick={() => setActiveMarkerId(null)}
      >
        <iframe
          title={`${regionLabel ?? 'Area'} map`}
          className="pointer-events-none h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
        />

        <div className="pointer-events-none absolute inset-0">
          {fallbackPins.map((pin) => {
            const isDesignCenter = pin.marker.type === 'design-center';
            const isActive = pin.marker.id === activeMarkerId;
            return (
              <button
                key={pin.marker.id}
                type="button"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className={cn(
                  'pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white text-[11px] font-bold text-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#f2894f]',
                  isDesignCenter ? 'size-5 bg-[#dc2626]' : 'flex size-7 items-center justify-center bg-[#2f5f8f]',
                  isActive && 'z-20 scale-110 ring-2 ring-[#f2894f]'
                )}
                aria-label={pin.marker.label}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveMarkerId((current) =>
                    current === pin.marker.id ? null : pin.marker.id
                  );
                  onMarkerSelect?.(pin.marker.id);
                }}
              >
                {!isDesignCenter && pin.marker.count ? pin.marker.count : ''}
              </button>
            );
          })}

          {activePin ? (
            <div
              style={{
                left: `${Math.min(Math.max(activePin.x, 12), 88)}%`,
                top: `${activePin.y}%`,
              }}
              className="pointer-events-auto absolute z-30 w-48 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-[#d8cfc3] bg-white p-3 text-left shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-sm font-bold leading-tight text-[#2f2f2d]">{activePin.marker.label}</p>
              {activePin.marker.area ? (
                <p className="mt-0.5 text-xs text-[#6b7280]">{activePin.marker.area}, TX</p>
              ) : null}
              {activePin.marker.priceFrom ? (
                <p className="mt-1.5 text-xs text-[#2f2f2d]">{formatPriceFrom(activePin.marker.priceFrom)}</p>
              ) : null}
              {activePin.marker.count ? (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#f2894f]">
                  {activePin.marker.count} homes available
                </p>
              ) : null}
              <span className="absolute left-1/2 top-full size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#d8cfc3] bg-white" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={cn('bg-[#e8edf2]', className)} />;
}
