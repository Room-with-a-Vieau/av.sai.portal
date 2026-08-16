'use client';

import type React from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  Field,
  ImageField,
  Link as ContentSdkLink,
  LinkField,
  NextImage as ContentSdkImage,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';

type JsonField<T> = { jsonValue?: T };

type MediaCanvasItem = {
  id?: string;
  image?: JsonField<ImageField>;
  video?: JsonField<LinkField>;
  tagline?: JsonField<Field<string>>;
};

type MediaCanvasDatasource = {
  title?: JsonField<Field<string>>;
  subtitle?: JsonField<Field<string>>;
  cta?: JsonField<LinkField>;
  pauseVideoLabel?: JsonField<Field<string>>;
  playVideoLabel?: JsonField<Field<string>>;
  children?: {
    results?: MediaCanvasItem[];
  };
};

export type MediaCanvasProps = ComponentProps & {
  fields?: {
    data?: {
      datasource?: MediaCanvasDatasource | null;
    };
  };
  isPageEditing?: boolean;
};

type CollageSlot = {
  top: string;
  left: string;
  width: string;
  zIndex: number;
};

/** Stable collage slots (desktop). Index maps deterministically — no Math.random. */
const COLLAGE_SLOTS: CollageSlot[] = [
  { top: '4%', left: '3%', width: '16%', zIndex: 2 },
  { top: '6%', left: '78%', width: '16%', zIndex: 3 },
  { top: '36%', left: '80%', width: '18%', zIndex: 4 },
  { top: '68%', left: '6%', width: '17%', zIndex: 3 },
  { top: '70%', left: '38%', width: '14%', zIndex: 2 },
  { top: '48%', left: '2%', width: '13%', zIndex: 1 },
  { top: '18%', left: '20%', width: '12%', zIndex: 1 },
  { top: '58%', left: '62%', width: '13%', zIndex: 2 },
];

function fieldString(field?: JsonField<Field<string>> | null): string {
  const value = field?.jsonValue?.value;
  return typeof value === 'string' ? value.trim() : '';
}

function linkHref(field?: JsonField<LinkField> | null): string {
  const value = field?.jsonValue?.value;
  const href = value?.href || value?.url;
  return typeof href === 'string' ? href.trim() : '';
}

function hasCta(field?: JsonField<LinkField> | null): boolean {
  const href = linkHref(field);
  return Boolean(href && href !== 'http://');
}

function hashToSlotIndex(id: string, index: number): number {
  let hash = 0;
  const seed = id || String(index);
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash + index) % COLLAGE_SLOTS.length;
}

const MediaCanvasEmpty: React.FC = () => (
  <div className="border-border bg-muted/20 text-muted-foreground rounded-2xl border border-dashed px-6 py-12 text-center text-sm">
    Add media tiles to this canvas.
  </div>
);

const EMPTY_IMAGE_FIELD: ImageField = { value: {} };
const EMPTY_LINK_FIELD: LinkField = { value: { href: '' } };
const EMPTY_TEXT_FIELD: Field<string> = { value: '' };

/** Pages editor card: always render child fields so chrome can select this tile. */
function MediaTileEditor({ item }: { item: MediaCanvasItem }) {
  return (
    <article className="pointer-events-auto relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm">
      <div className="aspect-square overflow-hidden rounded-sm bg-neutral-200">
        <ContentSdkImage
          field={item.image?.jsonValue ?? EMPTY_IMAGE_FIELD}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs font-medium">Video</p>
        <ContentSdkLink
          field={item.video?.jsonValue ?? EMPTY_LINK_FIELD}
          className="text-primary text-sm underline underline-offset-2"
        />
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs font-medium">Tagline</p>
        <Text
          field={item.tagline?.jsonValue ?? EMPTY_TEXT_FIELD}
          tag="p"
          className="text-sm"
        />
      </div>
    </article>
  );
}

function MediaTile({
  item,
  videosPaused,
  videoRef,
  slot,
}: {
  item: MediaCanvasItem;
  videosPaused: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  slot: CollageSlot;
}) {
  const videoUrl = linkHref(item.video);
  const hasImage = Boolean(item.image?.jsonValue?.value?.src);
  const tagline = fieldString(item.tagline);

  return (
    <article
      className="group absolute aspect-square hidden overflow-hidden rounded-sm bg-neutral-200 shadow-sm md:block"
      style={{
        top: slot.top,
        left: slot.left,
        width: slot.width,
        zIndex: slot.zIndex,
      }}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={videoUrl}
          muted
          loop
          playsInline
          autoPlay={!videosPaused}
          poster={item.image?.jsonValue?.value?.src}
        />
      ) : hasImage ? (
        <ContentSdkImage
          field={item.image?.jsonValue}
          className="h-full w-full object-cover"
        />
      ) : null}
      {tagline ? (
        <div className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1">
          <Text
            field={item.tagline?.jsonValue}
            tag="p"
            className="text-xs text-white"
          />
        </div>
      ) : null}
    </article>
  );
}

