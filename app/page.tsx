import { createClient } from '@/lib/supabase/server'
import { AuthScreen } from '@/components/auth-screen'
import { TrustLedgerShell } from '@/components/trustledger-shell'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ? <TrustLedgerShell /> : <AuthScreen />
}
