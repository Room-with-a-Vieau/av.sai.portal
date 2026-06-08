import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  LinkField,
  ImageField,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { MiniCart } from './non-sitecore/MiniCart';
import { SearchBox } from './non-sitecore/SearchBox';
import { DemoUserSwitcher } from './non-sitecore/DemoUserSwitcher';
import { ComponentProps } from 'lib/component-props';
import componentMap from '.sitecore/component-map';
import { MobileMenuWrapper } from './MobileMenuWrapper';
import { cn } from '@/lib/utils';

interface Fields {
  Logo: ImageField;
  SupportLink: LinkField;
  SearchLink: LinkField;
  CartLink: LinkField;
}

type HeaderSTProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

/** Sitecore checkbox / string params for rendering parameter ReverseTheme */
function isReverseThemeParam(value: string | undefined): boolean {
  if (value == null || typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'reversetheme';
}

export const Default = (props: HeaderSTProps) => {
  const { fields, params } = props;
  const isReverseTheme = isReverseThemeParam(params?.ReverseTheme);

  const utilityLinkClass = cn(
    'block p-4 font-[family-name:var(--font-body)] font-normal',
    isReverseTheme ? 'text-primary-foreground' : 'text-secondary-foreground'
  );

  const loginTriggerClass = isReverseTheme
    ? 'border-primary-foreground/40 bg-transparent text-primary-foreground shadow-none focus:ring-primary-foreground/30 [&_svg]:text-primary-foreground'
    : undefined;

  return (
    <section
      className={cn(
        'sticky top-0 z-30 w-full min-w-0 border-b shadow-sm',
        isReverseTheme ? 'border-primary-foreground/20' : 'border-border/30 bg-background',
        params?.styles,
        isReverseTheme && 'bg-primary text-primary-foreground'
      )}
      data-class-change
      data-header-st-reverse-theme={isReverseTheme ? '' : undefined}
    >
      <div
        className="flex w-full min-w-0 flex-col [.partial-editing-mode_&]:flex-col-reverse"
        role="navigation"
        aria-label="Site header"
      >
        {/* Row 1: utility bar — stacks above nav row so login dropdown is not covered */}
        <div className="relative z-20 w-full min-w-0">
          <div className="mx-auto flex w-full max-w-[100rem] items-center gap-2 px-4 sm:px-6 lg:gap-8 lg:px-8">
          <Link
            href="/"
            className="relative flex shrink-0 items-center self-stretch py-2"
            prefetch={false}
          >
            <ContentSdkImage
              field={props.fields?.Logo}
              className="h-auto max-h-10 w-auto max-w-[11rem] object-contain object-left sm:max-h-11 sm:max-w-[12rem]"
            />
          </Link>

          <ul
            className={cn(
              'ml-auto flex min-w-0 shrink-0 list-none flex-row items-center justify-end gap-0 p-0 lg:min-h-[4.5rem]',
              isReverseTheme && 'text-primary-foreground'
            )}
          >
            <li className="relative z-30 hidden items-center px-2 lg:flex">
              <DemoUserSwitcher triggerClassName={loginTriggerClass} />
            </li>
            <li className="hidden lg:block">
              <ContentSdkLink field={fields?.SupportLink} prefetch={false} className={utilityLinkClass} />
            </li>
            <li className="hidden lg:block">
              {params.showSearchBox ? (
                <SearchBox searchLink={fields?.SearchLink} triggerClassName={utilityLinkClass} />
              ) : (
                <ContentSdkLink field={fields?.SearchLink} prefetch={false} className={utilityLinkClass} />
              )}
            </li>
            <MobileMenuWrapper iconClassName={isReverseTheme ? 'text-primary-foreground' : undefined}>
              <div className="flex h-full w-full flex-col">
                <div className="flex flex-1 items-center justify-center">
                  <ul className="flex w-full flex-col bg-background text-center">
                    <AppPlaceholder
                      name={`header-navigation-${params?.DynamicPlaceholderId}`}
                      rendering={props.rendering}
                      page={props.page}
                      componentMap={componentMap}
                    />
                  </ul>
                </div>
                <div className="w-full">
                  <hr className="w-full border-border" />
                  <ul className="text-center">
                    <li>
                      <ContentSdkLink field={fields?.SupportLink} prefetch={false} className={utilityLinkClass} />
                    </li>
                  </ul>
                </div>
              </div>
            </MobileMenuWrapper>
            <li className="shrink-0">
              {params.showMiniCart ? (
                <MiniCart
                  cartLink={fields?.CartLink}
                  triggerClassName={isReverseTheme ? 'text-primary-foreground' : undefined}
                />
              ) : (
                <ContentSdkLink field={fields?.CartLink} prefetch={false} className={utilityLinkClass}>
                  <FontAwesomeIcon icon={faShoppingCart} width={24} height={24} />
                </ContentSdkLink>
              )}
            </li>
          </ul>
          </div>
        </div>

        {/* Row 2: main navigation */}
        <div
          className={cn(
            'relative z-10 hidden w-full min-w-0 border-t lg:block',
            isReverseTheme
              ? 'border-primary-foreground/20 bg-primary'
              : 'border-border/30 bg-transparent'
          )}
          data-header-st-nav-row={isReverseTheme ? 'reverse' : undefined}
        >
          <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
            <ul
              className={cn(
                'm-0 flex list-none flex-row items-center justify-start gap-0 p-0 text-left [.partial-editing-mode_&]:!flex-col',
                'min-h-0 py-1 lg:min-h-[3rem] lg:py-2',
                isReverseTheme &&
                  'text-primary-foreground [&>li>a]:!text-primary-foreground [&>li>a:hover]:opacity-90'
              )}
            >
              <AppPlaceholder
                name={`header-navigation-${params?.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
