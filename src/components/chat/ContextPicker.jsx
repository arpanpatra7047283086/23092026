import React from 'react'
import { FileText, Check, Plus } from 'lucide-react'

export function ContextPicker({ documents, selectedIds, toggleDoc }) {
  return (
    <div className="context-picker" id="context-picker">
      <span className="overline">Choose sources</span>
      {documents.map((doc) => (
        <button key={doc.id} onClick={() => toggleDoc(doc.id)}>
          <span className={`tiny-file tiny-file-${doc.color}`}><FileText size={11} /></span>
          <span>{doc.name}</span>
          {selectedIds.includes(doc.id) ? <Check size={15} /> : <span className="empty-check"></span>}
        </button>
      ))}
    </div>
  )
}
