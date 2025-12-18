import { ErrorMessages, Filters, Issue, SearchIssuesResult } from '@hitch/core';
import { useState } from 'react';

export function useIssueSearch() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(filters: Filters) {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filters.language) params.set('language', filters.language);
      if (filters.page) params.set('page', String(filters.page));
      if (filters.labels) params.set('labels', filters.labels.join(','));
      if (filters.updatedAt) params.set('updatedAt', filters.updatedAt);

      const res = await fetch(`/api/v1/issues?${params.toString()}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${ErrorMessages.GitHubFetchFailed}:${text}`);
      }

      const data: SearchIssuesResult = await res.json();
      setIssues(data.issues);
    } catch (err) {
      setError(err instanceof Error ? err.message : ErrorMessages.UnknownError);
    } finally {
      setLoading(false);
    }
  }

  return {
    issues,
    loading,
    error,
    search,
  };
}
