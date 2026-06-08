import 'server-only';

import React from 'react';
import {
  ComponentPropsContext,
  type ComponentPropsCollection,
  type Page,
} from '@sitecore-content-sdk/nextjs';
import {
  SitecoreProviderReactContext,
  type ComponentMap,
  type SitecoreProviderState,
} from '@sitecore-content-sdk/react';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import type { ImportMapImport } from '@sitecore-content-sdk/react';
import type { ComponentProps } from '@/lib/component-props';

type RenderComponentSsrInput = {
  api: SitecoreConfig['api'];
  componentMap: ComponentMap;
  page: Page;
  componentProps: ComponentPropsCollection;
  loadImportMap: () => Promise<ImportMapImport>;
  Component: React.ComponentType<ComponentProps & Record<string, unknown>>;
  componentElementProps: ComponentProps & Record<string, unknown>;
};

/**
 * SSR wrapper that mirrors SitecoreProvider context without calling the client
 * SitecoreProvider() function (which cannot run from Route Handlers).
 */
function RenderComponentSsrTree({
  api,
  componentMap,
  page,
  componentProps,
  loadImportMap,
  Component,
  componentElementProps,
}: RenderComponentSsrInput): React.ReactElement {
  const sitecoreContextValue: SitecoreProviderState = {
    page,
    componentMap,
    api,
    loadImportMap,
  };

  return (
    <SitecoreProviderReactContext.Provider value={sitecoreContextValue}>
      <ComponentPropsContext value={componentProps}>
        <Component {...componentElementProps} />
      </ComponentPropsContext>
    </SitecoreProviderReactContext.Provider>
  );
}

export async function renderComponentToHtml(input: RenderComponentSsrInput): Promise<string> {
  const { renderToString } = await import('react-dom/server');
  return renderToString(React.createElement(RenderComponentSsrTree, input));
}
