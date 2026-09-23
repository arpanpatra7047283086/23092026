import React from 'react'
import { LayoutDashboard, LibraryBig, MessageCircle, History, WandSparkles, UserRound, Settings, Sparkles, ChevronDown, CheckCircle2, CircleHelp, MoreHorizontal, X } from 'lucide-react'
import { Logo } from '../common/Logo'
import { Avatar } from '../common/Avatar'
import { SidebarLink } from './SidebarLink'
import { ProductHeader } from './ProductHeader'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'documents', label: 'Documents', icon: LibraryBig },
  { id: 'chat', label: 'Ask উপলব্ধি', icon: MessageCircle },
  { id: 'history', label: 'Chat history', icon: History },
]

const toolItems = [
  { id: 'planner', label: 'Work planner', icon: WandSparkles },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function AppShell({ user, page, navigate, onUpload, onSignOut, mobileMenu, setMobileMenu, children }) {
  return (
    <div className="product-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <button className="logo-button sidebar-logo" onClick={() => navigate('landing')}><Logo /></button>
          <button className="mobile-sidebar-close" onClick={() => setMobileMenu(false)}><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar"><Sparkles size={15} /></div>
          <div><small>Workspace</small><strong>My knowledge space</strong></div>
          <ChevronDown size={15} />
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => <SidebarLink key={item.id} item={item} active={page === item.id} onClick={() => navigate(item.id)} />)}
        </nav>
        <div className="sidebar-label tools-label">Tools</div>
        <nav className="sidebar-nav">
          {toolItems.map((item) => <SidebarLink key={item.id} item={item} active={page === item.id} onClick={() => navigate(item.id)} />)}
        </nav>
        <div className="sidebar-bottom">
          <div className="pipeline-status">
            <span className="status-pulse"></span>
            <div><strong>RAG pipeline</strong><small>All systems ready</small></div>
            <CheckCircle2 size={15} />
          </div>
          <button className="help-link"><CircleHelp size={16} /> Help & shortcuts</button>
          <div className="sidebar-user">
            <Avatar user={user} small />
            <div><strong>{user?.name || 'Guest'}</strong><small>{user?.email || 'guest@local'}</small></div>
            <button className="more-button" onClick={() => navigate('profile')}><MoreHorizontal size={16} /></button>
          </div>
        </div>
      </aside>
      <div className="product-main">
        <ProductHeader user={user} page={page} navigate={navigate} onUpload={onUpload} onSignOut={onSignOut} onOpenMenu={() => setMobileMenu((value) => !value)} />
        <main className="product-content">{children}</main>
      </div>
    </div>
  )
}