function MediaTileStacked({
  item,
  videosPaused,
}: {
  item: MediaCanvasItem;
  videosPaused: boolean;
}) {
  const videoUrl = linkHref(item.video);
  const hasImage = Boolean(item.image?.jsonValue?.value?.src);
  const tagline = fieldString(item.tagline);

  return (
    <article className="group relative aspect-square overflow-hidden rounded-sm bg-neutral-200 shadow-sm">
      {videoUrl ? (
        <video
          className="h-full w-full object-cover"
          src={videoUrl}
          muted
          loop
          playsInline
          autoPlay={!videosPaused}
          poster={item.image?.jsonValue?.value?.src}
        />
      ) : hasImage ? (
        <ContentSdkImage
          field={item.image?.jsonValue}
          className="h-full w-full object-cover"
        />
      ) : null}
      {tagline ? (
        <div className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1">
          <Text
            field={item.tagline?.jsonValue}
            tag="p"
            className="text-xs text-white"
          />
        </div>
      ) : null}
    </article>
  );
}

const MediaCanvasDefault: React.FC<MediaCanvasProps> = (props) => {
  const { fields, params } = props;
  const { page } = useSitecore();
  const isEditing = Boolean(
    props.isPageEditing || page?.mode?.isEditing || page?.mode?.isDesignLibrary
  );
  const datasource = fields?.data?.datasource;
  const [videosPaused, setVideosPaused] = useState(false);
  const videoEls = useRef<HTMLVideoElement[]>([]);

  const items = datasource?.children?.results ?? [];
  const hasVideos = useMemo(
    () => items.some((item) => Boolean(linkHref(item.video))),
    [items]
  );

  if (!datasource) {
    return <NoDataFallback componentName="MediaCanvas" />;
  }

  const pauseLabel = fieldString(datasource.pauseVideoLabel) || 'Pause video';
  const playLabel = fieldString(datasource.playVideoLabel) || 'Play video';

  const handleToggleVideos = () => {
    const nextPaused = !videosPaused;
    setVideosPaused(nextPaused);
    videoEls.current.forEach((video) => {
      if (!video) return;
      if (nextPaused) {
        video.pause();
      } else {
        void video.play();
      }
    });
  };

  const assignVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    if (el) {
      videoEls.current[index] = el;
    }
  };

  return (
    <section
      className={cn(
        'relative isolate min-h-[70vh] w-full bg-white px-4 py-16 md:min-h-[85vh] md:py-24',
        isEditing ? 'overflow-visible' : 'overflow-hidden',
        params?.styles
      )}
      id={params?.RenderingIdentifier}
    >
      {isEditing ? (
        <div className="relative z-30 mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.length === 0 ? <MediaCanvasEmpty /> : null}
          {items.map((item, index) => (
            <MediaTileEditor key={item.id || `media-tile-edit-${index}`} item={item} />
          ))}
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            {items.map((item, index) => (
              <MediaTile
                key={item.id || `media-tile-${index}`}
                item={item}
                videosPaused={videosPaused}
                videoRef={assignVideoRef(index)}
                slot={COLLAGE_SLOTS[hashToSlotIndex(item.id || '', index)]}
              />
            ))}
          </div>
          <div className="mx-auto mb-8 grid max-w-5xl grid-cols-2 gap-3 md:hidden">
            {items.map((item, index) => (
              <MediaTileStacked
                key={`mobile-${item.id || index}`}
                item={item}
                videosPaused={videosPaused}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center">
        {(fieldString(datasource.title) || isEditing) && (
          <Text
            field={datasource.title?.jsonValue}
            tag="h1"
            className="font-serif text-4xl font-normal tracking-tight text-primary md:text-6xl lg:text-7xl"
          />
        )}
        {(fieldString(datasource.subtitle) || isEditing) && (
          <Text
            field={datasource.subtitle?.jsonValue}
            tag="p"
            className="text-muted-foreground mt-4 max-w-xl text-base md:text-lg"
          />
        )}
        {(hasCta(datasource.cta) || isEditing) && (
          <div className="mt-6">
            <Button asChild variant="link" className="text-primary">
              <ContentSdkLink field={datasource.cta?.jsonValue ?? { value: { href: '' } }} />
            </Button>
          </div>
        )}
      </div>

      {(hasVideos || isEditing) && (
        <div className="relative z-20 mt-10 flex justify-end md:absolute md:bottom-8 md:right-8 md:mt-0">
          <button
            type="button"
            onClick={handleToggleVideos}
            className="text-primary text-sm underline underline-offset-4"
            aria-pressed={videosPaused}
          >
            {isEditing ? (
              <span className="flex flex-col items-end gap-1">
                <Text field={datasource.pauseVideoLabel?.jsonValue} tag="span" />
                <Text field={datasource.playVideoLabel?.jsonValue} tag="span" />
              </span>
            ) : (
              <span>{videosPaused ? playLabel : pauseLabel}</span>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export const Default: React.FC<MediaCanvasProps> = (props) => {
  const { page } = useSitecore();
  return (
    <MediaCanvasDefault
      {...props}
      isPageEditing={Boolean(page?.mode?.isEditing || page?.mode?.isDesignLibrary)}
    />
  );
};
