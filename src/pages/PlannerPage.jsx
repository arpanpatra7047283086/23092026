import React, { useState } from 'react'
import { Sparkles, ChevronLeft, ChevronRight, Plus, MoreHorizontal, Database, Check, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react'
import { PageIntro } from '../components/ui/PageIntro'
import { Button } from '../components/common/Button'
import { Tag } from '../components/ui/Tag'

export function PlannerPage({ documents }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Read the product brief overview', meta: '25 min · Product requirements v2.pdf', done: true },
    { id: 2, title: 'Map the three onboarding friction themes', meta: '40 min · Q3 customer research.docx', done: false },
    { id: 3, title: 'Draft beta cohort guardrails', meta: '30 min · Product requirements v2.pdf', done: false },
    { id: 4, title: 'Share a one-page synthesis with the team', meta: '20 min · Your workspace', done: false }
  ])
  const [newTask, setNewTask] = useState('')

  const toggle = (id) => setTasks((current) =>
    current.map((task) => task.id === id ? { ...task, done: !task.done } : task)
  )

  const addTask = (event) => {
    event.preventDefault()
    if (!newTask.trim()) return
    setTasks((current) => [...current, { id: Date.now(), title: newTask.trim(), meta: 'Added just now · Your workspace', done: false }])
    setNewTask('')
  }

  return (
    <div className="planner-page">
      <PageIntro
        eyebrow="AI study / work planner"
        title="Make a plan you can keep."
        copy="Turn the knowledge in your library into a clear next sequence."
        actions={<Button icon={Sparkles}>Generate from docs</Button>}
      />

      <div className="planner-layout">
        <section className="planner-main">
          <div className="planner-date-bar">
            <button><ChevronLeft size={15} /></button>
            <div>
              <span>Today</span>
              <strong>Thursday · 18 September 2026</strong>
            </div>
            <button><ChevronRight size={15} /></button>
            <Tag tone="ready" dot>4 day streak</Tag>
          </div>

          <div className="planner-progress">
            <div>
              <span className="overline">Your focus path</span>
              <strong>{tasks.filter((task) => task.done).length} of {tasks.length} complete</strong>
            </div>
            <div className="large-progress"><i style={{ width: `${(tasks.filter((task) => task.done).length / tasks.length) * 100}%` }}></i></div>
          </div>

          <div className="planner-tasks">
            {tasks.map((task) => (
              <div key={task.id} className={`planner-task ${task.done ? 'planner-task-done' : ''}`}>
                <button className="task-check" onClick={() => toggle(task.id)}>{task.done && <Check size={13} />}</button>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.meta}</span>
                </div>
                <MoreHorizontal size={17} />
              </div>
            ))}
          </div>

          <form className="add-task-form" onSubmit={addTask}>
            <Plus size={17} />
            <input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task to your path…" />
            <button type="submit">Add</button>
          </form>
        </section>

        <aside className="planner-aside">
          <div className="planner-ai-card">
            <div className="planner-ai-orb"><Sparkles size={21} /></div>
            <span className="overline">A gentle nudge</span>
            <h2>Protect the first meaningful moment.</h2>
            <p>Your product brief and research notes both point to activation. Start there before widening the scope.</p>
            <button className="dark-text-link">Ask about this insight <ArrowUpRight size={14} /></button>
          </div>

          <div className="planner-source-card">
            <div className="panel-heading">
              <div>
                <span className="overline">Plan sources</span>
                <h3>{documents.length} documents available</h3>
              </div>
              <Database size={18} />
            </div>
            <div className="planner-source-list">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="planner-source-item">
                  <span className={`tiny-file tiny-file-${doc.color}`}><FileText size={11} /></span>
                  <span>{doc.name}</span>
                  <CheckCircle2 size={14} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
