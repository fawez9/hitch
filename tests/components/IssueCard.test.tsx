import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IssueCard } from '@/components/IssueCard';
import type { Issue } from '@hitch/core';

describe('IssueCard', () => {
  const issue: Issue = {
    id: '1',
    title: 'Fix authentication bug',
    url: 'https://github.com/hitch/repo/issues/1',
    labels: ['bug', 'good first issue'],
    createdAt: 'opened 2 days ago',
    updatedAt: '2025-01-01T00:00:00Z',
    difficulty: 'Beginner',
    repository: {
      name: 'hitch/repo',
      url: 'https://github.com/hitch/repo',
      language: 'TypeScript',
      owner: 'hitch',
    },
  };

  it('renders issue title with link', () => {
    render(<IssueCard issue={issue} />);

    const titleLink = screen.getByRole('link', {
      name: /fix authentication bug/i,
    });

    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', issue.url);
  });

  it('renders repository link', () => {
    render(<IssueCard issue={issue} />);

    const repoLink = screen.getByRole('link', {
      name: issue.repository.name,
    });

    expect(repoLink).toBeInTheDocument();
    expect(repoLink).toHaveAttribute('href', issue.repository.url);
  });

  it('renders labels', () => {
    render(<IssueCard issue={issue} />);

    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('good first issue')).toBeInTheDocument();
  });

  it('renders language badge when language exists', () => {
    render(<IssueCard issue={issue} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders repository owner', () => {
    render(<IssueCard issue={issue} />);

    expect(screen.getByText(/by hitch/i)).toBeInTheDocument();
  });
});
