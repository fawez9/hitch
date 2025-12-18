import { ErrorMessages, Filters, searchIssues } from '@hitch/core';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: Filters = {
    language: searchParams.get('language') ?? undefined,
    labels: searchParams.getAll('labels'),
    page: Number(searchParams.get('page') ?? 1),
  };

  try {
    const result = await searchIssues(filters);
    return NextResponse.json(
      {
        issues: result.issues,
        pagination: result.pagination,
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(ErrorMessages.GitHubFetchFailed, error.message);
    } else {
      console.error(ErrorMessages.GitHubFetchFailed, error);
    }

    return NextResponse.json({ message: ErrorMessages.GitHubFetchFailed }, { status: 500 });
  }
}
