import { ErrorMessages } from '@hitch/core';

export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
}

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
  const { method = 'GET', headers, body } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`${ErrorMessages.HttpError} (${response.status})`);
    }

    return response.json();
  } catch (error: unknown) {
    // NOTE: Preserve HttpError
    if (error instanceof Error) {
      if (error.message.startsWith(ErrorMessages.HttpError)) {
        throw error;
      }

      console.error(ErrorMessages.NetworkError, error.message);
    }

    throw new Error(ErrorMessages.NetworkError);
  }
}
