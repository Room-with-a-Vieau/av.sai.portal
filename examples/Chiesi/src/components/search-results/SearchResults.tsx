'use client';

/**
 * SearchResults — Chiesi Global Rare Diseases personalized content search (SitecoreAI demo).
 *
 * Persona-aware rare disease information hub:
 * - Anonymous: public disease info, patient leaflets, FAQs
 * - Healthcare Professional: prescribing info, SmPC, clinical briefs, trial data
 * - Patient Advocate: policy briefs, coalition toolkits, awareness resources
 * - Caregiver / Rare disease Patient: care guides, support programs, patient stories
 */

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Loader2,
  Lock,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
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
  CHIESI_BASE,
  contentLanguages,
  contentTypes,
  DEMO_CONTENT_IDS,
  documentPreviewContent,
  documentRequiresHcp,
  documentRequiresLogin,
  getDefaultCardImage,
  itemMatchesQuery,
  itemMetadataLine,
  itemVisibleForDemoUser,
  normalizeQuery,
  personaSearchHint,
  popularSearches,
  relevanceScore,
  resolveAccessDisplay,
  resourceFormats,
  RESULTS_PAGE_SIZE,
  searchCatalog,
  searchFacetLabels,
  supplementalResultsForDemoUserTaxonomy,
  therapeuticAreas,
  audienceTags,
  accessTiers,
  productHasAttachedDocuments,
  type AccessTier,
  type AudienceTag,
  type ContentLanguage,
  type ContentType,
  type DemoUserTaxonomy,
  type DocumentType,
  type ResourceFormat,
  type SearchResultItem,
  type TherapeuticArea,
} from './data';

export type SearchResultsProps = {
  className?: string;
  disableUrlSync?: boolean;
  initialQuery?: string;
};

type SortMode = 'relevance' | 'az' | 'recent';

const CHIESI_PRIMARY = '#A61D5D';
const CHIESI_TEAL = '#004B4D';

type FacetSelections = {
  contentTypes: Set<ContentType>;
  therapeuticAreas: Set<TherapeuticArea>;
  audienceTags: Set<AudienceTag>;
  resourceFormats: Set<ResourceFormat>;
  languages: Set<ContentLanguage>;
  accessTiers: Set<AccessTier>;
};

function emptyFacets(): FacetSelections {
  return {
    contentTypes: new Set(),
    therapeuticAreas: new Set(),
    audienceTags: new Set(),
    resourceFormats: new Set(),
    languages: new Set(),
    accessTiers: new Set(),
  };
}

function countActiveFacets(f: FacetSelections): number {
  return (
    f.contentTypes.size +
    f.therapeuticAreas.size +
    f.audienceTags.size +
    f.resourceFormats.size +
    f.languages.size +
    f.accessTiers.size
  );
}

