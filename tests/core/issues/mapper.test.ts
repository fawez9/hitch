import { describe, expect, it } from 'vitest';
import { GitHubIssueItem, issuesMapper } from '@hitch/core';

describe('issuesMapper', () => {
  it('maps GitHubIssueItem[] to Issues[] correctly', () => {
    const input: GitHubIssueItem[] = [
      {
        id: 123,
        title: 'Test issue',
        body: 'Some body',
        html_url: 'https://github.com/test/repo/issues/1',
        labels: [{ name: 'good first issue' }],
        repository: {
          name: 'repo',
          owner: { login: 'octocat' },
          html_url: 'https://github.com/test/repo',
          language: 'TypeScript',
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
    ];
    const result = issuesMapper(input);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: '123',
      title: 'Test issue',
      url: 'https://github.com/test/repo/issues/1',
      repository: {
        name: 'repo',
        owner: 'octocat',
        url: 'https://github.com/test/repo',
        language: 'TypeScript',
      },
      labels: ['good first issue'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      difficulty: 'Beginner',
    });
  });
  it('filters out items without repository', () => {
    const input: GitHubIssueItem[] = [
      {
        id: 1,
        title: 'No repo',
        html_url: 'https://github.com/issues/1',
        labels: [],
        repository: null, // simulate API edge case
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    const result = issuesMapper(input);

    expect(result).toHaveLength(0);
  });
  it('handles missing language safely', () => {
    const input: GitHubIssueItem[] = [
      {
        id: 2,
        title: 'No language',
        html_url: 'https://github.com/test/repo/issues/2',
        labels: [],
        repository: {
          name: 'repo',
          owner: { login: 'octocat' },
          html_url: 'https://github.com/test/repo',
          language: undefined,
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    const result = issuesMapper(input);

    expect(result[0].repository.language).toBe('unknown');
  });
});
