'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination as PaginationType } from '@hitch/core';

interface PaginationProps {
  pagination: PaginationType;
  variant?: 'full' | 'arrows';
}

export function Pagination({ pagination, variant = 'full' }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { page: currentPage, total, per_page: perPage, hasNext } = pagination;

  // GitHub API limit: max 1000 results (33 pages with per_page=30)
  const MAX_GITHUB_RESULTS = 1000;
  const maxPages = Math.min(Math.ceil(total / perPage), Math.ceil(MAX_GITHUB_RESULTS / perPage));

  // Disable next if we're at GitHub's limit
  const isAtGitHubLimit = currentPage >= maxPages;
  const canGoNext = hasNext && !isAtGitHubLimit;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/?${params.toString()}`, { scroll: true });
  };

  const hasPrev = currentPage > 1;
  //NOTE: this is for how many button for page visible
  const VISIBLE_PAGES = 5;

  const getPageRange = () => {
    const half = Math.floor(VISIBLE_PAGES / 2);

    let start = Math.max(1, currentPage - half);
    let end = start + VISIBLE_PAGES - 1;

    if (end > maxPages) {
      end = maxPages;
      start = Math.max(1, end - VISIBLE_PAGES + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPageRange();

  // Arrows only variant
  if (variant === 'arrows') {
    return (
      <div className="flex items-center justify-between py-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrev}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
            ${hasPrev ? 'border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-cyan-500' : 'border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
          `}
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <span className="text-sm text-slate-400">
            Page {currentPage} of {maxPages}
          </span>
          {isAtGitHubLimit && total > MAX_GITHUB_RESULTS && (
            <p className="text-xs text-slate-500 mt-1">GitHub API limit reached</p>
          )}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!canGoNext}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
            ${canGoNext ? 'border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-cyan-500' : 'border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
          `}
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  // Full pagination variant
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* <div className="text-center">
        <p className="text-sm text-slate-400">
          Page {currentPage} of {maxPages} • {Math.min(total, MAX_GITHUB_RESULTS)} of {total} issues
        </p>
        {total > MAX_GITHUB_RESULTS && (
          <p className="text-xs text-slate-500 mt-1">
            Showing first 1,000 results (GitHub API limit)
          </p>
        )}
      </div> */}

      <div className="flex items-center gap-2 overflow-x-auto max-w-full scrollbar-hide">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrev}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
            ${hasPrev ? 'border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-cyan-500' : 'border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
          `}
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {pages[0] > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                1
              </button>
              <span className="text-slate-600">…</span>
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              disabled={page === currentPage}
              className={
                page === currentPage
                  ? 'px-3 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold'
                  : 'px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800'
              }
            >
              {page}
            </button>
          ))}

          {pages[pages.length - 1] < maxPages && (
            <>
              <span className="text-slate-600">…</span>
              <button
                onClick={() => goToPage(maxPages)}
                className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                {maxPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!canGoNext}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
            ${canGoNext ? 'border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-cyan-500' : 'border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