function itemPassesFacets(item: SearchResultItem, f: FacetSelections): boolean {
  if (f.contentTypes.size && !f.contentTypes.has(item.contentType)) return false;
  if (f.therapeuticAreas.size && !f.therapeuticAreas.has(item.therapeuticArea)) return false;
  if (f.audienceTags.size && !item.audienceTags.some((tag) => f.audienceTags.has(tag))) return false;
  if (f.resourceFormats.size && !f.resourceFormats.has(item.resourceFormat)) return false;
  if (f.languages.size && !f.languages.has(item.language)) return false;
  if (f.accessTiers.size && !f.accessTiers.has(item.accessTier)) return false;
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
              className="mt-0.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
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
        <ChevronDown className="size-4 shrink-0 text-primary transition-transform duration-200" />
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
  counts: ReturnType<typeof useFacetCounts>;
  onToggle: {
    contentTypes: (k: ContentType) => void;
    therapeuticAreas: (k: TherapeuticArea) => void;
    audienceTags: (k: AudienceTag) => void;
    resourceFormats: (k: ResourceFormat) => void;
    languages: (k: ContentLanguage) => void;
    accessTiers: (k: AccessTier) => void;
  };
  activeFilterCount: number;
  clearFilters: () => void;
  resultCount: number;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/60 px-4 py-3.5">
        <p className="text-sm font-semibold text-foreground">Refine Results</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="font-semibold tabular-nums text-foreground">{resultCount}</span> resources
        </p>
        {activeFilterCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 h-8 px-0 text-primary hover:text-primary"
            onClick={clearFilters}
          >
            Clear all filters
          </Button>
        ) : null}
      </div>
      <div className="max-h-[min(75vh,44rem)] overflow-y-auto px-2 pb-2">
        <FacetCheckboxGroup
          title="Content Type"
          options={contentTypes}
          labels={searchFacetLabels.contentType}
          selected={facets.contentTypes}
          counts={counts.contentTypes}
          onToggle={onToggle.contentTypes}
        />
        <FacetCheckboxGroup
          title="Therapeutic Area"
          options={therapeuticAreas}
          labels={searchFacetLabels.therapeuticArea}
          selected={facets.therapeuticAreas}
          counts={counts.therapeuticAreas}
          onToggle={onToggle.therapeuticAreas}
        />
        <FacetCheckboxGroup
          title="Intended Audience"
          options={audienceTags}
          labels={searchFacetLabels.audienceTag}
          selected={facets.audienceTags}
          counts={counts.audienceTags}
          onToggle={onToggle.audienceTags}
        />
        <FacetCheckboxGroup
          title="Format"
          options={resourceFormats}
          labels={searchFacetLabels.resourceFormat}
          selected={facets.resourceFormats}
          counts={counts.resourceFormats}
          onToggle={onToggle.resourceFormats}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Language"
          options={contentLanguages}
          labels={searchFacetLabels.contentLanguage}
          selected={facets.languages}
          counts={counts.languages}
          onToggle={onToggle.languages}
          defaultOpen={false}
        />
        <FacetCheckboxGroup
          title="Access Level"
          options={accessTiers}
          labels={searchFacetLabels.accessTier}
          selected={facets.accessTiers}
          counts={counts.accessTiers}
          onToggle={onToggle.accessTiers}
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

  const rows = [
    { type: 'Patient Leaflet' as DocumentType, available: item.documents.patientLeaflet },
    { type: 'Prescribing Info' as DocumentType, available: item.documents.prescribingInfo },
    { type: 'SmPC' as DocumentType, available: item.documents.smpc },
    { type: 'Clinical Brief' as DocumentType, available: item.documents.clinicalBrief },
  ].filter((r): r is { type: DocumentType; available: boolean } => r.available);

  if (!rows.length) return null;

  return (
    <div className="mt-3 rounded-md border border-border/60 bg-muted/30 px-3 py-2.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Attached Documents
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {rows.map(({ type }) => {
          const allowed = canAccessDocument(item, type, user);
          const needsLogin = documentRequiresLogin(type) && !user;
          const needsHcp = documentRequiresHcp(type) && user !== 'Healthcare Professional';

          if (allowed) {
            return (
              <div key={type} className="flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 border-primary/30 text-xs"
                  onClick={() => onDownload(item, type)}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  {type}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1 px-2 text-xs text-primary"
                  onClick={() => onPreview(item, type)}
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden />
                  Preview
                </Button>
              </div>
            );
          }

          if (needsLogin || needsHcp) {
            return (
              <span
                key={type}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-dashed border-border bg-muted/50 px-2.5 text-xs text-muted-foreground"
                title={needsHcp ? 'Healthcare professional access required' : 'Sign in to access'}
              >
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {type}
                <span className="hidden sm:inline">
                  — {needsHcp ? 'HCP only' : 'Sign in'}
                </span>
              </span>
            );
          }

          return null;
        })}
      </div>
      {!user ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Patient leaflets are public. Sign in via the header for clinical documents and personalized
          results.
        </p>
      ) : null}
    </div>
  );
}

