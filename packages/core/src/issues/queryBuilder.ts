/**
 * Builds a GitHub search query string from provided filters.
 * Ensures "is:issue is:open" is always included.
 *
 * @param filters Filters object containing optional language, labels, updatedAt, and page number
 * @returns A string ready to be used as GitHub search query
 */
import { Filters } from '.';

export function buildQuery(filters: Filters): string {
  const { language, labels, updatedAt } = filters;
  let query = 'is:issue is:open';
  if (language) {
    query += ` language:${language}`;
  }
  if (updatedAt) {
    query += ` updated:>${updatedAt}`;
  }
  if (labels?.length) {
    query += labels.map((label) => ` label:${label}`).join('');
  }
  return query;
}
