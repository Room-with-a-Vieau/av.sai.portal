'use client';

/**
 * SearchResults — Microbiologics product & document search (SitecoreAI demo).
 *
 * Mirrors microbiologics.com search with auth-scoped access:
 * - Anonymous: find by catalog #, download COA, "Log in to see price", SDS/IFU locked
 * - Authenticated (HeaderST persona): contract pricing + SDS/IFU download & inline preview
 */

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Download, Eye, Loader2, Lock, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import type { ComponentProps } from '@/lib/component-props';
import {
  DEMO_TAXONOMY_CHANGE_EVENT,
  DEMO_TAXONOMY_STORAGE_KEY,
  PROFILE_CHANGE_EVENT,
  parseDemoUserTaxonomy,
} from '@/lib/demo-taxonomy';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import {
  canAccessDocument,
  DEMO_CATALOG_NUMBERS,
  documentPreviewContent,
  documentRequiresLogin,
  MB_BASE,
  productHasAttachedDocuments,
  antibioticResistantOptions,
  biosafetyLevels,
  documentCategories,
  documentLanguages,
  formatPrice,
  getDefaultCardImage,
  industryTypes,
  instrumentKits,
  itemMatchesQuery,
  itemVisibleForDemoUser,
  molecularSyndromicOptions,
  normalizeQuery,
  popularSearches,
  productFormats,
  relevanceScore,
  resolvePriceDisplay,
  RESULTS_PAGE_SIZE,
  searchCatalog,
  searchFacetLabels,
  supplementalResultsForDemoUserTaxonomy,
  standardGuidelines,
  taxonomyGroups,
  testMethods,
  type AntibioticResistant,
  type BiosafetyLevel,
  type DemoUserTaxonomy,
  type DocumentCategory,
  type DocumentLanguage,
  type DocumentType,
  type IndustryType,
  type InstrumentKit,
  type MolecularSyndromic,
  type ProductFormat,
  type SearchResultItem,
  type StandardGuideline,
  type TaxonomyGroup,
  type TestMethod,
} from './data';

export type SearchResultsProps = {
  className?: string;
  disableUrlSync?: boolean;
  initialQuery?: string;
};

type SortMode = 'relevance' | 'az';

const TEAL = '#00788A';

type FacetSelections = {
  biosafety: Set<BiosafetyLevel>;
  formats: Set<ProductFormat>;
  docLanguages: Set<DocumentLanguage>;
  docCategories: Set<DocumentCategory>;
  antibiotic: Set<AntibioticResistant>;
  industries: Set<IndustryType>;
  instruments: Set<InstrumentKit>;
  syndromic: Set<MolecularSyndromic>;
  standards: Set<StandardGuideline>;
  taxonomy: Set<TaxonomyGroup>;
  testMethods: Set<TestMethod>;
};

function emptyFacets(): FacetSelections {
  return {
    biosafety: new Set(),
    formats: new Set(),
    docLanguages: new Set(),
    docCategories: new Set(),
    antibiotic: new Set(),
    industries: new Set(),
    instruments: new Set(),
    syndromic: new Set(),
    standards: new Set(),
    taxonomy: new Set(),
    testMethods: new Set(),
  };
}

function countActiveFacets(f: FacetSelections): number {
  return (
    f.biosafety.size +
    f.formats.size +
    f.docLanguages.size +
    f.docCategories.size +
    f.antibiotic.size +
    f.industries.size +
    f.instruments.size +
    f.syndromic.size +
    f.standards.size +
    f.taxonomy.size +
    f.testMethods.size
  );
}

