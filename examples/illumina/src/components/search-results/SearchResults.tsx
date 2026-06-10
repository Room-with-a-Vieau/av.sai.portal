'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  Sparkles,
  UserCircle2,
  Wrench,
  X,
} from 'lucide-react';

import type { ComponentProps } from '@/lib/component-props';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';
import type { DemoUserTaxonomy } from '@/lib/demo-user-personas';
import { parseDemoUserTaxonomy } from '@/lib/demo-user-personas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

import {
  categoryFilterLabels,
  categoryFilters,
  categoryFilterToParam,
  itemMatchesQuery,
  itemVisibleForDemoUser,
  normalizeQuery,
  parseCategoryFilter,
  popularSearches,
  relevanceScore,
  RESULTS_PAGE_SIZE,
  searchCatalog,
  searchTools,
  selectAiSearchInsight,
  selectFeaturedAnswer,
  suggestedQuestions,
  supplementalResultsForDemoUserTaxonomy,
  type SearchCategoryFilter,
  type SearchResultItem,
} from './illumina-search-data';

export type SearchResultsProps = {
  className?: string;
  disableUrlSync?: boolean;
  initialQuery?: string;
};

type SortMode = 'relevance' | 'az';

function categoryIcon(category: SearchResultItem['category']) {
  if (category === 'manuals') return FileText;
  if (category === 'techSupport') return Wrench;
  if (category === 'learn' || category === 'training' || category === 'publications') return BookOpen;
  return FileText;
}

