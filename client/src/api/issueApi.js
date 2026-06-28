import api from './http';

export const getIssueStats = async () => {
  const response = await api.get('/issues/stats');
  return response.data;
};

export const getIssues = async (params) => {
  const response = await api.get('/issues', { params });
  return response.data;
};

export const getIssueById = async (id) => {
  const response = await api.get(`/issues/${id}`);
  return response.data;
};

export const createIssue = async (payload) => {
  const response = await api.post('/issues', payload);
  return response.data;
};

export const updateIssue = async (id, payload) => {
  const response = await api.put(`/issues/${id}`, payload);
  return response.data;
};

export const updateIssueStatus = async (id, status) => {
  const response = await api.patch(`/issues/${id}/status`, { status });
  return response.data;
};

export const deleteIssue = async (id) => {
  const response = await api.delete(`/issues/${id}`);
  return response.data;
};
