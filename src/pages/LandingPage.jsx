import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowDownToLine,
  BrainCircuit,
  Zap,
  Sparkles,
  Upload,
  Check,
  ArrowUpRight,
  MessageCircle,
  FolderOpen,
  Network,
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { LandingHeader } from '../components/landing/LandingHeader'
import { RobotAssistant } from '../components/landing/RobotAssistant'
import { Button } from '../components/common/Button'
import { Logo } from '../components/common/Logo'

function PipelineStep({ number, icon: Icon, title, copy }) {
  return (
    <div className="pipeline-step">
      <div className="pipeline-number">{number}</div>
      <div className="pipeline-icon"><Icon size={20} /></div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  )
}

function AuthenticatedLanding({ user, onNavigate, onUpload }) {
  return (
    <section className="authenticated-home page-container">
      <div className="signed-in-strip">
        <div>
          <span className="overline">Your workspace is ready</span>
          <h2>Good to see you, {user?.name?.split(' ')[0] || 'there'}.</h2>
          <p>Pick up where you left off, or make your next document searchable.</p>
        </div>
        <div className="strip-actions">
          <Button variant="secondary" onClick={() => onNavigate('chat')} icon={MessageCircle}>Start asking</Button>
          <Button onClick={onUpload} icon={Upload}>Upload docs</Button>
        </div>
      </div>
      <div className="quick-start-grid">
        <button className="quick-start-card quick-start-upload" onClick={onUpload}>
          <div className="quick-card-icon"><Upload size={20} /></div>
          <div>
            <span className="overline">01 · Add knowledge</span>
            <h3>Upload a document</h3>
            <p>PDF, Word, TXT, or a scan</p>
          </div>
          <ArrowUpRight size={18} />
        </button>
        <button className="quick-start-card" onClick={() => onNavigate('documents')}>
          <div className="quick-card-icon violet"><FolderOpen size={20} /></div>
          <div>
            <span className="overline">02 · Browse library</span>
            <h3>Open your doc bucket</h3>
            <p>4 documents · 3 ready to ask</p>
          </div>
          <ArrowUpRight size={18} />
        </button>
        <button className="quick-start-card" onClick={() => onNavigate('chat')}>
          <div className="quick-card-icon orange"><Sparkles size={20} /></div>
          <div>
            <span className="overline">03 · Find an answer</span>
            <h3>Start asking</h3>
            <p>Answers with clickable citations</p>
          </div>
          <ArrowUpRight size={18} />
        </button>
      </div>
    </section>
  )
}

