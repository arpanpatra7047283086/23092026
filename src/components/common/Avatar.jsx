import React, { useState } from 'react'

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
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = avatarUrl && !imageFailed

  return (
    <div className={`avatar ${small ? 'avatar-small' : ''}`} title={user?.name || 'Profile'}>
      {showImage ? (
        <img src={avatarUrl} alt={`${user?.name || 'Profile'} profile`} onError={() => setImageFailed(true)} />
      ) : (
        initials(user?.name || 'Guest')
      )}
    </div>
  )
}
