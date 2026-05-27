import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { GetStaticPropsContext } from 'next';
import {
  type ComponentParams,
  type ComponentPropsCollection,
  type LayoutServiceData,
  type Page,
} from '@sitecore-content-sdk/nextjs';
import type React from 'react';
import scConfig from 'sitecore.config';
import type { ComponentProps } from '@/lib/component-props';
import { findComponentRendering } from '@/lib/componentRenderer';
import {
  buildRenderComponentDebug,
  type RenderComponentDebugPayload,
} from '@/lib/render-component-debug';
import { renderComponentToHtml } from '@/lib/render-component-ssr';
import { resolveReactComponent } from '@/lib/resolve-react-component';
import { sitecoreClient } from '@/lib/sitecoreClient';
import { componentMap } from 'temp/componentFactory';

export const dynamic = 'force-dynamic';

type RenderComponentRequestBody = {
  componentName: string;
  routePath: string;
  siteName?: string;
  language?: string;
  /** When true, responses include a `debug` object with route, rendering, map resolution, and props. */
  debug?: boolean;
};

type RenderComponentSuccessResponse = {
  html: string;
  debug?: RenderComponentDebugPayload;
};

type RenderComponentErrorResponse = {
  error: string;
  debug?: RenderComponentDebugPayload;
};

/** Same header name as Sitecore Experience Edge GraphQL ([GraphQL IDE](https://edge.sitecorecloud.io/api/graphql/ide)). */
const GQL_TOKEN_HEADER = 'x-gql-token';

function getGqlToken(request: NextRequest): string | null {
  const token = request.headers.get(GQL_TOKEN_HEADER);
  return token?.trim() || null;
}

/**
 * Tokens the server will accept in X-GQL-Token.
 * This is NOT only SITECORE_EDITING_SECRET — that value secures /api/editing/render, while the
 * GraphQL IDE uses an Experience Edge API token. Set SITECORE_EDGE_GQL_TOKEN to the same
 * token you use in the IDE.
 */
function getAuthorizedGqlTokens(): string[] {
  const candidates = [
    process.env.SITECORE_EDGE_GQL_TOKEN,
    process.env.SITECORE_EDGE_API_KEY,
    process.env.SITECORE_EDGE_CONTEXT_ID,
    process.env.SITECORE_EDITING_SECRET,
  ];

  return [
    ...new Set(
      candidates
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ];
}

function tokensEqual(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(provided, 'utf8'), Buffer.from(expected, 'utf8'));
  } catch {
    return false;
  }
}

function isGqlTokenAuthorized(provided: string | null): boolean {
  if (!provided) {
    return false;
  }
  return getAuthorizedGqlTokens().some((expected) => tokensEqual(provided, expected));
}

function isRenderComponentRequestBody(value: unknown): value is RenderComponentRequestBody {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const body = value as Record<string, unknown>;
  return typeof body.componentName === 'string' && typeof body.routePath === 'string';
}

function buildPageFromLayout(layoutData: LayoutServiceData, locale: string): Page {
  return {
    layout: layoutData,
    locale,
    mode: {
      isEditing: false,
      isNormal: true,
      isPreview: false,
      name: 'normal',
      designLibrary: { isVariantGeneration: false },
      isDesignLibrary: false,
    },
  } as Page;
}

