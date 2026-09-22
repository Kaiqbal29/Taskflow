const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

async function request(path, options = {}, token = null) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || Object.values(payload.errors ?? {}).flat()[0] || 'Terjadi kesalahan pada server.')
  return payload
}

export const api = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: (token) => request('/auth/me', {}, token),
  logout: (token) => request('/auth/logout', { method: 'POST' }, token),
  workspaces: (token) => request('/workspaces', {}, token),
  workspace: (token, workspaceId) => request(`/workspaces/${workspaceId}`, {}, token),
  activity: (token, workspaceId) => request(`/workspaces/${workspaceId}/activity`, {}, token),
  addMember: (token, workspaceId, data) => request(`/workspaces/${workspaceId}/members`, { method: 'POST', body: JSON.stringify(data) }, token),
  removeMember: (token, workspaceId, memberId) => request(`/workspaces/${workspaceId}/members/${memberId}`, { method: 'DELETE' }, token),
  projects: (token, workspaceId) => request(`/workspaces/${workspaceId}/projects`, {}, token),
  createProject: (token, workspaceId, data) => request(`/workspaces/${workspaceId}/projects`, { method: 'POST', body: JSON.stringify(data) }, token),
  updateProject: (token, workspaceId, projectId, data) => request(`/workspaces/${workspaceId}/projects/${projectId}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
  deleteProject: (token, workspaceId, projectId) => request(`/workspaces/${workspaceId}/projects/${projectId}`, { method: 'DELETE' }, token),
  tasks: (token, workspaceId, projectId) => request(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, {}, token),
  comments: (token, workspaceId, projectId, taskId) => request(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`, {}, token),
  addComment: (token, workspaceId, projectId, taskId, data) => request(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify(data) }, token),
  createTask: (token, workspaceId, projectId, data) => request(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }, token),
  updateTask: (token, workspaceId, projectId, taskId, data) => request(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
}
