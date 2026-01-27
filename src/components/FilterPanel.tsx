'use client';

import { IssueLabel, labels, labelStyles, languages } from '@/ui/filterView';
import { Search, X } from 'lucide-react';

interface FilterPanelProps {
  selectedLabels: IssueLabel[];
  onToggleLabel: (label: IssueLabel) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onClear: () => void;
}

export function FilterPanel({
  selectedLabels,
  onToggleLabel,
  selectedLanguage,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-6 shadow-xl shadow-black/20">
      {/* Label Filters */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
          Filter by label
        </h3>
        <div className="flex flex-wrap gap-3">
          {labels.map((label) => {
            const active = selectedLabels.includes(label);

            return (
              <button
                key={label}
                onClick={() => onToggleLabel(label)}
                data-active={active}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                  ${active ? 'ring-2 ring-cyan-500 scale-105' : 'hover:scale-105'}
                  bg-slate-800/50 ${labelStyles[label]}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language & Search */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Filter by language & search
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Language selector */}
          <div className="relative min-w-50">
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="w-full appearance-none bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search issues by title or repository ..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          </div>

          {/* Clear button */}
          {(selectedLabels.length > 0 || selectedLanguage !== 'All Languages' || searchQuery) && (
            <button
              onClick={onClear}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button
            onClick={onSearchSubmit}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
