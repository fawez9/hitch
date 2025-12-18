'use client';
import { useIssueSearch } from '@/hooks/useIssueSearch';
import { Filters } from '@hitch/core';
import { useEffect } from 'react';

export default function Home() {
  const { issues, loading, error, search } = useIssueSearch();
  useEffect(() => {
    const filters: Filters = { language: 'typescript' };
    search(filters);
  }, []);
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <a href={issue.url} target="_blank" rel="noopener noreferrer">
              {issue.title}
            </a>
            {' - '}
            <a href={issue.repository.url}>{issue.repository.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
