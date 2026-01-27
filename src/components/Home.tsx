'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Search } from 'lucide-react';
import { IssueCard } from '@/components/IssueCard';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { useIssueSearch } from '@/hooks/useIssueSearch';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filters } from '@hitch/core';
import { Pagination } from '@/components/Pagination';
import { IssueLabel } from '@/ui/filterView';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { issues, pagination, loading, error, search } = useIssueSearch();

  // Read state from URL (single source of truth)
  const keyword = searchParams.get('q') ?? '';
  const language = searchParams.get('language') || undefined;
  const labelsParam = searchParams.get('labels');
  const updatedAt = searchParams.get('updatedAt') || undefined;
  const pageParam = searchParams.get('page');

  // Initialize search query from URL
  const [searchQuery, setSearchQuery] = useState(keyword);

  // Sync searchQuery with URL when URL changes
  useEffect(() => {
    setSearchQuery(keyword);
  }, [keyword]);

  // Derive selected labels and language from URL
  const selectedLabels: IssueLabel[] = labelsParam ? (labelsParam.split(',') as IssueLabel[]) : [];
  const selectedLanguage = language
    ? language.charAt(0).toUpperCase() + language.slice(1)
    : 'All Languages';

  // Trigger search when URL params change (not local searchQuery state)
  useEffect(() => {
    search({
      keyword: keyword || undefined,
      language,
      labels: labelsParam ? labelsParam.split(',') : undefined,
      updatedAt,
      page: pageParam ? Number(pageParam) : 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, language, labelsParam, updatedAt, pageParam]);

  // Client-side search filtering only
  const filteredIssues = issues.filter((issue) => {
    if (!keyword.trim()) return true;

    const query = keyword.toLowerCase();
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.repository.name.toLowerCase().includes(query)
    );
  });
  // Handle search keyword
  const handleSearchSubmit = () => {
    const params = new URLSearchParams(window.location.search);

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }

    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  // Handle label toggle - updates URL
  const handleToggleLabel = (label: IssueLabel) => {
    const params = new URLSearchParams(window.location.search);
    const currentLabels = params.get('labels')?.split(',').filter(Boolean) || [];

    let newLabels;
    if (currentLabels.includes(label)) {
      newLabels = currentLabels.filter((l) => l !== label);
    } else {
      newLabels = [...currentLabels, label];
    }

    if (newLabels.length > 0) {
      params.set('labels', newLabels.join(','));
    } else {
      params.delete('labels');
    }

    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  // Handle language change - updates URL
  const handleSelectLanguage = (lang: string) => {
    const params = new URLSearchParams(window.location.search);

    if (lang && lang !== 'All Languages') {
      params.set('language', lang.toLowerCase());
    } else {
      params.delete('language');
    }

    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  // Handle clear all filters
  const handleClear = () => {
    setSearchQuery('');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] w-full">
      <Header />
      <div className="max-w-5xl mx-auto px-3 sm:px-4 space-y-8 pt-10">
        <main className="space-y-8 w-full min-w-0">
          <FilterPanel
            selectedLabels={selectedLabels}
            onToggleLabel={handleToggleLabel}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onClear={handleClear}
          />
          {!loading && !error && pagination && (
            <Pagination pagination={pagination} variant="arrows" />
          )}

          <div className="space-y-4 w-full min-w-0">
            <div className="flex items-center justify-between text-sm text-slate-400 px-1">
              <span>
                Showing {filteredIssues.length} of {issues.length} issues
              </span>
              {loading && <span className="text-cyan-400 animate-pulse">Syncing...</span>}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                <Loader2 size={40} className="animate-spin text-cyan-400 mb-4" />
                <p className="font-mono text-sm">Fetching repositories...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-red-500/5 rounded-2xl border border-red-500/10">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredIssues.length > 0 ? (
              <div className="grid gap-4 w-full min-w-0">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-[#1e293b]/50 rounded-2xl border border-dashed border-slate-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                  <Search className="text-slate-500" size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-200 mb-1">No issues found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query</p>
                <button
                  onClick={handleClear}
                  className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-medium hover:underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          {!loading && !error && pagination && (
            <Pagination pagination={pagination} variant="full" />
          )}
        </main>
      </div>
      <footer className="border-t border-border border-slate-500 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          <p>Built for open source contributors • Powered by GitHub API</p>
        </div>
      </footer>
    </div>
  );
}
