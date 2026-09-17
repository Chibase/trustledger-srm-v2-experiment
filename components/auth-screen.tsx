'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    const supabase = createClient()
    const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback` } })
    setBusy(false)
    if (result.error) setMessage(result.error.message)
    else setMessage(mode === 'signup' ? 'Check your email to confirm your account.' : 'Signed in. Refreshing…')
    if (mode === 'login' && !result.error) window.location.reload()
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] p-6"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">TrustLedger SRM · V2</p><h1 className="mt-3 text-2xl font-semibold text-slate-950">{mode === 'login' ? 'Sign in' : 'Create your account'}</h1><p className="mt-2 text-sm text-slate-500">Use email and password to access the Projects workspace.</p><label className="mt-6 block text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3" /></label><label className="mt-4 block text-sm font-medium">Password<input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3" /></label>{message && <p className="mt-4 text-sm text-slate-600" role="status">{message}</p>}<button disabled={busy} className="mt-6 h-11 w-full rounded-lg bg-[#147d76] font-semibold text-white disabled:opacity-60">{busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}</button><button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="mt-4 w-full text-sm font-medium text-teal-700">{mode === 'login' ? 'Need an account? Sign up' : 'Already registered? Sign in'}</button></form></main>
}
