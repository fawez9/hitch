import { ErrorMessages, Filters, Issue, Pagination, SearchIssuesResult } from '@hitch/core';
import { useState } from 'react';

export function useIssueSearch() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(filters: Filters) {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filters.labels) params.set('labels', filters.labels.join(','));
      if (filters.language) params.set('language', filters.language);
      if (filters.updatedAt) params.set('updatedAt', filters.updatedAt);
      if (filters.page) params.set('page', String(filters.page));

      const res = await fetch(`/api/v1/issues?${params.toString()}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${ErrorMessages.GitHubFetchFailed}:${text}`);
      }

      const data: SearchIssuesResult = await res.json();
      setIssues(data.issues);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : ErrorMessages.UnknownError);
    } finally {
      setLoading(false);
    }
  }

  return {
    issues,
    pagination,
    loading,
    error,
    search,
  };
}
