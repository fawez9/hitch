/**
 * Maps GitHub API issue items into internal Issue type.
 * Filters out items without repository info.
 * @param items Array of GitHubIssueItem from GitHub API
 * @returns Array of Issue
 * @function hasRepository This tells TypeScript:“After this check, repository is guaranteed to exist.”
 */

import { ErrorMessages, GitHubIssueItem, Issue } from '.';

function extractRepoFromUrl(url: string): { owner: string; name: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}

function hasRepository(item: GitHubIssueItem): boolean {
  return !!item.repository_url && extractRepoFromUrl(item.repository_url) !== null;
}

export function issuesMapper(items: GitHubIssueItem[]): Issue[] {
  return items.filter(hasRepository).map((item) => {
    const repoInfo = extractRepoFromUrl(item.repository_url);

    if (!repoInfo) {
      throw new Error(`${ErrorMessages.RepoInfoExtractFailed}: ${item.repository_url}`);
    }

    return {
      id: item.id.toString(),
      title: item.title,
      url: item.html_url,
      repository: {
        name: repoInfo.name,
        owner: repoInfo.owner,
        url: `https://github.com/${repoInfo.owner}/${repoInfo.name}`,
        language: 'unknown', //NOTE: Search API doesn't provide language info
      },
      labels: item.labels.map((label) => label.name),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      difficulty: 'Beginner',
    };
  });
}
