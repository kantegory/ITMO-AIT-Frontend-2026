import { api } from './client';
import type { Activity } from '../types/domain';

export interface ActivityQuery {
  _sort?: string;
  _order?: 'asc' | 'desc';
  _limit?: number;
}

export async function getActivity(query: ActivityQuery = {}): Promise<Activity[]> {
  const { data } = await api.get<Activity[]>('/activity', { params: query });
  return data;
}
