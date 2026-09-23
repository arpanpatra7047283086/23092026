import { apiRequest } from './api'

const cleanEmail = (email) => email.trim().toLowerCase()

export const sendForgotPasswordOTP = async (email) => {
  return await apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: { email: cleanEmail(email) },
  }, false)
}

export const verifyForgotPasswordOTP = async (email, otp) => {
  return await apiRequest('/api/auth/verify-reset-otp', {
    method: 'POST',
    body: { email: cleanEmail(email), otp: otp.trim() },
  }, false)
}

export const resetPassword = async (resetToken, newPassword) => {
  return await apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: {
      reset_token: resetToken,
      new_password: newPassword,
    },
  }, false)
}

// The backend has no separate password-reset resend route. Requesting a new
// forgot-password OTP is the supported API operation (subject to its cooldown).
export const resendForgotPasswordOTP = sendForgotPasswordOTP
