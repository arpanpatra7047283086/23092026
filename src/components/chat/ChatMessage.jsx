import React from 'react'
import { Sparkles, Quote, Copy, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react'

export function ChatMessage({ message, onCitation, feedback, onFeedback, onCopy, onRegenerate }) {
  if (message.role === 'user') return (
    <div className="chat-message user-message">
      <div className="user-message-bubble">{message.text}</div>
    </div>
  )

  return (
    <div className="chat-message assistant-message">
      <div className="message-avatar"><Sparkles size={15} /></div>
      <div className="message-content">
        <span className="message-label">উপলব্ধি <small>grounded answer</small></span>
        <p>{message.text}</p>
        {message.citations?.length > 0 && (
          <div className="citation-row">
            <span className="citation-label"><Quote size={12} /> Sources</span>
            {message.citations.map((citation) => (
              <button key={citation.id} className="citation-chip" onClick={() => onCitation(citation)}>
                <span>{citation.doc.name}</span>
                <b>{citation.label}</b>
              </button>
            ))}
          </div>
        )}
        {message.id !== 'welcome' && (
          <div className="message-actions">
            <button onClick={() => onCopy(message.text)}><Copy size={13} /> Copy</button>
            <button onClick={onRegenerate}><RefreshCw size={13} /> Regenerate</button>
            <span className="message-action-spacer"></span>
            <button
              className={feedback === 'up' ? 'feedback-active' : ''}
              onClick={() => onFeedback(feedback === 'up' ? null : 'up')}
            >
              <ThumbsUp size={13} />
            </button>
            <button
              className={feedback === 'down' ? 'feedback-active feedback-negative' : ''}
              onClick={() => onFeedback(feedback === 'down' ? null : 'down')}
            >
              <ThumbsDown size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
