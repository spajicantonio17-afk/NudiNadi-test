import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client (for Client Components)
// Uses @supabase/ssr which stores session in cookies — shared with server-side middleware
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton instance for client components
let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!browserClient) {
    browserClient = createClient()
  }
  return browserClient
}
