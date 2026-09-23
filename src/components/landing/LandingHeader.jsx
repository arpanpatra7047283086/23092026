import React, { useState } from 'react'
import { Menu, ArrowRight, ChevronDown, ArrowUpRight } from 'lucide-react'
import { Logo } from '../common/Logo'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { ProfileMenu } from '../layout/ProfileMenu'

export function LandingHeader({ user, onGetStarted, onSignIn, onNavigate, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const isAuthed = Boolean(user)

  return (
    <header className="landing-nav">
      <button className="logo-button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Logo /></button>
      <nav className={`landing-links ${showMobileNav ? 'landing-links-open' : ''}`}>
        <a href="#answers">What we do</a>
        <a href="#answers">Benefits</a>
        <a href="#how-it-works">How it works</a>
        <a href="#faq">FAQ</a>
        {isAuthed && <button className="nav-link-button" onClick={() => onNavigate('dashboard')}>Workspace <ArrowUpRight size={14} /></button>}
      </nav>
      <div className="landing-actions">
        {isAuthed ? (
          <div className="profile-menu-wrap">
            <button className="profile-trigger" onClick={() => setMenuOpen((open) => !open)}><Avatar user={user} small /><ChevronDown size={14} /></button>
            {menuOpen && <ProfileMenu user={user} onNavigate={onNavigate} onSignOut={onSignOut} />}
          </div>
        ) : (
          <>
            <button className="text-button desktop-only" onClick={onSignIn}>Sign in</button>
            <Button onClick={onGetStarted} icon={ArrowRight} iconRight>Get started</Button>
          </>
        )}
        <button className="mobile-nav-toggle" onClick={() => setShowMobileNav((value) => !value)}><Menu size={20} /></button>
      </div>
    </header>
  )
}
