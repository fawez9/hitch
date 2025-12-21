'use client';
import React, { useEffect, useState } from 'react';
import { GitMerge, Terminal, AlertCircle, Loader2, Search } from 'lucide-react';
import { IssueCard, Issue, IssueLabel } from '@/components/IssueCard';
import { FilterPanel } from '@/components/FilterPanel';
import { Header } from '@/components/Header';
// Mock Data
const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Fix authentication flow for OAuth providers',
    repo: 'example/project',
    language: 'TypeScript',
    labels: ['bug', 'good first issue'],
    comments: 5,
    createdAt: 'almost 2 years ago',
    url: '#',
  },
  {
    id: '2',
    title: 'Add dark mode support to dashboard',
    repo: 'awesome/app',
    language: 'JavaScript',
    labels: ['enhancement', 'help wanted'],
    comments: 12,
    createdAt: 'almost 2 years ago',
    url: '#',
  },
  {
    id: '3',
    title: 'Improve documentation for API endpoints',
    repo: 'open/source',
    language: 'Python',
    labels: ['documentation'],
    comments: 3,
    createdAt: 'almost 2 years ago',
    url: '#',
  },
  {
    id: '4',
    title: 'Memory leak in event listener cleanup',
    repo: 'react/library',
    language: 'TypeScript',
    labels: ['bug'],
    comments: 8,
    createdAt: 'almost 2 years ago',
    url: '#',
  },
  {
    id: '5',
    title: 'Implement Rust bindings for core logic',
    repo: 'system/core',
    language: 'Rust',
    labels: ['enhancement', 'help wanted'],
    comments: 15,
    createdAt: '3 days ago',
    url: '#',
  },
  {
    id: '6',
    title: 'Update dependencies to latest versions',
    repo: 'web/frontend',
    language: 'JavaScript',
    labels: ['good first issue'],
    comments: 1,
    createdAt: '1 week ago',
    url: '#',
  },
];
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<IssueLabel | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIssues(MOCK_ISSUES);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  // Filter logic
  const filteredIssues = issues.filter((issue) => {
    const matchesLabel = selectedLabel ? issue.labels.includes(selectedLabel) : true;
    const matchesLanguage =
      selectedLanguage !== 'All Languages' ? issue.language === selectedLanguage : true;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.repo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLabel && matchesLanguage && matchesSearch;
  });
  const handleClear = () => {
    setSelectedLabel(null);
    setSelectedLanguage('All Languages');
    setSearchQuery('');
  };
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <div className="max-w-5xl mx-auto space-y-8 pt-10">
        {/* Main Content */}
        <main className="space-y-8">
          <FilterPanel
            selectedLabel={selectedLabel}
            onSelectLabel={setSelectedLabel}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={handleClear}
          />

          {/* Results Section */}
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
