import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

// Cliente para Supabase HOSPEDADO (Auth + Usuários)
export const createHostedClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_HOSTED_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_HOSTED_ANON_KEY!

  return createClient(supabaseUrl, supabaseKey)
}

// Cliente para componentes do lado do cliente (Auth)
export const createHostedComponentClient = () =>
  createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_HOSTED_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_HOSTED_ANON_KEY!,
  })
