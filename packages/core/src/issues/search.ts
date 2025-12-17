/**
 * Fetches GitHub issues based on provided filters.
 * Uses the GitHub Search API and maps results to the internal Issue type.
 *
 * @param filters Filters object containing optional language, labels, updatedAt, and page number
 * @returns An object containing:
 *   - issues: Array of Issue objects (id, title, repository, labels, etc.)
 *   - pagination: Object with page, per_page, total, and hasNext boolean
 *
 * @throws Throws an error if GitHub API responds with a non-OK status
 */
import { buildQuery, Filters, GitHubIssueItem, Issue, issueMapper } from '.';

export async function searchIssues(filters: Filters) {
  const query = buildQuery(filters);
  const url = new URL('https://api.github.com/search/issues');
  url.searchParams.append('q', query);
  url.searchParams.append('page', (filters.page || 1).toString());
  url.searchParams.append('per_page', '30');

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
  };

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('GitHub API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
      url: url.toString(),
      query: query,
    });
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data: { items: GitHubIssueItem[]; total_count: number } = await response.json();

  const issues: Issue[] = issueMapper(data.items);
  return {
    issues,
    pagination: {
      page: filters.page || 1,
      per_page: 30,
      total: data.total_count,
      //NOTE: this is for dividing result through pages
      hasNext: (filters.page || 1) * 30 < data.total_count,
    },
  };
}
