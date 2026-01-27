'use client';
import { GoIssueOpened } from 'react-icons/go';
import { GitPullRequest } from 'lucide-react';
import { DEFAULT_LABEL_STYLE, IssueView, labelConfig, languageColors } from '@/ui/issueView';
interface IssueCardProps {
  issue: IssueView;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="group relative bg-[#1e293b] rounded-xl border border-slate-700/50 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-900/10 w-full min-w-0">
      <div className="flex flex-col gap-3 w-full min-w-0">
        {/* Header: Title and Repo */}
        <div className="space-y-1.5 w-full min-w-0">
          <div className="flex items-center gap-2 w-full min-w-0">
            <GoIssueOpened className="size-6 text-slate-100 group-hover:text-green-500 transition-colors shrink-0" />
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors wrap-break-words min-w-0"
            >
              {issue.title}
            </a>
          </div>
          <div className="flex items-center flex-wrap gap-2 text-sm w-full min-w-0">
            <a
              href={issue.repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-cyan-400 hover:underline decoration-cyan-400/50 underline-offset-2 break-all"
            >
              {issue.repository.name}
            </a>
            <span className="text-slate-600 shrink-0">•</span>
            <div className="flex items-center gap-1.5 shrink-0">
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
            <span className="text-slate-500 text-xs shrink-0">{issue.createdAt}</span>
          </div>
          <div className="text-teal-300 font-mono wrap-break-words">
            <span>By {issue.repository.owner}</span>
          </div>
        </div>
        {/* Footer: Labels and Metrics */}
        <div className="flex items-center justify-between mt-2 w-full min-w-0">
          <div className="flex flex-wrap gap-2 min-w-0 flex-1">
            {issue.labels.map((label) => {
              const objectStyle = labelConfig[label];
              const style = objectStyle
                ? `${objectStyle.bg} ${objectStyle.border} ${objectStyle.text}`
                : DEFAULT_LABEL_STYLE;
              return (
                <span
                  key={label}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border ${style} wrap-break-word`}
                >
                  {label}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm shrink-0">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500">
              <GitPullRequest size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