function ResultRow({ item }: { item: SearchResultItem }) {
  const Icon = categoryIcon(item.category);
  const meta = [
    categoryFilterLabels[item.category],
    item.documentType,
    item.dateLabel,
    item.breadcrumb?.join(' › '),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="group border-b border-border/70 py-6 last:border-b-0">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-inherit no-underline"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-full bg-secondary/80 text-[11px] font-semibold uppercase tracking-wide text-foreground"
          >
            {categoryFilterLabels[item.category]}
          </Badge>
          {item.isNew ? (
            <Badge className="rounded-full bg-[#4E60EE] text-[10px] font-bold uppercase text-white hover:bg-[#4E60EE]">
              New
            </Badge>
          ) : null}
          {item.demoUserTaxonomy ? (
            <Badge variant="outline" className="rounded-full border-[#4E60EE]/30 text-[10px] text-[#4E60EE]">
              For {item.demoUserTaxonomy}
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-[#4E60EE]">
          {item.title}
        </h3>
        {meta ? (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon className="size-3.5 shrink-0 text-[#4E60EE]" aria-hidden />
            {meta}
          </p>
        ) : null}
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/85">{item.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4E60EE]">
          View resource
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </a>
    </article>
  );
}

function CategorySidebar({
  activeCategory,
  categoryCounts,
  onCategoryChange,
}: {
  activeCategory: SearchCategoryFilter;
  categoryCounts: Record<SearchCategoryFilter, number>;
  onCategoryChange: (category: SearchCategoryFilter) => void;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Filter by category</h2>
      </div>
      <ul className="p-2">
        {categoryFilters.map((category) => {
          const active = activeCategory === category;
          return (
            <li key={category}>
              <button
                type="button"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                  active
                    ? 'bg-[#4E60EE]/10 font-semibold text-[#4E60EE]'
                    : 'text-foreground/90 hover:bg-secondary/80'
                )}
              >
                <span>{categoryFilterLabels[category]}</span>
                <span className="text-xs tabular-nums text-muted-foreground">({categoryCounts[category]})</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border/60 px-4 py-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">More search tools</h3>
        <ul className="mt-3 space-y-2">
          {searchTools.map((tool) => (
            <li key={tool.href}>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 text-sm font-medium text-[#4E60EE] hover:underline"
              >
                {tool.label}
                <ExternalLink className="mt-0.5 size-3 shrink-0 opacity-70" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
  const filterFromUrl = parseCategoryFilter(searchParams.get('filter'));
  const pageFromUrl = Math.max(1, Number.parseInt(searchParams.get('p') ?? '1', 10) || 1);

  const [query, setQuery] = useState(() =>
    disableUrlSync ? normalizeQuery(initialQuery) : normalizeQuery(qFromUrl)
  );
  const [draft, setDraft] = useState(() => (disableUrlSync ? initialQuery : qFromUrl));
  const [activeCategory, setActiveCategory] = useState<SearchCategoryFilter>(filterFromUrl);
  const [resultsPage, setResultsPage] = useState(pageFromUrl);
  const [sort, setSort] = useState<SortMode>('relevance');
  const [isSearching, setIsSearching] = useState(false);
  const [demoTaxonomyRaw, setDemoTaxonomyRaw] = useState('');

  useEffect(() => {
    const readTaxonomy = () => {
      setDemoTaxonomyRaw(
        typeof window !== 'undefined' ? (window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '') : ''
      );
    };
    readTaxonomy();
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, readTaxonomy);
    return () => window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, readTaxonomy);
  }, []);

  const activeDemoUserTaxonomy = useMemo(
    () => parseDemoUserTaxonomy(demoTaxonomyRaw),
    [demoTaxonomyRaw]
  );

  const activeCatalog = useMemo(() => {
    if (!activeDemoUserTaxonomy) return searchCatalog;
    return [...supplementalResultsForDemoUserTaxonomy(activeDemoUserTaxonomy), ...searchCatalog];
  }, [activeDemoUserTaxonomy]);

  useEffect(() => {
    if (disableUrlSync) return;
    setDraft(qFromUrl);
    setQuery(normalizeQuery(qFromUrl));
    setActiveCategory(filterFromUrl);
    setResultsPage(pageFromUrl);
  }, [disableUrlSync, filterFromUrl, pageFromUrl, qFromUrl]);

  useEffect(() => {
    setIsSearching(true);
    const t = window.setTimeout(() => setIsSearching(false), 180);
    return () => window.clearTimeout(t);
  }, [query, activeCategory, sort, activeDemoUserTaxonomy]);

  useEffect(() => {
    setResultsPage(1);
  }, [query, activeCategory, sort, activeDemoUserTaxonomy]);

  const syncUrl = useCallback(
    (next: { q?: string; filter?: SearchCategoryFilter; page?: number }) => {
      if (disableUrlSync) return;
      const params = new URLSearchParams(searchParams.toString());
      const qRaw = next.q ?? draft;
      const trimmed = qRaw.trim();
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');

      const filter = next.filter ?? activeCategory;
      const filterParam = categoryFilterToParam(filter);
      if (filterParam) params.set('filter', filterParam);
      else params.delete('filter');

      const page = next.page ?? resultsPage;
      if (page > 1) params.set('p', String(page));
      else params.delete('p');

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [activeCategory, disableUrlSync, draft, pathname, resultsPage, router, searchParams]
  );

  const runSearch = useCallback(
    (term?: string) => {
      const trimmed = (term ?? draft).trim();
      setDraft(trimmed);
      setQuery(normalizeQuery(trimmed));
      setResultsPage(1);
      syncUrl({ q: trimmed, page: 1 });
    },
    [draft, syncUrl]
  );

  const queryMatched = useMemo(
    () =>
      activeCatalog.filter(
        (item) => itemVisibleForDemoUser(item, activeDemoUserTaxonomy) && itemMatchesQuery(item, query)
      ),
    [activeCatalog, activeDemoUserTaxonomy, query]
  );

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(categoryFilters.map((c) => [c, 0])) as Record<
      SearchCategoryFilter,
      number
    >;
    counts.all = queryMatched.length;
    for (const item of queryMatched) {
      counts[item.category] += 1;
    }
    return counts;
  }, [queryMatched]);

  const filtered = useMemo(() => {
    let list = queryMatched;
    if (activeCategory !== 'all') {
      list = list.filter((item) => item.category === activeCategory);
    }
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
  }, [activeCategory, activeDemoUserTaxonomy, query, queryMatched, sort]);

  const resultsTotalPages = Math.max(1, Math.ceil(filtered.length / RESULTS_PAGE_SIZE));
  const safeResultsPage = Math.min(resultsPage, resultsTotalPages);
  const pagedResults = useMemo(() => {
    const start = (safeResultsPage - 1) * RESULTS_PAGE_SIZE;
    return filtered.slice(start, start + RESULTS_PAGE_SIZE);
  }, [filtered, safeResultsPage]);

  useEffect(() => {
    if (resultsPage > resultsTotalPages) setResultsPage(resultsTotalPages);
  }, [resultsPage, resultsTotalPages]);

  const featured = useMemo(
    () => selectFeaturedAnswer(query, activeDemoUserTaxonomy),
    [activeDemoUserTaxonomy, query]
  );
  const aiInsight = useMemo(
    () => selectAiSearchInsight(query, activeDemoUserTaxonomy),
    [activeDemoUserTaxonomy, query]
  );

  const displayHeading = draft.trim() || qFromUrl.trim();

  const handleCategoryChange = (category: SearchCategoryFilter) => {
    setActiveCategory(category);
    setResultsPage(1);
    syncUrl({ filter: category, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setResultsPage(page);
    syncUrl({ page });
  };

  return (
    <section className={cn('min-h-[60vh] bg-background pb-16 pt-6 sm:pt-8', className)} aria-label="Site search">
      <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#4E60EE]"
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
                placeholder="Search products, learn, support, manuals…"
                className="h-12 w-full rounded-full border border-border bg-background pl-10 pr-10 text-sm text-foreground shadow-sm outline-none ring-[#4E60EE]/20 placeholder:text-muted-foreground focus:border-[#4E60EE] focus:ring-2 focus:ring-[#4E60EE]/20"
                autoComplete="off"
              />
              {draft ? (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                  onClick={() => {
                    setDraft('');
                    setQuery('');
                    setResultsPage(1);
                    syncUrl({ q: '', page: 1 });
                  }}
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <Button
              type="button"
              className="h-12 shrink-0 rounded-full border border-[#4E60EE] bg-white px-8 font-semibold text-[#4E60EE] hover:bg-[#f5f5f5]"
              onClick={() => runSearch()}
            >
              Search
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Popular</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => runSearch(term)}
                className="rounded-full border border-border/80 bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-[#4E60EE]/40 hover:text-[#4E60EE]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Persona banner */}
        {activeDemoUserTaxonomy ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[#4E60EE]/20 bg-[#4E60EE]/5 px-4 py-3 text-sm text-foreground">
            <UserCircle2 className="size-4 shrink-0 text-[#4E60EE]" aria-hidden />
            <span>
              Results personalized for{' '}
              <strong className="font-semibold text-[#4E60EE]">{activeDemoUserTaxonomy}</strong>.
            </span>
            <span className="text-muted-foreground">Change persona via the header Login menu.</span>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Select a persona in the header <strong className="font-medium text-foreground">Login</strong> menu to
            personalize ranking and supplemental results.
          </p>
        )}

        {/* Suggested questions */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground">Suggested questions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => runSearch(question.replace(/\?$/, ''))}
                className="rounded-full border border-border bg-card px-4 py-2 text-left text-xs font-medium text-foreground shadow-sm transition-colors hover:border-[#4E60EE]/40 hover:bg-[#4E60EE]/5 hover:text-[#4E60EE]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <header className="mt-10">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {normalizeQuery(query) ? (
              <>
                Results for <span className="text-[#4E60EE]">&ldquo;{displayHeading}&rdquo;</span>
              </>
            ) : (
              'Search Illumina.com'
            )}
          </h1>
          {activeCategory !== 'all' ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Filtered by <strong className="text-foreground">{categoryFilterLabels[activeCategory]}</strong>
            </p>
          ) : null}
        </header>

        {/* Mobile category pills */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {categoryFilters.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                activeCategory === category
                  ? 'border-[#4E60EE] bg-[#4E60EE]/10 text-[#4E60EE]'
                  : 'border-border bg-card text-foreground'
              )}
            >
              {categoryFilterLabels[category]} ({categoryCounts[category]})
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <aside className="hidden w-full shrink-0 lg:block lg:w-[min(100%,18rem)] xl:w-72">
            <div className="sticky top-28">
              <CategorySidebar
                activeCategory={activeCategory}
                categoryCounts={categoryCounts}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {/* AI / Q&A answer */}
            {featured ? (
              <section
                className="relative overflow-hidden rounded-2xl border border-[#4E60EE]/25 bg-gradient-to-br from-[#4E60EE]/8 via-background to-secondary/40 p-5 shadow-sm"
                aria-labelledby="search-qa-heading"
              >
                <div className="absolute right-0 top-0 size-40 rounded-full bg-[#4E60EE]/10 blur-3xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#4E60EE]/15 text-[#4E60EE]">
                    <Sparkles className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p id="search-qa-heading" className="text-xs font-bold uppercase tracking-wider text-[#4E60EE]">
                      AI answer
                    </p>
                    <h2 className="text-lg font-semibold leading-snug text-foreground">{featured.question}</h2>
                    <p className="text-sm leading-relaxed text-foreground/85">{featured.displayAnswer}</p>
                    <a
                      href={featured.learnMoreHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#4E60EE] hover:underline"
                    >
                      {featured.learnMoreLabel ?? 'Learn more'}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </div>
                </div>
              </section>
            ) : null}

            {aiInsight ? (
              <section
                className={cn(
                  'rounded-2xl border border-border/80 bg-card p-5 shadow-sm',
                  featured ? 'mt-4' : ''
                )}
                aria-labelledby="search-ai-insight-heading"
              >
                <p id="search-ai-insight-heading" className="text-xs font-bold uppercase tracking-wider text-[#4E60EE]">
                  AI search insight
                </p>
                <h2 className="mt-2 text-base font-semibold text-foreground">{aiInsight.headline}</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{aiInsight.body}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                  {aiInsight.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <a
                  href={aiInsight.learnMoreHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4E60EE] hover:underline"
                >
                  {aiInsight.learnMoreLabel ?? 'Learn more'}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </section>
            ) : null}

            <div
              className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
                featured || aiInsight ? 'mt-8' : 'mt-0'
              )}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isSearching ? <Loader2 className="size-4 shrink-0 animate-spin text-[#4E60EE]" aria-hidden /> : null}
                <span>
                  <strong className="font-semibold text-foreground">{filtered.length}</strong>{' '}
                  {filtered.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <span className="hidden sm:inline">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  className="h-9 rounded-full border border-border bg-background px-3 text-sm outline-none focus:border-[#4E60EE] focus:ring-2 focus:ring-[#4E60EE]/20"
                >
                  <option value="relevance">Best match</option>
                  <option value="az">Title A–Z</option>
                </select>
              </label>
            </div>

            {filtered.length > 0 ? (
              <>
                <div className="mt-4 rounded-2xl border border-border/70 bg-card px-4 sm:px-6">
                  {pagedResults.map((item) => (
                    <ResultRow key={item.id} item={item} />
                  ))}
                </div>

                {filtered.length > RESULTS_PAGE_SIZE ? (
                  <nav
                    className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center"
                    aria-label="Paged search results"
                  >
                    <p className="text-sm text-muted-foreground">
                      Showing{' '}
                      <span className="font-semibold tabular-nums text-foreground">
                        {(safeResultsPage - 1) * RESULTS_PAGE_SIZE + 1}
                      </span>
                      –
                      <span className="font-semibold tabular-nums text-foreground">
                        {Math.min(safeResultsPage * RESULTS_PAGE_SIZE, filtered.length)}
                      </span>{' '}
                      of <span className="font-semibold tabular-nums text-foreground">{filtered.length}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        disabled={safeResultsPage <= 1}
                        onClick={() => handlePageChange(Math.max(1, safeResultsPage - 1))}
                      >
                        Previous
                      </Button>
                      <span className="px-2 text-sm tabular-nums text-foreground">
                        Page {safeResultsPage} of {resultsTotalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        disabled={safeResultsPage >= resultsTotalPages}
                        onClick={() => handlePageChange(Math.min(resultsTotalPages, safeResultsPage + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
                <p className="text-sm font-medium text-foreground">No matches for that combination.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a broader phrase like &ldquo;spatial discovery&rdquo; or switch category to All.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-5 rounded-full"
                  onClick={() => handleCategoryChange('all')}
                >
                  Show all categories
                </Button>
              </div>
            )}

            <div className="mt-10 lg:hidden">
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground">
                  More search tools
                  <ChevronDown className="size-4 text-[#4E60EE]" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <ul className="space-y-2 rounded-2xl border border-border bg-card p-4">
                    {searchTools.map((tool) => (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#4E60EE] hover:underline"
                        >
                          {tool.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export const Default = (props: ComponentProps) => (
  <SearchResults className={typeof props.params?.styles === 'string' ? props.params.styles : undefined} />
);
