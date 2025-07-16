"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("LoginForm: Starting login process for:", email)

    try {
      const { data, error } = await signIn(email, password)

      console.log("LoginForm: SignIn response:", { data: data?.user?.email, error: error?.message })

      if (error) {
        console.error("LoginForm: Login error:", error)
        setError(error.message || "Erro ao fazer login")
      } else if (data?.user) {
        console.log("LoginForm: Login successful, user authenticated:", data.user.email)
        console.log("LoginForm: Waiting for AuthProvider to handle redirect...")
        setSuccess(true)
        // O redirecionamento será feito pelo AuthProvider onAuthStateChange
      } else {
        console.error("LoginForm: No user returned from signIn")
        setError("Erro inesperado no login")
      }
    } catch (error) {
      console.error("LoginForm: Unexpected error:", error)
      setError("Erro inesperado ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo-ricardo.png"
              alt="R.I.C.A.R.D.O Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Fazer Login</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o R.I.C.A.R.D.O Prompt Builder
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Login realizado com sucesso! Redirecionando...
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : success ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Redirecionando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Criar conta
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
