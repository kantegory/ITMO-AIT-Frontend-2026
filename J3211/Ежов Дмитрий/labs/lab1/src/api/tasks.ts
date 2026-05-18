import { api } from './client';
import type { Task } from '../types/domain';
import type { TaskFilters } from '../types/api';

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks', { params: filters });
  return data;
}

export async function getTask(id: number): Promise<Task> {
  const { data } = await api.get<Task>(`/tasks/${id}`);
  return data;
}

export async function updateTask(id: number, patch: Partial<Task>): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}`, patch);
  return data;
}
