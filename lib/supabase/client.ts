import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://missing-supabase-url.invalid',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'missing-supabase-key',
    )
  }
  return client
}

export const getRedirectUrl = () =>
  process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`

export type SupabaseClient = ReturnType<typeof createClient>

export type Database = {
  public: {
    Tables: {
      projects: { Row: Project; Insert: ProjectInsert; Update: Partial<ProjectInsert> }
      organisations: { Row: Organisation; Insert: OrganisationInsert; Update: Partial<OrganisationInsert> }
      organisation_memberships: { Row: Membership; Insert: MembershipInsert; Update: Partial<MembershipInsert> }
      profiles: { Row: Profile; Insert: ProfileInsert; Update: Partial<ProfileInsert> }
    }
  }
}

export type Project = { id: string; organisation_id: string; name: string; project_code: string; description: string | null; status: 'planning' | 'active' | 'on_hold' | 'completed'; location: string | null; start_date: string | null; end_date: string | null; created_at: string; updated_at: string; archived_at: string | null }
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'archived_at'> & { archived_at?: string | null }
export type Organisation = { id: string; name: string; slug: string; created_by: string; created_at: string; updated_at: string }
export type OrganisationInsert = Omit<Organisation, 'id' | 'created_at' | 'updated_at'>
export type Membership = { organisation_id: string; user_id: string; role: 'admin' | 'member'; created_at: string }
export type MembershipInsert = Omit<Membership, 'created_at'>
export type Profile = { id: string; full_name: string | null; created_at: string; updated_at: string }
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>
