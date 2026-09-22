import { useEffect, useMemo, useState } from 'react'
import AuthScreen from './AuthScreen.jsx'
import { api } from './lib/api.js'
import { CommentsPanel, ProjectsView, SettingsView, TeamView } from './CollaborationViews.jsx'
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Moon,
  Target,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react'

const initialTasks = [
  { id: 1, title: 'Design onboarding flow', project: 'Website Redesign', status: 'in-progress', priority: 'High', due: 'Today', assignee: 'AF', tone: 'indigo', comments: 4 },
  { id: 2, title: 'Update pricing page copy', project: 'Website Redesign', status: 'review', priority: 'Medium', due: 'Sep 24', assignee: 'NS', tone: 'rose', comments: 2 },
  { id: 3, title: 'Set up analytics events', project: 'Mobile App', status: 'backlog', priority: 'Low', due: 'Sep 26', assignee: 'MA', tone: 'amber', comments: 0 },
  { id: 4, title: 'Create empty states', project: 'Design System', status: 'done', priority: 'Medium', due: 'Sep 19', assignee: 'AF', tone: 'indigo', comments: 3 },
  { id: 5, title: 'Review authentication API', project: 'Mobile App', status: 'in-progress', priority: 'High', due: 'Sep 25', assignee: 'RD', tone: 'emerald', comments: 5 },
  { id: 6, title: 'Prepare launch checklist', project: 'Website Redesign', status: 'backlog', priority: 'Medium', due: 'Sep 28', assignee: 'NS', tone: 'rose', comments: 1 },
  { id: 7, title: 'QA responsive layouts', project: 'Design System', status: 'review', priority: 'Low', due: 'Sep 23', assignee: 'MA', tone: 'amber', comments: 2 },
  { id: 8, title: 'Refine hero messaging', project: 'Website Redesign', status: 'done', priority: 'High', due: 'Sep 19', assignee: 'NS', tone: 'rose', comments: 1 },
  { id: 9, title: 'Prototype workspace switcher', project: 'Mobile App', status: 'in-progress', priority: 'High', due: 'Sep 26', assignee: 'AF', tone: 'indigo', comments: 2 },
  { id: 10, title: 'Document color tokens', project: 'Design System', status: 'review', priority: 'Medium', due: 'Sep 24', assignee: 'RD', tone: 'emerald', comments: 1 },
]

const columns = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-400', soft: 'bg-slate-100 dark:bg-slate-800/70' },
  { id: 'in-progress', label: 'In progress', color: 'bg-indigo-500', soft: 'bg-indigo-50 dark:bg-indigo-950/30' },
  { id: 'review', label: 'In review', color: 'bg-amber-500', soft: 'bg-amber-50 dark:bg-amber-950/25' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500', soft: 'bg-emerald-50 dark:bg-emerald-950/25' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My tasks', icon: ListTodo, badge: '8' },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Team', icon: Users },
]

const projects = [
  { name: 'All projects', count: 24, color: 'bg-indigo-500' },
  { name: 'Website Redesign', count: 8, color: 'bg-violet-500' },
  { name: 'Mobile App', count: 10, color: 'bg-sky-500' },
  { name: 'Design System', count: 6, color: 'bg-emerald-500' },
]

const people = [
  { initials: 'AF', name: 'Aisyah F.', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200' },
  { initials: 'NS', name: 'Nadia S.', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200' },
  { initials: 'MA', name: 'Miko A.', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200' },
  { initials: 'RD', name: 'Raka D.', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200' },
]

const fallbackActivity = [
  { id: 'demo-1', action: 'task.status_changed', metadata: { title: 'Pricing page copy' }, user: { name: 'Nadia Putri' }, created_at: '2026-09-22T09:48:00Z' },
  { id: 'demo-2', action: 'comment.added', metadata: { title: 'Onboarding flow' }, user: { name: 'Aisyah Rahma' }, created_at: '2026-09-22T09:15:00Z' },
  { id: 'demo-3', action: 'task.completed', metadata: { title: 'API review' }, user: { name: 'Raka Aditya' }, created_at: '2026-09-22T07:00:00Z' },
]

const demoMembers = [
  { id: 'demo-kaiqbal', name: 'Kaiqbal Faris', email: 'demo@taskflow.test', pivot: { role: 'owner' } },
  { id: 'demo-nadia', name: 'Nadia Putri', email: 'nadia@taskflow.test', pivot: { role: 'admin' } },
  { id: 'demo-raka', name: 'Raka Aditya', email: 'raka@taskflow.test', pivot: { role: 'member' } },
  { id: 'demo-aisyah', name: 'Aisyah Rahma', email: 'aisyah@taskflow.test', pivot: { role: 'member' } },
]

const demoProjects = [
  { id: 'demo-website', name: 'Website Redesign', description: 'Refresh the marketing site with a clearer product story.', status: 'active', tasks_count: 4, completed_tasks_count: 1 },
  { id: 'demo-mobile', name: 'Mobile App', description: 'Bring the core planning workflow to a focused mobile experience.', status: 'active', tasks_count: 3, completed_tasks_count: 0 },
  { id: 'demo-system', name: 'Design System', description: 'Build reusable foundations for a consistent product experience.', status: 'active', tasks_count: 3, completed_tasks_count: 1 },
]

function initialsFromName(name = 'Kaiqbal') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function formatTaskDueDate(value) {
  if (!value) return 'No due date'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value))
}

function mapApiTask(task, projectName) {
  const rawDueDate = task.due_date ?? ''
  const dueDate = rawDueDate ? String(rawDueDate).slice(0, 10) : ''
  return {
    id: task.id,
    title: task.title,
    project: projectName,
    status: task.status,
    priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
    due: formatTaskDueDate(rawDueDate),
    dueDate,
    assignee: task.assignee ? initialsFromName(task.assignee.name) : 'KI',
    assigneeId: task.assignee_id ?? task.assignee?.id ?? null,
    assigneeName: task.assignee?.name ?? 'Unassigned',
    tone: 'indigo',
    comments: task.comments?.length ?? 0,
  }
}

function formatDashboardDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date)
}

