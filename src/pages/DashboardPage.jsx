import React from 'react'
import { MessageCircle, Upload, LibraryBig, CheckCircle2, Lightbulb, ArrowRight, MoreHorizontal, ArrowUpRight, Sparkles } from 'lucide-react'
import { PageIntro } from '../components/ui/PageIntro'
import { Button } from '../components/common/Button'
import { DocumentRow } from '../components/documents/DocumentRow'

function StatCard({ label, value, delta, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}><Icon size={18} /></div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-delta">{delta}</div>
    </div>
  )
}

export function DashboardPage({ user, documents, chats, onNavigate, onUpload }) {
  const readyDocs = documents.filter((doc) => doc.status === 'ready').length

  return (
    <div className="dashboard-page">
      <PageIntro
        eyebrow="Your knowledge space"
        title={`Good morning, ${user?.name?.split(' ')[0] || 'there'}.`}
        copy="Here’s the pulse of your documents, questions, and ideas."
        actions={
          <>
            <Button variant="secondary" onClick={() => onNavigate('chat')} icon={MessageCircle}>Ask a question</Button>
            <Button onClick={onUpload} icon={Upload}>Upload</Button>
          </>
        }
      />

      <div className="dashboard-hero-card">
        <div>
          <span className="overline">Keep the thread going</span>
          <h2>Turn reading into <em>momentum.</em></h2>
          <p>Ask across {readyDocs} ready documents, get the source beside every answer, and keep your next action close.</p>
          <Button variant="dark" onClick={() => onNavigate('chat')} icon={ArrowRight} iconRight>Open your assistant</Button>
        </div>
        <div className="dashboard-orbit">
          <div className="dash-orbit-line"></div>
          <div className="dash-orbit-dot dash-dot-a"></div>
          <div className="dash-orbit-dot dash-dot-b"></div>
          <div className="dash-center"><Sparkles size={22} /></div>
          <span className="dash-float-label label-a">hybrid search</span>
          <span className="dash-float-label label-b">citations on</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Documents" value={documents.length} delta="+2 this week" icon={LibraryBig} tone="aqua" />
        <StatCard label="Ready to ask" value={readyDocs} delta="All indexed" icon={CheckCircle2} tone="green" />
        <StatCard label="Questions asked" value="128" delta="+24% this month" icon={MessageCircle} tone="violet" />
        <StatCard label="Saved insights" value="34" delta="12 with citations" icon={Lightbulb} tone="orange" />
      </div>

      <div className="dashboard-columns">
        <section className="panel recent-panel">
          <div className="panel-heading">
            <div><span className="overline">Library pulse</span><h2>Recent documents</h2></div>
            <button className="text-link" onClick={() => onNavigate('documents')}>View all <ArrowRight size={14} /></button>
          </div>
          <div className="recent-list">
            {documents.slice(0, 4).map((doc) => <DocumentRow key={doc.id} document={doc} compact />)}
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-heading">
            <div><span className="overline">Your rhythm</span><h2>Recent questions</h2></div>
            <button className="icon-button"><MoreHorizontal size={17} /></button>
          </div>
          <div className="activity-list">
            {chats.slice(0, 3).map((chat, index) => (
              <button className="activity-item" key={chat.id} onClick={() => onNavigate('chat')}>
                <span className={`activity-dot activity-dot-${index}`}></span>
                <div>
                  <strong>{chat.title}</strong>
                  <small>{chat.date} · {chat.messages} messages</small>
                </div>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
          <div className="activity-footer">
            <span><span className="streak-dot"></span> 4 day focus streak</span>
            <span>Keep going →</span>
          </div>
        </section>
      </div>
    </div>
  )
}