function itemPassesFacets(item: SearchResultItem, f: FacetSelections): boolean {
  if (f.biosafety.size && !f.biosafety.has(item.biosafetyLevel)) return false;
  if (f.formats.size && !f.formats.has(item.productFormat)) return false;
  if (f.docLanguages.size) {
    if (!item.documentLanguage || !f.docLanguages.has(item.documentLanguage)) return false;
  }
  if (f.docCategories.size) {
    if (!item.documentCategory || !f.docCategories.has(item.documentCategory)) return false;
  }
  if (f.antibiotic.size && !f.antibiotic.has(item.antibioticResistant)) return false;
  if (f.industries.size && !item.industryTypes.some((i) => f.industries.has(i))) return false;
  if (f.instruments.size && !item.instrumentKits.some((k) => f.instruments.has(k))) return false;
  if (f.syndromic.size && !f.syndromic.has(item.molecularSyndromic)) return false;
  if (f.standards.size && !item.standards.some((s) => f.standards.has(s))) return false;
  if (f.taxonomy.size && !f.taxonomy.has(item.taxonomy)) return false;
  if (f.testMethods.size && !item.testMethods.some((t) => f.testMethods.has(t))) return false;
  return true;
}

function FacetCheckboxGroup<T extends string>({
  title,
  options,
  labels,
  selected,
  counts,
  onToggle,
  defaultOpen = true,
}: {
  title: string;
  options: readonly T[];
  labels: Record<T, string>;
  selected: Set<T>;
  counts: Record<T, number>;
  onToggle: (key: T) => void;
  defaultOpen?: boolean;
}) {
  const visible = options.filter((k) => counts[k] > 0);
  if (!visible.length) return null;

  return (
    <FacetSection title={title} defaultOpen={defaultOpen}>
      <div className="flex flex-col gap-2.5">
        {visible.map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-start gap-2.5 text-sm text-foreground/90"
          >
            <Checkbox
              checked={selected.has(key)}
              onCheckedChange={() => onToggle(key)}
              className="mt-0.5 border-[#00788A] data-[state=checked]:bg-[#00788A] data-[state=checked]:text-white"
            />
            <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-1">
              <span className="leading-snug">{labels[key]}</span>
              <span className="text-xs tabular-nums text-muted-foreground">({counts[key]})</span>
            </span>
          </label>
        ))}
      </div>
    </FacetSection>
  );
}

function FacetSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="border-b border-border/60 py-3 last:border-b-0">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground outline-none [&[data-state=open]_svg]:rotate-180">
        {title}
        <ChevronDown className="size-4 shrink-0 text-[#00788A] transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function SearchFacetsPanel({
  facets,
  counts,
  onToggle,
  activeFilterCount,
  clearFilters,
  resultCount,
}: {
  facets: FacetSelections;
  counts: ReturnType<typeof useFacetCounts> extends infer R ? R : never;
  onToggle: {
    biosafety: (k: BiosafetyLevel) => void;
    formats: (k: ProductFormat) => void;
    docLanguages: (k: DocumentLanguage) => void;
    docCategories: (k: DocumentCategory) => void;
    antibiotic: (k: AntibioticResistant) => void;
    industries: (k: IndustryType) => void;
    instruments: (k: InstrumentKit) => void;
    syndromic: (k: MolecularSyndromic) => void;
    standards: (k: StandardGuideline) => void;
    taxonomy: (k: TaxonomyGroup) => void;
    testMethods: (k: TestMethod) => void;
  };
  activeFilterCount: number;
  clearFilters: () => void;
  resultCount: number;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/60 px-4 py-3.5">
        <p className="text-sm font-semibold text-foreground">Narrow By</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="font-semibold tabular-nums text-foreground">{resultCount}</span> Products
        </p>
        {activeFilterCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 h-8 px-0 text-[#00788A] hover:text-[#00788A]"
            onClick={clearFilters}
          >
            Clear all filters
          </Button>
        ) : null}
      </div>
      <div className="max-h-[min(75vh,44rem)] overflow-y-auto px-2 pb-2">
        <FacetCheckboxGroup
          title="Biosafety Level"
          options={biosafetyLevels}
          labels={searchFacetLabels.biosafetyLevel}
          selected={facets.biosafety}
          counts={counts.biosafety}
          onToggle={onToggle.biosafety}
        />
        <FacetCheckboxGroup
          title="Product Format"
          options={productFormats}
          labels={searchFacetLabels.productFormat}
          selected={facets.formats}
          counts={counts.formats}
          onToggle={onToggle.formats}
        />
        <FacetCheckboxGroup
          title="Document Language"
          options={documentLanguages}
          labels={searchFacetLabels.documentLanguage}
          selected={facets.docLanguages}
          counts={counts.docLanguages}
          onToggle={onToggle.docLanguages}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Document Category"
          options={documentCategories}
          labels={searchFacetLabels.documentCategory}
          selected={facets.docCategories}
          counts={counts.docCategories}
          onToggle={onToggle.docCategories}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Antibiotic/Drug Resistant Strains"
          options={antibioticResistantOptions}
          labels={searchFacetLabels.antibioticResistant}
          selected={facets.antibiotic}
          counts={counts.antibiotic}
          onToggle={onToggle.antibiotic}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Industry Type"
          options={industryTypes}
          labels={searchFacetLabels.industryType}
          selected={facets.industries}
          counts={counts.industries}
          onToggle={onToggle.industries}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Instrument/Type Kits"
          options={instrumentKits}
          labels={searchFacetLabels.instrumentKit}
          selected={facets.instruments}
          counts={counts.instruments}
          onToggle={onToggle.instruments}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Molecular Syndromic Testing"
          options={molecularSyndromicOptions}
          labels={searchFacetLabels.molecularSyndromic}
          selected={facets.syndromic}
          counts={counts.syndromic}
          onToggle={onToggle.syndromic}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Standards and Guidelines"
          options={standardGuidelines}
          labels={searchFacetLabels.standardGuideline}
          selected={facets.standards}
          counts={counts.standards}
          onToggle={onToggle.standards}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Taxonomy"
          options={taxonomyGroups}
          labels={searchFacetLabels.taxonomy}
          selected={facets.taxonomy}
          counts={counts.taxonomy}
          onToggle={onToggle.taxonomy}
        />
        <FacetCheckboxGroup
          title="Test Method"
          options={testMethods}
          labels={searchFacetLabels.testMethod}
          selected={facets.testMethods}
          counts={counts.testMethods}
          onToggle={onToggle.testMethods}
          defaultOpen={false}
        />
      </div>
    </div>
  );
}

