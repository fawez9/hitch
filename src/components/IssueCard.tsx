'use client';

import { GoIssueOpened } from 'react-icons/go';
import { GitPullRequest } from 'lucide-react';
import { IssueView } from '@/ui/issueView';

interface IssueCardProps {
  issue: IssueView;
}

// Only style common labels; fallback for unknown
const labelConfig: Record<string, { bg: string; text: string; border: string }> = {
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

const DEFAULT_LABEL_STYLE = 'bg-slate-500/10 text-slate-200 border border-slate-500/20';

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-400',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-400',
  Rust: 'bg-orange-400',
  Go: 'bg-cyan-400',
  React: 'bg-sky-400',
};

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="group relative bg-[#1e293b] rounded-xl border border-slate-700/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-900/10">
      <div className="flex flex-col gap-3">
        {/* Header: Title and Repo */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <GoIssueOpened className="size-6 text-slate-100 group-hover:text-cyan-400 transition-colors" />
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors"
            >
              {issue.title}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <a
              href={issue.repository.url}
              className="font-mono text-cyan-400 hover:underline decoration-cyan-400/50 underline-offset-2"
            >
              {issue.repository.name}
            </a>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              {issue.repository.language ? (
                <>
                  <span
                    className={`w-2 h-2 rounded-full ${languageColors[issue.repository.language] || 'bg-slate-400'}`}
                  />
                  <span className="text-slate-400 font-mono text-xs">
                    {issue.repository.language}
                  </span>
                </>
              ) : null}
              <span className="text-slate-600">•</span>
            </div>
            <span className="text-slate-500 text-xs">{issue.createdAt}</span>
          </div>
          <div className="text-teal-300 font-mono">
            <span>By {issue.repository.owner}</span>
          </div>
        </div>

        {/* Footer: Labels and Metrics */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-wrap gap-2">
            {issue.labels.map((label) => {
              const objectStyle = labelConfig[label];
              const style = objectStyle
                ? `${objectStyle.bg} ${objectStyle.border} ${objectStyle.text}`
                : DEFAULT_LABEL_STYLE;
              return (
                <span
                  key={label}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border ${style}`}
                >
                  {label}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
              <GitPullRequest size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
