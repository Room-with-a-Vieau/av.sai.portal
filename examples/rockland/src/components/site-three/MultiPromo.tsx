'use client';

import { useMemo, useState } from 'react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLTextField } from 'types/igql';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

interface Fields {
  data: {
    datasource: {
      title?: IGQLTextField;
      description?: IGQLTextField;
      children: {
        results: SimplePromoFields[];
      };
    };
  };
}

interface SimplePromoFields {
  id: string;
  heading: IGQLTextField;
  description: IGQLTextField;
  slug?: IGQLTextField;
  image: IGQLImageField;
  link: IGQLLinkField;
}

type MultiPromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type PromoItemProps = SimplePromoFields & {
  isHorizontal?: boolean;
};

const PromoItem = ({ isHorizontal, ...promo }: PromoItemProps) => {
  const { image, heading, description, link } = promo ?? {};

  return (
    <div className={`grid gap-8 ${isHorizontal ? 'lg:grid-cols-[1fr_2fr]' : ''}`}>
      <ContentSdkImage
        field={image?.jsonValue}
        className="w-full h-full aspect-square object-cover shadow-2xl"
      />
      <div>
        <h3 className="text-xl lg:text-2xl mb-2">
          <ContentSdkText field={heading?.jsonValue} />
        </h3>
        <p className="lg:text-lg mb-2">
          <ContentSdkText field={description?.jsonValue} />
        </p>
        <ContentSdkLink field={link?.jsonValue} className="btn btn-ghost" />
      </div>
    </div>
  );
};

const parentBasedGridClasses =
  'grid lg:[.multipromo-2-3_&]:grid-cols-[2fr_3fr] lg:[.multipromo-3-2_&]:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] gap-14';
const parentBasedGridItemClasses =
  '[.multipromo-centered_&]:items-center [.bg-gradient_&]:text-white items-start';

export const Default = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section className={`relative ${props.params?.styles || ''}`} data-class-change>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-6 text-2xl lg:text-5xl">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={datasource?.description?.jsonValue} />
            </p>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-12`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const Stacked = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section
        className={`relative ${props.params?.styles || ''} overflow-hidden`}
        data-class-change
      >
        <span className="absolute top-1/3 left-1/3 [.multipromo-3-2_&]:-left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] -rotate-15 [.multipromo-3-2_&]:rotate-15 z-0"></span>
        <div className="relative container mx-auto px-4 py-16 z-10">
          <div className={`${parentBasedGridClasses}`}>
            <div className="lg:[.multipromo-3-2_&]:col-start-1 lg:[.multipromo-2-3_&]:col-start-2 lg:col-start-2 [.multipromo-2-3_&]:text-right">
              <h2 className="mb-6 text-2xl lg:text-5xl">
                <ContentSdkText field={datasource?.title?.jsonValue} />
              </h2>
              <p className="text-lg">
                <ContentSdkText field={datasource?.description?.jsonValue} />
              </p>
            </div>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-30`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return (
                <div
                  key={promo?.id}
                  className="lg:odd:-mt-8 lg:[.multipromo-3-2_&]:even:-mt-8 lg:[.multipromo-3-2_&]:odd:mt-0"
                >
                  <PromoItem {...promo} />
                </div>
              );
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const SingleColumn = (props: MultiPromoProps) => {
  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );

  if (props.fields) {
    return (
      <section className={`relative ${props.params?.styles || ''}`} data-class-change>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mb-16">
            <h2 className="mb-6 text-2xl lg:text-5xl">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={datasource?.description?.jsonValue} />
            </p>
          </div>
          <div className="grid gap-14">
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} isHorizontal />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

const SideTabsPromoPanel = ({
  promo,
  tabId,
  panelId,
}: {
  promo: SimplePromoFields;
  tabId: string;
  panelId: string;
}) => {
  const { image, heading, description, link } = promo ?? {};

  return (
    <>
      <div className="bg-muted/60 flex min-h-[280px] items-center justify-center p-6 sm:min-h-[360px] lg:min-h-[420px]">
        {image?.jsonValue && (
          <ContentSdkImage
            field={image.jsonValue}
            className="max-h-[360px] w-full max-w-full object-contain lg:max-h-[420px]"
          />
        )}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        className="bg-primary text-primary-foreground relative flex min-h-[280px] flex-col justify-center px-6 py-8 sm:min-h-[360px] sm:px-10 lg:min-h-[420px] lg:px-12"
      >
        {heading?.jsonValue && (
          <h3 className="text-accent font-heading mb-4 text-pretty text-2xl leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            <ContentSdkText field={heading.jsonValue} />
          </h3>
        )}
        {description?.jsonValue && (
          <p className="font-body mb-6 max-w-prose text-base leading-relaxed text-white/95 sm:text-lg">
            <ContentSdkText field={description.jsonValue} />
          </p>
        )}
        {link?.jsonValue && (
          <ContentSdkLink
            field={link.jsonValue}
            className="font-body inline-flex w-fit items-center border border-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          />
        )}
      </div>
    </>
  );
};

export const SideTabs = (props: MultiPromoProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const promos = useMemo(
    () => props.fields?.data?.datasource?.children?.results?.filter(Boolean) ?? [],
    [props.fields?.data?.datasource?.children?.results]
  );

  if (props.fields) {
    const activePromo = promos[activeIndex] ?? promos[0];

    return (
      <section
        className={cn('multi-promo-side-tabs relative w-full', props.params?.styles || '')}
        data-class-change
      >
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="border-border overflow-hidden rounded-none border shadow-sm lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)_minmax(0,3fr)]">
            <div className="lg:contents">
              {activePromo ? (
                <SideTabsPromoPanel
                  promo={activePromo}
                  tabId={`multi-promo-side-tab-${activePromo.id}`}
                  panelId={`multi-promo-side-tab-panel-${activePromo.id}`}
                />
              ) : (
                <>
                  <div className="bg-muted/60 min-h-[280px]" />
                  <div className="bg-primary min-h-[280px]" />
                </>
              )}
            </div>

            <div
              className="border-border flex flex-col border-t lg:border-t-0 lg:border-l"
              role="tablist"
              aria-label="Promotions"
            >
              {promos.map((promo, index) => {
                const isActive = index === activeIndex;
                const tabLabel = promo.slug?.jsonValue ?? promo.heading?.jsonValue;

                return (
                  <button
                    key={promo.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`multi-promo-side-tab-panel-${promo.id}`}
                    id={`multi-promo-side-tab-${promo.id}`}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      'font-body relative flex min-h-[4.5rem] flex-1 items-center border-b border-border px-4 py-3 text-left text-sm font-semibold leading-snug transition-colors last:border-b-0 sm:px-5 sm:text-base',
                      isActive
                        ? 'bg-accent text-primary z-10'
                        : 'bg-background text-primary hover:bg-muted/40'
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="border-r-accent absolute left-0 top-1/2 hidden h-0 w-0 -translate-x-full -translate-y-1/2 border-y-[0.75rem] border-r-[0.75rem] border-y-transparent lg:block"
                      />
                    )}
                    {tabLabel ? (
                      <ContentSdkText field={tabLabel} />
                    ) : (
                      <span>{`Promotion ${index + 1}`}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="MultiPromo" />;
};
