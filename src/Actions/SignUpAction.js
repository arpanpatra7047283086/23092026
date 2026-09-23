import { apiRequest } from './api'

// .............................. Register ....................
export const register = async (name, email, password) => {
  try {
    return await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      },
    }, false)
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

// .............................. MailVerify ....................
export const verifyEmail = async (email, otp) => {
  try {
    const data = await apiRequest('/api/auth/verify-email', {
      method: 'POST',
      body: {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      },
    }, false)

    return data;
  } catch (error) {
    console.error('Verification error:', error)
    throw error
  }
}

// .............................. OTP request for resend ....................
export const resendVerificationOtp = async (email) => {
  return await apiRequest('/api/auth/resend-verification-otp', {
    method: 'POST',
    body: { email: email.trim().toLowerCase() },
  }, false)
}
