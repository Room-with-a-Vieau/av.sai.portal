'use client';

/**
 * ProductDetail — Microbiologics product detail page (SitecoreAI demo).
 *
 * Sitecore datasource supplies CatalogNumber; product content is resolved from bundled
 * NetSuite-style JSON (`netsuite-product-catalog.json`) or an optional CMS JSON override.
 */

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Lock,
} from 'lucide-react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DEMO_TAXONOMY_CHANGE_EVENT,
  DEMO_TAXONOMY_STORAGE_KEY,
  PROFILE_CHANGE_EVENT,
  parseDemoUserTaxonomy,
  type DemoUserTaxonomy,
} from '@/lib/demo-taxonomy';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

import {
  canAccessDocument,
  documentPreviewContent,
  documentRequiresLogin,
  formatPrice,
  productHasDocuments,
  resolveProductPriceDisplay,
  toDocumentSearchItem,
  type DocumentType,
} from './product-detail.data';
import {
  lookupNetSuiteProduct,
  resolveCatalogNumber,
  resolveCatalogNumberField,
} from './product-detail.fields';
import type { ProductDetailProps } from './product-detail.props';
import type { NetSuiteProductRecord } from './product-detail.types';
import { useAddToCartEvent } from './useAddToCartEvent';

const TEAL = '#00788A';

function useDemoTaxonomy() {
  const [raw, setRaw] = useState('');

  useEffect(() => {
    const read = () => {
      setRaw(typeof window !== 'undefined' ? (window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '') : '');
    };
    read();
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
    window.addEventListener(PROFILE_CHANGE_EVENT, read);
    return () => {
      window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, read);
      window.removeEventListener(PROFILE_CHANGE_EVENT, read);
    };
  }, []);

  return useMemo(() => parseDemoUserTaxonomy(raw), [raw]);
}

