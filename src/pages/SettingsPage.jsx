import React, { useState } from 'react'
import { SlidersHorizontal, ShieldCheck, Database, Bell, Lightbulb, Check, CheckCircle2, AlertCircle, Trash2, Mail, Lock, ArrowRight } from 'lucide-react'
import { PageIntro } from '../components/ui/PageIntro'
import { Button } from '../components/common/Button'
import { Toggle } from '../components/ui/Toggle'
import { requestDeleteAccountOTP, deleteAccount } from '../Actions/DeleteAccountAction'
import { clearAuthState } from '../Actions/api'
import { deleteAllDocuments } from '../Actions/DashboardAction'
import { updateProfile } from '../Actions/ProfileAction'

export function SettingsPage({ user, documents, setDocuments, onSignOut }) {
  const [tone, setTone] = useState('Clear & thoughtful')
  const [instructions, setInstructions] = useState('Use concise explanations, keep citations visible, and call out uncertainty.')
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Delete account flow states
  const [deleteStep, setDeleteStep] = useState(1) // 1: email input, 2: OTP input
  const [email, setEmail] = useState(user?.email || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const save = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const responseTone = {
        'Clear & thoughtful': 'clear_thoughtful',
        'Concise & direct': 'concise_direct',
        'Warm & encouraging': 'detailed_teaching',
        'Academic & precise': 'academic_precise',
      }[tone]
      const response = await updateProfile({
        preferences: {
          response_tone: responseTone,
          custom_instructions: instructions.trim() || null,
        },
      })
      const next = { ...user, ...(response?.data || response) }
      window.localStorage.setItem('upolobdhi-user', JSON.stringify(next))
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      setError(err.message || 'Could not save preferences.')
    }
  }

  const handleSendDeleteOTP = async (e) => {
    e.preventDefault()
    const accountEmail = user?.email?.trim().toLowerCase()
    if (!accountEmail) return setError('Your account email is unavailable. Please sign in again and retry.')

    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      await requestDeleteAccountOTP(accountEmail)
      setDeleteStep(2)
      setSuccessMsg('Verification code sent to your email.')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyDeleteOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('Please enter the 6-digit verification code.')
    setLoading(true)
    setError('')
    try {
      await deleteAccount(otp)
      clearAuthState()
      if (onSignOut) {
        onSignOut()
      } else {
        window.location.reload()
      }
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please check the code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-page">
      <PageIntro
        eyebrow="Make it yours"
        title="Settings."
        copy="Tune the way your workspace answers, stores, and protects."
      />

      <div className="settings-layout">
        <aside className="settings-nav panel">
          <button className="active"><SlidersHorizontal size={16} /> Response style</button>
          <button><ShieldCheck size={16} /> Privacy & security</button>
          <button><Database size={16} /> Data & storage</button>
          <button><Bell size={16} /> Notifications</button>
        </aside>

        <div className="settings-sections">
          <form className="panel settings-card" onSubmit={save}>
            <div className="panel-heading">
              <div>
                <span className="overline">Instructions & response tone</span>
                <h2>Shape your assistant.</h2>
                <p>These preferences apply to new conversations and can be adjusted anytime.</p>
              </div>
              {saved && <span className="saved-state"><CheckCircle2 size={15} /> Saved</span>}
            </div>
            <label>Response tone
              <select value={tone} onChange={(event) => setTone(event.target.value)}>
                <option>Clear & thoughtful</option>
                <option>Concise & direct</option>
                <option>Warm & encouraging</option>
                <option>Academic & precise</option>
              </select>
            </label>
            <label>Custom instructions
              <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows="4" />
            </label>
            <div className="settings-tip">
              <Lightbulb size={16} />
              <span>Try asking for your preferred level of detail, reading level, or how you want uncertainty explained.</span>
            </div>
            <Button type="submit" icon={Check}>Save preferences</Button>
          </form>

          <section className="panel settings-card">
            <div className="panel-heading">
              <div>
                <span className="overline">Privacy & security</span>
                <h2>Your knowledge stays yours.</h2>
                <p>Simple controls for the data inside this workspace.</p>
              </div>
              <ShieldCheck className="green-icon" size={22} />
            </div>
            <div className="setting-row">
              <div><strong>Private workspace</strong><span>Your documents are only visible to you.</span></div>
              <Toggle checked />
              <span className="setting-state">On</span>
            </div>
            <div className="setting-row">
              <div><strong>Conversation memory</strong><span>Let answers reference earlier turns in this chat.</span></div>
              <Toggle checked />
              <span className="setting-state">On</span>
            </div>
            <div className="setting-row">
              <div><strong>Improve retrieval with feedback</strong><span>Use your thumbs up/down to improve this workspace.</span></div>
              <Toggle checked={false} />
              <span className="setting-state">Off</span>
            </div>
          </section>

          <section className="panel settings-card danger-zone">
            <div className="panel-heading">
              <div>
                <span className="overline">Danger zone</span>
                <h2>Take your data with you.</h2>
                <p>These actions cannot be undone. Export anything you want to keep first.</p>
              </div>
              <AlertCircle className="danger-icon" size={22} />
            </div>
            <div className="danger-actions">
              <div><strong>Delete all documents</strong><span>Remove {documents.length} files and their search index.</span></div>
              <button type="button" className="danger-outline" onClick={async () => { try { await deleteAllDocuments(); setDocuments([]); setConfirmDelete(false) } catch (err) { setError(err.message || 'Could not delete documents.') } }}><Trash2 size={15} /> Delete all</button>
            </div>
            <div className="danger-actions">
              <div><strong>Delete account</strong><span>Remove your profile, documents, and chat history.</span></div>
              <button type="button" className="danger-button" onClick={() => { setConfirmDelete(true); setDeleteStep(1); setEmail(user?.email || ''); setOtp(''); setError(''); setSuccessMsg(''); }}><Trash2 size={15} /> Delete account</button>
            </div>
            {confirmDelete && (
              <div className="confirm-box delete-account-box" style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #ef4444', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#ef4444' }}>
                  <AlertCircle size={18} />
                  <strong style={{ fontSize: '1rem' }}>Account Deletion Verification Required</strong>
                </div>

                {deleteStep === 1 ? (
                  <form onSubmit={handleSendDeleteOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                      To permanently delete your account, we will send a verification code to the email address on this signed-in account.
                    </p>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="email"
                        value={email}
                        readOnly
                        placeholder="you@example.com"
                        style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: '6px', border: '1px solid var(--border-color, #ccc)', background: 'transparent', color: 'inherit' }}
                        required
                      />
                      <Mail size={16} style={{ position: 'absolute', right: '12px', opacity: 0.5 }} />
                    </div>
                    {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{error}</div>}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                      <button type="submit" className="danger-button" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {loading ? 'Sending...' : 'Send OTP'} <ArrowRight size={14} />
                      </button>
                      <button type="button" className="text-button" onClick={() => setConfirmDelete(false)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyDeleteOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981' }}>
                      {successMsg || 'Verification code sent to your email.'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                      Please enter the verification code sent to <strong>{email}</strong>:
                    </p>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: '6px', border: '1px solid var(--border-color, #ccc)', background: 'transparent', color: 'inherit', letterSpacing: '2px', fontWeight: 'bold' }}
                        inputMode="numeric"
                        required
                      />
                      <Lock size={16} style={{ position: 'absolute', right: '12px', opacity: 0.5 }} />
                    </div>
                    {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{error}</div>}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                      <button type="submit" className="danger-button" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: '#fff' }}>
                        {loading ? 'Deleting...' : 'Permanently Delete Account'}
                      </button>
                      <button type="button" className="text-button" onClick={() => setDeleteStep(1)}>Back</button>
                      <button type="button" className="text-button" onClick={() => setConfirmDelete(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
