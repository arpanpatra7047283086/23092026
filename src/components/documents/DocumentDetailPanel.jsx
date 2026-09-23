import React from 'react'
import { X, FileText, CheckCircle2, Trash2, MessageCircle, Check } from 'lucide-react'
import { Tag } from '../ui/Tag'
import { Button } from '../common/Button'

function ProcessingLine({ label, done }) {
  return (
    <div className={`processing-line ${done ? 'done' : ''}`}>
      <span className="processing-line-icon">{done ? <Check size={12} /> : <span></span>}</span>
      <span>{label}</span>
      {done && <small>done</small>}
    </div>
  )
}

export function DocumentDetailPanel({ document, onClose, onDelete }) {
  return (
    <div className="detail-drawer-backdrop" onClick={onClose}>
      <aside className="detail-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="detail-drawer-header">
          <div>
            <span className="overline">Document overview</span>
            <h2>{document.name}</h2>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className={`detail-file-banner detail-banner-${document.color}`}>
          <div className="file-icon"><FileText size={24} /></div>
          <div>
            <strong>{document.type} document</strong>
            <span>{document.size} · {document.pages} pages</span>
          </div>
          <Tag tone={document.status === 'ready' ? 'ready' : 'processing'} dot>
            {document.status === 'ready' ? 'Indexed' : `${document.progress}%`}
          </Tag>
        </div>
        <div className="detail-section">
          <span className="overline">Automatic overview</span>
          <p>{document.overview}</p>
        </div>
        <div className="detail-section">
          <div className="detail-section-heading">
            <span className="overline">Processing map</span>
            <span className="processing-complete">
              <CheckCircle2 size={14} /> {document.status === 'ready' ? 'Complete' : 'In progress'}
            </span>
          </div>
          <div className="processing-map">
            <ProcessingLine label="Text extracted" done={document.progress > 30} />
            <ProcessingLine label="Chunked for retrieval" done={document.progress > 55} />
            <ProcessingLine label="Embeddings generated" done={document.progress > 78} />
            <ProcessingLine label="Stored in vector index" done={document.status === 'ready'} />
          </div>
        </div>
        <div className="detail-section">
          <span className="overline">Glossary preview</span>
          <div className="glossary-list">
            {document.glossary.length ? (
              document.glossary.map((term) => <span key={term}>{term}</span>)
            ) : (
              <span className="muted-text">Glossary appears after processing.</span>
            )}
          </div>
        </div>
        <div className="drawer-footer">
          <button className="danger-outline" onClick={onDelete}><Trash2 size={15} /> Delete document</button>
          <Button onClick={onClose} icon={MessageCircle}>Ask about it</Button>
        </div>
      </aside>
    </div>
  )
}
