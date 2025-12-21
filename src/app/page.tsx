'use client';
import { useIssueSearch } from '@/hooks/useIssueSearch';
import { Filters } from '@hitch/core';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { issues, loading, error, search } = useIssueSearch();
  const searchParams = useSearchParams();

  const language = searchParams.get('language') || undefined;
  const labelsParam = searchParams.get('labels');
  const pageParam = searchParams.get('page');

  const filters: Filters = {
    language,
    labels: labelsParam ? labelsParam.split(',') : undefined,
    page: pageParam ? Number(pageParam) : 1,
  };
  console.log(filters);

  useEffect(() => {
    search(filters);
  }, [searchParams]);
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
            <a href={issue.repository.url} target="_blank">
              {issue.repository.name}
            </a>
            <p>{issue.repository.language}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
