import { apiRequest } from './api';

/**
 * Resends verification OTP to the user's email.
 * @param {string} email - The user's email address.
 * @returns {Promise<null>}
 */
export const resendVerificationOTP = async (email) => {
  try {
    const data = await apiRequest('/api/auth/resend-verification-otp', {
      method: 'POST',
      body: { email: email.trim().toLowerCase() },
    });
    return data;
  } catch (error) {
    console.error('Error resending verification OTP:', error);
    throw error;
  }
};
