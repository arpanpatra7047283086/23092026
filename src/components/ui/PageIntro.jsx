import React from 'react'

export function PageIntro({ eyebrow, title, copy, actions }) {
  return (
    <div className="page-intro">
      <div>
        <span className="overline">{eyebrow}</span>
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
      {actions && <div className="page-intro-actions">{actions}</div>}
    </div>
  )
}
