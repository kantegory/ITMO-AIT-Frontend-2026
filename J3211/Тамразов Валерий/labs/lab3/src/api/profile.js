import http from './http';

export const fetchUserPipelines = (userId) => http.get('/pipelines', { params: { userId } });
export const fetchUserArtifacts = (userId) => http.get('/artifacts', { params: { userId } });
export const fetchUserPolicies = (userId) => http.get('/policies', { params: { userId } });
export const fetchPipelineArtifacts = (pipelineId) => http.get('/artifacts', { params: { pipelineId } });
