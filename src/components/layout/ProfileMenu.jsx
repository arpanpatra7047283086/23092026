import React from 'react'
import { LayoutDashboard, UserRound, Settings, LogOut } from 'lucide-react'
import { Avatar } from '../common/Avatar'

export function ProfileMenu({ user, onNavigate, onSignOut }) {
  return (
    <div className="profile-menu">
      <div className="profile-menu-user">
        <Avatar user={user} small />
        <div>
          <strong>{user?.name || 'Your profile'}</strong>
          <small>{user?.email || 'hello@example.com'}</small>
        </div>
      </div>
      <div className="profile-menu-divider"></div>
      <button onClick={() => onNavigate('dashboard')}><LayoutDashboard size={15} /> Dashboard</button>
      <button onClick={() => onNavigate('profile')}><UserRound size={15} /> Profile</button>
      <button onClick={() => onNavigate('settings')}><Settings size={15} /> Settings</button>
      <div className="profile-menu-divider"></div>
      <button className="danger-menu" onClick={onSignOut}><LogOut size={15} /> Log out</button>
    </div>
  )
}
