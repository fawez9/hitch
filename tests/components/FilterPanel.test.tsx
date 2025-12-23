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

  it('pushes correct URL on Search click', async () => {
    renderPanel({
      selectedLabels: ['bug', 'enhancement'],
      selectedLanguage: 'TypeScript',
    });

    await userEvent.click(screen.getByText('Search'));

    expect(pushMock).toHaveBeenCalledWith('/?language=typescript&labels=bug%2Cenhancement&page=1');
  });

  it('shows Clear button only when filters are active and calls onClear', async () => {
    const onClear = vi.fn();

    renderPanel({
      selectedLabels: ['bug'],
      onClear,
    });

    const clearBtn = screen.getByText('Clear');
    expect(clearBtn).toBeInTheDocument();

    await userEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('does not show Clear button when no filters are active', () => {
    renderPanel();

    expect(screen.queryByText('Clear')).toBeNull();
  });
});
