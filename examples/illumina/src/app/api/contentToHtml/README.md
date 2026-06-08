# Content to HTML API

Fetches a Sitecore content item by **content tree path** via Experience Edge GraphQL and returns the item fields plus a simple HTML snippet (`title` → `h1`, `description` → `p`).

## Endpoint

| Property | Value |
| -------- | ----- |
| **Method** | `POST` |
| **Path** | `/api/contentToHtml` |

## Authentication

Same as `/api/render-component`:

```http
X-GQL-Token: <your-experience-edge-graphql-token>
```

Configure `SITECORE_EDGE_GQL_TOKEN` in `.env.local` (recommended).

## Request body

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `itemPath` | `string` | Yes | Full Sitecore item path, e.g. `/sitecore/content/sync/basspro/Home/Data/.../Adventure On` |
| `language` | `string` | No | Locale (default: `en` or `NEXT_PUBLIC_DEFAULT_LANGUAGE`) |

## Response — `200 OK`

```json
{
  "data": {
    "item": {
      "id": "7BE52809743942EC918471E4CD185F01",
      "name": "Adventure On",
      "fields": [
        { "name": "title", "value": "Adventure starts tomorrow" },
        { "name": "description", "value": "In your backyard or anywhere" }
      ]
    }
  },
  "html": "<article class=\"content-to-html\">\n<h1>Adventure starts tomorrow</h1>\n<p>In your backyard or anywhere</p>\n</article>"
}
```

System fields (`__Created`, `__Updated`, etc.) are included in `fields` when returned by Edge but omitted from `html`.

## Example

```bash
curl -X POST "http://localhost:3000/api/contentToHtml" \
  -H "Content-Type: application/json" \
  -H "X-GQL-Token: YOUR_EXPERIENCE_EDGE_GRAPHQL_TOKEN" \
  -d "{\"itemPath\":\"/sitecore/content/sync/basspro/YOUR/PATH/TO/Adventure On\",\"language\":\"en\"}"
```

Replace `YOUR/PATH/TO/Adventure On` with the path from Content Editor or GraphQL IDE.
