export type IssueLabel = string; // flexible

export interface FilterPanelProps {
  selectedLabel: IssueLabel | null;
  onSelectLabel: (label: IssueLabel | null) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

// Default UI labels (users can still add custom labels)
export const labels: string[] = [
  'bug',
  'good first issue',
  'help wanted',
  'documentation',
  'enhancement',
];

export const labelStyles: Record<IssueLabel, string> = {
  bug: 'hover:bg-red-500 hover:border-red-500 hover:text-white data-[active=true]:bg-red-500 data-[active=true]:border-red-500 data-[active=true]:text-white border-red-500/30 text-red-400',
  'good first issue':
    'hover:bg-emerald-500 hover:border-emerald-500 hover:text-white data-[active=true]:bg-emerald-500 data-[active=true]:border-emerald-500 data-[active=true]:text-white border-emerald-500/30 text-emerald-400',
  'help wanted':
    'hover:bg-amber-500 hover:border-amber-500 hover:text-white data-[active=true]:bg-amber-500 data-[active=true]:border-amber-500 data-[active=true]:text-white border-amber-500/30 text-amber-400',
  documentation:
    'hover:bg-blue-500 hover:border-blue-500 hover:text-white data-[active=true]:bg-blue-500 data-[active=true]:border-blue-500 data-[active=true]:text-white border-blue-500/30 text-blue-400',
  enhancement:
    'hover:bg-purple-500 hover:border-purple-500 hover:text-white data-[active=true]:bg-purple-500 data-[active=true]:border-purple-500 data-[active=true]:text-white border-purple-500/30 text-purple-400',
};

export const languages = [
  'All Languages',
  'JavaScript',
  'TypeScript',
  'Python',
  'Rust',
  'Go',
  'React',
];
