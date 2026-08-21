import type React from 'react';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text,
  type Field,
  type ImageField,
  type LinkField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/lib/component-props';
type J<T> = { jsonValue?: T };
interface Logo {
  id?: string;
  logoImage?: J<ImageField>;
  companyName?: J<Field<string>>;
  logoLink?: J<LinkField>;
}
interface DS {
  title?: J<Field<string>>;
  children?: { results?: Logo[] };
}
type Props = ComponentProps & { fields?: { data?: { datasource?: DS } } };
const Empty = (): React.JSX.Element => (
  <div className="component logo-cloud">
    <span className="is-empty-hint">LogoCloud</span>
  </div>
);
function View({
  props,
  variant,
}: {
  props: Props;
  variant: 'row' | 'grid' | 'labels';
}): React.JSX.Element {
  const ds = props.fields?.data?.datasource;
  if (!ds) return <Empty />;
  return (
    <section
      id={props.params.RenderingIdentifier}
      className={cn('component logo-cloud px-6 py-14', props.params.styles)}
    >
      <div className="mx-auto max-w-[1200px]">
        <Text
          field={ds.title?.jsonValue}
          tag="h2"
          className="mb-8 text-center text-3xl font-bold"
        />
        <div
          className={cn(
            'grid items-center gap-8',
            variant === 'row'
              ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          )}
        >
          {(ds.children?.results ?? []).map((logo, i) =>
            logo.logoLink?.jsonValue ? (
              <ContentSdkLink
                key={logo.id ?? i}
                field={logo.logoLink.jsonValue}
                className="flex flex-col items-center gap-3 rounded-lg p-4"
              >
                <ContentSdkImage
                  field={logo.logoImage?.jsonValue}
                  className="h-14 w-full object-contain grayscale transition hover:grayscale-0"
                />
                {variant === 'labels' && (
                  <Text
                    field={logo.companyName?.jsonValue}
                    tag="span"
                    className="text-sm font-semibold"
                  />
                )}
              </ContentSdkLink>
            ) : (
              <div key={logo.id ?? i} className="flex flex-col items-center gap-3 rounded-lg p-4">
                <ContentSdkImage
                  field={logo.logoImage?.jsonValue}
                  className="h-14 w-full object-contain grayscale"
                />
                {variant === 'labels' && (
                  <Text
                    field={logo.companyName?.jsonValue}
                    tag="span"
                    className="text-sm font-semibold"
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
export const Default: React.FC<Props> = (props) => <View props={props} variant="row" />;
export const Grid: React.FC<Props> = (props) => <View props={props} variant="grid" />;
export const WithLabels: React.FC<Props> = (props) => <View props={props} variant="labels" />;
