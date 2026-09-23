import React, { useState } from 'react'
import { X, ShieldCheck, Check, AlertCircle, Eye, ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'
import { login } from '../../Actions/LoginAction'
import { register, verifyEmail } from '../../Actions/SignUpAction'
import { resendVerificationOTP } from '../../Actions/ResendVerificationOTP'

export function AuthPage({ initialMode, onClose, onSuccess, onForgotPassword }) {
  const [mode, setMode] = useState(initialMode)
  const [step, setStep] = useState(initialMode === 'signup' ? 1 : 0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setStep(nextMode === 'signup' ? 1 : 0)
    setError('')
    setSuccessMsg('')
  }

  const extractUser = (response) => {
    const payload = response?.data || response?.result || response || {};
    return payload.user || payload.profile || (payload.email ? payload : {});
  }

  const submitSignIn = async (event) => {
    event.preventDefault()
    if (!email || !password) return setError('Add your email and password to continue.')

    setLoading(true)
    setError('')
    try {
      const response = await login(email, password)
      const user = extractUser(response)

      const profile = {
        name: user.name || user.username || email.split('@')[0],
        email: user.email || email,
        ...user
      };

      onSuccess(profile, false)
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const submitSignUp = async (event) => {
    event.preventDefault()
    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    if (!name || !email) return setError('Use your name and a valid email to continue.')
    if (!strongPassword.test(password) || /\s/.test(password)) return setError('Use a Strong Password')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    setError('')
    try {
      await register(name, email, password)
      setStep(2)
      setSuccessMsg('Verification code sent to your email.')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const verify = async (event) => {
    event.preventDefault()
    if (otp.length !== 6) return setError('Enter the 6-digit verification code sent to your email.')

    setLoading(true)
    setError('')
    try {
      const response = await verifyEmail(email, otp)
      const user = extractUser(response)
      // Email verification is public; authenticate immediately so protected onboarding APIs can run.
      const loginResponse = await login(email, password)
      const loginUser = extractUser(loginResponse)

      const profile = {
        name: loginUser.name || user.name || name,
        email: loginUser.email || user.email || email,
        ...user,
        ...loginUser,
      }

      onSuccess(profile, true)
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.message || 'Verification failed.')
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
      await resendVerificationOTP(email)
      setSuccessMsg('A new code has been sent to your email.')
    } catch (err) {
      setError(err.message || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop auth-backdrop">
      <div className="auth-shell">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="auth-aside">
          <Logo />
          <div className="auth-aside-copy">
            <span className="overline">A quieter kind of intelligence</span>
            <h2>Make space for the<br /><em>good questions.</em></h2>
            <p>Bring your reading, research, and rough ideas into one grounded space.</p>
          </div>
          <div className="auth-aside-footer"><span className="mini-check"><Check size={12} /></span>Private by default</div>
        </div>
        <div className="auth-form-panel">
          {step === 2 ? (
            <form className="auth-form" onSubmit={verify}>
              <button type="button" className="back-link" onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</button>
              <div className="auth-heading">
                <div className="form-icon"><ShieldCheck size={20} /></div>
                <span className="overline">One small step</span>
                <h1>Check your inbox.</h1>
                <p>We sent a verification code to <strong>{email || 'your email'}</strong>.</p>
              </div>
              <label>Verification code
                <div className="otp-input-wrap">
                  <input
                    autoFocus
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    placeholder="000000"
                  />
                </div>
              </label>
              {error && <div className="form-error"><AlertCircle size={15} />{error}</div>}
              {successMsg && <div className="form-success" style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1rem' }}>{successMsg}</div>}
              <Button type="submit" className="full-button" icon={ArrowRight} iconRight disabled={loading}>
                {loading ? 'Processing...' : 'Verify & enter'}
              </Button>
              <p className="form-footnote">Didn’t get it? <button type="button" className="inline-button" onClick={handleResendOtp} disabled={loading}>Resend code</button></p>
            </form>
          ) : (
            <>
              <div className="auth-tabs">
                <button className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>Sign in</button>
                <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Create account</button>
              </div>
              {mode === 'signin' ? (
                <form className="auth-form" onSubmit={submitSignIn}>
                  <div className="auth-heading"><span className="overline">Welcome back</span><h1>Good to have you here.</h1><p>Pick up your thinking right where you left it.</p></div>
                  <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                  <label>Password
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Your password"
                      />
                      <button type="button" onClick={() => setShowPassword((value) => !value)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </label>
                  <div className="form-row-between">
                    <label className="check-label"><input type="checkbox" /> <span>Remember me</span></label>
                    <button type="button" className="inline-button" onClick={onForgotPassword}>Forgot password?</button>
                  </div>
                  {error && <div className="form-error"><AlertCircle size={15} />{error}</div>}
                  <Button type="submit" className="full-button" icon={ArrowRight} iconRight disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                  <p className="form-footnote">New to উপলব্ধি? <button type="button" className="inline-button" onClick={() => switchMode('signup')}>Create an account</button></p>
                </form>
              ) : (
                <form className="auth-form" onSubmit={submitSignUp}>
                  <div className="auth-heading"><span className="overline">Start with a clean slate</span><h1>Make your space.</h1><p>A private home for everything you want to understand better.</p></div>
                  <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Aarav Sen" /></label>
                  <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                  <label>Password
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a strong password"
                      />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </label>
                  <ul className="password-rules" aria-label="Password rules">
                    <li className={password.length >= 8 ? 'valid' : ''}>Minimum 8 characters</li>
                    <li className={/[A-Z]/.test(password) ? 'valid' : ''}>At least 1 uppercase letter (A-Z)</li>
                    <li className={/[a-z]/.test(password) ? 'valid' : ''}>At least 1 lowercase letter (a-z)</li>
                    <li className={/\d/.test(password) ? 'valid' : ''}>At least 1 number (0-9)</li>
                    <li className={/[!@#$%^&*]/.test(password) ? 'valid' : ''}>At least 1 special character (!@#$%^&*)</li>
                    <li className={!/\s/.test(password) ? 'valid' : ''}>No spaces</li>
                  </ul>
                  <label>Confirm password
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Re-enter your password"
                    />
                  </label>
                  {password && confirmPassword && password !== confirmPassword && <div className="password-match-error">Passwords do not match.</div>}
                  {error && <div className="form-error"><AlertCircle size={15} />{error}</div>}
                  <Button type="submit" className="full-button" icon={ArrowRight} iconRight disabled={loading}>
                    {loading ? 'Continuing...' : 'Continue to verification'}
                  </Button>
                  <p className="form-footnote">Already have an account? <button type="button" className="inline-button" onClick={() => switchMode('signin')}>Sign in</button></p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
