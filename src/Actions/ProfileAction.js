import { apiRequest } from './api'

export const getSetupQuestions = () => apiRequest('/api/profile/setup-questions')

export const submitProfileSetup = (answers) => apiRequest('/api/profile/setup', {
  method: 'POST',
  body: { answers },
})

export const getProfile = () => apiRequest('/api/profile')

export const updateProfile = (profile) => apiRequest('/api/profile', {
  method: 'PATCH',
  body: profile,
})

export const uploadAvatar = (file) => {
  const body = new FormData()
  body.append('file', file)
  return apiRequest('/api/profile/avatar', { method: 'POST', body })
}

export const deleteAvatar = () => apiRequest('/api/profile/avatar', { method: 'DELETE' })

export const getMe = () => apiRequest('/api/me')
