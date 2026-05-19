import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import type { Field } from '@sitecore-content-sdk/nextjs';
import client from '@/lib/sitecore-client';
import type { LocationItemFields } from './location-search.types';

const PAGE_SIZE = 100;

const LOCATION_CHILDREN_PAGE_QUERY = /* GraphQL */ `
  query LocationChildrenPage(
    $path: String!
    $language: String!
    $first: Int!
    $after: String
  ) {
    item(path: $path, language: $language) {
      children(first: $first, after: $after) {
        total
        pageInfo {
          hasNext
          endCursor
        }
        results {
          id
          Name: field(name: "Name") {
            value
          }
          StreetAddress: field(name: "Street Address") {
            value
          }
          City: field(name: "City") {
            value
          }
          State: field(name: "State") {
            value
          }
          GEO: field(name: "GEO") {
            value
          }
        }
      }
    }
  }
`;

interface RawField {
  value?: string | null;
  jsonValue?: { value?: string | null } | string | null;
}

interface RawLocationRow {
  id?: string;
  Name?: RawField;
  StreetAddress?: RawField;
  City?: RawField;
  State?: RawField;
  GEO?: RawField;
}

interface LocationChildrenPageResult {
  item?: {
    children?: {
      total?: number;
      pageInfo?: {
        hasNext?: boolean;
        endCursor?: string | null;
      };
      results?: RawLocationRow[];
    };
  };
}

function readFieldValue(field?: RawField): string {
  if (!field) return '';
  if (typeof field.value === 'string') return field.value.trim();
  const jv = field.jsonValue;
  if (typeof jv === 'string') return jv.trim();
  if (jv && typeof jv === 'object' && typeof jv.value === 'string') {
    return jv.value.trim();
  }
  return '';
}

function toTextField(value: string): Field<string> | undefined {
  if (!value) return undefined;
  return { value };
}

function normalizeRow(row: RawLocationRow): LocationItemFields {
  return {
    id: row.id ?? '',
    Name: toTextField(readFieldValue(row.Name)),
    StreetAddress: toTextField(readFieldValue(row.StreetAddress)),
    City: toTextField(readFieldValue(row.City)),
    State: toTextField(readFieldValue(row.State)),
    GEO: toTextField(readFieldValue(row.GEO)),
  };
}

function createGraphClient(): GraphQLRequestClient | null {
  const endpoint = process.env.SITECORE_GRAPHQL_ENDPOINT;
  const apiKey = process.env.SITECORE_API_KEY;
  if (!endpoint || !apiKey) return null;
  return new GraphQLRequestClient(endpoint, { apiKey });
}

async function fetchPageWithGraphClient(
  graphClient: GraphQLRequestClient,
  path: string,
  language: string,
  after: string | null
): Promise<LocationChildrenPageResult> {
  return graphClient.request<LocationChildrenPageResult>(LOCATION_CHILDREN_PAGE_QUERY, {
    path,
    language,
    first: PAGE_SIZE,
    after,
  });
}

async function fetchPageWithSitecoreClient(
  path: string,
  language: string,
  after: string | null
): Promise<LocationChildrenPageResult> {
  return client.getData<LocationChildrenPageResult>(LOCATION_CHILDREN_PAGE_QUERY, {
    path,
    language,
    first: PAGE_SIZE,
    after,
  });
}

/**
 * Loads all children under the datasource folder (paginated).
 * ComponentQuery on the rendering often returns only 10 unless children(first: N) is set in CM.
 */
export async function fetchAllLocationItems(
  datasourcePath: string,
  language: string
): Promise<LocationItemFields[]> {
  const path = datasourcePath.trim();
  if (!path) return [];

  const graphClient = createGraphClient();
  const all: LocationItemFields[] = [];
  let after: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const data: LocationChildrenPageResult = graphClient
      ? await fetchPageWithGraphClient(graphClient, path, language, after)
      : await fetchPageWithSitecoreClient(path, language, after);

    const connection = data.item?.children;
    const batch = (connection?.results ?? []).map(normalizeRow);
    all.push(...batch);

    hasNext = Boolean(connection?.pageInfo?.hasNext);
    after = connection?.pageInfo?.endCursor ?? null;

    if (batch.length === 0) break;
  }

  return all;
}
