import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http } from '@/lib/http';
import { ErrorMessages } from '@hitch/core';

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('http()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns parsed JSON on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    const result = await http<{ ok: boolean }>('/test');

    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('throws HttpError on non-OK response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(http('/test')).rejects.toThrow(`${ErrorMessages.HttpError} (500)`);
  });

  it('throws NetworkError when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network down'));

    await expect(http('/test')).rejects.toThrow(ErrorMessages.NetworkError);
  });
});
