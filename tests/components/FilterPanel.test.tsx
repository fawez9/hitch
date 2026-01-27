import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterPanel } from '@/components/FilterPanel';

// ---- mock next/navigation ----
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => new URLSearchParams(''),
}));

// ---- mock ui config ----
vi.mock('@/ui/filterView', () => ({
  labels: ['bug', 'enhancement'],
  languages: ['All Languages', 'TypeScript'],
  labelStyles: {
    bug: 'bg-red-500',
    enhancement: 'bg-blue-500',
  },
}));

describe('FilterPanel', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  function renderPanel(overrides = {}) {
    return render(
      <FilterPanel
        selectedLabels={[]}
        onToggleLabel={vi.fn()}
        selectedLanguage="All Languages"
        onSelectLanguage={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        onSearchSubmit={vi.fn()}
        onClear={vi.fn()}
        {...overrides}
      />,
    );
  }

  it('calls onToggleLabel when clicking a label', async () => {
    const onToggleLabel = vi.fn();
    renderPanel({ onToggleLabel });

    await userEvent.click(screen.getByText('bug'));
    expect(onToggleLabel).toHaveBeenCalledWith('bug');
  });

  it('calls onSearchSubmit when clicking Search button', async () => {
    const onSearchSubmit = vi.fn();
    renderPanel({ onSearchSubmit });

    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearchSubmit).toHaveBeenCalledOnce();
  });

  it('allows typing in search input without triggering search', async () => {
    const onSearchChange = vi.fn();
    const onSearchSubmit = vi.fn();
    renderPanel({ onSearchChange, onSearchSubmit, searchQuery: '' });

    const searchInput = screen.getByPlaceholderText(/search issues/i);
    await userEvent.type(searchInput, 'test');

    // onSearchChange should be called (to update state)
    expect(onSearchChange).toHaveBeenCalled();
    // But onSearchSubmit should NOT be called until Search button is clicked
    expect(onSearchSubmit).not.toHaveBeenCalled();
  });

  it('triggers search only when Search button is clicked', async () => {
    const onSearchChange = vi.fn();
    const onSearchSubmit = vi.fn();
    renderPanel({ onSearchChange, onSearchSubmit, searchQuery: 'test query' });

    // Type in the input
    const searchInput = screen.getByPlaceholderText(/search issues/i);
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'new search');

    // Search should not be triggered yet
    expect(onSearchSubmit).not.toHaveBeenCalled();

    // Click Search button
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    // Now search should be triggered
    expect(onSearchSubmit).toHaveBeenCalledOnce();
  });

  it('calls onSelectLanguage when changing language', async () => {
    const onSelectLanguage = vi.fn();
    renderPanel({ onSelectLanguage });

    const languageSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(languageSelect, 'TypeScript');

    expect(onSelectLanguage).toHaveBeenCalledWith('TypeScript');
  });

  it('shows Clear button only when filters are active and calls onClear', async () => {
    const onClear = vi.fn();
    renderPanel({
      selectedLabels: ['bug'],
      onClear,
    });

    const clearBtn = screen.getByRole('button', { name: /clear/i });
    expect(clearBtn).toBeInTheDocument();

    await userEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('shows Clear button when searchQuery has value', () => {
    renderPanel({ searchQuery: 'test' });
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('shows Clear button when language is selected', () => {
    renderPanel({ selectedLanguage: 'TypeScript' });
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('does not show Clear button when no filters are active', () => {
    renderPanel();
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });

  it('displays search query in input field', () => {
    renderPanel({ searchQuery: 'my search term' });
    const searchInput = screen.getByPlaceholderText(/search issues/i);
    expect(searchInput).toHaveValue('my search term');
  });

  it('displays selected labels as active', () => {
    renderPanel({ selectedLabels: ['bug'] });
    const bugButton = screen.getByText('bug');
    expect(bugButton).toHaveAttribute('data-active', 'true');
  });

  it('displays unselected labels as inactive', () => {
    renderPanel({ selectedLabels: [] });
    const bugButton = screen.getByText('bug');
    expect(bugButton).toHaveAttribute('data-active', 'false');
  });

  it('displays selected language in dropdown', () => {
    renderPanel({ selectedLanguage: 'TypeScript' });
    const languageSelect = screen.getByRole('combobox');
    expect(languageSelect).toHaveValue('TypeScript');
  });
});
