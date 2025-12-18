import { ErrorMessages, Filters, Issue, searchIssues } from '@hitch/core';

export async function fetchIssues(filters: Filters): Promise<Issue[]> {
  try {
    const result = await searchIssues(filters);
    return result.issues;
  } catch (error: unknown) {
    //NOTE: without this below if we cant access the error message
    if (error instanceof Error) {
      console.error(ErrorMessages.GitHubFetchFailed, error.message);
    } else {
      console.error(ErrorMessages.GitHubFetchFailed, error);
    }
    return [];
  }
}
