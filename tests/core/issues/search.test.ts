import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorMessages, GitHubIssueItem, searchIssues } from '@hitch/core';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

const mockGitHubItems: GitHubIssueItem[] = [
  {
    id: 1,
    title: 'Test issue',
    html_url: 'https://github.com/test/repo/issues/1',
    labels: [{ name: 'bug' }],
    repository_url: 'https://api.github.com/repos/test/repo',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];
describe('searchIssues (unit)', () => {
  it('returns mapped issues when API succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: mockGitHubItems,
        total_count: 1,
      }),
    });

    const result = await searchIssues({ language: 'typescript', page: 1 });

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].title).toBe('Test issue');
    expect(result.issues[0].repository.owner).toBe('test');
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.hasNext).toBe(false);
  });

  it('returns empty issues when API returns none', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [],
        total_count: 0,
      }),
    });

    const result = await searchIssues({ page: 1 });

    expect(result.issues).toEqual([]);
    expect(result.pagination.hasNext).toBe(false);
  });

  it('throws error when GitHub API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Bad credentials',
    });

    await expect(searchIssues({ page: 1 })).rejects.toThrow(ErrorMessages.GitHubAPIError);
  });
});
