/**
 * Fetches GitHub issues based on provided filters.
 * Uses the GitHub Search API and maps results to the internal Issue type.
 * Fetches repository languages in parallel for all issues.
 *
 * @param filters Filters object containing optional language, labels, updatedAt, and page number
 * @returns An object containing:
 *   - issues: Array of Issue objects with language populated
 *   - pagination: Object with page, per_page, total, and hasNext boolean
 *
 * @throws Throws an error if GitHub API responds with a non-OK status
 */
import {
  buildQuery,
  ErrorMessages,
  Filters,
  GitHubIssueItem,
  Issue,
  issuesMapper,
  SearchIssuesResult,
} from '.';

/**
 * Fetches the primary language for a repository
 * @param owner Repository owner
 * @param name Repository name
 * @returns Primary language name or null
 */
async function fetchRepoLanguage(owner: string, name: string): Promise<string | null> {
  try {
    const url = new URL(`https://api.github.com/repos/${owner}/${name}/languages`);
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };

    if (process.env.SECRET_TOKEN) {
      headers.Authorization = `Bearer ${process.env.SECRET_TOKEN}`;
    }

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) return null;

    const languages = await response.json();
    const entries = Object.entries(languages) as [string, number][];

    if (entries.length === 0) return null;

    // Get primary language (most bytes)
    const [primaryLanguage] = entries.sort((a, b) => b[1] - a[1])[0];
    return primaryLanguage;
  } catch (error) {
    console.error(`Failed to fetch language for ${owner}/${name}:`, error);
    return null;
  }
}

export async function searchIssues(filters: Filters): Promise<SearchIssuesResult> {
  const query = buildQuery(filters);
  // console.log('FINAL QUERY:', query);
  const url = new URL('https://api.github.com/search/issues');
  url.searchParams.append('q', query);
  url.searchParams.append('page', (filters.page || 1).toString());
  url.searchParams.append('per_page', '10');

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };

  if (process.env.SECRET_TOKEN) {
    headers.Authorization = `Bearer ${process.env.SECRET_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(ErrorMessages.GitHubFetchFailed, {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
      url: url.toString(),
      query: query,
    });
    throw new Error(
      `${ErrorMessages.GitHubAPIError} ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const data: { items: GitHubIssueItem[]; total_count: number } = await response.json();
  const issues: Issue[] = issuesMapper(data.items);

  // Fetch languages for all issues in parallel
  const issuesWithLanguage = await Promise.all(
    issues.map(async (issue) => {
      const language = await fetchRepoLanguage(issue.repository.owner, issue.repository.name);
      return {
        ...issue,
        repository: {
          ...issue.repository,
          language,
        },
      };
    }),
  );

  return {
    issues: issuesWithLanguage,
    pagination: {
      page: filters.page || 1,
      per_page: 10,
      total: data.total_count,
      hasNext: (filters.page || 1) * 10 < data.total_count,
    },
  };
}
