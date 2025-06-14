export interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  user: {
    id: number;
    username: string;
  };
} 