import React from 'react'

export function SidebarLink({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`} onClick={onClick}>
      <Icon size={17} />
      <span>{item.label}</span>
      {item.id === 'documents' && <span className="sidebar-count">4</span>}
    </button>
  )
}
