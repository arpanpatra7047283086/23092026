import React, { useState } from 'react'

export function Toggle({ checked }) {
  const [on, setOn] = useState(checked)
  return (
    <button
      className={`toggle ${on ? 'toggle-on' : ''}`}
      onClick={() => setOn((value) => !value)}
      aria-label="Toggle"
    >
      <span></span>
    </button>
  )
}
