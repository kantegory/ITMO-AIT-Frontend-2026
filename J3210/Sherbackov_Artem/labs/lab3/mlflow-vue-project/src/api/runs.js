import { api } from './instance';

export const runsApi = {
  getByExperimentId(experimentId) {
    return api.get(`/runs?experimentId=${experimentId}`);
  },
  getById(id) {
    return api.get(`/runs/${id}`);
  }
};