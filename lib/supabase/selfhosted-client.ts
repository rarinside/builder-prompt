import { createClient } from "@supabase/supabase-js"

// Cliente para Supabase SELF-HOSTED (Prompts + Assinaturas)
export const createSelfHostedClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_SELFHOSTED_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SELFHOSTED_ANON_KEY!

  return createClient(supabaseUrl, supabaseKey)
}

// Cliente administrativo para self-hosted
export const createSelfHostedAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_SELFHOSTED_URL!
  const supabaseServiceKey = process.env.SUPABASE_SELFHOSTED_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Self-hosted Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
