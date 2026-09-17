'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function OrganisationContext() {
  const [organisation, setOrganisation] = useState<{ id: string; name: string } | null>(null)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { const supabase = createClient(); void supabase.from('organisation_memberships').select('organisation_id, organisations(id,name)').eq('status', 'active').limit(1).maybeSingle().then(({ data }) => { const org = data?.organisations as { id: string; name: string } | null; if (org) setOrganisation(org) }) }, [])
  async function bootstrap() { setBusy(true); setError(''); const { data, error: rpcError } = await createClient().rpc('bootstrap_first_organisation', { p_name: name }); setBusy(false); if (rpcError) setError(rpcError.message); else if (data) setOrganisation({ id: data.id, name: data.name }) }
  if (organisation) return <div className="mb-6 flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50 px-4 py-3"><div><p className="text-xs font-medium uppercase tracking-wide text-teal-700">Current organisation</p><p className="mt-1 text-sm font-semibold text-slate-900">{organisation.name}</p></div><button onClick={() => createClient().auth.signOut().then(() => window.location.reload())} className="text-sm font-semibold text-teal-700">Sign out</button></div>
  return <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-slate-900">Set up your first organisation</p><p className="mt-1 text-sm text-slate-600">Projects are isolated by organisation membership.</p><div className="mt-3 flex gap-2"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Organisation name" className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm" /><button disabled={busy || !name.trim()} onClick={bootstrap} className="rounded-lg bg-[#147d76] px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Creating…' : 'Create'}</button></div>{error && <p className="mt-2 text-sm text-rose-700" role="alert">{error}</p>}</div>
}
