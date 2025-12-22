/**
 * Maps GitHub API issue items into internal Issue type.
 * Filters out items without repository info.
 * @param items Array of GitHubIssueItem from GitHub API
 * @returns Array of Issue
 */
import { ErrorMessages, GitHubIssueItem, Issue } from '.';

export function formatOpenedAt(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `opened ${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `opened ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `opened ${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `opened ${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `opened ${months}mo ago`;

  const years = Math.floor(months / 12);
  return `opened ${years}y ago`;
}

function extractRepoFromUrl(url: string): { owner: string; name: string } | null {
  // NOTE: Parse repository_url like: https://api.github.com/repos/microsoft/TypeScript
  const match = url.match(/repos\/([^\/]+)\/([^\/]+)/);
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
        language: null, // Language is on the item, not nested
      },
      labels: item.labels.map((label) => label.name),
      createdAt: formatOpenedAt(item.created_at),
      updatedAt: formatOpenedAt(item.updated_at),
      difficulty: 'Beginner',
    };
  });
}
