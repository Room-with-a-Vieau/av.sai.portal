import type React from 'react';
import {
  NextImage as ContentSdkImage,
  Text,
  type Field,
  type ImageField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
interface Fields {
  GalleryImage?: ImageField;
  Caption?: Field<string>;
  AltText?: Field<string>;
}
type Props = ComponentProps & { fields?: Fields };
const Empty = (): React.JSX.Element => (
  <div className="component image-gallery">
    <span className="is-empty-hint">ImageGallery</span>
  </div>
);
function View({
  props,
  variant,
}: {
  props: Props;
  variant: 'default' | 'gallery' | 'parallax';
}): React.JSX.Element {
  if (!props.fields) return <Empty />;
  const editing = props.page?.mode?.isEditing;
  return (
    <figure
      id={props.params.RenderingIdentifier}
      className={cn(
        'component image-gallery px-6 py-12',
        variant === 'parallax' && 'px-0',
        props.params.styles
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-[1200px]',
          variant === 'gallery' && 'grid gap-5 md:grid-cols-3',
          variant === 'parallax' && 'max-w-none overflow-hidden'
        )}
      >
        {(props.fields.GalleryImage?.value?.src || editing) &&
          [0, ...(variant === 'gallery' ? [1, 2] : [])].map((key) => (
            <ContentSdkImage
              key={key}
              field={props.fields?.GalleryImage}
              className={cn(
                'w-full rounded-[var(--brand-card-radius)] object-cover',
                variant === 'gallery' ? 'aspect-[4/3]' : 'max-h-[680px]',
                variant === 'parallax' && 'min-h-[520px] rounded-none object-cover'
              )}
            />
          ))}
        <Text field={props.fields.AltText} tag="span" className="sr-only" />
      </div>
      <Text
        field={props.fields.Caption}
        tag="figcaption"
        className="mx-auto mt-3 max-w-[1200px] text-sm text-[var(--brand-muted-foreground)]"
      />
    </figure>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} variant="default" />;
export const Gallery: React.FC<Props> = (props) => <View props={props} variant="gallery" />;
export const Parallax: React.FC<Props> = (props) => <View props={props} variant="parallax" />;
