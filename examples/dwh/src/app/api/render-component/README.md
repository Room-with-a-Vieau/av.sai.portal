# Render Component API

Server-side rendering endpoint for a single Sitecore component on a given route. Intended for headless tooling, previews, or automation that needs isolated component HTML without loading a full page.

## Endpoint

| Property | Value |
| -------- | ----- |
| **Method** | `POST` |
| **Path** | `/api/render-component` |

## Authentication

Send the same **`X-GQL-Token`** header you use for [Sitecore Experience Edge GraphQL](https://edge.sitecorecloud.io/api/graphql/ide) (Delivery API):

```http
X-GQL-Token: <your-experience-edge-graphql-token>
```

The rendering host compares that value to server-side configuration. It must match **one** of these environment variables in `.env.local`:

| Variable | Typical use |
| -------- | ----------- |
| **`SITECORE_EDGE_GQL_TOKEN`** (recommended) | Copy the token that works in the GraphQL IDE |
| `SITECORE_EDGE_API_KEY` | If your team stores the Edge API key here |
| `SITECORE_EDGE_CONTEXT_ID` | Only if your IDE token is literally the context ID |
| `SITECORE_EDITING_SECRET` | Legacy fallback; this secures `/api/editing/render`, not Edge GraphQL |

**Important:** `SITECORE_EDITING_SECRET` and the GraphQL IDE token are often **different** values. If the IDE accepts your token but this API returns 401, add the IDE token to `.env.local` as `SITECORE_EDGE_GQL_TOKEN` and restart the dev server.

Requests without a valid token receive **401 Unauthorized**.

## Request body

`Content-Type: application/json`

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `componentName` | `string` | Yes | Sitecore rendering name (e.g. `Hero`, `MultiPromo`). Must match a key in the generated component map. |
| `routePath` | `string` | Yes | Sitecore item path for the page (e.g. `/` or `/Landing-Pages`). Leading/trailing slashes are optional. |
| `siteName` | `string` | No | XM Cloud site name. Defaults to `NEXT_PUBLIC_DEFAULT_SITE_NAME`. |
| `language` | `string` | No | Locale / language code (e.g. `en`). Defaults to `en`. |
| `debug` | `boolean` | No | When `true`, responses include a `debug` object (route, rendering, map resolution, fetched props). |

### Example body

```json
{
  "componentName": "MultiPromo",
  "routePath": "/",
  "siteName": "basspro",
  "language": "en",
  "debug": true
}
```

## Response

### Success — `200 OK`

```json
{
  "html": "<section>...</section>",
  "debug": { }
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `html` | `string` | Server-rendered HTML for the matched component only (no document shell, layout, or global styles). |
| `debug` | `object` | Present when `debug: true` in the request. See [Debug output](#debug-output). |

### Debug output

Set `"debug": true` in the POST body. The API returns a `debug` object on **success and error** responses (except auth / config failures before layout is loaded).

Useful fields:

| Field | Description |
| ----- | ----------- |
| `request` | Echo of `componentName`, `routePath`, `siteName`, `language` |
| `route` | Route item summary (`name`, `displayName`, `itemId`, field keys) |
| `routeRenderings` | Every rendering on the page (`componentName`, `uid`, `params.FieldNames`) — use when the requested name is not found |
| `rendering` | Sanitized layout rendering for the matched component (params, placeholders, fields) |
| `renderingSummary` | Short summary of the matched rendering |
| `componentMap` | Map resolution: `resolutionPath`, `fieldNamesParam`, `entryExportKeys`, `resolvedIsFunction`, `similarMapKeys` |
| `componentProps` | Keys from `getComponentData` and props fetched for the rendering `uid` |
| `renderError` | On `500`, the React SSR error message when debug was enabled |

**Tip:** If you see `Element type is invalid... got: undefined`, check `componentMap.resolutionPath` and `fieldNamesParam`. Variants are selected via rendering parameter **`FieldNames`** (same as the Content SDK placeholder), not `RenderingIdentifier`.

### Client errors

| Status | Body | When |
| ------ | ---- | ---- |
| `400` | `{ "error": "..." }` | Missing/invalid JSON or missing `componentName` / `routePath` |
| `401` | `{ "error": "Unauthorized — missing or invalid X-GQL-Token" }` | Missing or invalid `X-GQL-Token` header |
| `404` | `{ "error": "..." }` | Route not found, component not on route, or no React module in the component map |

### Server error — `500`

```json
{
  "error": "Error message",
  "debug": { "renderError": "Element type is invalid..." }
}
```

Returned when rendering fails or required server env vars are not configured. Include `"debug": true` in the request to inspect route/map/props when SSR fails.

## Example

```bash
curl -X POST "http://localhost:3000/api/render-component" \
  -H "Content-Type: application/json" \
  -H "X-GQL-Token: YOUR_EXPERIENCE_EDGE_GRAPHQL_TOKEN" \
  -d "{
    \"componentName\": \"MultiPromo\",
    \"routePath\": \"/\",
    \"siteName\": \"basspro\",
    \"language\": \"en\",
    \"debug\": true
  }"
```

## Styling and SSR limitations

- Output is **HTML markup only**. Global CSS, Tailwind compilation, theme tokens, and layout wrappers from the full Next.js page are **not** included unless the component inlines styles.
- For pixel-accurate previews, consumers may need to wrap `html` in a shell that loads the same stylesheets as the public site (`globals.css`, theme CSS, etc.).
- Images and media URLs come from Sitecore field values as returned by the Layout Service / Edge API.

## Client components and hooks

- Components that rely on **client-only** hooks (`useState`, `useEffect`, browser APIs, `useSitecore` / `useSitecoreContext` behavior that expects a hydrated client, etc.) may render incompletely or throw during `renderToString`.
- Prefer testing **server components** or simple presentational components through this endpoint.
- Interactive variants may need a full page render in the browser instead of this API.

## Implementation notes

- Layout data is loaded via `sitecoreClient.getRouteData()` (wrapper around `SitecoreClient.getPage()` in SDK 2.x).
- Component resolution uses `src/temp/componentFactory.ts`, which re-exports `.sitecore/component-map`.
- The target rendering is located by walking `sitecore.route.placeholders` recursively (`src/lib/componentRenderer.ts`).
- SSR uses `src/lib/render-component-ssr.tsx`, which supplies `SitecoreProviderReactContext` directly (not `SitecoreProvider()`, which is client-only and cannot run from Route Handlers).
