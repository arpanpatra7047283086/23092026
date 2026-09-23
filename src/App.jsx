import React, { useEffect, useRef, useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { ChatPage } from './pages/ChatPage'
import { HistoryPage } from './pages/HistoryPage'
import { PlannerPage } from './pages/PlannerPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { AuthPage } from './components/auth/AuthPage'
import { OnboardingPage } from './components/auth/OnboardingPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { logout, getCurrentUser } from './Actions/LoginAction'
import { getProfile } from './Actions/ProfileAction'
import { listDocuments, uploadDocument } from './Actions/DashboardAction'

function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = window.localStorage.getItem('upolobdhi-user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [page, setPage] = useState('landing')
  const [authOpen, setAuthOpen] = useState(false) // false, 'signin', 'signup', 'forgot'
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)
  const [documents, setDocuments] = useState([]) 
  const [chats, setChats] = useState([])         
  const [mobileMenu, setMobileMenu] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.title = page === 'landing' ? 'উপলব্ধি · Understand more' : `${page[0].toUpperCase()}${page.slice(1)} · উপলব্ধি`
  }, [page])

  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      Promise.all([getCurrentUser(), getProfile()])
        .then(([meResponse, profileResponse]) => {
          const me = meResponse?.data || meResponse?.result || meResponse || {}
          const profile = profileResponse?.data || profileResponse?.result || profileResponse || {}
          const hydratedUser = { ...(user || {}), ...me, ...profile, name: me.name || me.full_name || me.username || user?.name || user?.email?.split('@')[0], email: me.email || user?.email }
          if (hydratedUser.email) {
            setUser(hydratedUser)
            window.localStorage.setItem('upolobdhi-user', JSON.stringify(hydratedUser))
          }
        })
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('upolobdhi-user')
        })
    }
  }, [])

  
  useEffect(() => {
    if (user) {
      listDocuments()
        .then(res => {
          const docs = res?.documents || res?.data?.documents || res?.data || res?.result || []
          if (Array.isArray(docs)) setDocuments(docs.map((doc) => ({ ...doc, name: doc.title || doc.filename || doc.name, type: (doc.mime_type || doc.type || '').split('/').pop()?.toUpperCase() || 'TXT', size: formatBytes(doc.size), added: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recently', progress: doc.status === 'processing' ? 40 : 100 })))
        })
        .catch(err => console.error('Error fetching documents:', err))
    } else {
      setDocuments([])
      setChats([])
    }
  }, [user])

 
  useEffect(() => {
    const timer = window.setInterval(() => {
      setDocuments((current) =>
        current.map((document) => {
          if (document.status !== 'processing') return document
          const progress = Math.min(100, (document.progress || 0) + 7)
          return { ...document, progress, status: progress === 100 ? 'ready' : 'processing' }
        }),
      )
    }, 1300)
    return () => window.clearInterval(timer)
  }, [])

  const navigate = (nextPage) => {
    setPage(nextPage)
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openAuth = (mode = 'signup') => {
    setAuthOpen(mode)
    setOnboardingOpen(false)
  }

  const handleAuthSuccess = async (profile, needsOnboarding) => {
    const meResponse = await getCurrentUser().catch(() => null)
    const me = meResponse?.data || meResponse?.result || meResponse || {}
    const hydrated = { ...profile, ...me, name: me.name || me.full_name || me.username || profile.name || profile.email?.split('@')[0] }
    if (needsOnboarding) {
      setPendingUser(hydrated)
      setAuthOpen(false)
      setOnboardingOpen(true)
    } else {
      setUser(hydrated)
      window.localStorage.setItem('upolobdhi-user', JSON.stringify(hydrated))
      setAuthOpen(false)
      navigate('dashboard')
    }
  }

  const finishOnboarding = (profileResponse) => {
    const profile = { ...pendingUser, ...(profileResponse?.data || profileResponse), needsOnboarding: false }
    setUser(profile)
    window.localStorage.setItem('upolobdhi-user', JSON.stringify(profile))
    setPendingUser(null)
    setOnboardingOpen(false)
    navigate('dashboard')
  }

  const signOut = () => {
    logout()
    setUser(null)
    navigate('landing')
  }

  const ingestFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    const validFiles = files.filter((file) => /\.(pdf|docx|txt)$/i.test(file.name) && file.size <= 20 * 1024 * 1024)
    const newDocuments = validFiles.map((file, index) => {
      const lower = file.name.toLowerCase()
      let type = 'TXT'
      if (lower.endsWith('.pdf')) type = 'PDF'
      if (lower.endsWith('.docx')) type = 'DOCX'
      return {
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        type,
        size: formatBytes(file.size),
        pages: 1,
        chunks: 0,
        status: 'processing',
        progress: 18,
        added: 'Just now',
        color: ['aqua', 'violet', 'orange', 'pink'][index % 4],
        overview: 'Document is being uploaded and processed...',
        glossary: [],
      }
    })
    setDocuments((current) => [...newDocuments, ...current])
    navigate('documents')
    try {
      const uploaded = await Promise.all(validFiles.map((file) => uploadDocument(file.name.replace(/\.[^.]+$/, ''), file)))
      const serverDocs = uploaded.map((response, index) => ({ ...(response?.data || response), name: response?.title || validFiles[index].name, size: formatBytes(response?.size || validFiles[index].size), type: validFiles[index].name.split('.').pop().toUpperCase(), progress: 100 }))
      setDocuments((current) => [...serverDocs, ...current.filter((doc) => !newDocuments.some((item) => item.id === doc.id))])
    } catch (error) {
      setDocuments((current) => current.map((doc) => newDocuments.some((item) => item.id === doc.id) ? { ...doc, status: 'failed', overview: error.message } : doc))
    }
  }

  const triggerUpload = () => fileInputRef.current?.click()

  const landing = page === 'landing'

  return (
    <div className="app-shell-root">
      <input
        ref={fileInputRef}
        className="sr-only"
        id="global-upload"
        type="file"
        accept=".pdf,.docx,.txt"
        multiple
        onChange={(event) => {
          ingestFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {landing ? (
        <LandingPage
          user={user}
          onGetStarted={() => openAuth('signup')}
          onSignIn={() => openAuth('signin')}
          onNavigate={navigate}
          onUpload={triggerUpload}
          onSignOut={signOut}
        />
      ) : (
        <AppShell
          user={user}
          page={page}
          navigate={navigate}
          onUpload={triggerUpload}
          onSignOut={signOut}
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
        >
          {page === 'dashboard' && <DashboardPage user={user} documents={documents} chats={chats} onNavigate={navigate} onUpload={triggerUpload} />}
          {page === 'documents' && <DocumentsPage documents={documents} setDocuments={setDocuments} onUpload={triggerUpload} />}
          {page === 'chat' && <ChatPage documents={documents} onNavigate={navigate} />}
          {page === 'history' && <HistoryPage chats={chats} setChats={setChats} />}
          {page === 'planner' && <PlannerPage documents={documents} />}
          {page === 'profile' && <ProfilePage user={user} setUser={setUser} />}
          {page === 'settings' && <SettingsPage user={user} documents={documents} setDocuments={setDocuments} onSignOut={signOut} />}
        </AppShell>
      )}

      {authOpen && (authOpen === 'forgot' ? (
        <ForgotPasswordPage onClose={() => setAuthOpen(false)} />
      ) : (
        <AuthPage
          initialMode={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
          onForgotPassword={() => setAuthOpen('forgot')}
        />
      ))}
      {onboardingOpen && <OnboardingPage user={pendingUser} onComplete={finishOnboarding} onBack={() => setOnboardingOpen(false)} />}
    </div>
  )
}

export default App
