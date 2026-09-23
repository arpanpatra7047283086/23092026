import React from 'react'
import { FileText, ChevronRight } from 'lucide-react'
import { Tag } from '../ui/Tag'

export function DocumentRow({ document, compact = false }) {
  return (
    <div className={`document-row ${compact ? 'document-row-compact' : ''}`}>
      <div className={`file-icon file-icon-${document.color}`}><FileText size={17} /></div>
      <div className="document-row-main">
        <strong>{document.name}</strong>
        <span>{document.type} · {document.size}</span>
      </div>
      <div className="document-row-status">
        {document.status === 'ready' ? <Tag tone="ready" dot>Ready</Tag> : <Tag tone="processing" dot>Processing</Tag>}
      </div>
      <ChevronRight size={15} className="row-chevron" />
    </div>
  )
}
