import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from '@/components/Pagination';
import type { Pagination as PaginationType } from '@hitch/core';

// ---- Next.js navigation mocks ----
const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => new URLSearchParams('page=2'),
}));

describe('Pagination', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  const basePagination: PaginationType = {
    page: 2,
    total: 150,
    per_page: 10,
    hasNext: true,
  };

  it('renders current page', () => {
    render(<Pagination pagination={basePagination} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders visible page buttons', () => {
    render(<Pagination pagination={basePagination} />);

    // Visible pages around page 2
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('navigates to next page when Next is clicked', () => {
    render(<Pagination pagination={basePagination} />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(pushMock).toHaveBeenCalledWith('/?page=3', { scroll: true });
  });

  it('navigates to previous page when Previous is clicked', () => {
    render(<Pagination pagination={basePagination} />);

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));

    expect(pushMock).toHaveBeenCalledWith('/?page=1', { scroll: true });
  });

  it('disables Previous button on first page', () => {
    render(<Pagination pagination={{ ...basePagination, page: 1 }} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button when hasNext is false', () => {
    render(<Pagination pagination={{ ...basePagination, hasNext: false }} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('renders arrows-only variant', () => {
    render(<Pagination pagination={basePagination} variant="arrows" />);

    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    // Page numbers should NOT exist
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('clicking a page number navigates correctly', () => {
    render(<Pagination pagination={basePagination} />);

    fireEvent.click(screen.getByText('3'));

    expect(pushMock).toHaveBeenCalledWith('/?page=3', { scroll: true });
  });
});