function DocumentAccessPanel({
  item,
  user,
  onDownload,
  onPreview,
}: {
  item: SearchResultItem;
  user: DemoUserTaxonomy | null;
  onDownload: (item: SearchResultItem, docType: DocumentType) => void;
  onPreview: (item: SearchResultItem, docType: DocumentType) => void;
}) {
  if (!productHasAttachedDocuments(item) || !item.documents) return null;

  const rows: { type: DocumentType; available: boolean }[] = [
    { type: 'COA', available: item.documents.coa },
    { type: 'SDS', available: item.documents.sds },
    { type: 'IFU', available: item.documents.ifu },
  ].filter((r) => r.available);

  if (!rows.length) return null;

  return (
    <div className="mt-3 rounded-md border border-border/60 bg-slate-50/80 px-3 py-2.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Documents
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {rows.map(({ type }) => {
          const allowed = canAccessDocument(item, type, user);
          const needsLogin = documentRequiresLogin(type) && !user;

          if (allowed) {
            return (
              <div key={type} className="flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 border-[#00788A]/30 text-xs"
                  onClick={() => onDownload(item, type)}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  {type}
                </Button>
                {(type === 'SDS' || type === 'IFU') && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1 px-2 text-xs text-[#00788A]"
                    onClick={() => onPreview(item, type)}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden />
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
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-dashed border-border bg-muted/50 px-2.5 text-xs text-muted-foreground"
                title="Sign in to access this document"
              >
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {type}
                <span className="hidden sm:inline">— Sign in</span>
              </span>
            );
          }

          return null;
        })}
      </div>
      {!user ? (
        <p className="mt-2 text-xs text-muted-foreground">
          COA available without login. Sign in via the header for SDS, IFU, and contract pricing.
        </p>
      ) : null}
    </div>
  );
}

function PriceLine({
  item,
  user,
}: {
  item: SearchResultItem;
  user: DemoUserTaxonomy | null;
}) {
  const display = resolvePriceDisplay(item, user);

  if (display.kind === 'login') {
    return (
      <p className="mt-1 text-sm font-medium text-[#00788A]">
        Log in to see price
      </p>
    );
  }

  if (display.kind === 'hidden') {
    if (item.isDocument) {
      return <p className="mt-1 text-xs text-muted-foreground">Document — no pricing</p>;
    }
    if (user === 'Regulatory Professional') {
      return (
        <p className="mt-1 text-xs text-muted-foreground">Document &amp; regulatory access</p>
      );
    }
    return null;
  }

  return (
    <p className="mt-1 flex flex-wrap items-baseline gap-2 text-sm">
      <span className="font-semibold text-foreground">
        {formatPrice(display.amount, display.currency)}
      </span>
      {display.listAmount != null && display.listAmount > display.amount ? (
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(display.listAmount, display.currency)}
        </span>
      ) : null}
    </p>
  );
}

function ResultRow({
  item,
  user,
  onDownload,
  onPreview,
}: {
  item: SearchResultItem;
  user: DemoUserTaxonomy | null;
  onDownload: (item: SearchResultItem, docType: DocumentType) => void;
  onPreview: (item: SearchResultItem, docType: DocumentType) => void;
}) {
  const img = item.imageSrc ?? getDefaultCardImage();
  const formatLabel = searchFacetLabels.productFormat[item.productFormat];

  return (
    <article className="flex flex-col gap-4 border-b border-border/60 py-5 sm:flex-row sm:items-start">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted sm:h-28 sm:w-28"
      >
        <Image
          src={img}
          alt=""
          fill
          unoptimized
          sizes="112px"
          className="object-contain p-1"
        />
      </a>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#00788A]">
          {formatLabel}
          <span className="mx-1.5 text-muted-foreground">·</span>
          <span className="text-muted-foreground">Catalog No. {item.catalogNumber}</span>
        </p>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-base font-semibold leading-snug text-foreground hover:text-[#00788A]"
        >
          {item.title}
        </a>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <PriceLine item={item} user={user} />
        <DocumentAccessPanel
          item={item}
          user={user}
          onDownload={onDownload}
          onPreview={onPreview}
        />
      </div>
    </article>
  );
}

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

function buildFacetCounts(
  items: SearchResultItem[],
  facets: FacetSelections,
  dimension: keyof FacetSelections,
  getKeys: (item: SearchResultItem) => string[]
): Record<string, number> {
  const others = { ...facets, [dimension]: new Set() } as FacetSelections;
  const base = items.filter((item) => itemPassesFacets(item, others));
  const counts: Record<string, number> = {};
  for (const item of base) {
    for (const key of getKeys(item)) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return counts;
}

function useFacetCounts(queryMatched: SearchResultItem[], facets: FacetSelections) {
  return useMemo(
    () => ({
      biosafety: buildFacetCounts(queryMatched, facets, 'biosafety', (i) => [i.biosafetyLevel]),
      formats: buildFacetCounts(queryMatched, facets, 'formats', (i) => [i.productFormat]),
      docLanguages: buildFacetCounts(queryMatched, facets, 'docLanguages', (i) =>
        i.documentLanguage ? [i.documentLanguage] : []
      ),
      docCategories: buildFacetCounts(queryMatched, facets, 'docCategories', (i) =>
        i.documentCategory ? [i.documentCategory] : []
      ),
      antibiotic: buildFacetCounts(queryMatched, facets, 'antibiotic', (i) => [
        i.antibioticResistant,
      ]),
      industries: buildFacetCounts(queryMatched, facets, 'industries', (i) => i.industryTypes),
      instruments: buildFacetCounts(queryMatched, facets, 'instruments', (i) => i.instrumentKits),
      syndromic: buildFacetCounts(queryMatched, facets, 'syndromic', (i) => [i.molecularSyndromic]),
      standards: buildFacetCounts(queryMatched, facets, 'standards', (i) => i.standards),
      taxonomy: buildFacetCounts(queryMatched, facets, 'taxonomy', (i) => [i.taxonomy]),
      testMethods: buildFacetCounts(queryMatched, facets, 'testMethods', (i) => i.testMethods),
    }),
    [queryMatched, facets]
  );
}

export const SearchResults: FC<SearchResultsProps> = ({
  className,
  disableUrlSync = false,
  initialQuery = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';

  const activeDemoUserTaxonomy = useDemoTaxonomy();

  const [query, setQuery] = useState(() =>
    disableUrlSync ? normalizeQuery(initialQuery) : normalizeQuery(qFromUrl)
  );
  const [draft, setDraft] = useState(() => (disableUrlSync ? initialQuery : qFromUrl));
  const [sort, setSort] = useState<SortMode>('relevance');
  const [isSearching, setIsSearching] = useState(false);
  const [facets, setFacets] = useState<FacetSelections>(emptyFacets);
  const [resultsPage, setResultsPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState<{
    item: SearchResultItem;
    docType: DocumentType;
  } | null>(null);

  const handleDocumentDownload = useCallback((item: SearchResultItem, docType: DocumentType) => {
    if (!canAccessDocument(item, docType, activeDemoUserTaxonomy)) {
      toast.message('Sign in required', {
        description: `${docType} is available to authenticated users from your organization.`,
      });
      return;
    }
    toast.success(`${docType} download started`, {
      description: `Catalog #${item.catalogNumber} — simulated file delivery`,
    });
  }, [activeDemoUserTaxonomy]);

  const handleDocumentPreview = useCallback((item: SearchResultItem, docType: DocumentType) => {
    if (!canAccessDocument(item, docType, activeDemoUserTaxonomy)) {
      toast.message('Sign in required', {
        description: `Inline preview for ${docType} requires authentication.`,
      });
      return;
    }
    setPreviewDoc({ item, docType });
  }, [activeDemoUserTaxonomy]);

  const makeToggle = useCallback(
    (key: keyof FacetSelections) => (v: never) =>
      setFacets((prev) => {
        const next = { ...prev, [key]: new Set(prev[key]) };
        const set = next[key] as Set<never>;
        if (set.has(v)) set.delete(v);
        else set.add(v);
        return next;
      }),
    []
  );

  useEffect(() => {
    if (disableUrlSync) return;
    setDraft(qFromUrl);
    setQuery(normalizeQuery(qFromUrl));
  }, [disableUrlSync, qFromUrl]);

  useEffect(() => {
    setIsSearching(true);
    const t = window.setTimeout(() => setIsSearching(false), 200);
    return () => window.clearTimeout(t);
  }, [query, facets, sort]);

  useEffect(() => {
    setResultsPage(1);
  }, [query, facets, sort]);

  const activeCatalog = useMemo(() => {
    const merged = activeDemoUserTaxonomy
      ? [...supplementalResultsForDemoUserTaxonomy(activeDemoUserTaxonomy), ...searchCatalog]
      : searchCatalog;
    return merged.filter((item) => itemVisibleForDemoUser(item, activeDemoUserTaxonomy));
  }, [activeDemoUserTaxonomy]);

  const queryMatched = useMemo(
    () => activeCatalog.filter((item) => itemMatchesQuery(item, query)),
    [activeCatalog, query]
  );

  const facetCounts = useFacetCounts(queryMatched, facets);

  const filtered = useMemo(() => {
    const list = queryMatched.filter((item) => itemPassesFacets(item, facets));
    const sorted = [...list];
    if (sort === 'az') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => {
        const ra = relevanceScore(a, query, activeDemoUserTaxonomy);
        const rb = relevanceScore(b, query, activeDemoUserTaxonomy);
        if (rb !== ra) return rb - ra;
        return a.title.localeCompare(b.title);
      });
    }
    return sorted;
  }, [queryMatched, facets, sort, query, activeDemoUserTaxonomy]);

  const resultsTotalPages = Math.max(1, Math.ceil(filtered.length / RESULTS_PAGE_SIZE));
  const safeResultsPage = Math.min(resultsPage, resultsTotalPages);
  const pagedResults = useMemo(() => {
    const start = (safeResultsPage - 1) * RESULTS_PAGE_SIZE;
    return filtered.slice(start, start + RESULTS_PAGE_SIZE);
  }, [filtered, safeResultsPage]);

  useEffect(() => {
    if (resultsPage > resultsTotalPages) setResultsPage(resultsTotalPages);
  }, [resultsPage, resultsTotalPages]);

  const activeFilterCount = countActiveFacets(facets);
  const clearFilters = () => setFacets(emptyFacets());

  const syncUrl = useCallback(
    (qRaw: string) => {
      if (disableUrlSync) return;
      const trimmed = qRaw.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [disableUrlSync, pathname, router, searchParams]
  );

  const runSearch = useCallback(() => {
    const trimmed = draft.trim();
    setQuery(normalizeQuery(trimmed));
    syncUrl(trimmed);
  }, [draft, syncUrl]);

  const applyPopular = (term: string) => {
    setDraft(term);
    setQuery(normalizeQuery(term));
    syncUrl(term);
  };

  const displayHeading = draft.trim() || qFromUrl.trim();
  const personaLabel = activeDemoUserTaxonomy ?? 'Not signed in';

  const facetToggleHandlers = {
    biosafety: makeToggle('biosafety'),
    formats: makeToggle('formats'),
    docLanguages: makeToggle('docLanguages'),
    docCategories: makeToggle('docCategories'),
    antibiotic: makeToggle('antibiotic'),
    industries: makeToggle('industries'),
    instruments: makeToggle('instruments'),
    syndromic: makeToggle('syndromic'),
    standards: makeToggle('standards'),
    taxonomy: makeToggle('taxonomy'),
    testMethods: makeToggle('testMethods'),
  };

  return (
    <section className={cn('min-h-[60vh] bg-background pb-16 pt-6', className)} aria-label="Search results">
      <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#00788A]"
                aria-hidden
              />
              <input
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runSearch();
                  }
                }}
                placeholder="Search by organism, catalog number, ATCC number, or product name..."
                className="h-11 w-full rounded-md border border-border bg-background pl-11 pr-10 text-sm outline-none ring-[#00788A]/20 placeholder:text-muted-foreground focus:border-[#00788A] focus:ring-2"
                autoComplete="off"
              />
              {draft ? (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Clear search"
                  onClick={() => {
                    setDraft('');
                    setQuery('');
                    syncUrl('');
                  }}
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <Button
              type="button"
              className="h-11 shrink-0 px-8 font-semibold text-white"
              style={{ backgroundColor: TEAL }}
              onClick={runSearch}
            >
              Search
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Popular
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => applyPopular(term)}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-[#00788A]/40 hover:text-[#00788A]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#00788A]">Products</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {normalizeQuery(query) ? (
                <>
                  Results for <span style={{ color: TEAL }}>&ldquo;{displayHeading}&rdquo;</span>
                </>
              ) : (
                'Product search'
              )}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Search mirrors{' '}
              <a
                href={MB_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#00788A] hover:underline"
              >
                microbiologics.com
              </a>{' '}
              — reference materials with auth-scoped documents: COA is public; SDS and IFU require
              header login. Contract pricing resolves from NetSuite when signed in.
            </p>
            <div className="mt-3 rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Demo catalog numbers: </span>
              {DEMO_CATALOG_NUMBERS.map((d, i) => (
                <span key={d.catalogNumber}>
                  {i > 0 ? ' · ' : ''}
                  <button
                    type="button"
                    className="font-mono text-[#00788A] hover:underline"
                    onClick={() => applyPopular(d.catalogNumber)}
                  >
                    {d.catalogNumber}
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-dashed border-[#00788A]/30 bg-[#00788A]/5 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Signed in as:</span> {personaLabel}
            {!activeDemoUserTaxonomy ? (
              <span className="mt-0.5 block text-[#00788A]">
                COA only · Sign in for SDS, IFU, and pricing
              </span>
            ) : (
              <span className="mt-0.5 block text-emerald-700">
                Full document access · Contract pricing active
              </span>
            )}
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,17.5rem)] xl:w-72">
            <div className="hidden lg:block">
              <SearchFacetsPanel
                facets={facets}
                counts={facetCounts}
                onToggle={facetToggleHandlers}
                activeFilterCount={activeFilterCount}
                clearFilters={clearFilters}
                resultCount={filtered.length}
              />
            </div>
            <div className="lg:hidden">
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold">
                  Narrow By
                  {activeFilterCount > 0 ? (
                    <Badge variant="secondary" className="rounded-full">
                      {activeFilterCount}
                    </Badge>
                  ) : null}
                  <ChevronDown className="size-4 text-[#00788A]" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <SearchFacetsPanel
                    facets={facets}
                    counts={facetCounts}
                    onToggle={facetToggleHandlers}
                    activeFilterCount={activeFilterCount}
                    clearFilters={clearFilters}
                    resultCount={filtered.length}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isSearching ? (
                  <Loader2 className="size-4 animate-spin text-[#00788A]" aria-hidden />
                ) : null}
                <span>
                  <strong className="font-semibold tabular-nums text-foreground">{filtered.length}</strong>{' '}
                  {filtered.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-[#00788A]/20"
                >
                  <option value="relevance">Best match</option>
                  <option value="az">Name A–Z</option>
                </select>
              </label>
            </div>

            {filtered.length > 0 ? (
              <>
                <div>
                  {pagedResults.map((item) => (
                    <ResultRow
                      key={item.id}
                      item={item}
                      user={activeDemoUserTaxonomy}
                      onDownload={handleDocumentDownload}
                      onPreview={handleDocumentPreview}
                    />
                  ))}
                </div>
                {filtered.length > RESULTS_PAGE_SIZE ? (
                  <nav
                    className="mt-6 flex flex-col items-stretch justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center"
                    aria-label="Paged search results"
                  >
                    <p className="text-sm text-muted-foreground">
                      Showing {(safeResultsPage - 1) * RESULTS_PAGE_SIZE + 1}–
                      {Math.min(safeResultsPage * RESULTS_PAGE_SIZE, filtered.length)} of{' '}
                      {filtered.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={safeResultsPage <= 1}
                        onClick={() => setResultsPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span className="px-2 text-sm tabular-nums">
                        Page {safeResultsPage} of {resultsTotalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={safeResultsPage >= resultsTotalPages}
                        onClick={() => setResultsPage((p) => Math.min(resultsTotalPages, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-secondary-foreground">No matches found.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try catalog numbers such as 0681E7, 0659E7, or SK-0ASP61.
                </p>
                <Button type="button" variant="secondary" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={Boolean(previewDoc)} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-2xl">
          {previewDoc ? (
            <>
              <DialogHeader>
                <DialogTitle>{previewDoc.docType} Preview</DialogTitle>
                <DialogDescription>{previewDoc.item.title}</DialogDescription>
              </DialogHeader>
              {(() => {
                const content = documentPreviewContent(previewDoc.item, previewDoc.docType);
                return (
                  <div className="space-y-3 rounded-md border border-border bg-muted/30 p-4 text-sm">
                    <p className="font-semibold">{content.title}</p>
                    <p>Catalog #: {content.catalogNumber}</p>
                    <p>Lot: {content.lotNumber}</p>
                    <p className="text-muted-foreground">{content.summary}</p>
                    <p className="border-t border-border pt-3 text-xs text-muted-foreground">
                      {content.approvedBy}
                    </p>
                  </div>
                );
              })()}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export const Default = (props: ComponentProps) => (
  <SearchResults className={typeof props.params?.styles === 'string' ? props.params.styles : undefined} />
);
