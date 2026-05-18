import { api } from './client';
import type { Project } from '../types/domain';

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects');
  return data;
}
