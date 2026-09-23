import React from 'react'

export function Tag({ children, tone = 'neutral', dot = false }) {
  return <span className={`tag tag-${tone}`}>{dot && <i className="tag-dot" />}{children}</span>
}
