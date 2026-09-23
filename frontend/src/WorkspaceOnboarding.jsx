import { useState } from 'react'
import { ArrowRight, Building2, CheckCircle2, KeyRound, LogOut, Sparkles, Users } from 'lucide-react'

export default function WorkspaceOnboarding({ user, onCreateWorkspace, onJoinWorkspace, onLogout }) {
  const [mode, setMode] = useState('create')
  const [workspaceName, setWorkspaceName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    const value = mode === 'create' ? workspaceName.trim() : joinCode.trim().toUpperCase()
    if (!value) return
    setLoading(true)
    setError('')
    try {
      if (mode === 'create') await onCreateWorkspace(value)
      else await onJoinWorkspace(value)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-5 py-10 text-slate-900 dark:bg-[#0c1020] dark:text-slate-100 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white sm:p-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-white/10" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full border-[38px] border-white/10" />
            <div className="relative flex h-full flex-col justify-between gap-16">
              <div>
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Sparkles size={19} /></span><span className="text-xl font-bold tracking-tight">Task<span className="text-indigo-200">Flow</span></span></div>
                <p className="mt-16 text-sm font-medium text-indigo-100">Welcome, {user?.name ?? 'there'}.</p>
                <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight">Start with a workspace that fits your team.</h1>
                <p className="mt-5 max-w-sm text-sm leading-6 text-indigo-100">Create a new workspace for your team, or join an existing one with its unique code.</p>
              </div>
              <div className="relative space-y-3 text-sm text-indigo-50"><div className="flex items-center gap-3"><CheckCircle2 size={17} /> Creator becomes the workspace owner</div><div className="flex items-center gap-3"><CheckCircle2 size={17} /> Joiners start as regular members</div><div className="flex items-center gap-3"><CheckCircle2 size={17} /> Keep each team in its own workspace</div></div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Workspace setup</p><h2 className="mt-3 text-2xl font-bold tracking-tight">Where do you want to work?</h2><p className="mt-2 text-sm text-slate-400">You can create one or join a team you already belong to.</p></div><button onClick={onLogout} className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"><LogOut size={14} /> Sign out</button></div>
            <div className="mt-8 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"><button onClick={() => { setMode('create'); setError('') }} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${mode === 'create' ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-400'}`}><Building2 size={14} /> Create workspace</button><button onClick={() => { setMode('join'); setError('') }} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${mode === 'join' ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-400'}`}><Users size={14} /> Join workspace</button></div>
            <form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">{mode === 'create' ? 'Workspace name' : 'Workspace join code'}<div className="relative mt-2"><span className="absolute left-3 top-3.5 text-slate-400">{mode === 'create' ? <Building2 size={16} /> : <KeyRound size={16} />}</span><input required autoFocus value={mode === 'create' ? workspaceName : joinCode} onChange={(event) => mode === 'create' ? setWorkspaceName(event.target.value) : setJoinCode(event.target.value.toUpperCase())} maxLength={mode === 'create' ? 100 : 8} placeholder={mode === 'create' ? 'e.g. Northstar Product Team' : 'e.g. 4FJ8K2LM'} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/70 dark:focus:ring-indigo-950" /></div></label>{mode === 'join' && <p className="text-xs leading-5 text-slate-400">Ask your workspace owner for the 8-character code. You will join as a member automatically.</p>}{error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60 dark:shadow-indigo-950">{loading ? 'Please wait...' : mode === 'create' ? 'Create workspace' : 'Join workspace'} {!loading && <ArrowRight size={16} />}</button></form>
          </section>
        </div>
      </div>
    </main>
  )
}
