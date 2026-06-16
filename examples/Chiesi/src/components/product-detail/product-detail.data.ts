import type { DemoUserTaxonomy } from '@/lib/demo-taxonomy';

import type { NetSuiteProductRecord } from './product-detail.types';
import type { DocumentType } from '@/components/search-results/data';
import {
  canAccessDocument,
  documentPreviewContent,
  documentRequiresLogin,
  searchCatalogForLegacyBridge,
  type SearchResultItem,
} from '@/components/search-results/data';

export type ProductPriceDisplay =
  | { kind: 'login' }
  | { kind: 'hidden' }
  | { kind: 'price'; amount: number; currency: 'USD' | 'EUR'; listAmount?: number };

/** Map NetSuite record to the SearchResultItem shape used by shared document helpers. */
export function toDocumentSearchItem(product: NetSuiteProductRecord): SearchResultItem {
  return searchCatalogForLegacyBridge({
    catalogNumber: product.catalogNumber,
    productName: product.productName,
    shortDescription: product.shortDescription,
    documents: product.documents,
  });
}

export function resolveProductPriceDisplay(
  _product: NetSuiteProductRecord,
  user: DemoUserTaxonomy | null,
): ProductPriceDisplay {
  if (!user) return { kind: 'login' };
  if (user === 'Patient Advocate') return { kind: 'hidden' };
  if (user === 'Caregiver') return { kind: 'hidden' };

  return { kind: 'hidden' };
}

export {
  canAccessDocument,
  documentPreviewContent,
  documentRequiresLogin,
  formatPrice,
  type DocumentType,
} from '@/components/search-results/data';

export function productHasDocuments(product: NetSuiteProductRecord): boolean {
  const { coa, sds, ifu } = product.documents;
  return coa || sds || ifu;
}
