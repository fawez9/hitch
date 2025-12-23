import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIssueSearch } from '@/hooks/useIssueSearch';
import { ErrorMessages, Issue } from '@hitch/core';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('useIssueSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch issues and update state on success', async () => {
    const fakeIssues: Issue[] = [
      {
        id: '1',
        title: 'Test issue',
        url: 'https://github.com/test/repo/issues/1',
        labels: ['bug'],
        repository: {
          name: 'repo',
          language: 'ts',
          url: 'https://github.com/test/repo',
          owner: 'test',
        },
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        difficulty: 'Beginner',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        issues: fakeIssues,
        pagination: { page: 1, total: 1, per_page: 30, hasNext: false },
      }),
    } as Response);

    const { result } = renderHook(() => useIssueSearch());

    await act(async () => {
      await result.current.search({
        labels: ['bug'],
        language: 'ts',
        page: 1,
      });
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith('/api/v1/issues?labels=bug&language=ts&page=1');

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.issues).toEqual(fakeIssues);
    expect(result.current.pagination?.page).toBe(1);
  });

  it('should set error if fetch fails (non-200)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Bad request',
    } as Response);

    const { result } = renderHook(() => useIssueSearch());

    await act(async () => {
      await result.current.search({ page: 1 });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.issues).toEqual([]);
    expect(result.current.error).toContain(ErrorMessages.GitHubFetchFailed);
  });

  it('should handle fetch throwing an error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useIssueSearch());

    await act(async () => {
      await result.current.search({ page: 1 });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.issues).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('should build query params correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        issues: [],
        pagination: { page: 2, total: 0, per_page: 30, hasNext: false },
      }),
    } as Response);

    const { result } = renderHook(() => useIssueSearch());

    await act(async () => {
      await result.current.search({
        labels: ['bug', 'enhancement'],
        language: 'ts',
        page: 2,
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/issues?labels=bug%2Cenhancement&language=ts&page=2',
    );
  });
});
