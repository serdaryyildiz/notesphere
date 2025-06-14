export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  owner: User;
  collaborators: User[];
  tags: string[];
  likes: number;
  comments: number;
}

export type Repository = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  owner: User;
  collaborators: User[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  repositories: Repository[];
  collaborators: User[];
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  type: 'collaboration_invite' | 'note_shared' | 'repository_shared' | 'project_shared' | 'mention';
  message: string;
  from: User;
  createdAt: string;
  read: boolean;
  data: {
    noteId?: string;
    repositoryId?: string;
    projectId?: string;
  };
}; 