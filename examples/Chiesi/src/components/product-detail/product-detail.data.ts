import type { DemoUserTaxonomy } from '@/lib/demo-taxonomy';

import type { NetSuiteProductRecord } from './product-detail.types';
import type { DocumentType } from '@/components/search-results/data';
import {
  canAccessDocument,
  documentPreviewContent,
  documentRequiresLogin,
  formatPrice,
  isAuthenticatedDemoUser,
  type SearchResultItem,
} from '@/components/search-results/data';

export type ProductPriceDisplay =
  | { kind: 'login' }
  | { kind: 'hidden' }
  | { kind: 'price'; amount: number; currency: 'USD' | 'EUR'; listAmount?: number };

/** Map NetSuite record to the SearchResultItem shape used by shared document helpers. */
export function toDocumentSearchItem(product: NetSuiteProductRecord): SearchResultItem {
  return {
    id: product.catalogNumber,
    title: product.productName,
    catalogNumber: product.catalogNumber,
    description: product.shortDescription,
    href: '#',
    productFormat: 'epower',
    biosafetyLevel: 'bsl2',
    antibioticResistant: 'no',
    industryTypes: [],
    instrumentKits: [],
    molecularSyndromic: 'no',
    standards: [],
    taxonomy: 'bacteria',
    testMethods: [],
    listPrice: product.pricing.listPriceUsd,
    goldPrice: product.pricing.goldPriceUsd,
    distributorPrice: product.pricing.distributorPriceEur,
    documents: product.documents,
  };
}

export function resolveProductPriceDisplay(
  product: NetSuiteProductRecord,
  user: DemoUserTaxonomy | null,
): ProductPriceDisplay {
  if (!isAuthenticatedDemoUser(user)) return { kind: 'login' };
  if (user === 'Regulatory Professional') return { kind: 'hidden' };

  if (user === 'Distributor Rep') {
    const amount = product.pricing.distributorPriceEur;
    if (amount == null) return { kind: 'hidden' };
    return { kind: 'price', amount, currency: 'EUR' };
  }

  const contract = product.pricing.goldPriceUsd ?? product.pricing.listPriceUsd;
  if (contract == null) return { kind: 'hidden' };

  return {
    kind: 'price',
    amount: contract,
    currency: 'USD',
    listAmount:
      product.pricing.goldPriceUsd != null && product.pricing.listPriceUsd != null
        ? product.pricing.listPriceUsd
        : undefined,
  };
}

export {
  canAccessDocument,
  documentPreviewContent,
  documentRequiresLogin,
  formatPrice,
  type DocumentType,
};

export function productHasDocuments(product: NetSuiteProductRecord): boolean {
  const { coa, sds, ifu } = product.documents;
  return coa || sds || ifu;
}
