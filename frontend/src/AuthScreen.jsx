import { useState } from 'react'
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, Sparkles, Users, Zap } from 'lucide-react'
import { api } from './lib/api.js'

const benefits = ['Unlimited projects and tasks', 'Kanban boards for every workflow', 'Team activity in one place']

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = mode === 'login' ? await api.login({ email: form.email, password: form.password }) : await api.register(form)
      localStorage.setItem('taskflow_token', response.token)
      onAuthenticated({ ...response, demo: false })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function tryDemo() {
    setLoading(true)
    setError('')
    try {
      const response = await api.login({ email: 'demo@taskflow.test', password: 'password123' })
      localStorage.setItem('taskflow_token', response.token)
      onAuthenticated({ ...response, demo: false })
    } catch {
      onAuthenticated({ demo: true, user: { name: 'Kaiqbal Faris' } })
    } finally {
      setLoading(false)
    }
  }


  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900 dark:bg-[#0c1020] dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[38px] border-white/10" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full border-[52px] border-white/10" />
          <div className="relative"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><Sparkles size={19} /></span><span className="text-xl font-bold tracking-tight">Task<span className="text-indigo-200">Flow</span></span></div><div className="mt-28 max-w-lg"><p className="mb-5 flex items-center gap-2 text-sm font-medium text-indigo-100"><Zap size={15} /> Work better, together</p><h1 className="text-5xl font-bold leading-[1.08] tracking-tight">Turn ideas into progress.</h1><p className="mt-6 max-w-md text-base leading-7 text-indigo-100">A focused workspace for teams who want clarity, momentum, and fewer things falling through the cracks.</p><div className="mt-10 space-y-4">{benefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 text-sm text-indigo-50"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20"><Check size={13} /></span>{benefit}</div>)}</div></div></div>
          <div className="relative flex items-center gap-3 text-xs text-indigo-100"><Users size={15} /><span>Built for modern product teams</span></div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10"><div className="w-full max-w-md"><div className="mb-10 flex items-center gap-3 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white"><Sparkles size={17} /></span><span className="text-lg font-bold">Task<span className="text-indigo-500">Flow</span></span></div><div className="mb-8"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Your workspace awaits</p><h2 className="text-3xl font-bold tracking-tight">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm text-slate-400">{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Start organizing your team with TaskFlow.'}</p></div><div className="mb-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800"><button onClick={() => { setMode('login'); setError('') }} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${mode === 'login' ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-400'}`}>Sign in</button><button onClick={() => { setMode('register'); setError('') }} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${mode === 'register' ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-400'}`}>Create account</button></div><form onSubmit={submit} className="auth-form space-y-4">{mode === 'register' && <Field label="Full name"><input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Kaiqbal" /></Field>}<Field label="Email"><div className="relative"><Mail size={16} className="absolute left-3 top-3.5 text-slate-400" /><input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" className="pl-10" /></div></Field><Field label="Password"><div className="relative"><LockKeyhole size={16} className="absolute left-3 top-3.5 text-slate-400" /><input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="At least 8 characters" className="pl-10 pr-10" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3.5 text-slate-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></Field>{mode === 'register' && <Field label="Confirm password"><input required minLength={8} type="password" value={form.password_confirmation} onChange={(event) => update('password_confirmation', event.target.value)} placeholder="Repeat your password" /></Field>}{error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60 dark:shadow-indigo-950">{loading ? 'Please wait...' : mode === 'login' ? 'Sign in to TaskFlow' : 'Create account'} {!loading && <ArrowRight size={16} />}</button></form><div className="my-6 flex items-center gap-3 text-[11px] text-slate-300"><span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />or<span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /></div><button onClick={tryDemo} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-300">Preview demo workspace</button><p className="mt-8 text-center text-[11px] leading-5 text-slate-400">By continuing, you agree to TaskFlow&apos;s terms and privacy policy.</p></div></section>
      </div>
    </main>
  )
}

function Field({ label, children }) {
  return <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}<div className="mt-2">{children}</div></label>
}
