import React, { useState } from 'react'
import { X, ShieldCheck, Check, AlertCircle, Eye, ArrowLeft, ArrowRight, Mail, Lock } from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { sendForgotPasswordOTP, verifyForgotPasswordOTP, resetPassword, resendForgotPasswordOTP } from '../Actions/ForgotPasswordAction'

export default function ForgotPasswordPage({ onClose }) {
  const [step, setStep] = useState(1) 
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email) return setError('Please enter your email address.')

    setLoading(true)
    setError('')
    try {
      await sendForgotPasswordOTP(email)
      setStep(2)
      setSuccessMsg('Verification code sent to your email.')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('Please enter the 6-digit verification code.')

    setLoading(true)
    setError('')
    try {
      const response = await verifyForgotPasswordOTP(email, otp)
      const payload = response?.data || response?.result || response || {}
      const token = payload.reset_token || payload.token

      if (token) {
        setResetToken(token)
        setStep(3)
        setSuccessMsg('')
      } else {
        throw new Error('Verification successful, but no reset token was received.')
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) return setError('Email is missing.')
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      await resendForgotPasswordOTP(email)
      setSuccessMsg('A new code has been sent to your email.')
    } catch (err) {
      setError(err.message || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    setError('')
    try {
      await resetPassword(resetToken, password)
      setStep(4)
      setSuccessMsg('Password changed successfully. You can now sign in.')
    } catch (err) {
      setError(err.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop auth-backdrop">
      <div className="auth-shell">
        {onClose && <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>}

        <div className="auth-aside">
          <Logo />
          <div className="auth-aside-copy">
            <span className="overline">Secure Access</span>
            <h2>Recover your<br /><em>account space.</em></h2>
            <p>Bring your reading, research, and rough ideas into one grounded space.</p>
          </div>
          <div className="auth-aside-footer">
            <span className="mini-check"><Check size={12} /></span>
            Private by default
          </div>
        </div>

        <div className="auth-form-panel">
          {step === 4 ? (
            <div className="auth-form">
              <div className="auth-heading">
                <div className="form-icon" style={{ color: '#10b981' }}>
                  <Check size={24} />
                </div>
                <span className="overline">Success</span>
                <h1>All set!</h1>
                <p>{successMsg}</p>
              </div>
              <Button onClick={onClose} className="full-button" icon={ArrowRight} iconRight>
                Back to sign in
              </Button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={step === 1 ? handleSendOTP : step === 2 ? handleVerifyOTP : handleResetPassword}>
              {step > 1 && step < 4 && (
                <button type="button" className="back-link" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={15} /> Back
                </button>
              )}

              <div className="auth-heading">
                <div className="form-icon">
                  {step === 3 ? <Lock size={20} /> : <ShieldCheck size={20} />}
                </div>
                <span className="overline">Account Recovery</span>
                <h1>
                  {step === 1 && "Forgot password?"}
                  {step === 2 && "Check your inbox."}
                  {step === 3 && "Set new password."}
                </h1>
                <p>
                  {step === 1 && "Enter your email to receive a verification code."}
                  {step === 2 && <>We sent a code to <strong>{email}</strong></>}
                  {step === 3 && "Create a secure password for your workspace."}
                </p>
              </div>

              {/* Step 1 & 2: Email box always visible during verification flow */}
              {(step === 1 || step === 2) && (
                <label>
                  Email address
                  <div className="password-input">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={step === 2}
                      autoFocus={step === 1}
                    />
                    <Mail size={16} style={{ position: 'absolute', right: '12px', opacity: 0.4 }} />
                  </div>
                </label>
              )}

              {/* Step 2: OTP Box appears below email box */}
              {step === 2 && (
                <label>
                  Verification code
                  <div className="otp-input-wrap">
                    <input
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      inputMode="numeric"
                      placeholder="000000"
                    />
                  </div>
                </label>
              )}

              {/* Step 3: New Password boxes appear after OTP verification */}
              {step === 3 && (
                <>
                  <label>
                    New password
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        autoFocus
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </label>
                  <label>
                    Retype password
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </label>
                </>
              )}

              {error && <div className="form-error"><AlertCircle size={15} />{error}</div>}
              {successMsg && step === 2 && <div className="form-success" style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1rem' }}>{successMsg}</div>}

              <Button type="submit" className="full-button" icon={ArrowRight} iconRight disabled={loading}>
                {loading ? "Processing..." : (
                  step === 1 ? "verifyMailForForgotPassword" :
                  step === 2 ? "verifyOTP" :
                  "Reset Password"
                )}
              </Button>

              {step === 2 && (
                <p className="form-footnote">
                  Didn't get it? <button type="button" className="inline-button" onClick={handleResendOtp} disabled={loading}>Resend code</button>
                </p>
              )}

              <p className="form-footnote">
                Suddenly remembered? <button type="button" className="inline-button" onClick={onClose}>Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
