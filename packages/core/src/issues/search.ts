import { buildQuery } from './queryBuilder';
import { Filters, GitHubIssueItem, Issue } from './types';

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

  const issues: Issue[] = data.items
    // NOTE: Some search results may not include repository data (edge cases / API inconsistencies),so we defensively filter them out.
    .filter((item) => item.repository)
    .map((item) => ({
      id: item.id.toString(),
      title: item.title,
      url: item.html_url,
      repository: {
        name: item.repository.name,
        owner: item.repository.owner.login,
        url: item.repository.html_url,
      },
      labels: item.labels.map((label) => label.name),
      language: item.repository.language,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      difficulty: 'Beginner',
    }));

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
