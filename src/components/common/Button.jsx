import React from 'react'

export function Button({ children, variant = 'primary', icon: Icon, iconRight = false, className = '', ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {!iconRight && Icon && <Icon size={16} strokeWidth={2.1} />}
      <span>{children}</span>
      {iconRight && Icon && <Icon size={16} strokeWidth={2.1} />}
    </button>
  )
}
