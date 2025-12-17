export interface Repository {
  name: string;
  owner: string;
  url: string;
  language?: string;
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

export interface Filters {
  language?: string;
  labels?: string[];
  updatedAt?: string;
  page?: number;
}

export interface GitHubIssueItem {
  id: number;
  title: string;
  body?: string;
  labels: { name: string }[];
  html_url: string;
  repository: {
    name: string;
    owner: { login: string };
    html_url: string;
    language?: string;
  };
  created_at: string;
  updated_at: string;
}
