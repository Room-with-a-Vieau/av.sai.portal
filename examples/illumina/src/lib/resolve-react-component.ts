import type React from 'react';
import type { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import type { ComponentMap } from '@sitecore-content-sdk/react';
import type { ComponentProps } from '@/lib/component-props';

/** Matches SXA / Content SDK placeholder resolution (`FieldNames` rendering parameter). */
const DEFAULT_EXPORT_NAME = 'Default';

export type ResolveReactComponentMeta = {
  mapHasEntry: boolean;
  entryType: 'missing' | 'function' | 'module';
  fieldNamesParam?: string;
  resolutionPath: string;
  entryExportKeys: string[];
  resolvedExportName?: string;
  resolvedIsFunction: boolean;
  componentType?: string;
};

export type ResolveReactComponentResult = {
  component: React.ComponentType<ComponentProps> | null;
  meta: ResolveReactComponentMeta;
};

function listModuleExportKeys(entry: Record<string, unknown>): string[] {
  return Object.keys(entry).filter((key) => key !== 'componentType');
}

function pickVariant(
  moduleExports: Record<string, unknown>,
  exportName: string | undefined,
): { component: React.ComponentType<ComponentProps> | null; resolutionPath: string } {
  if (exportName && exportName !== DEFAULT_EXPORT_NAME) {
    const variant = moduleExports[exportName];
    if (typeof variant === 'function') {
      return {
        component: variant as React.ComponentType<ComponentProps>,
        resolutionPath: `params.FieldNames:${exportName}`,
      };
    }
    return {
      component: null,
      resolutionPath: `params.FieldNames:${exportName} (not a function export)`,
    };
  }

  const resolved =
    moduleExports.default ??
    moduleExports.Default ??
    (typeof moduleExports === 'function' ? moduleExports : null);

  if (typeof resolved === 'function') {
    const path = moduleExports.default
      ? 'default export'
      : moduleExports.Default
        ? 'Default export'
        : 'module as component';
    return { component: resolved as React.ComponentType<ComponentProps>, resolutionPath: path };
  }

  return { component: null, resolutionPath: 'no default/Default export' };
}

/**
 * Resolves a React component from the generated component map using the same rules as
 * {@link getComponentForRendering} in `@sitecore-content-sdk/react` (FieldNames → default → Default).
 */
export function resolveReactComponent(
  map: ComponentMap,
  componentName: string,
  rendering: ComponentRendering,
): ResolveReactComponentResult {
  const entry = map.get(componentName);
  const params = rendering.params as Record<string, string | undefined> | undefined;
  const fieldNamesParam = params?.FieldNames;

  if (!entry) {
    return {
      component: null,
      meta: {
        mapHasEntry: false,
        entryType: 'missing',
        fieldNamesParam,
        resolutionPath: 'map miss',
        entryExportKeys: [],
        resolvedIsFunction: false,
      },
    };
  }

  if (typeof entry === 'function') {
    return {
      component: entry as React.ComponentType<ComponentProps>,
      meta: {
        mapHasEntry: true,
        entryType: 'function',
        fieldNamesParam,
        resolutionPath: 'map entry is function',
        entryExportKeys: [],
        resolvedExportName: 'function',
        resolvedIsFunction: true,
      },
    };
  }

  const moduleExports = entry as Record<string, unknown>;
  const { component, resolutionPath } = pickVariant(moduleExports, fieldNamesParam);
  return {
    component,
    meta: {
      mapHasEntry: true,
      entryType: 'module',
      fieldNamesParam,
      resolutionPath,
      entryExportKeys: listModuleExportKeys(moduleExports),
      resolvedExportName: component ? resolutionPath : undefined,
      resolvedIsFunction: typeof component === 'function',
      ...(moduleExports.componentType !== undefined
        ? { componentType: String(moduleExports.componentType) }
        : {}),
    },
  };
}
