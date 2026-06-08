import scConfig from 'sitecore.config';
import client from '@/lib/sitecore-client';

export type ContentItemField = {
  name: string;
  value: string;
};

export type ContentItemPayload = {
  id: string;
  name: string;
  fields: ContentItemField[];
};

export type ContentToHtmlData = {
  data: {
    item: ContentItemPayload;
  };
};

type EdgeFieldRow = {
  name?: string;
  value?: string | null;
};

type ItemByPathResult = {
  item?: {
    id?: string;
    name?: string;
    fields?: EdgeFieldRow[];
    title?: { value?: string };
    description?: { value?: string };
  } | null;
};

const ITEM_BY_PATH_QUERY = /* GraphQL */ `
  query ContentToHtmlItem($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      name
      fields {
        name
        value
      }
    }
  }
`;

const ITEM_BY_PATH_FALLBACK_QUERY = /* GraphQL */ `
  query ContentToHtmlItemFallback($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      name
      title: field(name: "title") {
        value
      }
      description: field(name: "description") {
        value
      }
    }
  }
`;

function normalizeItemPath(itemPath: string): string {
  const trimmed = itemPath.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function isSystemFieldName(name: string): boolean {
  return name.startsWith('__');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mapEdgeFields(rows: EdgeFieldRow[] | undefined): ContentItemField[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows
    .filter((row): row is EdgeFieldRow & { name: string } => typeof row?.name === 'string')
    .map((row) => ({
      name: row.name,
      value: typeof row.value === 'string' ? row.value : row.value == null ? '' : String(row.value),
    }));
}

function buildFieldsFromFallback(item: NonNullable<ItemByPathResult['item']>): ContentItemField[] {
  const fields: ContentItemField[] = [];
  const title = item.title?.value?.trim();
  const description = item.description?.value?.trim();
  if (title) {
    fields.push({ name: 'title', value: title });
  }
  if (description) {
    fields.push({ name: 'description', value: description });
  }
  return fields;
}

/**
 * Fetches a Sitecore content item by content tree path via Experience Edge GraphQL.
 */
export async function fetchContentItemByPath(
  itemPath: string,
  language?: string,
): Promise<ContentItemPayload | null> {
  const path = normalizeItemPath(itemPath);
  if (!path) {
    return null;
  }

  const lang = language?.trim() || scConfig.defaultLanguage || 'en';

  const loadFallbackItem = async (): Promise<ItemByPathResult['item'] | null> => {
    const fallback = await client.getData<ItemByPathResult>(ITEM_BY_PATH_FALLBACK_QUERY, {
      path,
      language: lang,
    });
    return fallback?.item ?? null;
  };

  try {
    let item: ItemByPathResult['item'] | null | undefined;

    try {
      const result = await client.getData<ItemByPathResult>(ITEM_BY_PATH_QUERY, {
        path,
        language: lang,
      });
      item = result?.item;
    } catch (primaryError) {
      console.warn('[fetchContentItemByPath] Primary query failed, using field fallback:', primaryError);
      item = await loadFallbackItem();
    }

    if (!item?.id) {
      return null;
    }

    let fields = mapEdgeFields(item.fields);
    if (fields.length === 0) {
      const fallbackItem =
        item.title || item.description ? item : await loadFallbackItem();
      fields = buildFieldsFromFallback(fallbackItem ?? {});
    }

    return {
      id: item.id,
      name: item.name ?? '',
      fields,
    };
  } catch (error) {
    console.error('[fetchContentItemByPath] GraphQL request failed:', error);
    throw error;
  }
}

/**
 * Builds a minimal HTML block: `title` → &lt;h1&gt;, `description` and other non-system fields → &lt;p&gt;.
 */
export function contentFieldsToHtml(item: ContentItemPayload): string {
  const titleField = item.fields.find((f) => f.name.toLowerCase() === 'title' && f.value.trim());
  const descriptionField = item.fields.find(
    (f) => f.name.toLowerCase() === 'description' && f.value.trim(),
  );

  const otherFields = item.fields.filter((f) => {
    if (isSystemFieldName(f.name)) {
      return false;
    }
    const lower = f.name.toLowerCase();
    if (lower === 'title' || lower === 'description') {
      return false;
    }
    return Boolean(f.value.trim());
  });

  const blocks: string[] = [];

  if (titleField) {
    blocks.push(`<h1>${escapeHtml(titleField.value)}</h1>`);
  } else if (item.name.trim()) {
    blocks.push(`<h1>${escapeHtml(item.name)}</h1>`);
  }

  if (descriptionField) {
    blocks.push(`<p>${escapeHtml(descriptionField.value)}</p>`);
  }

  for (const field of otherFields) {
    blocks.push(`<p>${escapeHtml(field.value)}</p>`);
  }

  if (blocks.length === 0) {
    return '<article class="content-to-html"></article>';
  }

  return `<article class="content-to-html">\n${blocks.join('\n')}\n</article>`;
}

export async function fetchContentToHtml(
  itemPath: string,
  language?: string,
): Promise<ContentToHtmlData & { html: string }> {
  const item = await fetchContentItemByPath(itemPath, language);
  if (!item) {
    throw new ContentItemNotFoundError(itemPath);
  }

  return {
    data: { item },
    html: contentFieldsToHtml(item),
  };
}

export class ContentItemNotFoundError extends Error {
  constructor(public readonly itemPath: string) {
    super(`Content item not found for path: ${itemPath}`);
    this.name = 'ContentItemNotFoundError';
  }
}
