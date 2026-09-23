import { apiRequest } from './api';

export const requestDeleteAccountOTP = async (email) => {
  return await apiRequest('/api/auth/request-delete-account-otp', {
    method: 'POST',
    body: {
        email: email.trim().toLowerCase(),
      },
  });
};

export const deleteAccount = async (otp) => {
  return await apiRequest('/api/auth/delete-account', {
    method: 'DELETE',
    body: { otp }
  });
};
