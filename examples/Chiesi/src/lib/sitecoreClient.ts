/**
 * Server-side Sitecore client singleton for component rendering services.
 *
 * TODO: Spec references @sitecore-content-sdk/core; in SDK 2.x SitecoreClient is provided by
 * @sitecore-content-sdk/nextjs/client (extends @sitecore-content-sdk/content/client).
 * Configuration is driven by sitecore.config, which reads SITECORE_EDGE_CONTEXT_ID and
 * NEXT_PUBLIC_DEFAULT_SITE_NAME from the environment.
 */
import type { LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import sitecoreClientInstance from './sitecore-client';

function parseRoutePath(routePath: string): string[] {
  const normalized = routePath.trim().replace(/^\/+|\/+$/g, '');
  return normalized.length > 0 ? normalized.split('/') : [];
}

/**
 * Fetches layout data for a route. SDK 2.x exposes {@link SitecoreClient.getPage}; there is no
 * separate getRouteData API — this helper returns `page.layout` for parity with the spec.
 */
export async function getRouteData(
  routePath: string,
  options: { siteName?: string; language?: string } = {},
): Promise<LayoutServiceData | null> {
  const site =
    options.siteName ??
    process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME ??
    scConfig.defaultSite;
  const locale = options.language ?? 'en';

  const page = await sitecoreClientInstance.getPage(parseRoutePath(routePath), { site, locale });
  return page?.layout ?? null;
}

export const sitecoreClient = Object.assign(sitecoreClientInstance, {
  getRouteData,
});
