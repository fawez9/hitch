import React from 'react';
import { Search, X } from 'lucide-react';
import { IssueLabel } from './IssueCard';
interface FilterPanelProps {
  selectedLabel: IssueLabel | null;
  onSelectLabel: (label: IssueLabel | null) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}
const labels: IssueLabel[] = [
  'bug',
  'good first issue',
  'help wanted',
  'documentation',
  'enhancement',
  'docs',
];
const labelStyles: Record<IssueLabel, string> = {
  bug: 'hover:bg-red-500 hover:border-red-500 hover:text-white data-[active=true]:bg-red-500 data-[active=true]:border-red-500 data-[active=true]:text-white border-red-500/30 text-red-400',
  'good first issue':
    'hover:bg-emerald-500 hover:border-emerald-500 hover:text-white data-[active=true]:bg-emerald-500 data-[active=true]:border-emerald-500 data-[active=true]:text-white border-emerald-500/30 text-emerald-400',
  'help wanted':
    'hover:bg-amber-500 hover:border-amber-500 hover:text-white data-[active=true]:bg-amber-500 data-[active=true]:border-amber-500 data-[active=true]:text-white border-amber-500/30 text-amber-400',
  documentation:
    'hover:bg-blue-500 hover:border-blue-500 hover:text-white data-[active=true]:bg-blue-500 data-[active=true]:border-blue-500 data-[active=true]:text-white border-blue-500/30 text-blue-400',
  enhancement:
    'hover:bg-purple-500 hover:border-purple-500 hover:text-white data-[active=true]:bg-purple-500 data-[active=true]:border-purple-500 data-[active=true]:text-white border-purple-500/30 text-purple-400',
  docs: '',
};
const languages = ['All Languages', 'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'React'];
export function FilterPanel({
  selectedLabel,
  onSelectLabel,
  selectedLanguage,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
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
          {labels.map((label) => (
            <button
              key={label}
              onClick={() => onSelectLabel(selectedLabel === label ? null : label)}
              data-active={selectedLabel === label}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                bg-slate-800/50 ${labelStyles[label]}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Language & Search */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Filter by language & search
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
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

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search issues..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          </div>

          <div className="flex gap-2">
            {(selectedLabel || selectedLanguage !== 'All Languages' || searchQuery) && (
              <button
                onClick={onClear}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
