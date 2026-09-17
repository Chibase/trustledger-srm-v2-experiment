export type Project = {
  id: number
  name: string
  area: string
  stage: string
  status: string
  description?: string
}

export type ProjectInput = Omit<Project, 'id'>

export interface ProjectRepository {
  list(): Project[]
  create(input: ProjectInput): Project
  update(id: number, input: ProjectInput): Project | null
  archive(id: number): boolean
  reset(): Project[]
}

const storageKey = 'trustledger.projects.v2.experimental'
const seedProjects: Project[] = [
  { id: 1, name: 'North Ridge Wind Farm', area: 'Mahlangu District', stage: 'Construction', status: 'On track', description: 'Renewable energy infrastructure programme' },
]

function readProjects(): Project[] {
  if (typeof window === 'undefined') return seedProjects
  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) as Project[] : seedProjects
  } catch {
    return seedProjects
  }
}

function writeProjects(projects: Project[]) {
  if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, JSON.stringify(projects))
}

export const localProjectRepository: ProjectRepository = {
  list() { return readProjects() },
  create(input) {
    const project = { ...input, id: Date.now() }
    writeProjects([...readProjects(), project])
    return project
  },
  update(id, input) {
    const project = { ...input, id }
    writeProjects(readProjects().map((item) => item.id === id ? project : item))
    return project
  },
  archive(id) {
    const current = readProjects()
    const next = current.filter((item) => item.id !== id)
    writeProjects(next)
    return next.length !== current.length
  },
  reset() {
    writeProjects(seedProjects)
    return seedProjects
  },
}

export function getSeedProjects() {
  return seedProjects.map((project) => ({ ...project }))
}

// Replace this adapter with a PostgreSQL/Drizzle or Frappe implementation after assessment.
export const projectRepository = localProjectRepository
