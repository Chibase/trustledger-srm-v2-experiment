'use client'

import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'

type Field = { key: string; label: string; placeholder: string; type?: 'text' | 'number' | 'date'; required?: boolean }

export function RecordForm({ title, fields, onCancel, onSave }: { title: string; fields: Field[]; onCancel: () => void; onSave: (record: Record<string, string>) => void }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    const missing = fields.find((field) => field.required && !values[field.key]?.trim())
    if (missing) return setError(`${missing.label} is required.`)
    onSave(values)
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="record-form-title">
    <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between"><div><h2 id="record-form-title" className="text-lg font-semibold text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">Add a fictional prototype record.</p></div><button type="button" onClick={onCancel} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close form"><X size={18} /></button></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className="flex flex-col gap-1.5 text-sm font-medium text-slate-700"><span>{field.label}{field.required ? ' *' : ''}</span><input required={field.required} type={field.type ?? 'text'} value={values[field.key] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>)}</div>
      {error && <p className="mt-4 text-sm font-medium text-rose-600" role="alert">{error}</p>}
      <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="rounded-lg bg-[#147d76] px-4 py-2 text-sm font-semibold text-white hover:bg-[#106b65]">Save record</button></div>
    </form>
  </div>
}

export type { Field }
