import type { ComponentPropsCollection, LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import type { ComponentMap } from '@sitecore-content-sdk/react';
import type { ResolveReactComponentMeta } from '@/lib/resolve-react-component';

export type RouteRenderingSummary = {
  uid?: string;
  componentName: string;
  fieldNames?: string;
  placeholderKeys: string[];
  fieldKeys: string[];
};

const MAX_STRING_LENGTH = 800;
const MAX_ARRAY_ITEMS = 20;
const MAX_OBJECT_KEYS = 40;

function truncateString(value: string): string {
  if (value.length <= MAX_STRING_LENGTH) {
    return value;
  }
  return `${value.slice(0, MAX_STRING_LENGTH)}… [truncated ${value.length - MAX_STRING_LENGTH} chars]`;
}

/**
 * JSON-safe snapshot for API debug output (avoids circular refs and huge payloads).
 */
export function sanitizeForDebug(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    return truncateString(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (depth >= 6) {
    return '[max depth]';
  }

  if (Array.isArray(value)) {
    const items = value.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizeForDebug(item, depth + 1));
    if (value.length > MAX_ARRAY_ITEMS) {
      items.push(`… [${value.length - MAX_ARRAY_ITEMS} more items]`);
    }
    return items;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_OBJECT_KEYS);
    const result: Record<string, unknown> = {};
    for (const [key, child] of entries) {
      result[key] = sanitizeForDebug(child, depth + 1);
    }
    if (Object.keys(value as object).length > MAX_OBJECT_KEYS) {
      result['…'] = `[${Object.keys(value as object).length - MAX_OBJECT_KEYS} more keys]`;
    }
    return result;
  }

  return String(value);
}

function summarizeRenderingFields(rendering: ComponentRendering): string[] {
  const fields = rendering.fields;
  if (!fields || typeof fields !== 'object') {
    return [];
  }
  return Object.keys(fields);
}

export function summarizeRendering(rendering: ComponentRendering): RouteRenderingSummary {
  const placeholders = rendering.placeholders;
  return {
    uid: rendering.uid,
    componentName: rendering.componentName,
    fieldNames:
      typeof rendering.params?.FieldNames === 'string' ? rendering.params.FieldNames : undefined,
    placeholderKeys:
      placeholders && typeof placeholders === 'object' ? Object.keys(placeholders) : [],
    fieldKeys: summarizeRenderingFields(rendering),
  };
}

function walkRenderings(node: unknown, results: RouteRenderingSummary[]): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  const rendering = node as ComponentRendering;
  if (typeof rendering.componentName === 'string') {
    results.push(summarizeRendering(rendering));
    const placeholders = rendering.placeholders;
    if (placeholders && typeof placeholders === 'object') {
      for (const value of Object.values(placeholders)) {
        if (Array.isArray(value)) {
          for (const child of value) {
            walkRenderings(child, results);
          }
        } else {
          walkRenderings(value, results);
        }
      }
    }
  }
}

export function listRenderingsOnRoute(layoutData: LayoutServiceData): RouteRenderingSummary[] {
  const results: RouteRenderingSummary[] = [];
  const placeholders = layoutData?.sitecore?.route?.placeholders;
  if (!placeholders || typeof placeholders !== 'object') {
    return results;
  }

  for (const value of Object.values(placeholders)) {
    if (Array.isArray(value)) {
      for (const child of value) {
        walkRenderings(child, results);
      }
    } else {
      walkRenderings(value, results);
    }
  }

  return results;
}

export function findSimilarMapKeys(map: ComponentMap, componentName: string, limit = 15): string[] {
  const needle = componentName.toLowerCase();
  const matches: string[] = [];
  for (const key of map.keys()) {
    if (key.toLowerCase().includes(needle) || needle.includes(key.toLowerCase())) {
      matches.push(key);
      if (matches.length >= limit) {
        break;
      }
    }
  }
  return matches;
}

export type DatasourceChildrenSummary = {
  childCount: number;
  children: Array<{
    id?: string;
    fieldKeys: string[];
    hasHeading: boolean;
    hasImage: boolean;
    hasLink: boolean;
  }>;
};

