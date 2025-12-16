interface Repository {
  name: string;
  owner: string;
  url: string;
}

interface Issue {
  id: string;
  title: string;
  body?: string;
  url: string;
  repository: Repository;
  language: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface Filters {
  language?: string;
  labels?: string[];
  updatedAt?: string;
  page?: number;
}
