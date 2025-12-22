import { Issue } from '@hitch/core';

export interface IssueView {
  id: string;
  title: string;
  body?: string;
  url: string;

  repository: {
    name: string;
    owner: string;
    url: string;
    language?: string | null;
  };

  labels: string[];
  comments?: number;
  createdAt: string;
}

export function toIssueView(issue: Issue): IssueView {
  return {
    id: issue.id,
    title: issue.title,
    body: issue.body,
    url: issue.url,
    repository: {
      name: issue.repository.name,
      owner: issue.repository.owner,
      url: issue.repository.url,
      language: issue.repository.language,
    },
    labels: issue.labels,
    comments: issue.comments,
    createdAt: issue.createdAt,
  };
}
