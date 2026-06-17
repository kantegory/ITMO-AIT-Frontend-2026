export type TaskStatus = 'todo' | 'progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type UserRole = 'manager' | 'developer' | 'analyst' | 'observer';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface Subtask {
  id: number;
  text: string;
  assigneeId: number;
  done: boolean;
}

export interface Attachment {
  name: string;
  size: number;
  icon: string;
}

export interface Project {
  id: number;
  name: string;
  progress: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  assigneeId: number;
  status: TaskStatus;
  priority: Priority;
  deadline: string;
  tags: string[];
  subtasks: Subtask[];
  attachments: Attachment[];
  createdAt: string;
}

export interface Activity {
  id: number;
  userId: number;
  action: 'created' | 'updated' | 'completed' | 'commented' | 'deleted';
  targetType: 'task' | 'project';
  targetId: number;
  createdAt: string;
}
