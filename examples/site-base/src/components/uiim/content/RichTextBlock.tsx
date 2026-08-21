import type React from 'react';
import {
  RichText as ContentSdkRichText,
  Text,
  type Field,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
interface Fields {
  Title?: Field<string>;
  Body?: RichTextField;
}
type Props = ComponentProps & { fields?: Fields };
const Empty = (): React.JSX.Element => (
  <div className="component rich-text-block">
    <span className="is-empty-hint">RichTextBlock</span>
  </div>
);
function View({
  props,
  variant,
}: {
  props: Props;
  variant: 'default' | 'centered' | 'narrow' | 'mission';
}): React.JSX.Element {
  if (!props.fields) return <Empty />;
  const editing = props.page?.mode?.isEditing;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn(
        'component rich-text-block px-6 py-14 text-[var(--brand-fg)]',
        variant === 'mission' ? 'bg-[#DDEFFA] py-20' : 'bg-[var(--brand-bg)]',
        props.params.styles
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-[1200px]',
          variant === 'centered' && 'max-w-4xl text-center',
          variant === 'narrow' && 'max-w-2xl',
          variant === 'mission' && 'max-w-4xl text-center'
        )}
      >
        {(props.fields.Title?.value || editing) && (
          <Text
            field={props.fields.Title}
            tag="h2"
            className="text-3xl font-bold leading-tight md:text-4xl"
          />
        )}
        {(props.fields.Body?.value || editing) && (
          <ContentSdkRichText
            field={props.fields.Body}
            className="prose prose-lg mx-auto mt-5 max-w-none"
          />
        )}
      </div>
    </section>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} variant="default" />;
export const Centered: React.FC<Props> = (props) => <View props={props} variant="centered" />;
export const Narrow: React.FC<Props> = (props) => <View props={props} variant="narrow" />;
export const GuideStoneMissionBand: React.FC<Props> = (props) => (
  <View props={props} variant="mission" />
);
