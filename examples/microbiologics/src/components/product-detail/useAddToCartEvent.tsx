'use client';

import { useCallback } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { event } from '@sitecore-content-sdk/events';

import type { DemoUserTaxonomy } from '@/lib/demo-taxonomy';

import { resolveProductPriceDisplay } from './product-detail.data';
import type { NetSuiteProductRecord } from './product-detail.types';

/**
 * Sends an ADD_TO_CART custom event to Sitecore CDP when the shopper adds a product from ProductDetail.
 */
export function useAddToCartEvent({ uid }: { uid?: string }) {
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;
  const route = page?.layout?.sitecore?.route;

  return useCallback(
    (product: NetSuiteProductRecord, user: DemoUserTaxonomy | null) => {
      if (process.env.NODE_ENV === 'development' || isEditing || isPreview) return;

      const priceDisplay = resolveProductPriceDisplay(product, user);
      const unitPrice = priceDisplay.kind === 'price' ? priceDisplay.amount : product.pricing.listPriceUsd;
      const currency = priceDisplay.kind === 'price' ? priceDisplay.currency : 'USD';

      event({
        type: 'ADD_TO_CART',
        siteId: page.siteName,
        channel: 'WEB',
        currency,
        name: route?.name,
        language: route?.itemLanguage,
        extensionData: {
          catalogNumber: product.catalogNumber,
          productName: product.productName,
          productCategory: product.category,
          productFormat: product.generalInformation.productFormat,
          quantity: 1,
          unitPrice: unitPrice ?? 0,
          listPrice: product.pricing.listPriceUsd ?? 0,
          stockStatus: product.stockStatus,
          interactionSource: 'product-detail',
          componentId: uid ?? '',
        },
      }).catch((e) => console.debug(e));
    },
    [route, page, uid, isEditing, isPreview],
  );
}
