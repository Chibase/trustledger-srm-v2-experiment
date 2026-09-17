'use client'

import { useState } from 'react'
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  FileBarChart,
  FolderKanban,
  Gauge,
  Globe2,
  Handshake,
  LayoutDashboard,
  Menu,
  Network,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Geographic Areas', icon: Globe2 },
  { label: 'Stakeholders', icon: Users },
  { label: 'Governance Institutions', icon: Network },
  { label: 'Engagements', icon: Handshake },
  { label: 'Grievances', icon: AlertCircle },
  { label: 'Impact Monitoring', icon: Activity },
  { label: 'Reports', icon: FileBarChart },
  { label: 'Settings', icon: Settings },
]

const stats = [
  { label: 'Active Projects', value: '12', note: '+2 this quarter', icon: FolderKanban, color: 'teal' },
  { label: 'Registered Stakeholders', value: '1,284', note: '+8.4% vs last month', icon: Users, color: 'blue' },
  { label: 'Open Grievances', value: '38', note: '6 high priority', icon: AlertCircle, color: 'amber' },
  { label: 'Engagements This Month', value: '76', note: '91% completion rate', icon: Handshake, color: 'violet' },
]

const projects = [
  { name: 'North Ridge Wind Farm', location: 'Mahlangu District', stage: 'Construction', progress: 68, status: 'On track', tone: 'success' },
  { name: 'Cedar Valley Water Network', location: 'Kopano Municipality', stage: 'Pre-construction', progress: 42, status: 'At risk', tone: 'warning' },
  { name: 'Eastbank Solar Corridor', location: 'Tswelopele Region', stage: 'Planning', progress: 24, status: 'On track', tone: 'success' },
]

const activities = [
  { title: 'Community engagement logged', detail: 'North Ridge Wind Farm · Ward 4', time: '18 min ago', icon: Handshake, tone: 'teal' },
  { title: 'Grievance escalated', detail: 'Cedar Valley Water Network · GRV-0248', time: '1 hr ago', icon: AlertCircle, tone: 'amber' },
  { title: 'Stakeholder record updated', detail: 'Eastbank Solar Corridor · Institution', time: '3 hrs ago', icon: Users, tone: 'blue' },
  { title: 'Impact indicator verified', detail: 'North Ridge Wind Farm · Employment', time: 'Yesterday', icon: ShieldCheck, tone: 'violet' },
]

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const Icon = stat.icon
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${stat.color === 'teal' ? 'bg-teal-50 text-teal-700' : stat.color === 'blue' ? 'bg-blue-50 text-blue-700' : stat.color === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-violet-50 text-violet-700'}`}>
          <Icon size={19} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">{stat.note}</p>
    </div>
  )
}

