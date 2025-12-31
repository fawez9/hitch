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

// Only style common labels; fallback for unknown
export const labelConfig: Record<string, { bg: string; text: string; border: string }> = {
  bug: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  'good first issue': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  'help wanted': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  documentation: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  enhancement: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

export const DEFAULT_LABEL_STYLE = 'bg-slate-500/10 text-slate-200 border border-slate-500/20';

export const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-400',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-400',
  Rust: 'bg-orange-400',
  Go: 'bg-cyan-400',
  Java: 'bg-red-400',
  Dart: 'bg-sky-400',
  Shell: 'bg-slate-400',
  'C++': 'bg-indigo-400',
  C: 'bg-blue-600',
  'C#': 'bg-violet-400',
  PHP: 'bg-purple-400',
};
