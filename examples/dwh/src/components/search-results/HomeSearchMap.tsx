'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { MapMarker } from './home-search-data';
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
  regionLabel?: string;
};

export function HomeSearchMap({
  markers,
  className,
  onMarkerSelect,
  center,
  zoom,
  osmBbox,
  osmMarker,
  regionLabel,
}: HomeSearchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(
    Boolean(typeof window !== 'undefined' && window.google && window.google.maps)
  );
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
        onMarkerSelect?.(marker.id);
      });

      googleMarkers.push(googleMarker);
    });

    return () => {
      googleMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [isLoaded, markers, onMarkerSelect, mapCenter, mapZoom]);

  if (!apiKey) {
    const bbox = osmBbox ?? '-122.7827%2C45.4949%2C-122.4726%2C45.7821';
    const marker = osmMarker ?? '45.6387%2C-122.6615';
    return (
      <div className={cn('relative overflow-hidden bg-[#e8edf2]', className)}>
        <iframe
          title={`${regionLabel ?? 'Area'} map`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
        />
      </div>
    );
  }

  return <div ref={mapRef} className={cn('bg-[#e8edf2]', className)} />;
}
