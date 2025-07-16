import LoginForm from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - R.I.C.A.R.D.O Prompt Builder",
  description: "Faça login para acessar o construtor de prompts R.I.C.A.R.D.O",
}

export default function LoginPage() {
  return <LoginForm />
}
