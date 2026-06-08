import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  ContentItemNotFoundError,
  fetchContentToHtml,
  type ContentToHtmlData,
} from '@/lib/content-to-html';

export const dynamic = 'force-dynamic';

type ContentToHtmlRequestBody = {
  /** Sitecore content tree path, e.g. `/sitecore/content/sync/basspro/.../Adventure On` */
  itemPath: string;
  language?: string;
};

type ContentToHtmlSuccessResponse = ContentToHtmlData & {
  html: string;
};

type ContentToHtmlErrorResponse = {
  error: string;
};

const GQL_TOKEN_HEADER = 'x-gql-token';

function getGqlToken(request: NextRequest): string | null {
  const token = request.headers.get(GQL_TOKEN_HEADER);
  return token?.trim() || null;
}

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

function isContentToHtmlRequestBody(value: unknown): value is ContentToHtmlRequestBody {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const body = value as Record<string, unknown>;
  return typeof body.itemPath === 'string';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authorizedTokens = getAuthorizedGqlTokens();
    if (authorizedTokens.length === 0) {
      return NextResponse.json<ContentToHtmlErrorResponse>(
        {
          error:
            'No GraphQL tokens configured on the rendering host. Set SITECORE_EDGE_GQL_TOKEN (recommended).',
        },
        { status: 500 },
      );
    }

    const token = getGqlToken(request);
    if (!isGqlTokenAuthorized(token)) {
      return NextResponse.json<ContentToHtmlErrorResponse>(
        {
          error: 'Unauthorized — missing or invalid X-GQL-Token.',
        },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ContentToHtmlErrorResponse>(
        { error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    if (!isContentToHtmlRequestBody(body)) {
      return NextResponse.json<ContentToHtmlErrorResponse>(
        { error: 'itemPath is required' },
        { status: 400 },
      );
    }

    const itemPath = body.itemPath.trim();
    if (!itemPath) {
      return NextResponse.json<ContentToHtmlErrorResponse>(
        { error: 'itemPath is required' },
        { status: 400 },
      );
    }

    const result = await fetchContentToHtml(itemPath, body.language);
    return NextResponse.json<ContentToHtmlSuccessResponse>(result);
  } catch (error) {
    if (error instanceof ContentItemNotFoundError) {
      return NextResponse.json<ContentToHtmlErrorResponse>(
        { error: error.message },
        { status: 404 },
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[contentToHtml]', error);
    return NextResponse.json<ContentToHtmlErrorResponse>({ error: message }, { status: 500 });
  }
}
