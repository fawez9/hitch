import { searchIssues } from '@hitch/core';
import { describe, it, expect } from 'vitest';

const hasToken = !!process.env.GITHUB_TOKEN;

describe('searchIssues (integration)', () => {
  it.skipIf(!hasToken)('fetches issues from GitHub', async () => {
    const result = await searchIssues({
      language: 'typescript',
      page: 1,
    });

    expect(result.issues).toBeDefined();
    expect(result.pagination).toBeDefined();
    expect(result.pagination.page).toBe(1);
  });

  it.skipIf(!hasToken)('respects pagination hasNext logic', async () => {
    const result = await searchIssues({
      language: 'javascript',
      page: 1,
    });

    if (result.pagination.total > 30) {
      expect(result.pagination.hasNext).toBe(true);
    } else {
      expect(result.pagination.hasNext).toBe(false);
    }
  });

  it.skipIf(!hasToken)('returns empty results for impossible filters', async () => {
    const result = await searchIssues({
      language: 'nonexistent_language_123',
      labels: ['definitely-not-a-real-label'],
      page: 1,
    });

    expect(result.issues.length).toBe(0);
    expect(result.pagination.hasNext).toBe(false);
  });
});