/** Summarize GraphQL `children.results` without truncating nested promo fields. */
export function summarizeDatasourceChildren(fields: unknown): DatasourceChildrenSummary | null {
  if (!fields || typeof fields !== 'object') {
    return null;
  }

  const data = (fields as { data?: { datasource?: { children?: { results?: unknown[] } } } }).data;
  const results = data?.datasource?.children?.results;
  if (!Array.isArray(results)) {
    return null;
  }

  return {
    childCount: results.length,
    children: results.map((item, index) => {
      if (!item || typeof item !== 'object') {
        return { id: `index-${index}`, fieldKeys: [], hasHeading: false, hasImage: false, hasLink: false };
      }
      const promo = item as Record<string, unknown>;
      return {
        id: typeof promo.id === 'string' ? promo.id : undefined,
        fieldKeys: Object.keys(promo),
        hasHeading: Boolean(promo.heading),
        hasImage: Boolean(promo.image),
        hasLink: Boolean(promo.link),
      };
    }),
  };
}

export type RenderComponentDebugPayload = {
  request: {
    componentName: string;
    routePath: string;
    siteName?: string;
    language?: string;
  };
  route?: {
    name?: string;
    displayName?: string;
    itemId?: string;
    templateId?: string;
    fieldKeys: string[];
  };
  rendering?: ReturnType<typeof sanitizeForDebug>;
  renderingSummary?: RouteRenderingSummary;
  routeRenderings?: RouteRenderingSummary[];
  componentMap?: ResolveReactComponentMeta & {
    similarMapKeys: string[];
    mapSize: number;
  };
  componentProps?: {
    collectionKeys: string[];
    fetchedForRenderingUid?: string;
    fetchedProps?: ReturnType<typeof sanitizeForDebug>;
    /** Parsed from `fields.data.datasource.children.results` on fetched props. */
    fetchedChildren?: DatasourceChildrenSummary | null;
  };
  /** Parsed from layout `rendering.fields` (before/without getComponentData merge). */
  renderingChildren?: DatasourceChildrenSummary | null;
  layoutContext?: ReturnType<typeof sanitizeForDebug>;
  /** Set when SSR throws after debug was requested. */
  renderError?: string;
};

export function buildRenderComponentDebug(input: {
  componentName: string;
  routePath: string;
  siteName?: string;
  language?: string;
  layoutData?: LayoutServiceData | null;
  rendering?: ComponentRendering | null;
  componentMap?: ComponentMap;
  resolveMeta?: ResolveReactComponentMeta;
  componentProps?: ComponentPropsCollection;
  renderingUid?: string;
}): RenderComponentDebugPayload {
  const route = input.layoutData?.sitecore?.route;
  const fetchedProps =
    input.renderingUid && input.componentProps
      ? input.componentProps[input.renderingUid]
      : undefined;

  const payload: RenderComponentDebugPayload = {
    request: {
      componentName: input.componentName,
      routePath: input.routePath,
      siteName: input.siteName,
      language: input.language,
    },
  };

  if (route) {
    payload.route = {
      name: route.name,
      displayName: route.displayName,
      itemId: route.itemId,
      templateId: route.templateId,
      fieldKeys:
        route.fields && typeof route.fields === 'object' ? Object.keys(route.fields) : [],
    };
  }

  if (input.layoutData) {
    payload.routeRenderings = listRenderingsOnRoute(input.layoutData);
    payload.layoutContext = sanitizeForDebug(input.layoutData.sitecore?.context);
  }

  if (input.rendering) {
    payload.rendering = sanitizeForDebug(input.rendering);
    payload.renderingSummary = summarizeRendering(input.rendering);
    payload.renderingChildren = summarizeDatasourceChildren(input.rendering.fields);
  }

  if (input.componentMap && input.resolveMeta) {
    payload.componentMap = {
      ...input.resolveMeta,
      similarMapKeys: findSimilarMapKeys(input.componentMap, input.componentName),
      mapSize: input.componentMap.size,
    };
  }

  if (input.componentProps) {
    const fetchedFields =
      fetchedProps && typeof fetchedProps === 'object'
        ? (fetchedProps as { fields?: unknown }).fields
        : undefined;
    payload.componentProps = {
      collectionKeys: Object.keys(input.componentProps),
      fetchedForRenderingUid: input.renderingUid,
      fetchedProps: sanitizeForDebug(fetchedProps),
      fetchedChildren: summarizeDatasourceChildren(fetchedFields),
    };
  }

  return payload;
}
