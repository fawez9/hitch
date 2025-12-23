import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/v1/issues/route';
import * as core from '@hitch/core';

vi.mock('@hitch/core');

describe('GET /api/v1/issues', () => {
  const mockedSearchIssues = vi.mocked(core.searchIssues);

  beforeEach(() => {
    mockedSearchIssues.mockReset();
  });

  it('should return issues with 200 status', async () => {
    const fakeIssues: core.Issue[] = [
      {
        id: '1',
        title: 'Test issue',
        url: 'https://github.com/hitch/test/issues/1', // required
        labels: ['bug'],
        repository: {
          name: 'repo',
          language: 'ts',
          url: 'https://github.com/hitch/test/',
          owner: 'hitch',
        },
        createdAt: '2025-12-23T12:00:00Z', // required
        updatedAt: '2025-12-23T12:00:00Z', // required
        difficulty: 'Beginner', // optional if your type has it optional
      },
    ];

    const fakePagination = { page: 1, total: 1, per_page: 30, hasNext: false };

    mockedSearchIssues.mockResolvedValue({
      issues: fakeIssues,
      pagination: fakePagination,
    });

    const url = 'http://localhost/api/v1/issues?labels=bug&language=ts&page=1';
    const req = new Request(url);

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.issues).toEqual(fakeIssues);
    expect(json.pagination).toEqual(fakePagination);

    expect(mockedSearchIssues).toHaveBeenCalledOnce();
    expect(mockedSearchIssues).toHaveBeenCalledWith({
      labels: ['bug'],
      language: 'ts',
      page: 1,
    });
  });

  it('should return 500 if searchIssues throws', async () => {
    mockedSearchIssues.mockRejectedValue(new Error('API failure'));

    const url = 'http://localhost/api/v1/issues';
    const req = new Request(url);

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ message: core.ErrorMessages.GitHubFetchFailed });
    expect(mockedSearchIssues).toHaveBeenCalledOnce();
  });

  it('should parse multiple labels correctly', async () => {
    mockedSearchIssues.mockResolvedValue({
      issues: [],
      pagination: { page: 1, total: 0, per_page: 30, hasNext: false },
    });

    const url = 'http://localhost/api/v1/issues?labels=bug,enhancement&page=2';
    const req = new Request(url);

    await GET(req);

    expect(mockedSearchIssues).toHaveBeenCalledWith({
      labels: ['bug', 'enhancement'],
      language: undefined,
      page: 2,
    });
  });
});