function formatRelativeTime(value) {
  if (!value) return 'Recently'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

function activityCopy(entry) {
  const actor = entry.user?.name ?? 'A teammate'
  const title = entry.metadata?.title ?? entry.metadata?.name ?? 'a task'
  const subject = <span className="text-indigo-500">{title}</span>
  if (entry.action === 'task.completed') return <><span>{actor}</span> completed {subject}</>
  if (entry.action === 'comment.added') return <><span>{actor}</span> commented on {subject}</>
  if (entry.action === 'project.created') return <><span>{actor}</span> created {subject}</>
  if (entry.action === 'task.status_changed') return <><span>{actor}</span> updated {subject}</>
  return <><span>{actor}</span> updated {subject}</>
}

function Avatar({ initials, className = '' }) {
  return <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${className}`}>{initials}</span>
}

function Priority({ value }) {
  const styles = {
    High: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    Low: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  }
  return <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${styles[value]}`}>{value}</span>
}

function TaskCard({ task, onDragStart, onOpen }) {
  const assignee = people.find((person) => person.initials === task.assignee)
  return (
    <button
      draggable
      onDragStart={() => onDragStart(task.id)}
      onClick={() => onOpen(task)}
      className="group w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 dark:text-slate-100">{task.title}</span>
        <MoreHorizontal size={16} className="shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="mb-3 flex items-center gap-2 text-[11px] text-slate-400">
        <span className={`h-2 w-2 rounded-full ${task.tone === 'rose' ? 'bg-rose-400' : task.tone === 'amber' ? 'bg-amber-400' : task.tone === 'emerald' ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
        {task.project}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Priority value={task.priority} />
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><CalendarDays size={12} /> {task.due}</span>
          {task.comments > 0 && <span className="flex items-center gap-1"><MessageSquare size={12} /> {task.comments}</span>}
          <Avatar initials={task.assignee} className={assignee?.color ?? 'bg-slate-100 text-slate-600'} />
        </div>
      </div>
    </button>
  )
}

function StatCard({ icon: Icon, label, value, change, positive, tint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon size={19} /></div>
        <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'}`}>
          {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {change}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  )
}

function ActivityItem({ initials, color, children, time }) {
  return (
    <div className="flex gap-3">
      <Avatar initials={initials} className={color} />
      <div className="min-w-0 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-200">{children}</span><div className="mt-0.5 text-[11px] text-slate-400">{time}</div></div>
    </div>
  )
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('taskflow_theme') === 'dark')
  const [session, setSession] = useState(null)
  const [authChecked, setAuthChecked] = useState(() => !localStorage.getItem('taskflow_token'))
  const [apiContext, setApiContext] = useState(null)
  const [activity, setActivity] = useState([])
  const [comments, setComments] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [taskEditor, setTaskEditor] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [activeNav, setActiveNav] = useState('Overview')
  const [selectedProject, setSelectedProject] = useState('All projects')
  const [tasks, setTasks] = useState(initialTasks)
  const [draggedId, setDraggedId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', project: 'Website Redesign', priority: 'Medium', assignee: '', assigneeId: '', due: '2026-09-30' })

  useEffect(() => {
    localStorage.setItem('taskflow_theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token')
    if (!token) return
    api.me(token)
      .then((user) => setSession({ token, user, demo: false }))
      .catch(() => localStorage.removeItem('taskflow_token'))
      .finally(() => setAuthChecked(true))
  }, [])

  useEffect(() => {
    if (session?.demo) {
      const timer = window.setTimeout(() => {
        const demoWorkspace = { id: 'demo-workspace', name: 'Northstar Product Team', owner_id: 'demo-kaiqbal', members: demoMembers }
        setApiContext({ workspaces: [{ ...demoWorkspace, projects_count: demoProjects.length }], workspace: demoWorkspace, projects: demoProjects, activeProject: demoProjects[0] })
        setActivity(fallbackActivity)
        setSelectedProject('Website Redesign')
        setNewTask((current) => ({ ...current, project: 'Website Redesign', assigneeId: 'demo-nadia', assignee: 'NP' }))
        setTasks(initialTasks)
      }, 0)
      return () => window.clearTimeout(timer)
    }
    if (!session?.token) return undefined
    let cancelled = false
    api.workspaces(session.token)
      .then(async (workspaces) => {
        const summary = workspaces.find((workspace) => workspace.slug === 'northstar-product-team') ?? workspaces[0]
        if (!summary) return
        const [workspace, projectList, activityList] = await Promise.all([
          api.workspace(session.token, summary.id),
          api.projects(session.token, summary.id),
          api.activity(session.token, summary.id),
        ])
        const firstProject = projectList[0]
        if (cancelled) return
        setApiContext({ workspaces, workspace, projects: projectList, activeProject: firstProject ?? null })
        setActivity(activityList)
        setSelectedProject(firstProject?.name ?? 'All projects')
        const firstAssignee = workspace.members?.find((member) => member.id !== workspace.owner_id) ?? workspace.members?.[0]
        setNewTask((current) => ({ ...current, project: firstProject?.name ?? '', assigneeId: firstAssignee?.id ?? '', assignee: firstAssignee ? initialsFromName(firstAssignee.name) : '' }))
        if (!firstProject) { setTasks([]); return }
        const taskLists = await Promise.all(projectList.map(async (project) => ({ project, tasks: await api.tasks(session.token, workspace.id, project.id) })))
        if (cancelled) return
        setTasks(taskLists.flatMap(({ project, tasks: projectTasks }) => projectTasks.map((task) => mapApiTask(task, project.name))))
      })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [session])

  useEffect(() => {
    const taskProject = apiContext?.projects?.find((project) => project.name === selectedTask?.project) ?? apiContext?.activeProject
    if (!selectedTask || !session?.token || !taskProject) return
    api.comments(session.token, apiContext.workspace.id, taskProject.id, selectedTask.id)
      .then(setComments)
      .catch(() => setComments([]))
  }, [selectedTask, session, apiContext])

  const visibleTasks = useMemo(() => selectedProject === 'All projects' ? tasks : tasks.filter((task) => task.project === selectedProject), [selectedProject, tasks])
  const completed = tasks.filter((task) => task.status === 'done').length
  const overdue = tasks.filter((task) => task.dueDate && new Date(`${task.dueDate}T23:59:59`) < new Date() && task.status !== 'done').length
  const memberCount = apiContext?.workspace?.members?.length ?? 4
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  const projectOptions = apiContext?.projects?.length ? [{ name: 'All projects', count: tasks.length, color: 'bg-indigo-500' }, ...apiContext.projects.map((project) => ({ name: project.name, count: project.tasks_count ?? 0, color: 'bg-violet-500' }))] : projects
  const workspaceOptions = apiContext?.workspaces?.length ? apiContext.workspaces : apiContext?.workspace ? [apiContext.workspace] : []
  const memberOptions = apiContext?.workspace?.members?.map((member) => ({ id: member.id, name: member.name, initials: initialsFromName(member.name) })) ?? people.map((person) => ({ id: person.initials, name: person.name, initials: person.initials }))
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return { tasks: [], projects: [], members: [] }
    return {
      tasks: tasks.filter((task) => `${task.title} ${task.project}`.toLowerCase().includes(query)).slice(0, 6),
      projects: (apiContext?.projects ?? []).filter((project) => `${project.name} ${project.description ?? ''}`.toLowerCase().includes(query)).slice(0, 5),
      members: (apiContext?.workspace?.members ?? []).filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query)).slice(0, 5),
    }
  }, [searchQuery, tasks, apiContext])

  if (!authChecked) return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-sm text-slate-400 dark:bg-[#0c1020]">Loading TaskFlow...</div>
  if (!session) return <AuthScreen onAuthenticated={setSession} />

  async function moveTask(status) {
    if (draggedId === null) return
    const draggedTask = tasks.find((task) => task.id === draggedId)
    const taskProject = apiContext?.projects?.find((project) => project.name === draggedTask?.project) ?? apiContext?.activeProject
    setTasks((current) => current.map((task) => task.id === draggedId ? { ...task, status } : task))
    if (session?.token && taskProject) {
      await api.updateTask(session.token, apiContext.workspace.id, taskProject.id, draggedId, { status })
    }
    setDraggedId(null)
  }

  async function createTask(event) {
    event.preventDefault()
    if (!newTask.title.trim()) return
    const taskProject = apiContext?.projects?.find((project) => project.name === newTask.project) ?? apiContext?.activeProject
    if (session?.token && taskProject) {
      const created = await api.createTask(session.token, apiContext.workspace.id, taskProject.id, {
        title: newTask.title,
        priority: newTask.priority.toLowerCase(),
        status: 'backlog',
        assignee_id: newTask.assigneeId || null,
        due_date: /^\d{4}-\d{2}-\d{2}$/.test(newTask.due) ? newTask.due : null,
      })
      setTasks((current) => [...current, mapApiTask(created, taskProject.name)])
    } else {
      setTasks((current) => [...current, { id: Date.now(), ...newTask, status: 'backlog', comments: 0, tone: 'indigo' }])
    }
    const firstMember = apiContext?.workspace?.members?.find((member) => member.id !== apiContext.workspace.owner_id) ?? apiContext?.workspace?.members?.[0]
    setNewTask({ title: '', project: taskProject?.name ?? 'Website Redesign', priority: 'Medium', assignee: firstMember ? initialsFromName(firstMember.name) : '', assigneeId: firstMember?.id ?? '', due: '2026-09-30' })
    setModalOpen(false)
  }

  async function saveTask(event) {
    event.preventDefault()
    if (!taskEditor?.title.trim()) return
    const taskProject = apiContext?.projects?.find((project) => project.name === taskEditor.project) ?? apiContext?.activeProject
    const payload = { title: taskEditor.title, status: taskEditor.status, priority: taskEditor.priority.toLowerCase(), assignee_id: taskEditor.assigneeId || null, due_date: /^\d{4}-\d{2}-\d{2}$/.test(taskEditor.dueDate) ? taskEditor.dueDate : null }
    try {
      const updated = session?.token && taskProject ? await api.updateTask(session.token, apiContext.workspace.id, taskProject.id, taskEditor.id, payload) : { ...taskEditor, ...payload }
      setTasks((current) => current.map((task) => task.id === taskEditor.id ? { ...task, ...mapApiTask(updated, taskProject?.name ?? task.project) } : task))
      setTaskEditor(null)
    } catch (error) { window.alert(error.message) }
  }

  async function deleteTask(task) {
    const taskProject = apiContext?.projects?.find((project) => project.name === task.project) ?? apiContext?.activeProject
    if (!window.confirm(`Hapus task "${task.title}"?`)) return
    try {
      if (session?.token && taskProject) await api.deleteTask(session.token, apiContext.workspace.id, taskProject.id, task.id)
      setTasks((current) => current.filter((item) => item.id !== task.id))
      setSelectedTask(null)
    } catch (error) { window.alert(error.message) }
  }

  async function createProject(data) {
    if (!apiContext?.workspace) return
    if (!session?.token) {
      const created = { id: `demo-project-${Date.now()}`, ...data, status: 'active', tasks_count: 0, completed_tasks_count: 0 }
      setApiContext((current) => ({ ...current, projects: [...current.projects, created] }))
      return
    }
    const created = await api.createProject(session.token, apiContext.workspace.id, data)
    setApiContext((current) => ({ ...current, projects: [...current.projects, { ...created, tasks_count: 0, completed_tasks_count: 0 }] }))
  }

  async function updateProject(projectId, data) {
    if (!apiContext?.workspace) return
    if (!session?.token) {
      setApiContext((current) => ({ ...current, projects: current.projects.map((project) => project.id === projectId ? { ...project, ...data } : project) }))
      return
    }
    const previous = apiContext.projects.find((project) => project.id === projectId)
    const updated = await api.updateProject(session.token, apiContext.workspace.id, projectId, data)
    setApiContext((current) => ({ ...current, projects: current.projects.map((project) => project.id === projectId ? updated : project) }))
    setTasks((current) => current.map((task) => task.project === previous?.name ? { ...task, project: updated.name } : task))
    if (selectedProject === previous?.name) setSelectedProject(updated.name)
    setNewTask((current) => current.project === previous?.name ? { ...current, project: updated.name } : current)
  }

  async function deleteProject(projectId) {
    if (!apiContext?.workspace) return
    const deleted = apiContext.projects.find((project) => project.id === projectId)
    if (!session?.token) {
      setApiContext((current) => ({ ...current, projects: current.projects.filter((project) => project.id !== projectId) }))
    } else {
      await api.deleteProject(session.token, apiContext.workspace.id, projectId)
      setApiContext((current) => ({ ...current, projects: current.projects.filter((project) => project.id !== projectId) }))
    }
    setTasks((current) => current.filter((task) => task.project !== deleted?.name))
    if (selectedProject === deleted?.name) setSelectedProject('All projects')
  }

  async function inviteMember(email, role = 'member') {
    if (!apiContext?.workspace) return
    if (!session?.token) {
      const member = { id: `demo-member-${Date.now()}`, name: email.split('@')[0], email, pivot: { role } }
      setApiContext((current) => ({ ...current, workspace: { ...current.workspace, members: [...(current.workspace.members ?? []), member] } }))
      return
    }
    const updatedWorkspace = await api.addMember(session.token, apiContext.workspace.id, { email, role })
    setApiContext((current) => ({ ...current, workspace: updatedWorkspace }))
  }

  async function updateMemberRole(memberId, role) {
    if (!apiContext?.workspace) return
    if (!session?.token) {
      setApiContext((current) => ({ ...current, workspace: { ...current.workspace, members: current.workspace.members.map((member) => member.id === memberId ? { ...member, pivot: { ...member.pivot, role } } : member) } }))
      return
    }
    const updatedWorkspace = await api.updateMemberRole(session.token, apiContext.workspace.id, memberId, role)
    setApiContext((current) => ({ ...current, workspace: updatedWorkspace }))
  }

  async function createWorkspace(name) {
    if (!name.trim()) return
    if (!session?.token) {
      const created = { id: `demo-workspace-${Date.now()}`, name, projects_count: 0, members: apiContext?.workspace?.members ?? [] }
      setApiContext((current) => ({ ...current, workspaces: [...(current.workspaces ?? []), created] }))
      return
    }
    const created = await api.createWorkspace(session.token, { name })
    setApiContext((current) => ({ ...current, workspaces: [...(current.workspaces ?? []), { ...created, projects_count: 0 }] }))
  }

  async function selectWorkspace(workspaceId) {
    if (!apiContext?.workspace || workspaceId === apiContext.workspace.id) return
    if (!session?.token) {
      const target = apiContext.workspaces?.find((item) => item.id === workspaceId)
      if (target) setApiContext((current) => ({ ...current, workspace: { ...target, members: target.members ?? current.workspace.members }, projects: [], activeProject: null }))
      return
    }
    try {
      const [workspace, projectList, activityList] = await Promise.all([
        api.workspace(session.token, workspaceId),
        api.projects(session.token, workspaceId),
        api.activity(session.token, workspaceId),
      ])
      setApiContext((current) => ({ ...current, workspace, projects: projectList, activeProject: projectList[0] ?? null }))
      setActivity(activityList)
      setSelectedProject(projectList[0]?.name ?? 'All projects')
      const taskLists = await Promise.all(projectList.map(async (project) => ({ project, tasks: await api.tasks(session.token, workspace.id, project.id) })))
      setTasks(taskLists.flatMap(({ project, tasks: projectTasks }) => projectTasks.map((task) => mapApiTask(task, project.name))))
    } catch (error) { window.alert(error.message) }
  }

  async function updateWorkspace(name) {
    if (!apiContext?.workspace || !name.trim()) return
    if (!session?.token) {
      setApiContext((current) => ({ ...current, workspace: { ...current.workspace, name }, workspaces: current.workspaces?.map((workspace) => workspace.id === current.workspace.id ? { ...workspace, name } : workspace) }))
      return
    }
    const updated = await api.updateWorkspace(session.token, apiContext.workspace.id, { name })
    setApiContext((current) => ({ ...current, workspace: updated, workspaces: current.workspaces?.map((workspace) => workspace.id === updated.id ? { ...workspace, name: updated.name, slug: updated.slug } : workspace) }))
  }

  async function deleteWorkspace() {
    if (!apiContext?.workspace || !window.confirm(`Hapus workspace "${apiContext.workspace.name}" beserta semua project dan task di dalamnya?`)) return
    try {
      if (session?.token) await api.deleteWorkspace(session.token, apiContext.workspace.id)
      localStorage.removeItem('taskflow_token')
      window.location.reload()
    } catch (error) { window.alert(error.message) }
  }

  async function removeMember(memberId) {
    if (!apiContext?.workspace) return
    if (!session?.token) {
      setApiContext((current) => ({ ...current, workspace: { ...current.workspace, members: current.workspace.members.filter((member) => member.id !== memberId) } }))
      return
    }
    const updatedWorkspace = await api.removeMember(session.token, apiContext.workspace.id, memberId)
    setApiContext((current) => ({ ...current, workspace: updatedWorkspace }))
  }

  async function logout() {
    try { if (session?.token) await api.logout(session.token) } catch { /* session cleanup still proceeds */ }
    localStorage.removeItem('taskflow_token')
    setSession(null)
    setApiContext(null)
    setActivity([])
    setTasks(initialTasks)
    setAuthChecked(true)
  }

  async function addComment(event) {
    event.preventDefault()
    if (!commentText.trim() || !selectedTask) return
    const taskProject = apiContext?.projects?.find((project) => project.name === selectedTask.project) ?? apiContext?.activeProject
    if (session?.token && taskProject) {
      const comment = await api.addComment(session.token, apiContext.workspace.id, taskProject.id, selectedTask.id, { body: commentText })
      setComments((current) => [comment, ...current])
    } else {
      setComments((current) => [{ id: Date.now(), body: commentText, user: { name: session?.user?.name ?? 'Kaiqbal' } }, ...current])
    }
    setCommentText('')
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#f7f8fc] text-slate-900 transition-colors dark:bg-[#0c1020] dark:text-slate-100">
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform dark:border-slate-800 dark:bg-[#11162a] ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950"><Sparkles size={18} /></div>
            <span className="text-lg font-bold tracking-tight">Task<span className="text-indigo-500">Flow</span></span>
            <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-1 text-slate-400 lg:hidden"><X size={18} /></button>
          </div>

          <div className="mt-9 px-2"><p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
            <div className="relative"><button onClick={() => setWorkspaceMenuOpen((value) => !value)} aria-expanded={workspaceMenuOpen} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold dark:border-slate-700"><span className="flex min-w-0 items-center gap-2.5"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-900/50 dark:text-violet-200">{initialsFromName(apiContext?.workspace?.name ?? 'Product team').slice(0, 1)}</span><span className="truncate">{apiContext?.workspace?.name ?? 'Product team'}</span></span><ChevronDown size={15} className={`shrink-0 text-slate-400 transition ${workspaceMenuOpen ? 'rotate-180' : ''}`} /></button>{workspaceMenuOpen && <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">{workspaceOptions.map((workspace) => <button key={workspace.id} onClick={() => { selectWorkspace(workspace.id); setWorkspaceMenuOpen(false) }} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs ${workspace.id === apiContext?.workspace?.id ? 'bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}><span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-[10px] font-bold text-violet-600 dark:bg-violet-900/50 dark:text-violet-200">{initialsFromName(workspace.name).slice(0, 1)}</span><span className="truncate">{workspace.name}</span></button>)}<button onClick={() => { setActiveNav('Settings'); setWorkspaceMenuOpen(false) }} className="mt-1 w-full rounded-lg border-t border-slate-100 px-2.5 py-2 text-left text-[11px] font-semibold text-indigo-600 dark:border-slate-800 dark:text-indigo-300">Manage workspaces</button></div>}</div>
          </div>

          <nav className="mt-8 space-y-1 px-1">
            {navItems.map(({ label, icon: Icon, badge }) => <button key={label} onClick={() => { setActiveNav(label); setMobileOpen(false) }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeNav === label ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'}`}><span className="flex items-center gap-3"><Icon size={17} />{label}</span>{badge && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">{label === 'My tasks' ? tasks.length : badge}</span>}</button>)}
          </nav>

          <div className="mt-8 px-2"><div className="mb-3 flex items-center justify-between px-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Projects</p><button aria-label="Add project" onClick={() => { setActiveNav('Projects'); setMobileOpen(false) }} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-slate-800"><Plus size={15} /></button></div>
            <div className="space-y-1">{projectOptions.slice(1).map((project) => <button key={project.name} onClick={() => setSelectedProject(project.name)} className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs transition ${selectedProject === project.name ? 'bg-slate-100 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}><span className="flex items-center gap-2.5"><span className={`h-2 w-2 rounded-full ${project.color}`} />{project.name}</span><span className="text-[10px] text-slate-400">{project.count}</span></button>)}</div>
          </div>

          <div className="mt-auto space-y-1 px-1"><button onClick={() => setActiveNav('Settings')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 ${activeNav === 'Settings' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}><Settings size={17} />Settings</button><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60"><CircleHelp size={17} />Help center</button><div className="mt-3 flex items-center gap-3 border-t border-slate-100 px-2 pt-4 dark:border-slate-800"><Avatar initials={initialsFromName(session?.user?.name)} className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{session?.user?.name ?? 'Kaiqbal'}</p><p className="truncate text-[10px] text-slate-400">Product workspace</p></div><button aria-label="Sign out" title="Sign out" onClick={logout} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"><LogOut size={15} /></button></div></div>
        </aside>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-[#f7f8fc]/90 px-5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c1020]/90 sm:px-8">
            <div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-500 lg:hidden"><Menu size={20} /></button><div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><span>Workspace</span><span>/</span><span className="font-semibold text-slate-600 dark:text-slate-300">{activeNav}</span></div><h1 className="text-base font-bold sm:hidden">{activeNav}</h1></div>
            <div className="flex items-center gap-2 sm:gap-4"><button onClick={() => setSearchOpen(true)} className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex"><Search size={15} />Search<span className="ml-4 flex items-center gap-0.5 text-[10px]"><Command size={11} />K</span></button><div className="relative"><button aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)} className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Bell size={18} />{activity.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />}</button>{notificationsOpen && <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Notifications</h3><button onClick={() => setNotificationsOpen(false)} className="text-xs text-slate-400">Close</button></div><div className="space-y-3">{(activity.length ? activity.slice(0, 5) : fallbackActivity.slice(0, 3)).map((entry) => <button key={entry.id} onClick={() => { setNotificationsOpen(false); setActiveNav('Overview') }} className="block w-full rounded-xl p-2 text-left text-xs text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"><span className="font-semibold text-slate-700 dark:text-slate-200">{entry.user?.name ?? 'Teammate'}</span> {entry.action.replaceAll('.', ' ')}<span className="mt-1 block text-[10px] text-slate-400">{formatRelativeTime(entry.created_at)}</span></button>)}</div></div>}</div><button aria-label="Toggle dark mode" onClick={() => setDark((value) => !value)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-indigo-950"><Plus size={15} /> <span className="hidden sm:inline">New task</span></button></div>
          </header>

          <main className="mx-auto max-w-[1600px] p-5 sm:p-8">
            {activeNav === 'Overview' ? <>
              <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 flex items-center gap-2 text-xs font-medium text-indigo-500"><Zap size={13} /> {formatDashboardDate()}</p><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Good afternoon, {session?.user?.name ?? 'Kaiqbal'} <span className="inline-block origin-bottom-right animate-[wiggle_1.5s_ease-in-out_infinite]">👋</span></h2><p className="mt-2 text-sm text-slate-400">Here&apos;s what&apos;s happening across your workspace today.</p></div><button className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><CalendarDays size={15} /> This week <ChevronDown size={14} /></button></section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Target} label="Total tasks" value={tasks.length.toString().padStart(2, '0')} change="Live" positive tint="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300" /><StatCard icon={CheckCircle2} label="Completed tasks" value={completed.toString().padStart(2, '0')} change={tasks.length ? `${Math.round((completed / tasks.length) * 100)}%` : '0%'} positive tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300" /><StatCard icon={Clock3} label="Overdue tasks" value={overdue.toString().padStart(2, '0')} change={overdue ? 'Needs focus' : 'On track'} positive={!overdue} tint="bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300" /><StatCard icon={Users} label="Active members" value={memberCount.toString().padStart(2, '0')} change="Workspace" positive tint="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300" /></section>

              <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
                <div className="min-w-0"><div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="text-base font-bold">Task overview</h3><p className="mt-1 text-xs text-slate-400">Drag and drop tasks to update their status.</p></div><div className="flex items-center gap-2"><button onClick={() => setSelectedProject('All projects')} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><span className="h-2 w-2 rounded-full bg-indigo-500" />{selectedProject}<ChevronDown size={14} /></button><button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 dark:border-slate-700 dark:bg-slate-900"><MoreHorizontal size={16} /></button></div></div>
                  <div className="grid gap-3 overflow-x-auto pb-2 md:grid-cols-2 2xl:grid-cols-4">{columns.map((column) => <div key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={() => moveTask(column.id)} className={`min-h-[325px] min-w-[255px] rounded-2xl p-3 ${column.soft}`}><div className="mb-3 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${column.color}`} /><span className="text-xs font-bold text-slate-600 dark:text-slate-300">{column.label}</span><span className="text-[10px] font-semibold text-slate-400">{visibleTasks.filter((task) => task.status === column.id).length}</span></div><button onClick={() => setModalOpen(true)} className="rounded-md p-1 text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/60"><Plus size={15} /></button></div><div className="space-y-2.5">{visibleTasks.filter((task) => task.status === column.id).map((task) => <TaskCard key={task.id} task={task} onDragStart={setDraggedId} onOpen={setSelectedTask} />)}</div></div>)}</div>
                </div>

                <aside className="space-y-6"><div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><div className="mb-5 flex items-center justify-between"><h3 className="text-sm font-bold">Sprint progress</h3><button className="text-slate-400"><MoreHorizontal size={17} /></button></div><div className="flex items-center gap-5"><div className="relative h-24 w-24 shrink-0 rounded-full" style={{ background: `conic-gradient(#6366f1 ${progress}%, #e8eaf2 0)` }}><div className="absolute inset-[7px] flex items-center justify-center rounded-full bg-white dark:bg-slate-900"><span className="text-xl font-bold">{progress}%</span></div></div><div><p className="text-xs text-slate-400">Sprint 12</p><p className="mt-1 text-sm font-semibold">Product polish</p><p className="mt-2 text-[11px] text-slate-400">{completed} of {tasks.length} tasks complete</p></div></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] dark:border-slate-800"><span className="text-slate-400">Ends in</span><span className="font-semibold text-slate-700 dark:text-slate-200">5 days</span></div></div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><div className="mb-5 flex items-center justify-between"><h3 className="text-sm font-bold">Recent activity</h3><button className="text-xs font-semibold text-indigo-500">View all</button></div><div className="space-y-4">{(activity.length ? activity.slice(0, 4) : fallbackActivity).map((entry) => <ActivityItem key={entry.id} initials={initialsFromName(entry.user?.name)} color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200" time={formatRelativeTime(entry.created_at)}>{activityCopy(entry)}</ActivityItem>)}</div></div></aside>
              </section>
            </> : activeNav === 'Projects' ? <ProjectsView projects={apiContext?.projects ?? []} activity={activity} onCreateProject={createProject} onUpdateProject={updateProject} onDeleteProject={deleteProject} /> : activeNav === 'Team' ? <TeamView members={apiContext?.workspace?.members ?? []} onInvite={inviteMember} onUpdateRole={updateMemberRole} onRemoveMember={removeMember} /> : activeNav === 'Settings' ? <SettingsView dark={dark} onToggleDark={() => setDark((value) => !value)} session={session} workspace={apiContext?.workspace} workspaces={apiContext?.workspaces ?? []} onCreateWorkspace={createWorkspace} onSelectWorkspace={selectWorkspace} onUpdateWorkspace={updateWorkspace} onDeleteWorkspace={deleteWorkspace} onLogout={logout} /> : <section className="flex min-h-[calc(100vh-180px)] items-center justify-center"><div className="max-w-md text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"><BarChart3 size={25} /></div><h2 className="text-xl font-bold">{activeNav}</h2><p className="mt-2 text-sm text-slate-400">This workspace view is ready for the next implementation stage.</p><button onClick={() => setActiveNav('Overview')} className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">Back to overview</button></div></section>}
          </main>
        </div>

        {selectedTask && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={() => setSelectedTask(null)}><div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">Task details</p><h3 className="mt-2 text-xl font-bold">{selectedTask.title}</h3></div><button aria-label="Close task details" onClick={() => setSelectedTask(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><p className="text-[10px] uppercase text-slate-400">Project</p><p className="mt-1 text-sm font-semibold">{selectedTask.project}</p></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><p className="text-[10px] uppercase text-slate-400">Due date</p><p className="mt-1 text-sm font-semibold">{selectedTask.due}</p></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><p className="text-[10px] uppercase text-slate-400">Priority</p><div className="mt-1"><Priority value={selectedTask.priority} /></div></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><p className="text-[10px] uppercase text-slate-400">Status</p><p className="mt-1 text-sm font-semibold capitalize">{selectedTask.status.replace('-', ' ')}</p></div></div><CommentsPanel comments={comments} value={commentText} onChange={setCommentText} onSubmit={addComment} /><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800"><span className="flex items-center gap-2 text-xs text-slate-400"><MessageSquare size={14} /> {comments.length || selectedTask.comments} comments</span><div className="flex items-center gap-2"><button onClick={() => { setTaskEditor({ id: selectedTask.id, title: selectedTask.title, project: selectedTask.project, status: selectedTask.status, priority: selectedTask.priority, assigneeId: selectedTask.assigneeId ?? '', dueDate: selectedTask.dueDate ?? '' }); setSelectedTask(null) }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"><Pencil size={13} className="mr-1 inline" />Edit</button><button onClick={() => deleteTask(selectedTask)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 dark:border-rose-900/60"><Trash2 size={13} className="mr-1 inline" />Delete</button><button onClick={() => setSelectedTask(null)} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">Done</button></div></div></div></div>}
        {searchOpen && <div className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-950/40 p-4 pt-24 backdrop-blur-sm" onClick={() => setSearchOpen(false)}><div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}><div className="flex items-center gap-3"><Search size={18} className="text-slate-400" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search tasks, projects, or members..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" /><button onClick={() => setSearchOpen(false)} className="text-xs text-slate-400">Esc</button></div>{searchQuery.trim() ? <div className="mt-5 space-y-4">{searchResults.tasks.length > 0 && <div><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tasks</p>{searchResults.tasks.map((task) => <button key={`task-${task.id}`} onClick={() => { setSelectedTask(task); setSearchOpen(false) }} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800"><span className="font-semibold">{task.title}</span><span className="text-slate-400">{task.project}</span></button>)}</div>}{searchResults.projects.length > 0 && <div><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Projects</p>{searchResults.projects.map((project) => <button key={`project-${project.id}`} onClick={() => { setSelectedProject(project.name); setActiveNav('Overview'); setSearchOpen(false) }} className="block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">{project.name}</button>)}</div>}{searchResults.members.length > 0 && <div><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Members</p>{searchResults.members.map((member) => <button key={`member-${member.id}`} onClick={() => { setActiveNav('Team'); setSearchOpen(false) }} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800"><span className="font-semibold">{member.name}</span><span className="text-slate-400">{member.email}</span></button>)}</div>}{!searchResults.tasks.length && !searchResults.projects.length && !searchResults.members.length && <p className="py-6 text-center text-xs text-slate-400">No results found.</p>}</div> : <p className="mt-5 text-xs text-slate-400">Search across the current workspace.</p>}</div></div>}
        {taskEditor && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={() => setTaskEditor(null)}><form onSubmit={saveTask} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">Edit task</p><h3 className="mt-2 text-xl font-bold">Correct task details</h3></div><button type="button" onClick={() => setTaskEditor(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button></div><label className="mt-6 block text-xs font-semibold text-slate-600 dark:text-slate-300">Task title<input required value={taskEditor.title} onChange={(event) => setTaskEditor({ ...taskEditor, title: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800/70" /></label><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Status<select value={taskEditor.status} onChange={(event) => setTaskEditor({ ...taskEditor, status: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70"><option value="backlog">Backlog</option><option value="in-progress">In progress</option><option value="review">In review</option><option value="done">Done</option></select></label><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Priority<select value={taskEditor.priority} onChange={(event) => setTaskEditor({ ...taskEditor, priority: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70"><option>High</option><option>Medium</option><option>Low</option></select></label></div><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Assignee<select value={taskEditor.assigneeId ?? ''} onChange={(event) => setTaskEditor({ ...taskEditor, assigneeId: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70"><option value="">Unassigned</option>{memberOptions.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Due date<input type="date" value={taskEditor.dueDate ?? ''} onChange={(event) => setTaskEditor({ ...taskEditor, dueDate: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70" /></label></div><button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white"><Pencil size={16} /> Save task</button></form></div>}
        {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={() => setModalOpen(false)}><form onSubmit={createTask} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">Create task</p><h3 className="mt-2 text-xl font-bold">Add something new</h3></div><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button></div><label className="mt-6 block text-xs font-semibold text-slate-600 dark:text-slate-300">Task title<input autoFocus value={newTask.title} onChange={(event) => setNewTask({ ...newTask, title: event.target.value })} placeholder="e.g. Add empty state illustrations" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/70 dark:focus:ring-indigo-950" /></label><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Project<select value={newTask.project} onChange={(event) => setNewTask({ ...newTask, project: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70">{projectOptions.slice(1).map((project) => <option key={project.name}>{project.name}</option>)}</select></label><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Priority<select value={newTask.priority} onChange={(event) => setNewTask({ ...newTask, priority: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70"><option>High</option><option>Medium</option><option>Low</option></select></label></div><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Assignee<select value={newTask.assigneeId} onChange={(event) => { const member = memberOptions.find((item) => String(item.id) === event.target.value); setNewTask({ ...newTask, assigneeId: event.target.value, assignee: member?.initials ?? '' }) }} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70"><option value="">Unassigned</option>{memberOptions.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Due date<input value={newTask.due} onChange={(event) => setNewTask({ ...newTask, due: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none dark:border-slate-700 dark:bg-slate-800/70" /></label></div><button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-indigo-950"><Plus size={16} /> Create task</button></form></div>}
      </div>
    </div>
  )
}

export default App
