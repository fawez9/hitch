import { describe, it, expect } from 'vitest';
import { buildQuery } from '../../../packages/core/src/issues/queryBuilder';
import { Filters } from '../../../packages/core/src/issues/types';

describe('buildQuery', () => {
  it('should build basic query with only required filters', () => {
    const filters: Filters = { language: undefined, labels: [], updatedAt: undefined, page: 1 };
    expect(buildQuery(filters)).toBe('is:issue is:open');
  });

  it('should include language filter when provided', () => {
    const filters: Filters = { language: 'typescript', labels: [], updatedAt: undefined, page: 1 };
    expect(buildQuery(filters)).toBe('is:issue is:open language:typescript');
  });

  it('should include updatedAt filter when provided', () => {
    const filters: Filters = {
      language: undefined,
      labels: [],
      updatedAt: '2024-01-01',
      page: 1,
    };
    expect(buildQuery(filters)).toBe('is:issue is:open updated:>2024-01-01');
  });

  it('should include labels filter when provided', () => {
    const filters: Filters = {
      language: undefined,
      labels: ['bug', 'enhancement'],
      updatedAt: undefined,
      page: 1,
    };
    expect(buildQuery(filters)).toBe('is:issue is:open label:bug label:enhancement');
  });

  it('should combine all filters when provided', () => {
    const filters: Filters = {
      language: 'javascript',
      labels: ['bug'],
      updatedAt: '2024-01-01',
      page: 2,
    };
    expect(buildQuery(filters)).toBe(
      'is:issue is:open language:javascript updated:>2024-01-01 label:bug',
    );
  });
});
