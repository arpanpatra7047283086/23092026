import React, { useState } from 'react'
import { Menu, Search, Bell, ChevronDown } from 'lucide-react'
import { Avatar } from '../common/Avatar'
import { ProfileMenu } from './ProfileMenu'

export function ProductHeader({ user, page, navigate, onUpload, onSignOut, onOpenMenu }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const title = page === 'chat' ? 'Ask উপলব্ধি' : page === 'dashboard' ? 'Dashboard' : page === 'planner' ? 'Work planner' : page[0].toUpperCase() + page.slice(1)

  return (
    <header className="product-header">
      <div className="header-left">
        <button className="mobile-menu-button" onClick={onOpenMenu}><Menu size={19} /></button>
        <div className="breadcrumbs">
          <button onClick={() => navigate('landing')}>Home</button>
          <span>/</span>
          <strong>{title}</strong>
        </div>
      </div>
      <div className="header-actions">
        <button className="header-icon-button" onClick={() => setSearchOpen((value) => !value)}><Search size={18} /></button>
        <button className="header-icon-button notification-button"><Bell size={18} /><i></i></button>
        <div className="header-divider"></div>
        <div className="profile-menu-wrap">
          <button className="header-profile" onClick={() => setProfileOpen((value) => !value)}>
            <Avatar user={user} small />
            <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
            <ChevronDown size={14} />
          </button>
          {profileOpen && <ProfileMenu user={user} onNavigate={navigate} onSignOut={onSignOut} />}
        </div>
      </div>
      {searchOpen && (
        <div className="global-search">
          <Search size={17} />
          <input autoFocus placeholder="Search documents, chats, or ask anything…" onKeyDown={(event) => event.key === 'Enter' && navigate('chat')} />
          <kbd>⌘ K</kbd>
        </div>
      )}
    </header>
  )
}
