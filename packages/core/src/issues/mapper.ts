/**
 * Maps GitHub API issue items into internal Issue type.
 * Filters out items without repository info.
 * @param items Array of GitHubIssueItem from GitHub API
 * @returns Array of Issue
 */

import { GitHubIssueItem, Issue } from './types';

export function issueMapper(items: GitHubIssueItem[]): Issue[] {
  return (
    // NOTE: GitHub API sometimes returns null for repository, filter those out
    items
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
      }))
  );
}
