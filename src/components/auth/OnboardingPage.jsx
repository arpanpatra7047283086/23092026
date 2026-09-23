import React, { useState } from 'react'
import { X, Sparkles, CheckCircle2, ArrowLeft, Check, ArrowRight } from 'lucide-react'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'
import { submitProfileSetup } from '../../Actions/ProfileAction'

// These values match the backend's ProfileSetupQuestion definitions exactly.
const setupQuestions = [
  { key: 'role', prompt: 'What describes you best?', options: [['student', 'Student'], ['engineer', 'Engineer'], ['researcher', 'Researcher'], ['founder', 'Founder'], ['writer_creator', 'Writer / creator'], ['other', 'Something else']] },
  { key: 'experience_level', prompt: 'How would you describe your experience level?', options: [['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced'], ['expert', 'Expert']] },
  { key: 'work_style', prompt: 'How do you like to work?', options: [['deep_focus', 'Deep focus'], ['fast_exploration', 'Fast exploration'], ['team_collaboration', 'Team collaboration'], ['study_sprints', 'Study in sprints'], ['mix', 'A mix of everything']] },
  { key: 'primary_goal', prompt: 'What would you like to do first?', options: [['understand_research', 'Understand research'], ['study_smarter', 'Study smarter'], ['ship_a_project', 'Ship a project'], ['organize_knowledge', 'Organize my knowledge'], ['explore', 'Explore what is possible']] },
  { key: 'preferred_answer_style', prompt: 'How should Upolabdhi usually explain things?', options: [['concise_direct', 'Concise and direct'], ['clear_thoughtful', 'Clear and thoughtful'], ['detailed_teaching', 'Detailed and teaching-oriented'], ['academic_precise', 'Academic and precise']] },
]

export function OnboardingPage({ onComplete, onBack }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const current = setupQuestions[step]

  const select = (optionKey) => setAnswers((previous) => ({ ...previous, [current.key]: optionKey }))

  const next = async () => {
    if (step !== setupQuestions.length - 1) return setStep((value) => value + 1)

    setSubmitting(true)
    setError('')
    try {
      // Example submitted payload:
      // { answers: [{ question_key: 'role', option_key: 'student' }, ...] }
      const response = await submitProfileSetup(setupQuestions.map(({ key }) => ({
        question_key: key,
        option_key: answers[key],
      })))
      onComplete(response)
    } catch (err) {
      setError(err.message || 'Could not save your setup.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop onboarding-backdrop">
      <div className="onboarding-shell">
        <div className="onboarding-top"><Logo compact /><button className="icon-button" onClick={onBack}><X size={18} /></button></div>
        <div className="onboarding-progress"><span style={{ width: `${((step + 1) / setupQuestions.length) * 100}%` }}></span></div>
        <div className="onboarding-content">
          <div className="onboarding-heading"><span className="overline">Profile setup · {step + 1} of {setupQuestions.length}</span><h1>{current.prompt}</h1><p>Choose the option that describes you best.</p></div>
          <div className="choice-grid">
            {current.options.map(([id, label]) => (
              <button key={id} className={`choice-card ${answers[current.key] === id ? 'choice-card-active' : ''}`} onClick={() => select(id)}>
                <span>{label}</span>{answers[current.key] === id ? <CheckCircle2 size={17} /> : <span className="choice-empty"></span>}
              </button>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="onboarding-actions">
            <button className="back-link" onClick={() => step === 0 ? onBack() : setStep((value) => value - 1)}><ArrowLeft size={15} /> {step === 0 ? 'Cancel' : 'Back'}</button>
            <Button onClick={next} disabled={!answers[current.key] || submitting} icon={step === setupQuestions.length - 1 ? Check : ArrowRight} iconRight>{submitting ? 'Saving...' : step === setupQuestions.length - 1 ? 'Finish my setup' : 'Continue'}</Button>
          </div>
        </div>
        <div className="onboarding-note"><Sparkles size={15} /> Personalization stays in your workspace and can be changed later.</div>
      </div>
    </div>
  )
}