export function LandingPage({ user, onGetStarted, onSignIn, onNavigate, onUpload, onSignOut }) {
  const [activeQuestion, setActiveQuestion] = useState('what')
  const isAuthed = Boolean(user)

  const questionContent = {
    what: {
      eyebrow: '01 · What we do',
      title: 'Your documents, finally in conversation.',
      copy: 'উপলব্ধি turns PDFs, notes, docs, and scans into a grounded knowledge space. Ask in plain language and get answers that point back to the exact source.',
      visual: 'Grounded answers, not guesswork.',
      icon: BrainCircuit,
    },
    benefits: {
      eyebrow: '02 · What you get',
      title: 'Clarity without the tab-switching.',
      copy: 'Move from “I know it is in here somewhere” to a useful answer in seconds. Search, compare, summarize, cite, and plan from the same calm workspace.',
      visual: 'More signal. Less searching.',
      icon: Zap,
    },
    start: {
      eyebrow: '03 · How to start',
      title: 'Bring one document. Leave with momentum.',
      copy: 'Create your private space, drop in a document, and ask your first question. We will handle extraction, chunking, embeddings, retrieval, and citations underneath.',
      visual: 'Upload → ask → understand.',
      icon: Sparkles,
    },
  }
  useEffect(() => {
    const questionIds = Object.keys(questionContent)
    const rotateQuestions = () => {
      setActiveQuestion((currentQuestion) => {
        const currentIndex = questionIds.indexOf(currentQuestion)
        return questionIds[(currentIndex + 1) % questionIds.length]
      })
    }
    const intervalId = window.setInterval(rotateQuestions, 5500)
    return () => window.clearInterval(intervalId)
  }, [])

  const question = questionContent[activeQuestion]
  const QuestionIcon = question.icon
  const questionIds = Object.keys(questionContent)
  const moveQuestion = (direction) => {
    const currentIndex = questionIds.indexOf(activeQuestion)
    const nextIndex = (currentIndex + direction + questionIds.length) % questionIds.length
    setActiveQuestion(questionIds[nextIndex])
  }
  const handleTouchStart = (event) => {
    event.currentTarget.dataset.touchStart = String(event.changedTouches[0].clientX)
  }
  const handleTouchEnd = (event) => {
    const startX = Number(event.currentTarget.dataset.touchStart)
    const distance = event.changedTouches[0].clientX - startX
    if (Math.abs(distance) > 45) moveQuestion(distance < 0 ? 1 : -1)
  }

  return (
    <div className="landing-page">
      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>
      <LandingHeader user={user} onGetStarted={onGetStarted} onSignIn={onSignIn} onNavigate={onNavigate} onSignOut={onSignOut} />

      <main>
        <section className="hero page-container">
          <div className="hero-copy">
            <div className="eyebrow-pill"><span className="pulse-dot"></span> A calmer way to work with knowledge</div>
            <h1>Understand more.<br /><em>Do better.</em></h1>
            <p className="hero-subtitle">A grounded AI workspace for the things you need to read, remember, and act on.</p>
            <div className="hero-actions">
              <Button onClick={isAuthed ? () => onNavigate('dashboard') : onGetStarted} icon={ArrowRight} iconRight>{isAuthed ? 'Open workspace' : 'Get started'}</Button>
              <a href="#answers" className="quiet-link">See how it works <ArrowDownToLine size={15} /></a>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><span>AS</span><span>NK</span><span>JD</span><span>+</span></div><span>Built for curious teams and focused minds.</span></div>
          </div>
          <div className="hero-visual">
            <div className="visual-grid"></div>
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="floating-note floating-note-top"><span className="mini-icon mini-icon-aqua"><Check size={12} /></span><div><b>Source grounded</b><small>3 citations found</small></div></div>
            <RobotAssistant />
            <div className="floating-note floating-note-bottom"><span className="mini-icon mini-icon-violet"><Sparkles size={12} /></span><div><b>Ready when you are</b><small>Ask anything in your docs</small></div><ArrowUpRight size={15} /></div>
          </div>
        </section>

        <section className="answer-section page-container" id="answers">
          <div className="section-heading split-heading"><div><span className="overline">Three answers to one big question</span><h2>Everything you need to <em>understand</em>.</h2></div><p>One focused space for reading, asking, and turning what you learn into your next move.</p></div>
          <div className="question-layout" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div key={activeQuestion} className="question-answer">
              <div className="question-answer-copy"><div className="answer-icon"><QuestionIcon size={20} /></div><span className="overline">{question.eyebrow}</span><h3>{question.title}</h3><p>{question.copy}</p><div className="answer-visual-label"><i></i>{question.visual}</div></div>
              <div className="answer-diagram"><div className="diagram-ring"></div><div className="diagram-card diagram-card-main"><div className="diagram-card-head"><span className="diagram-window-dot"></span><span className="diagram-window-dot"></span><span className="diagram-window-dot"></span><small>retrieval / grounded</small></div><div className="diagram-lines"><span></span><span></span><span></span><span></span></div><div className="diagram-citation"><Quote size={13} /> “The answer lives here.”</div></div><div className="diagram-chip diagram-chip-one">semantic search</div><div className="diagram-chip diagram-chip-two">confidence 96%</div></div>
            </div>
          </div>
          <div className="question-controls" aria-label="Answer cards">
            <button type="button" onClick={() => moveQuestion(-1)} aria-label="Previous answer"><ChevronLeft size={18} /></button>
            <span>{String(questionIds.indexOf(activeQuestion) + 1).padStart(2, '0')} / {String(questionIds.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => moveQuestion(1)} aria-label="Next answer"><ChevronRight size={18} /></button>
          </div>
        </section>

        <section className="how-section page-container" id="how-it-works">
          <div className="section-heading"><span className="overline">Under the hood, made simple</span><h2>From a file to a <em>felt sense of clarity.</em></h2></div>
          <div className="pipeline">
            <PipelineStep number="01" icon={Upload} title="Bring it in" copy="PDF, Word, TXT, or a scan. Your library can handle the mess." />
            <div className="pipeline-connector"><span></span></div>
            <PipelineStep number="02" icon={Network} title="We make sense of it" copy="Extraction, chunking, embeddings, and hybrid retrieval happen quietly." />
            <div className="pipeline-connector"><span></span></div>
            <PipelineStep number="03" icon={MessageCircle} title="You move forward" copy="Ask, cite, summarize, plan, and export without losing the source." />
          </div>
          <div className="landing-foot-cta"><div><span className="overline">Your next good question is waiting</span><h3>Start with what is already on your desk.</h3></div>{isAuthed ? <Button onClick={onUpload} icon={Upload}>Upload a document</Button> : <Button onClick={onGetStarted} icon={ArrowRight} iconRight>Create your space</Button>}</div>
        </section>

        <section className="faq-section page-container" id="faq" aria-labelledby="faq-title">
          <div className="faq-intro">
            <span className="overline">Need a little more clarity?</span>
            <h2 id="faq-title">Frequently asked <em>questions.</em></h2>
            <p>Short answers to help you understand how উপলব্ধি fits into your reading and research workflow.</p>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Where is this plan available?</summary>
              <p>উপলব্ধি is available in your browser wherever you work. Sign in to keep your private knowledge space synced across devices.</p>
            </details>
            <details className="faq-item">
              <summary>What do I get with a premium subscription?</summary>
              <p>Premium plans are designed for deeper document workflows, with more room for your library and longer, more frequent conversations with your sources.</p>
            </details>
            <details className="faq-item">
              <summary>What are premium solutions? Can I see a sample?</summary>
              <p>Premium solutions are tailored knowledge workflows for teams and complex document sets. Start with the workspace above to see the core experience in action.</p>
            </details>
            <details className="faq-item">
              <summary>How do you group questions by company?</summary>
              <p>Your questions stay connected to the documents and workspace you select, so each company or project can have its own focused context.</p>
            </details>
            <details className="faq-item">
              <summary>I added my payment method, but I still do not have premium access. What should I do?</summary>
              <p>Refresh your workspace and confirm that you are signed in with the account used for checkout. If access is still missing, contact support with your receipt.</p>
            </details>
            <details className="faq-item">
              <summary>What if I subscribe and want to cancel?</summary>
              <p>You can cancel before your next billing date. Your access remains available through the current subscription period, and your documents stay in your workspace.</p>
            </details>
          </div>
        </section>

        {isAuthed && <AuthenticatedLanding user={user} onNavigate={onNavigate} onUpload={onUpload} />}
      </main>
      <footer className="landing-footer">
        <div className="landing-footer-inner page-container">
          <div className="footer-brand-block">
            <Logo compact />
            <p>Make sense of what you already know.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <div><span className="overline">Explore</span><a href="#answers">What we do</a><a href="#how-it-works">How it works</a></div>
            <div><span className="overline">Workspace</span><button onClick={isAuthed ? () => onNavigate('dashboard') : onGetStarted}>{isAuthed ? 'Open workspace' : 'Get started'}</button><button onClick={isAuthed ? onSignOut : onSignIn}>{isAuthed ? 'Sign out' : 'Sign in'}</button></div>
          </nav>
          <div className="footer-meta"><span>Private by default · Built for thoughtful work</span><span>© 2026 উপলব্ধি</span></div>
        </div>
      </footer>
    </div>
  )
}