/** Extra props returned by getComponentData (e.g. GraphQL `fields`) keyed by rendering uid. */
function getFetchedComponentProps(
  collection: ComponentPropsCollection,
  renderingUid: string | undefined,
): Record<string, unknown> {
  if (!renderingUid) {
    return {};
  }
  const entry = collection[renderingUid];
  if (!entry || typeof entry !== 'object') {
    return {};
  }
  return entry as Record<string, unknown>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let debugEnabled = false;
  let lastDebugPayload: RenderComponentDebugPayload | undefined;

  try {
    const authorizedTokens = getAuthorizedGqlTokens();
    if (authorizedTokens.length === 0) {
      return NextResponse.json<RenderComponentErrorResponse>(
        {
          error:
            'No GraphQL tokens configured on the rendering host. Set SITECORE_EDGE_GQL_TOKEN (recommended) to the same Experience Edge token used in the GraphQL IDE.',
        },
        { status: 500 },
      );
    }

    const token = getGqlToken(request);
    if (!isGqlTokenAuthorized(token)) {
      return NextResponse.json<RenderComponentErrorResponse>(
        {
          error:
            'Unauthorized — missing or invalid X-GQL-Token. Use your Experience Edge GraphQL token (not necessarily SITECORE_EDITING_SECRET).',
        },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<RenderComponentErrorResponse>(
        { error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    if (!isRenderComponentRequestBody(body)) {
      return NextResponse.json<RenderComponentErrorResponse>(
        { error: 'componentName and routePath are required' },
        { status: 400 },
      );
    }

    const { componentName, routePath, siteName, language } = body;
    debugEnabled = body.debug === true;
    const trimmedName = componentName.trim();
    const trimmedPath = routePath.trim();

    if (!trimmedName || !trimmedPath) {
      return NextResponse.json<RenderComponentErrorResponse>(
        { error: 'componentName and routePath are required' },
        { status: 400 },
      );
    }

    const layoutData = await sitecoreClient.getRouteData(trimmedPath, { siteName, language });
    if (!layoutData?.sitecore?.route) {
      return NextResponse.json<RenderComponentErrorResponse>(
        {
          error: 'Route not found',
          ...(debugEnabled
            ? {
                debug: buildRenderComponentDebug({
                  componentName: trimmedName,
                  routePath: trimmedPath,
                  siteName,
                  language,
                  layoutData,
                }),
              }
            : {}),
        },
        { status: 404 },
      );
    }

    const rendering = findComponentRendering(layoutData, trimmedName);
    if (!rendering) {
      return NextResponse.json<RenderComponentErrorResponse>(
        {
          error: `Component "${trimmedName}" not found on route "${trimmedPath}"`,
          ...(debugEnabled
            ? {
                debug: buildRenderComponentDebug({
                  componentName: trimmedName,
                  routePath: trimmedPath,
                  siteName,
                  language,
                  layoutData,
                  componentMap,
                }),
              }
            : {}),
        },
        { status: 404 },
      );
    }

    const { component: ReactComponent, meta: resolveMeta } = resolveReactComponent(
      componentMap,
      trimmedName,
      rendering,
    );

    const locale = language ?? 'en';
    const page = buildPageFromLayout(layoutData, locale);

    const componentProps = await sitecoreClient.getComponentData(
      layoutData,
      {} as GetStaticPropsContext,
      componentMap,
    );

    lastDebugPayload = debugEnabled
      ? buildRenderComponentDebug({
          componentName: trimmedName,
          routePath: trimmedPath,
          siteName,
          language,
          layoutData,
          rendering,
          componentMap,
          resolveMeta,
          componentProps,
          renderingUid: rendering.uid,
        })
      : undefined;

    if (!ReactComponent) {
      return NextResponse.json<RenderComponentErrorResponse>(
        {
          error: `No React implementation registered for component "${trimmedName}"`,
          ...(lastDebugPayload ? { debug: lastDebugPayload } : {}),
        },
        { status: 404 },
      );
    }

    const fetchedProps = getFetchedComponentProps(componentProps, rendering.uid);
    const fetchedParams = (fetchedProps.params ?? {}) as ComponentParams;
    // Match AppPlaceholder: GraphQL fields live on componentProps[uid]; layout may also embed fields on rendering.
    const fields = (fetchedProps.fields ?? rendering.fields) as Record<string, unknown> | undefined;
    const componentElementProps: ComponentProps & Record<string, unknown> = {
      ...fetchedProps,
      fields,
      rendering,
      params: {
        ...(rendering.params ?? {}),
        ...fetchedParams,
      } as ComponentProps['params'],
      page,
    };

    const html = await renderComponentToHtml({
      api: scConfig.api,
      componentMap,
      page,
      componentProps,
      loadImportMap: () => import('.sitecore/import-map.server'),
      Component: ReactComponent as React.ComponentType<ComponentProps & Record<string, unknown>>,
      componentElementProps,
    });

    return NextResponse.json<RenderComponentSuccessResponse>({
      html,
      ...(lastDebugPayload ? { debug: lastDebugPayload } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown rendering error';
    console.error('[render-component]', error);

    const debug =
      debugEnabled && lastDebugPayload
        ? { ...lastDebugPayload, renderError: message }
        : undefined;

    return NextResponse.json<RenderComponentErrorResponse>(
      { error: message, ...(debug ? { debug } : {}) },
      { status: 500 },
    );
  }
}
