import React, { useState } from 'react'
import { MoreHorizontal, Eye, Trash2, FileType2, FileText, FileArchive, FileQuestion, Loader2, Network } from 'lucide-react'
import { Tag } from '../ui/Tag'

export function DocumentCard({ document, onOpen, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const FileIcon = document.type === 'PDF' ? FileType2 : document.type === 'DOCX' ? FileText : document.type === 'OCR' ? FileArchive : FileQuestion

  return (
    <article className={`document-card ${document.status === 'processing' ? 'document-card-processing' : ''}`}>
      <div className="document-card-top">
        <div className={`file-icon file-icon-${document.color}`}><FileIcon size={21} /></div>
        <button className="icon-button card-menu-button" onClick={() => setMenuOpen((value) => !value)}>
          <MoreHorizontal size={17} />
        </button>
        {menuOpen && (
          <div className="card-menu">
            <button onClick={onOpen}><Eye size={14} /> View details</button>
            <button onClick={onDelete} className="danger-menu"><Trash2 size={14} /> Delete</button>
          </div>
        )}
      </div>
      <button className="document-card-body" onClick={onOpen}>
        <div className="document-type">{document.type} <span>·</span> {document.size}</div>
        <h3>{document.name}</h3>
        <p>{document.pages} pages <span>·</span> Added {document.added}</p>
      </button>
      <div className="document-card-bottom">
        {document.status === 'ready' ? (
          <>
            <Tag tone="ready" dot>Ready to ask</Tag>
            <span className="chunk-count"><Network size={13} /> {document.chunks} chunks</span>
          </>
        ) : (
          <div className="processing-row">
            <Loader2 className="spin" size={14} />
            <span>Processing {document.progress}%</span>
            <div className="mini-progress"><i style={{ width: `${document.progress}%` }}></i></div>
          </div>
        )}
      </div>
    </article>
  )
}
