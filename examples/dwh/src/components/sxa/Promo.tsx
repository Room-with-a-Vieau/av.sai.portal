import React, { type JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Fields {
  PromoIcon: ImageField;
  PromoText: Field<string>;
  PromoLink: LinkField;
  PromoText2: Field<string>;
  PromoText3: Field<string>;
}

type PromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  if (props.fields) {
    return (
      <div
        data-class-change
        className={`component promo flex-1 shadow-lg pointer mb-5 lg:mb-0 ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="flex flex-col items-start justify-end h-full">
          <ContentSdkImage field={props.fields.PromoIcon} className="w-full h-auto object-cover" />
          <div className="flex-1 relative pt-4 px-6">
            <ContentSdkRichText
              tag="div"
              className="inline-block text-base font-bold px-2 py-1 mb-4 bg-[#ffb900]"
              field={props.fields.PromoText3}
            />
            <ContentSdkRichText
              tag="h2"
              className="text-3xl font-bold mb-4"
              field={props.fields.PromoText}
            />
            <ContentSdkRichText
              tag="div"
              className="text-base mb-4"
              field={props.fields.PromoText2}
            />
          </div>
          <Button
            variant="default"
            className="font-bold py-1 px-3 mx-6 mb-4 mt-auto relative b-0"
            asChild
          >
            <ContentSdkLink field={props.fields.PromoLink} />
          </Button>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

export const CenteredCard = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  if (props.fields) {
    return (
      <div
        data-class-change
        className={`component promo flex-1 w-full shadow-lg pointer mb-5 lg:mb-0 align-stretch ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="flex flex-col items-start justify-end">
          <ContentSdkImage field={props.fields.PromoIcon} className="w-full h-auto object-cover" />
          <div className="flex-1 relative pt-4 px-4 w-full justify-center text-center">
            <ContentSdkRichText
              tag="h2"
              className="text-4xl font-bold mb-4"
              field={props.fields.PromoText}
            />
            <ContentSdkRichText tag="div" className="mb-4" field={props.fields.PromoText2} />
          </div>
          <Button
            variant="link"
            size="lg"
            className="font-bold text-xl text-center w-full py-1 px-3 ml-4 mb-4 relative b-0"
            asChild
          >
            <ContentSdkLink field={props.fields.PromoLink} />
          </Button>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

/** 50/50 split: title + rich text + CTA left, full-bleed image right (stacks on mobile). */
export const SplitImageRight = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  if (props.fields) {
    return (
      <div
        data-class-change
        className={cn(
          'component promo w-full overflow-hidden border border-border bg-card shadow-sm',
          props.params.styles
        )}
        id={id ? id : undefined}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
          <div className="flex min-w-0 flex-col justify-center gap-6 overflow-hidden p-6 md:p-10 lg:p-12">
            <ContentSdkRichText
              tag="h2"
              className="max-w-full break-words font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl [overflow-wrap:anywhere] [&_*]:max-w-full [&_*]:break-words [&_h2]:m-0"
              field={props.fields.PromoText}
            />
            <ContentSdkRichText
              tag="div"
              className="content-sdk-rich-text max-w-full break-words text-base leading-relaxed text-muted-foreground [overflow-wrap:anywhere] [&_*]:max-w-full [&_li]:mb-3 [&_p]:mb-0 [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:p-0"
              field={props.fields.PromoText2}
            />
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="default" className="font-semibold" asChild>
                <ContentSdkLink field={props.fields.PromoLink} />
              </Button>
            </div>
          </div>
          <div className="relative min-h-[16rem] min-w-0 overflow-hidden lg:min-h-[24rem]">
            <ContentSdkImage
              field={props.fields.PromoIcon}
              className="h-full min-h-[16rem] w-full object-cover lg:min-h-[24rem]"
            />
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
