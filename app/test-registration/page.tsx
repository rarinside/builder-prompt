import TestRegistrationButton from "@/components/test-registration-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teste de Cadastro - R.I.C.A.R.D.O",
  description: "Testar sistema de cadastro após migração",
}

export default function TestRegistrationPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <TestRegistrationButton />
    </div>
  )
}
