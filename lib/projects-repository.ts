import { createClient as createSupabaseClient } from '@/lib/supabase/client'

export type Project = {
  id: string | number
  name: string
  area: string
  stage: string
  status: string
  description?: string
  archived_at?: string | null
}

export type ProjectInput = Omit<Project, 'id' | 'archived_at'>

export interface ProjectRepository {
  list(): Promise<Project[]>
  create(input: ProjectInput): Promise<Project>
  update(id: string | number, input: ProjectInput): Promise<Project | null>
  archive(id: string | number): Promise<boolean>
  reset(): Promise<Project[]>
}

const storageKey = 'trustledger.projects.v2.experimental'
const seedProjects: Project[] = [{ id: 1, name: 'North Ridge Wind Farm', area: 'Mahlangu District', stage: 'Construction', status: 'On track', description: 'Renewable energy infrastructure programme' }]

function readProjects(): Project[] {
  if (typeof window === 'undefined') return seedProjects
  try { const stored = window.localStorage.getItem(storageKey); return stored ? JSON.parse(stored) : seedProjects } catch { return seedProjects }
}
function writeProjects(projects: Project[]) { if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, JSON.stringify(projects)) }

export const localProjectRepository: ProjectRepository = {
  async list() { return readProjects() },
  async create(input) { const project = { ...input, id: Date.now() }; writeProjects([...readProjects(), project]); return project },
  async update(id, input) { const project = { ...input, id }; writeProjects(readProjects().map((item) => String(item.id) === String(id) ? project : item)); return project },
  async archive(id) { const current = readProjects(); const next = current.filter((item) => String(item.id) !== String(id)); writeProjects(next); return next.length !== current.length },
  async reset() { writeProjects(seedProjects); return seedProjects },
}

export function getSeedProjects() { return seedProjects.map((project) => ({ ...project })) }

export const supabaseProjectRepository: ProjectRepository = {
  async list() {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from('projects').select('id,name,geographic_area,stage,status,description,archived_at').is('archived_at', null).order('updated_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((item) => ({ id: item.id, name: item.name, area: item.geographic_area ?? '', stage: item.stage, status: item.status, description: item.description ?? undefined, archived_at: item.archived_at }))
  },
  async create(input) {
    const supabase = createSupabaseClient(); const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error('Authentication required')
    const { data, error } = await supabase.from('projects').insert({ name: input.name, geographic_area: input.area, stage: input.stage, status: input.status, description: input.description, created_by: auth.user.id }).select('id,name,geographic_area,stage,status,description,archived_at').single()
    if (error) throw error
    return { id: data.id, name: data.name, area: data.geographic_area ?? '', stage: data.stage, status: data.status, description: data.description ?? undefined, archived_at: data.archived_at }
  },
  async update(id, input) {
    const supabase = createSupabaseClient(); const { data, error } = await supabase.from('projects').update({ name: input.name, geographic_area: input.area, stage: input.stage, status: input.status, description: input.description }).eq('id', id).select('id,name,geographic_area,stage,status,description,archived_at').maybeSingle()
    if (error) throw error
    return data ? { id: data.id, name: data.name, area: data.geographic_area ?? '', stage: data.stage, status: data.status, description: data.description ?? undefined, archived_at: data.archived_at } : null
  },
  async archive(id) { const supabase = createSupabaseClient(); const { error } = await supabase.from('projects').update({ archived_at: new Date().toISOString() }).eq('id', id); if (error) throw error; return true },
  async reset() { return this.list() },
}

export const projectRepository = supabaseProjectRepository
