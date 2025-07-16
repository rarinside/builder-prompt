import RegisterForm from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Criar Conta - R.I.C.A.R.D.O Prompt Builder",
  description: "Crie sua conta para acessar o construtor de prompts R.I.C.A.R.D.O",
}

export default function RegisterPage() {
  return <RegisterForm />
}
