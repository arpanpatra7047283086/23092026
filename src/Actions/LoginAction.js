import { apiRequest, clearAuthState, saveTokens } from './api';

export const login = async (email, password) => {
  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.trim().toLowerCase(),
        password
      },
    }, false);

    if (!saveTokens(response)) {
      console.warn('Login successful but no tokens were returned.');
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  return await apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: { email: email.trim().toLowerCase() }
  });
};

export const verifyResetOtp = async (email, otp) => {
  return await apiRequest('/api/auth/verify-reset-otp', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      otp: otp.trim()
    }
  });
};

export const resetPassword = async (reset_token, new_password) => {
  return await apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: { reset_token, new_password }
  });
};

export const getCurrentUser = async () => {
  return await apiRequest('/api/me');
};

export const isAuthenticated = () => Boolean(localStorage.getItem('access_token'));

export const logout = () => {
  clearAuthState();
};
