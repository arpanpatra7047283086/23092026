import { apiRequest } from './api';



export const uploadDocument = async (title, file) => {
  const formData = new FormData();
  formData.append('title', title.trim());
  formData.append('file', file);

  try {
    return await apiRequest('/api/documents', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
};

export const listDocuments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/documents${query ? `?${query}` : ''}`;
  try {
    return await apiRequest(endpoint);
  } catch (error) {
    console.error('List documents error:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  try {
    return await apiRequest(`/api/documents/${documentId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};

export const getDocumentDetails = async (documentId) => {
  try {
    return await apiRequest(`/api/documents/${documentId}`);
  } catch (error) {
    console.error('Get document details error:', error);
    throw error;
  }
};

export const deleteAllDocuments = async () => apiRequest('/api/documents', { method: 'DELETE' });

export const getRawDocument = async (documentId) => {
  return apiRequest(`/api/documents/${documentId}/raw`, { responseType: 'blob' })
};

export const updateDocument = async (documentId, updateData) => {
  try {
    return await apiRequest(`/api/documents/${documentId}`, {
      method: 'PATCH',
      body: updateData,
    });
  } catch (error) {
    console.error('Update document error:', error);
    throw error;
  }
};
