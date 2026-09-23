import React, { useState } from 'react'
import { Pencil, Check, CheckCircle2 } from 'lucide-react'
import { PageIntro } from '../components/ui/PageIntro'
import { Avatar } from '../components/common/Avatar'
import { Tag } from '../components/ui/Tag'
import { Button } from '../components/common/Button'
import { updateProfile, uploadAvatar } from '../Actions/ProfileAction'

const roleOptions = [
  ['student', 'Student'], ['engineer', 'Engineer'], ['researcher', 'Researcher'],
  ['founder', 'Founder'], ['writer_creator', 'Writer / creator'], ['other', 'Something else'],
]

const displayValue = (value, fallback) => value ? value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : fallback

export function ProfilePage({ user, setUser }) {
  const [role, setRole] = useState(user?.role || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const persistUser = (profile) => {
    const next = { ...user, ...profile }
    setUser(next)
    window.localStorage.setItem('upolobdhi-user', JSON.stringify(next))
  }

  const save = async (event) => {
    event.preventDefault()
    if (!role) return setError('Select a role before saving.')

    setSaving(true)
    setError('')
    try {
      const response = await updateProfile({ role })
      persistUser(response?.data || response)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      setError(err.message || 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  const editPhoto = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Use a PNG or JPG image up to 5 MB.')
      return
    }

    setError('')
    try {
      const response = await uploadAvatar(file)
      persistUser(response?.data || response)
    } catch (err) {
      setError(err.message || 'Could not upload avatar.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="profile-page">
      <PageIntro eyebrow="Your profile" title="A workspace that feels like you." copy="Keep your preferences close to the way you think." />

      <div className="profile-layout">
        <section className="panel profile-card">
          <div className="profile-cover"><div className="profile-cover-glow"></div></div>
          <div className="profile-card-body">
            <div className="profile-avatar-large"><Avatar user={user} /></div>
            <div className="profile-card-title"><h2>{user?.name || 'Your name'}</h2><p>{user?.email || 'you@example.com'}</p><Tag tone="aqua">{displayValue(user?.role, 'Curious learner')}</Tag></div>
            <label className="secondary-icon-button"><Pencil size={15} /> Edit photo<input type="file" accept=".png,.jpg,.jpeg" onChange={editPhoto} hidden /></label>
          </div>
          <div className="profile-meta-grid">
            <div><span className="overline">Focus style</span><strong>{displayValue(user?.work_style, 'Deep focus')}</strong></div>
            <div><span className="overline">First goal</span><strong>{displayValue(user?.primary_goal, 'Understand research')}</strong></div>
            <div><span className="overline">Member since</span><strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</strong></div>
          </div>
        </section>

        <form className="panel profile-form" onSubmit={save}>
          <div className="panel-heading"><div><span className="overline">Personal details</span><h2>Your backend profile.</h2></div>{saved && <span className="saved-state"><CheckCircle2 size={15} /> Saved</span>}</div>
          <label>Full name<input value={user?.name || ''} disabled /><small>The current backend does not provide a profile-name update API.</small></label>
          <label>Email address<input value={user?.email || ''} disabled /></label>
          <label>What describes you best
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="" disabled>Select a role</option>
              {roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          {error && <div className="form-error">{error}</div>}
          <Button type="submit" icon={Check} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
        </form>
      </div>
    </div>
  )
}
