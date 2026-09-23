import React, { useState } from 'react'
import { Download, Trash2, Search, MessageCircle, Info, MoreHorizontal } from 'lucide-react'
import { PageIntro } from '../components/ui/PageIntro'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/ui/EmptyState'

export function HistoryPage({ chats, setChats }) {
  const [query, setQuery] = useState('')

  const filtered = chats.filter((chat) =>
    chat.title.toLowerCase().includes(query.toLowerCase()) ||
    chat.preview.toLowerCase().includes(query.toLowerCase())
  )

  const selected = chats.filter((chat) => chat.selected)

  const toggle = (id) => setChats((current) =>
    current.map((chat) => chat.id === id ? { ...chat, selected: !chat.selected } : chat)
  )

  const deleteSelected = () => setChats((current) => current.filter((chat) => !chat.selected))

  const exportChats = (items) => {
    const body = items.map((chat) => `# ${chat.title}\n${chat.preview}\n${chat.date}\n`).join('\n')
    const blob = new Blob([body], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'upolobdhi-chat-export.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="history-page">
      <PageIntro
        eyebrow="Keep the thread"
        title="Chat history."
        copy="Return to the questions that helped you get somewhere."
        actions={<Button variant="secondary" onClick={() => exportChats(chats)} icon={Download}>Export all</Button>}
      />

      <div className="history-toolbar">
        <div className="search-field">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chat history" />
        </div>
        <div className="history-actions">
          <span>{selected.length ? `${selected.length} selected` : 'Select chats to manage'}</span>
          {selected.length > 0 && (
            <>
              <button className="text-link" onClick={() => exportChats(selected)}><Download size={14} /> Export selected</button>
              <button className="danger-text-button" onClick={deleteSelected}><Trash2 size={14} /> Delete</button>
            </>
          )}
        </div>
      </div>

      <section className="history-list panel">
        {filtered.map((chat) => (
          <div className={`history-row ${chat.selected ? 'history-row-selected' : ''}`} key={chat.id}>
            <label className="history-checkbox">
              <input type="checkbox" checked={chat.selected} onChange={() => toggle(chat.id)} />
              <span></span>
            </label>
            <div className="history-chat-icon"><MessageCircle size={16} /></div>
            <div className="history-row-copy">
              <h3>{chat.title}</h3>
              <p>{chat.preview}</p>
            </div>
            <div className="history-row-meta">
              <span>{chat.messages} messages</span>
              <strong>{chat.date}</strong>
            </div>
            <button className="icon-button"><MoreHorizontal size={17} /></button>
          </div>
        ))}
        {!filtered.length && <EmptyState title="No matching conversations" copy="Try a different search term." />}
      </section>

      <div className="history-note">
        <Info size={15} />
        <span>Selective export includes titles, messages, and source references for the conversations you choose.</span>
      </div>
    </div>
  )
}