function Breadcrumbs({ segments }: { segments: string[] }) {
  if (!segments.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={`${segment}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {isLast ? (
                <span className="font-medium text-foreground">{segment}</span>
              ) : index === 0 ? (
                <Link href="/" className="hover:text-[#00788A]">
                  {segment}
                </Link>
              ) : (
                <span>{segment}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ProductImageGallery({ product }: { product: NetSuiteProductRecord }) {
  const images = product.images.length ? product.images : [''];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = images[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted">
        {activeSrc ? (
          <Image
            src={activeSrc}
            alt={product.productName}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-white/90 p-2 text-[#6DCCE1] shadow-sm hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-white/90 p-2 text-[#6DCCE1] shadow-sm hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-16 w-16 overflow-hidden rounded-md border bg-muted',
                index === activeIndex ? 'border-[#00788A] ring-2 ring-[#00788A]/30' : 'border-border/60',
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-contain p-1"
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PriceBlock({
  product,
  user,
  onAddToCart,
}: {
  product: NetSuiteProductRecord;
  user: DemoUserTaxonomy | null;
  onAddToCart: () => void;
}) {
  const display = resolveProductPriceDisplay(product, user);

  if (display.kind === 'login') {
    return (
      <p className="text-sm text-foreground">
        Please{' '}
        <span className="font-semibold text-[#00788A] underline decoration-[#00788A]/40">
          log in
        </span>{' '}
        to see price or purchase this item.
      </p>
    );
  }

  if (display.kind === 'hidden') {
    if (user === 'Regulatory Professional') {
      return (
        <p className="text-sm text-muted-foreground">Document &amp; regulatory access — no pricing shown.</p>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-2xl font-bold text-foreground">
        {formatPrice(display.amount, display.currency)}
      </span>
      {display.listAmount != null && display.listAmount > display.amount ? (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(display.listAmount, display.currency)}
        </span>
      ) : null}
      <Button
        type="button"
        size="sm"
        className="ml-2 bg-[#00788A] hover:bg-[#006070]"
        onClick={onAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
}

function GeneralInformationTable({ product }: { product: NetSuiteProductRecord }) {
  const info = product.generalInformation;
  const rows: { label: string; value: string }[] = [
    { label: 'Product Format', value: info.productFormat },
    { label: 'Strain Characteristics', value: info.strainCharacteristics },
    { label: 'Test Method', value: info.testMethod },
    { label: 'Catalog number', value: product.catalogNumber },
    { label: 'Taxonomy', value: info.taxonomy },
    { label: 'Industry Type', value: info.industryTypes.join(', ') },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/40 last:border-0">
              <th
                scope="row"
                className="w-1/3 bg-slate-50/80 px-4 py-3 text-left font-semibold text-foreground"
              >
                {row.label}
              </th>
              <td className="px-4 py-3 text-muted-foreground">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentationTab({
  product,
  user,
  onDownload,
  onPreview,
}: {
  product: NetSuiteProductRecord;
  user: DemoUserTaxonomy | null;
  onDownload: (docType: DocumentType) => void;
  onPreview: (docType: DocumentType) => void;
}) {
  if (!productHasDocuments(product)) {
    return <p className="text-sm text-muted-foreground">No documents available for this product.</p>;
  }

  const docItem = toDocumentSearchItem(product);
  const rows = [
    { type: 'COA' as DocumentType, available: product.documents.coa },
    { type: 'SDS' as DocumentType, available: product.documents.sds },
    { type: 'IFU' as DocumentType, available: product.documents.ifu },
  ].filter((r): r is { type: DocumentType; available: boolean } => r.available);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {rows.map(({ type }) => {
          const allowed = canAccessDocument(docItem, type, user);
          const needsLogin = documentRequiresLogin(type) && !user;

          if (allowed) {
            return (
              <div key={type} className="flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 gap-1.5 border-[#00788A]/30"
                  onClick={() => onDownload(type)}
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {type}
                </Button>
                {(type === 'SDS' || type === 'IFU') && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-9 gap-1 px-2 text-[#00788A]"
                    onClick={() => onPreview(type)}
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                    Preview
                  </Button>
                )}
              </div>
            );
          }

          if (needsLogin) {
            return (
              <span
                key={type}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-dashed border-border bg-muted/50 px-3 text-sm text-muted-foreground"
                title="Sign in to access this document"
              >
                <Lock className="h-4 w-4 shrink-0" aria-hidden />
                {type}
                <span className="hidden sm:inline">— Sign in</span>
              </span>
            );
          }

          return null;
        })}
      </div>
      {!user ? (
        <p className="text-xs text-muted-foreground">
          COA available without login. Sign in via the header for SDS, IFU, and contract pricing.
        </p>
      ) : null}
    </div>
  );
}

export const Default: FC<ProductDetailProps> = ({ fields, page, params, rendering }) => {
  const { isEditing } = page.mode;
  const catalogNumber = resolveCatalogNumber(fields);
  const catalogNumberField = resolveCatalogNumberField(fields);
  const product = useMemo(
    () => lookupNetSuiteProduct(catalogNumber, fields),
    [catalogNumber, fields],
  );
  const user = useDemoTaxonomy();
  const [previewDoc, setPreviewDoc] = useState<DocumentType | null>(null);
  const sendAddToCartEvent = useAddToCartEvent({ uid: rendering?.uid });

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    sendAddToCartEvent(product, user);
  }, [product, user, sendAddToCartEvent]);

  const handleDownload = useCallback(
    (docType: DocumentType) => {
      if (!product) return;
      const docItem = toDocumentSearchItem(product);
      if (!canAccessDocument(docItem, docType, user)) return;
      toast.success(`${docType} download started`, {
        description: `${product.productName} (${product.catalogNumber})`,
      });
    },
    [product, user],
  );

  const handlePreview = useCallback((docType: DocumentType) => {
    setPreviewDoc(docType);
  }, []);

  if (!fields && !isEditing) {
    return <NoDataFallback componentName="ProductDetail" />;
  }

  if (!catalogNumber && !isEditing) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        ProductDetail requires a Catalog Number on the datasource item.
      </div>
    );
  }

  if (!product && !isEditing) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        No NetSuite catalog record found for catalog number{' '}
        <strong className="text-foreground">{catalogNumber}</strong>.
      </div>
    );
  }

  const breadcrumb = product?.breadcrumb ?? ['Home', product?.productName ?? 'Product'];
  const previewContent =
    product && previewDoc ? documentPreviewContent(toDocumentSearchItem(product), previewDoc) : null;

  return (
    <section
      className={cn('mx-auto w-full max-w-7xl px-4 py-8', params?.styles)}
      data-component="product-detail"
    >
      <Breadcrumbs segments={breadcrumb} />

      {isEditing && catalogNumberField ? (
        <p className="mb-4 text-xs text-muted-foreground">
          Catalog Number (Sitecore):{' '}
          <Text field={catalogNumberField} tag="span" className="font-mono font-semibold" />
        </p>
      ) : null}

      {product ? (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery product={product} />

          <div className="min-w-0 space-y-6">
            <header>
              <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
              <p className="mt-1 text-sm">
                <span className="font-bold text-foreground">Catalog No. {product.catalogNumber}</span>
              </p>
              <h1 className="mt-2 font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {product.productName}
              </h1>
              <div className="mt-4">
                <PriceBlock product={product} user={user} onAddToCart={handleAddToCart} />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <Check className="h-4 w-4" aria-hidden />
                {product.stockStatus}
              </p>
            </header>

            <div>
              <h2 className="text-base font-bold text-foreground">Details</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>
              {product.prop65Warning ? (
                <p className="mt-3 text-sm">
                  <span className="font-bold text-foreground">WARNING:</span>{' '}
                  {product.prop65Warning}
                </p>
              ) : null}
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="h-auto w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger
                  value="general"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#00788A] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  General Information
                </TabsTrigger>
                <TabsTrigger
                  value="documentation"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#00788A] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Documentation
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-4">
                <GeneralInformationTable product={product} />
              </TabsContent>
              <TabsContent value="documentation" className="mt-4">
                <DocumentationTab
                  product={product}
                  user={user}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          Configure a catalog number on the datasource to preview product content in Page Editor.
        </div>
      )}

      <Dialog open={previewDoc != null} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-lg">
          {previewContent ? (
            <>
              <DialogHeader>
                <DialogTitle>{previewContent.title}</DialogTitle>
                <DialogDescription>
                  Catalog {previewContent.catalogNumber} · {previewContent.lotNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>{previewContent.summary}</p>
                <p className="text-muted-foreground">{previewContent.approvedBy}</p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Default;
