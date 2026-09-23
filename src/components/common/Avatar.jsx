import React from 'react'

function initials(name = 'Guest') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function Avatar({ user, small = false }) {
  const avatarUrl = user?.photo || user?.avatar?.secure_url || user?.avatar

  return (
    <div className={`avatar ${small ? 'avatar-small' : ''}`} title={user?.name || 'Profile'}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={`${user?.name || 'Profile'} profile`} />
      ) : (
        initials(user?.name || 'Guest')
      )}
    </div>
  )
}
