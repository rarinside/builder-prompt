import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_HOSTED_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_HOSTED_ANON_KEY!,
  )
}
