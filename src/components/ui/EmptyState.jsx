import React from 'react'
import { FolderOpen, Upload } from 'lucide-react'
import { Button } from '../common/Button'

export function EmptyState({ title, copy, onClick }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><FolderOpen size={23} /></div>
      <h3>{title}</h3>
      <p>{copy}</p>
      {onClick && <Button variant="secondary" onClick={onClick} icon={Upload}>Add a document</Button>}
    </div>
  )
}
