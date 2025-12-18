export const ErrorMessages = {
  // GitHub API errors
  GitHubTokenMissing: 'GitHub token is missing. Please set GITHUB_TOKEN in your environment.',
  GitHubAPIError: 'GitHub API returned an error. Check token and rate limits.',
  GitHubFetchFailed: 'Failed to fetch data from GitHub.',

  // Filters and query errors
  InvalidFilters: 'Filters provided are invalid.',
  InvalidPageNumber: 'Page number must be greater than 0.',

  // Mapping and data issues
  RepositoryMissing: 'Repository information is missing from the GitHub issue.',
  IssueMappingFailed: 'Failed to map GitHub issue to internal Issue type.',
  RepoInfoExtractFailed: 'Failed to extract repository info from URL',

  // Pagination errors
  PageOutOfRange: 'Requested page exceeds available results.',

  // Generic errors
  UnknownError: 'An unknown error occurred.',

  // 🌐 Network / transport layer
  NetworkError: 'Network error: Unable to reach the server. Please check your internet connection.',

  // 📡 HTTP-level errors (non-2xx responses)
  HttpError: 'Request failed: Server returned an error response.',

  // 🧾 JSON / parsing
  InvalidJSONResponse: 'Invalid server response: Failed to parse JSON.',
};