function AccessBadge({
  item,
  user,
}: {
  item: SearchResultItem;
  user: DemoUserTaxonomy | null;
}) {
  const access = resolveAccessDisplay(item, user);

  if (access.kind === 'personalized') {
    return (
      <Badge
        variant="secondary"
        className="gap-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/10"
      >
        <Sparkles className="h-3 w-3" aria-hidden />
        {access.label}
      </Badge>
    );
  }

  if (access.kind === 'hcpOnly') {
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <Lock className="h-3 w-3" aria-hidden />
        HCP only
      </Badge>
    );
  }

  if (access.kind === 'signIn') {
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <Lock className="h-3 w-3" aria-hidden />
        Sign in for full access
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-muted-foreground">
      Public
    </Badge>
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
  const formatLabel = searchFacetLabels.resourceFormat[item.resourceFormat];
  const typeLabel = searchFacetLabels.contentType[item.contentType];

  return (
    <article className="flex flex-col gap-4 border-b border-border/60 py-6 sm:flex-row sm:items-start">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted sm:h-32 sm:w-40"
      >
        <Image
          src={img}
          alt=""
          fill
          unoptimized
          sizes="160px"
          className="object-cover"
        />
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {typeLabel}
        </span>
      </a>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium" style={{ color: CHIESI_TEAL }}>
            {formatLabel}
            <span className="mx-1.5 text-muted-foreground">·</span>
            <span className="font-mono text-muted-foreground">{item.contentId}</span>
          </p>
          <AccessBadge item={item} user={user} />
        </div>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-lg font-semibold leading-snug text-foreground hover:text-primary"
        >
          {item.title}
        </a>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.summary}</p>

        {item.keyHighlights.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.keyHighlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-xs text-foreground/80"
              >
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            {itemMetadataLine(item)}
          </span>
          {item.readTimeMinutes ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {item.readTimeMinutes} min read
            </span>
          ) : null}
          <span>Updated {item.lastUpdated}</span>
        </div>

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
      contentTypes: buildFacetCounts(queryMatched, facets, 'contentTypes', (i) => [i.contentType]),
      therapeuticAreas: buildFacetCounts(queryMatched, facets, 'therapeuticAreas', (i) => [
        i.therapeuticArea,
      ]),
      audienceTags: buildFacetCounts(queryMatched, facets, 'audienceTags', (i) => i.audienceTags),
      resourceFormats: buildFacetCounts(queryMatched, facets, 'resourceFormats', (i) => [
        i.resourceFormat,
      ]),
      languages: buildFacetCounts(queryMatched, facets, 'languages', (i) => [i.language]),
      accessTiers: buildFacetCounts(queryMatched, facets, 'accessTiers', (i) => [i.accessTier]),
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

  const handleDocumentDownload = useCallback(
    (item: SearchResultItem, docType: DocumentType) => {
      if (!canAccessDocument(item, docType, activeDemoUserTaxonomy)) {
        toast.message('Access required', {
          description:
            docType === 'Prescribing Info' || docType === 'SmPC'
              ? `${docType} is available to verified healthcare professionals.`
              : `${docType} requires signing in via the header.`,
        });
        return;
      }
      toast.success(`${docType} download started`, {
        description: `${item.contentId} — simulated secure document delivery`,
      });
    },
    [activeDemoUserTaxonomy]
  );

  const handleDocumentPreview = useCallback(
    (item: SearchResultItem, docType: DocumentType) => {
      if (!canAccessDocument(item, docType, activeDemoUserTaxonomy)) {
        toast.message('Access required', {
          description: `Preview for ${docType} requires appropriate sign-in.`,
        });
        return;
      }
      setPreviewDoc({ item, docType });
    },
    [activeDemoUserTaxonomy]
  );

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
    } else if (sort === 'recent') {
      sorted.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
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
    contentTypes: makeToggle('contentTypes'),
    therapeuticAreas: makeToggle('therapeuticAreas'),
    audienceTags: makeToggle('audienceTags'),
    resourceFormats: makeToggle('resourceFormats'),
    languages: makeToggle('languages'),
    accessTiers: makeToggle('accessTiers'),
  };

  return (
    <section className={cn('min-h-[60vh] bg-background pb-16 pt-6', className)} aria-label="Search results">
      <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary"
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
                placeholder="Search diseases, treatments, support programs, clinical resources..."
                className="h-11 w-full rounded-md border border-border bg-background pl-11 pr-10 text-sm outline-none ring-primary/20 placeholder:text-muted-foreground focus:border-primary focus:ring-2"
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
              className="h-11 shrink-0 px-8 font-semibold text-primary-foreground"
              style={{ backgroundColor: CHIESI_PRIMARY }}
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
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Rare Disease Resources
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {normalizeQuery(query) ? (
                <>
                  Results for{' '}
                  <span style={{ color: CHIESI_PRIMARY }}>&ldquo;{displayHeading}&rdquo;</span>
                </>
              ) : (
                'Find information & support'
              )}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Personalized search across{' '}
              <a
                href={CHIESI_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Chiesi Global Rare Diseases
              </a>{' '}
              — disease education, treatment guides, clinical resources, advocacy toolkits, and patient
              support. Results adapt when you sign in as a Healthcare Professional, Patient Advocate,
              Caregiver, or Rare disease Patient.
            </p>
            <div className="mt-3 rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Demo content IDs: </span>
              {DEMO_CONTENT_IDS.map((d, i) => (
                <span key={d.contentId}>
                  {i > 0 ? ' · ' : ''}
                  <button
                    type="button"
                    className="font-mono text-primary hover:underline"
                    onClick={() => applyPopular(d.contentId)}
                    title={d.label}
                  >
                    {d.contentId}
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Signed in as:</span> {personaLabel}
            <span className="mt-0.5 block text-primary">{personaSearchHint(activeDemoUserTaxonomy)}</span>
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
                  Refine Results
                  {activeFilterCount > 0 ? (
                    <Badge variant="secondary" className="rounded-full">
                      {activeFilterCount}
                    </Badge>
                  ) : null}
                  <ChevronDown className="size-4 text-primary" />
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
                  <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
                ) : null}
                <span>
                  <strong className="font-semibold tabular-nums text-foreground">{filtered.length}</strong>{' '}
                  {filtered.length === 1 ? 'resource' : 'resources'}
                </span>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="relevance">Best match</option>
                  <option value="recent">Most recent</option>
                  <option value="az">Title A–Z</option>
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
                      {Math.min(safeResultsPage * RESULTS_PAGE_SIZE, filtered.length)} of {filtered.length}
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
                  Try &ldquo;Filsuvez&rdquo;, &ldquo;epidermolysis bullosa&rdquo;, or &ldquo;patient
                  support&rdquo;.
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
                    <p>Content ID: {content.contentId}</p>
                    <p>Version: {content.version}</p>
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
