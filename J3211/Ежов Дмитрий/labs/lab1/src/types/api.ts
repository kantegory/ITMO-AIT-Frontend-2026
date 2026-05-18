import type { Priority, TaskStatus, User, UserRole } from './domain';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  projectId?: number;
  assigneeId?: number;
  q?: string;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
}
