import http from './http';

export const fetchPipelines = (params) => http.get('/pipelines', { params });
export const fetchPipelineById = (id) => http.get(`/pipelines/${id}`);
