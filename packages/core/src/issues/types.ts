export interface Filters {
  language?: string;
  labels?: string[];
  updatedAt?: string;
  page?: number;
}
export interface Repository {
  name: string;
  owner: string;
  url: string;
  language?: string | null;
}
export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  hasNext: boolean;
}

export interface Issue {
  id: string;
  title: string;
  body?: string;
  url: string;
  repository: Repository;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GitHubIssueItem {
  id: number;
  title: string;
  body?: string;
  labels: Array<{ name: string }>;
  html_url: string;
  repository_url: string;
  created_at: string;
  updated_at: string;
}

export interface SearchIssuesResult {
  issues: Issue[];
  pagination: Pagination;
}
