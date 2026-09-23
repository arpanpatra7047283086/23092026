import React from 'react'
import { Quote, PanelRightClose, FileType2, ChevronLeft, ChevronRight } from 'lucide-react'

export function SourceViewer({ citation, documents, onClose }) {
  const document = citation?.doc || documents[0]
  if (!document) return (
    <aside className="source-panel source-empty">
      <div className="source-empty-icon"><Quote size={22} /></div>
      <h3>Citations will appear here</h3>
      <p>Ask a question and select a source to inspect the exact passage behind the answer.</p>
    </aside>
  )

  const page = citation?.page || 4
  return (
    <aside className="source-panel">
      <div className="source-header">
        <div>
          <span className="overline">Source viewer</span>
          <h2>{document.name}</h2>
        </div>
        <button className="icon-button" onClick={onClose}><PanelRightClose size={17} /></button>
      </div>
      <div className="source-toolbar">
        <span><FileType2 size={14} /> PDF view</span>
        <div>
          <button><ChevronLeft size={15} /></button>
          <span>{page} / {document.pages}</span>
          <button><ChevronRight size={15} /></button>
        </div>
      </div>
      <div className="pdf-page">
        <div className="pdf-page-label">{document.name}<span>PAGE {page}</span></div>
        <h3>{page === 4 ? 'Activation is the first meaningful moment' : 'A smaller cohort creates a safer signal'}</h3>
        <p>Customers describe value as the moment they can complete a meaningful task without needing a tour, a workaround, or help from the team.</p>
        <p className="highlighted-passage">
          The research suggests that <mark>activation should be treated as the clearest early signal</mark>,
          with a smaller beta cohort used to learn where the onboarding journey creates friction.
        </p>
        <p>That focus also gives the team a shared language for prioritising the next release and checking whether the product is moving in the right direction.</p>
        <div className="pdf-line short"></div>
        <div className="pdf-line"></div>
        <div className="pdf-line medium"></div>
        <div className="pdf-foot">{page} · {document.name}</div>
      </div>
      <div className="source-insight">
        <div className="source-insight-icon"><Quote size={14} /></div>
        <div>
          <strong>Why this is relevant</strong>
          <p>This passage directly supports the answer above.</p>
        </div>
      </div>
    </aside>
  )
}