export function TrustLedgerShell() {
  const [active, setActive] = useState('Dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')

  const pageTitle = active === 'Dashboard' ? 'Good morning, Alex' : active
  const pageDescription = active === 'Dashboard' ? "Here’s your stakeholder relations overview for today." : `Manage and monitor ${active.toLowerCase()} across your programmes.`

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-[#102a43] text-slate-200 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal-400 text-[#102a43]"><Gauge size={21} strokeWidth={2.5} /></div>
            <div><p className="text-[17px] font-semibold tracking-tight text-white">TrustLedger</p><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-teal-300">SRM · V2 Experimental</p></div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 lg:hidden" aria-label="Close navigation"><X size={20} /></button>
        </div>
        <nav className="flex-1 px-3 py-6" aria-label="Main navigation">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          <div className="flex flex-col gap-1">
            {navigation.map((item) => { const Icon = item.icon; const isActive = active === item.label; return <button key={item.label} onClick={() => { setActive(item.label); setMobileOpen(false) }} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${isActive ? 'bg-teal-400 font-semibold text-[#102a43]' : 'font-medium text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon size={17} aria-hidden="true" /><span>{item.label}</span></button> })}
          </div>
        </nav>
        <div className="border-t border-white/10 p-4"><div className="rounded-lg bg-white/5 p-3"><div className="flex items-center gap-2 text-xs font-medium text-teal-300"><ShieldCheck size={14} /> Prototype environment</div><p className="mt-1.5 text-[11px] leading-4 text-slate-400">Fictional sample data only. No live connections.</p></div></div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="text-slate-500 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button><div><p className="text-xs font-medium text-slate-400">TrustLedger SRM <span className="mx-1 text-slate-300">/</span> {active}</p><p className="mt-1 text-sm font-semibold text-slate-800">V2 Experimental Build</p></div></div>
          <div className="flex items-center gap-4"><div className="relative hidden md:block"><Search className="absolute left-3 top-2.5 text-slate-400" size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search workspace" className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100" aria-label="Search workspace" /></div><button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-teal-500" /></button><div className="hidden h-7 w-px bg-slate-200 sm:block" /><button className="flex items-center gap-2 rounded-lg p-1.5 pr-2 hover:bg-slate-50"><div className="flex size-8 items-center justify-center rounded-full bg-[#d9f0ed] text-xs font-bold text-[#147d76]">AM</div><div className="hidden text-left sm:block"><p className="text-xs font-semibold text-slate-800">Alex Morgan</p><p className="text-[10px] text-slate-400">Programme Lead</p></div><ChevronDown size={14} className="text-slate-400" /></button></div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-teal-700">Tuesday, 17 September 2026</p><h1 className="text-2xl font-semibold tracking-tight text-slate-950">{pageTitle}</h1><p className="mt-1 text-sm text-slate-500">{pageDescription}</p></div><button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#147d76] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#106b65]"><Plus size={16} /> Log activity</button></div>
          {active === 'Dashboard' ? <Dashboard /> : <ModuleEmptyState module={active} />}
        </main>
      </div>
    </div>
  )
}

function Dashboard() { return <div className="flex flex-col gap-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</div><div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-sm font-semibold text-slate-900">Project-status summary</h2><p className="mt-1 text-xs text-slate-500">Current delivery health across active projects</p></div><button className="text-xs font-semibold text-teal-700 hover:text-teal-800">View projects</button></div><div className="flex flex-col gap-5 p-5">{projects.map((project) => <div key={project.name}><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-800">{project.name}</p><p className="mt-1 text-xs text-slate-500">{project.location} · {project.stage}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${project.tone === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>{project.status}</span></div><div className="mt-3 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${project.tone === 'success' ? 'bg-teal-500' : 'bg-amber-400'}`} style={{ width: `${project.progress}%` }} /></div><span className="w-8 text-right text-xs font-semibold text-slate-500">{project.progress}%</span></div></div>)}</div></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-semibold text-slate-900">Grievance-status summary</h2><p className="mt-1 text-xs text-slate-500">Open cases by resolution stage</p></div><div className="flex items-center gap-6 p-5"><div className="relative flex size-32 shrink-0 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#f59e0b 0 18%, #14b8a6 18% 64%, #94a3b8 64% 100%)' }}><div className="flex size-20 flex-col items-center justify-center rounded-full bg-white"><span className="text-2xl font-semibold text-slate-900">38</span><span className="text-[10px] text-slate-400">total open</span></div></div><div className="flex flex-col gap-3 text-xs"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-teal-500" /><span className="text-slate-500">In progress</span><span className="ml-auto font-semibold text-slate-800">22</span></div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-amber-400" /><span className="text-slate-500">Escalated</span><span className="ml-auto font-semibold text-slate-800">7</span></div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-slate-400" /><span className="text-slate-500">Awaiting response</span><span className="ml-auto font-semibold text-slate-800">9</span></div></div></div></section></div><div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-sm font-semibold text-slate-900">Recent activities</h2><p className="mt-1 text-xs text-slate-500">Latest updates across your workspace</p></div><button className="text-xs font-semibold text-teal-700">View all</button></div><div className="divide-y divide-slate-100">{activities.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 px-5 py-4"><div className={`rounded-lg p-2 ${item.tone === 'teal' ? 'bg-teal-50 text-teal-700' : item.tone === 'amber' ? 'bg-amber-50 text-amber-700' : item.tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}><Icon size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{item.title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{item.detail}</p></div><span className="shrink-0 text-[11px] text-slate-400">{item.time}</span></div> })}</div></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-semibold text-slate-900">Impact-monitoring overview</h2><p className="mt-1 text-xs text-slate-500">Portfolio indicators this quarter</p></div><div className="flex flex-col gap-4 p-5"><ImpactRow label="Local employment" value="82%" note="of target achieved" progress={82} color="bg-teal-500" /><ImpactRow label="Community investment" value="74%" note="of target achieved" progress={74} color="bg-blue-500" /><ImpactRow label="Engagement coverage" value="91%" note="of active areas" progress={91} color="bg-violet-500" /></div><div className="border-t border-slate-100 px-5 py-3"><button className="flex items-center gap-2 text-xs font-semibold text-teal-700"><BarChart3 size={14} /> Open impact monitor</button></div></section></div></div> }
function ImpactRow({ label, value, note, progress, color }: { label: string; value: string; note: string; progress: number; color: string }) { return <div><div className="flex items-end justify-between"><div><p className="text-xs font-semibold text-slate-700">{label}</p><p className="mt-1 text-[11px] text-slate-400">{note}</p></div><span className="text-sm font-semibold text-slate-800">{value}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} /></div></div> }
function ModuleEmptyState({ module }: { module: string }) { return <div className="flex min-h-[480px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm"><div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><ClipboardList size={26} /></div><h2 className="text-lg font-semibold text-slate-900">No {module.toLowerCase()} records yet</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">This module is ready for your operational data. Add your first record to start building the TrustLedger workspace.</p><button className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#147d76] px-4 text-sm font-semibold text-white hover:bg-[#106b65]"><Plus size={16} /> Add {module.replace('Geographic Areas', 'area').replace('Governance Institutions', 'institution').replace('Impact Monitoring', 'indicator').replace('Reports', 'report').replace('Settings', 'configuration').replace('Projects', 'project').replace('Stakeholders', 'stakeholder').replace('Engagements', 'engagement').replace('Grievances', 'grievance').toLowerCase()}</button></div> }

export default TrustLedgerShell
