import React from 'react'

export function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <div className="brand-mark"><span></span><span></span><span></span></div>
      <div className="brand-copy">
        <strong>উপলব্ধি</strong>
        {!compact && <small>understand more</small>}
      </div>
    </div>
  )
}
