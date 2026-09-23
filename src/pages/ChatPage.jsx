import React, { useState, useEffect, useRef } from 'react'
import { History, PanelRightClose, PanelRightOpen, Sparkles, Plus, Send, ShieldCheck, FileText, X } from 'lucide-react'
import { PageIntro } from '../components/ui/PageIntro'
import { Button } from '../components/common/Button'
import { ChatMessage } from '../components/chat/ChatMessage'
import { SourceViewer } from '../components/chat/SourceViewer'
import { ContextPicker } from '../components/chat/ContextPicker'

const presetQuestions = [
  'Give me a 30-second overview',
  'What are the key risks?',
  'Make a study plan from this',
  'Compare the selected documents',
]

export function ChatPage({ documents, onNavigate }) {
  const [selectedDocIds, setSelectedDocIds] = useState(documents.filter((doc) => doc.status === 'ready').slice(0, 2).map((doc) => doc.id))
  const [messages, setMessages] = useState([{ id: 'welcome', role: 'assistant', text: 'Hi, I’m your grounded reading partner. Ask me anything across the selected documents — I’ll show you exactly where the answer comes from.', citations: [] }])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeCitation, setActiveCitation] = useState(null)
  const [showSources, setShowSources] = useState(true)
  const [feedback, setFeedback] = useState({})
  const timerRef = useRef(null)
  const readyDocuments = documents.filter((doc) => doc.status === 'ready')

  useEffect(() => () => window.clearInterval(timerRef.current), [])
  useEffect(() => {
    setSelectedDocIds((current) => current.filter((id) => documents.some((doc) => doc.id === id && doc.status === 'ready')))
  }, [documents])

  const selectedDocuments = readyDocuments.filter((doc) => selectedDocIds.includes(doc.id))

  const toggleDoc = (id) => setSelectedDocIds((current) =>
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  )

  const getResponse = (prompt) => {
    const source = selectedDocuments[0]?.name || 'your library'
    if (prompt.toLowerCase().includes('risk')) return `Across ${source} and the research notes, I see three risks worth watching: unclear activation ownership, a broad first release scope, and no explicit guardrail for support load. The strongest signal is the repeated call for a smaller beta cohort before launch.`
    if (prompt.toLowerCase().includes('plan') || prompt.toLowerCase().includes('study')) return `A useful starting plan is: first, read the overview and highlight the decision points; next, turn the recurring themes into a short checklist; finally, validate each action against the source citations. I can turn this into a day-by-day plan in Work planner.`
    if (prompt.toLowerCase().includes('compare')) return `The selected documents agree on one thing: activation is the clearest measure of value. The product brief frames it as a launch metric, while the customer research explains the onboarding friction that makes it hard to reach. I’ve kept both sources visible below.`
    return `Here’s the short version: the documents describe a focused next release anchored on activation, a smaller beta cohort, and a clearer onboarding path. The research adds useful context — customers want to reach value quickly, but the current journey asks them to do too much before the first meaningful moment.`
  }

  const sendMessage = (rawPrompt = input) => {
    const prompt = rawPrompt.trim()
    if (!prompt || isStreaming) return
    if (!selectedDocuments.length) {
      setMessages((current) => [...current, { id: `m-${Date.now()}`, role: 'assistant', text: 'Select at least one ready document from the context tray and I’ll ground the answer in it.', citations: [] }])
      return
    }

    const userMessage = { id: `m-${Date.now()}`, role: 'user', text: prompt }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setIsStreaming(true)
    setStreamingText('')

    const response = getResponse(prompt)
    const words = response.split(' ')
    let count = 0

    timerRef.current = window.setInterval(() => {
      count = Math.min(words.length, count + 5)
      setStreamingText(words.slice(0, count).join(' '))
      if (count >= words.length) {
        window.clearInterval(timerRef.current)
        setIsStreaming(false)
        setStreamingText('')
        setMessages((current) => [...current, {
          id: `m-${Date.now()}-answer`,
          role: 'assistant',
          text: response,
          citations: selectedDocuments.slice(0, 2).map((doc, index) => ({
            id: `${doc.id}-cite`,
            doc,
            page: index + 4,
            label: `p. ${index + 4}`
          }))
        }])
      }
    }, 65)
  }

  const regenerate = () => {
    const lastUser = [...messages].reverse().find((message) => message.role === 'user')
    if (lastUser) sendMessage(lastUser.text)
  }

  const copyAnswer = (text) => navigator.clipboard?.writeText(text)

  return (
    <div className="chat-page">
      <div className="chat-topline">
        <div>
          <span className="overline">Grounded conversation</span>
          <h1>Ask better questions.</h1>
          <p>Answers stay close to the documents you choose.</p>
        </div>
        <div className="chat-top-actions">
          <Button variant="ghost" onClick={() => onNavigate('history')} icon={History}>History</Button>
          <Button variant="secondary" onClick={() => setShowSources((value) => !value)} icon={showSources ? PanelRightClose : PanelRightOpen}>
            {showSources ? 'Hide sources' : 'Show sources'}
          </Button>
        </div>
      </div>

      <div className={`chat-workspace ${showSources ? '' : 'chat-workspace-full'}`}>
        <section className="chat-panel">
          <div className="chat-context-bar">
            <div className="context-label"><span className="context-pulse"></span><span>Answering from</span></div>
            <div className="context-docs">
              {selectedDocuments.map((doc) => (
                <button key={doc.id} className="context-doc-chip" onClick={() => toggleDoc(doc.id)}>
                  <span className={`tiny-file tiny-file-${doc.color}`}><FileText size={11} /></span>
                  {doc.name}
                  <X size={12} />
                </button>
              ))}
              <button className="add-context-button" onClick={() => document.getElementById('context-picker')?.classList.toggle('context-picker-open')}>
                <Plus size={14} /> Add source
              </button>
              <ContextPicker documents={readyDocuments} selectedIds={selectedDocIds} toggleDoc={toggleDoc} />
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCitation={setActiveCitation}
                feedback={feedback[message.id]}
                onFeedback={(value) => setFeedback((current) => ({ ...current, [message.id]: value }))}
                onCopy={copyAnswer}
                onRegenerate={regenerate}
              />
            ))}
            {isStreaming && (
              <div className="chat-message assistant-message">
                <div className="message-avatar"><Sparkles size={15} /></div>
                <div className="message-content">
                  <span className="message-label">উপলব্ধি <small>writing</small></span>
                  <p>{streamingText}<span className="typing-cursor"></span></p>
                </div>
              </div>
            )}
          </div>

          <div className="chat-composer-wrap">
            <div className="preset-row">
              {presetQuestions.map((question) => (
                <button key={question} onClick={() => sendMessage(question)} disabled={isStreaming}>
                  <Sparkles size={12} />{question}
                </button>
              ))}
            </div>
            <div className="chat-composer">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage() } }}
                placeholder="Ask across your documents…"
                rows="1"
              />
              <button className="send-button" onClick={() => sendMessage()} disabled={!input.trim() || isStreaming}>
                <Send size={17} />
              </button>
            </div>
            <div className="composer-foot">
              <span><ShieldCheck size={13} /> Answers are grounded in your selected sources</span>
              <span>Enter to send · Shift + Enter for a new line</span>
            </div>
          </div>
        </section>

        {showSources && <SourceViewer citation={activeCitation} documents={selectedDocuments} onClose={() => setActiveCitation(null)} />}
      </div>
    </div>
  )
}
