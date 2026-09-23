import React, { useState } from 'react'
import { Upload, Search, Grid2X2, ListFilter, ArrowRight } from 'lucide-react'
import { PageIntro } from '../components/ui/PageIntro'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { DocumentCard } from '../components/documents/DocumentCard'
import { DocumentDetailPanel } from '../components/documents/DocumentDetailPanel'
import { deleteDocument as deleteDocumentApi } from '../Actions/DashboardAction'

export function DocumentsPage({ documents, setDocuments, onUpload }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const filtered = documents.filter((doc) => {
    const matchesQuery = doc.name.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'all' || doc.status === filter || doc.type === filter
    return matchesQuery && matchesFilter
  })

  const deleteDocument = async (id) => {
    try {
      await deleteDocumentApi(id)
      setDocuments((current) => current.filter((doc) => doc.id !== id))
      setSelectedDoc(null)
    } catch (error) {
      console.error('Delete document error:', error)
    }
  }

  return (
    <div className="documents-page">
      <PageIntro
        eyebrow="Document bucket"
        title="Your source library."
        copy="Every file is extracted, chunked, embedded, and ready to answer from."
        actions={<Button onClick={onUpload} icon={Upload}>Add documents</Button>}
      />

      <div className="upload-zone" onClick={onUpload}>
        <div className="upload-zone-icon"><Upload size={21} /></div>
        <div>
          <strong>Drop a document here, or browse your files</strong>
          <p>PDF, DOCX, or TXT · up to 20 MB each</p>
        </div>
        <span className="upload-browse">Browse files <ArrowRight size={14} /></span>
      </div>

      <div className="library-toolbar">
        <div className="search-field">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your library" />
        </div>
        <div className="filter-pills">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All <span>{documents.length}</span></button>
          <button className={filter === 'ready' ? 'active' : ''} onClick={() => setFilter('ready')}>Ready <span>{documents.filter((doc) => doc.status === 'ready').length}</span></button>
          <button className={filter === 'processing' ? 'active' : ''} onClick={() => setFilter('processing')}>Processing <span>{documents.filter((doc) => doc.status === 'processing').length}</span></button>
        </div>
        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><Grid2X2 size={16} /></button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><ListFilter size={16} /></button>
        </div>
      </div>

      {filtered.length ? (
        <div className={`document-grid ${viewMode === 'list' ? 'document-grid-list' : ''}`}>
          {filtered.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onOpen={() => setSelectedDoc(document)}
              onDelete={() => deleteDocument(document.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No documents found" copy="Try another search or add your first document." onClick={onUpload} />
      )}

      {selectedDoc && (
        <DocumentDetailPanel
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDelete={() => deleteDocument(selectedDoc.id)}
        />
      )}
    </div>
  )
}
