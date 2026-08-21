import type React from 'react';
import {
  Link as ContentSdkLink,
  Text,
  type Field,
  type LinkField,
} from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';

interface AnnouncementBarFields {
  Message?: Field<string>;
  BarLink?: LinkField;
  BackgroundColor?: Field<string>;
}

type AnnouncementBarProps = ComponentProps & { fields?: AnnouncementBarFields };

const AnnouncementBarEmpty = (): React.JSX.Element => (
  <div className="component announcement-bar">
    <span className="is-empty-hint">AnnouncementBar</span>
  </div>
);

function AnnouncementBarView(
  { fields, params, page }: AnnouncementBarProps,
  highlight = false
): React.JSX.Element {
  if (!fields) return <AnnouncementBarEmpty />;
  const isEditing = page?.mode?.isEditing;
  const color = fields.BackgroundColor?.value;
  const background =
    color === 'primary'
      ? 'var(--brand-primary)'
      : color === 'accent'
        ? 'var(--brand-accent)'
        : 'var(--brand-muted)';
  return (
    <aside
      id={params.RenderingIdentifier}
      className={cn(
        'component announcement-bar px-4 py-2.5 text-center font-[var(--brand-body-font,inherit)] text-sm',
        highlight && 'font-semibold',
        params.styles
      )}
      style={{
        backgroundColor: background,
        color: color === 'primary' ? 'var(--brand-primary-foreground)' : 'var(--brand-fg)',
      }}
      aria-label="Announcement"
    >
      {(fields.Message?.value || isEditing) && <Text field={fields.Message} tag="span" />}
      {(fields.BarLink?.value?.href || isEditing) && (
        <ContentSdkLink
          field={fields.BarLink!}
          className={cn('ml-2 underline underline-offset-4', highlight && 'animate-pulse')}
        />
      )}
      {(fields.BackgroundColor?.value || isEditing) && (
        <span className="sr-only">
          <Text field={fields.BackgroundColor} />
        </span>
      )}
    </aside>
  );
}

export const Default: React.FC<AnnouncementBarProps> = (props) => AnnouncementBarView(props);
export const Highlight: React.FC<AnnouncementBarProps> = (props) =>
  AnnouncementBarView(props, true);
