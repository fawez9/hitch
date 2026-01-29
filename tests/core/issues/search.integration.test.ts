import { searchIssues } from '@hitch/core';
import { describe, it, expect, beforeEach } from 'vitest';

const hasToken = !!process.env.SECRET_TOKEN;

// Helper to add delay between tests - CRITICAL for secondary rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('searchIssues (integration)', () => {
  // Add 5 second delay before EACH test to respect GitHub secondary rate limits
  // GitHub docs recommend serial requests with delays for search API
  beforeEach(async () => {
    if (hasToken) {
      console.log('⏳ Waiting 5 seconds to respect GitHub secondary rate limits...');
      await delay(5000); // 5 seconds between each test
    }
  });

  it.skipIf(!hasToken)(
    'fetches issues from GitHub',
    async () => {
      const result = await searchIssues({
        language: 'typescript',
        page: 1,
      });

      expect(result.issues).toBeDefined();
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
    },
    15000, // timeout in milliseconds as third parameter
  );

  it.skipIf(!hasToken)(
    'respects pagination hasNext logic',
    async () => {
      const result = await searchIssues({
        language: 'javascript',
        page: 1,
      });

      if (result.pagination.total > 30) {
        expect(result.pagination.hasNext).toBe(true);
      } else {
        expect(result.pagination.hasNext).toBe(false);
      }
    },
    15000, // timeout in milliseconds
  );

  it.skipIf(!hasToken)(
    'returns empty results for impossible filters',
    async () => {
      const result = await searchIssues({
        language: 'nonexistent_language_123',
        labels: ['definitely-not-a-real-label'],
        page: 1,
      });

      expect(result.issues.length).toBe(0);
      expect(result.pagination.hasNext).toBe(false);
    },
    15000, // timeout in milliseconds
  );
});
