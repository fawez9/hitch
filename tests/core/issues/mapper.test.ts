import { describe, expect, it } from 'vitest';
import { issuesMapper } from '../../../packages/core/src/issues/mapper';
import { GitHubIssueItem } from '../../../packages/core/src/issues/types';

describe('issuesMapper', () => {
  it('maps GitHubIssueItem[] to Issues[] correctly', () => {
    const input: GitHubIssueItem[] = [
      {
        id: 123,
        title: 'Test issue',
        html_url: 'https://github.com/test/repo/issues/1',
        labels: [{ name: 'good first issue' }],
        body: 'this is the description of the issue',
        repository_url: 'https://api.github.com/repos/test/repo',
        comments: 0,
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
        owner: 'test',
        url: 'https://github.com/test/repo',
        language: null,
      },
      labels: ['good first issue'],
      body: 'this is the description of the issue',
      createdAt: 'opened 2y ago',
      comments: 0,
      updatedAt: '2024-01-02T00:00:00Z',
      difficulty: 'Beginner',
    });
  });

  it('filters out items without repository_url', () => {
    const input: GitHubIssueItem[] = [
      {
        id: 1,
        title: 'No repo',
        html_url: 'https://github.com/issues/1',
        labels: [],
        repository_url: '',
        comments: 0,
        created_at: 'opened 2y ago',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    const result = issuesMapper(input);

    expect(result).toHaveLength(0);
  });

  it('handles language as null', () => {
    const input: GitHubIssueItem[] = [
      {
        id: 2,
        title: 'No language',
        html_url: 'https://github.com/test/repo/issues/2',
        labels: [],
        repository_url: 'https://api.github.com/repos/test/repo',
        comments: 0,
        created_at: 'opened 2y ago',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    const result = issuesMapper(input);

    expect(result[0].repository.language).toBe(null);
  });
});
