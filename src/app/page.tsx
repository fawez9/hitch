'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Search } from 'lucide-react';
import { IssueCard } from '@/components/IssueCard';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { useIssueSearch } from '@/hooks/useIssueSearch';
import { useSearchParams } from 'next/navigation';
import { Filters } from '@hitch/core';
import { Pagination } from '@/components/Pagination';

type IssueLabel = string;

export default function Home() {
  const [selectedLabels, setSelectedLabels] = useState<IssueLabel[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [searchQuery, setSearchQuery] = useState('');
  const { issues, pagination, loading, error, search } = useIssueSearch();
  const searchParams = useSearchParams();

  const language = searchParams.get('language') || undefined;
  const labelsParam = searchParams.get('labels');
  const updatedAt = searchParams.get('updatedAt') || undefined;
  const pageParam = searchParams.get('page');

  const filters: Filters = {
    language,
    labels: labelsParam ? labelsParam.split(',') : undefined,
    updatedAt,
    page: pageParam ? Number(pageParam) : 1,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      search(filters);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Client-side filtering (only label and search, not language)
  const filteredIssues = issues.filter((issue) => {
    const matchesLabel =
      selectedLabels.length === 0
        ? true
        : selectedLabels.every((label) => issue.labels.includes(label));

    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.repository.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguage === 'All Languages'
        ? true
        : issue.repository.language?.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesLabel && matchesSearch && matchesLanguage;
  });

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleClear = () => {
    setSelectedLabels([]);
    setSelectedLanguage('All Languages');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <div className="max-w-5xl mx-auto space-y-8 pt-10">
        <main className="space-y-8">
          <FilterPanel
            selectedLabels={selectedLabels}
            onToggleLabel={toggleLabel}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={handleClear}
          />
          {!loading && !error && pagination && (
            <Pagination pagination={pagination} variant="arrows" />
          )}

          <div className="space-y-4">
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
              <div className="grid gap-4">
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
