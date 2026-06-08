import type { ComponentProps } from '@/lib/component-props';

/**
 * CommerceHeader — SitecoreAI partial-design component (Bass Pro shell POC).
 * No datasource required; navigation is sourced from bass-pro-navigation.ts.
 * Optional rendering params: `styles` (Tailwind / CSS class string).
 */
export type CommerceHeaderProps = ComponentProps & {
  params?: ComponentProps['params'] & {
    styles?: string;
  };
};
