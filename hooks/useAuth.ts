
"use client"

import React, { type ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string, nome: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    console.log("AuthProvider: Initializing...")

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("AuthProvider: Error getting session:", error)
        } else {
          console.log("AuthProvider: Initial session:", session?.user?.email || "No session")
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("AuthProvider: Error in getInitialSession:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed:", event, session?.user?.email || "No user")

      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_IN" && session?.user) {
        console.log("AuthProvider: User signed in, redirecting to dashboard...")
        router.push("/dashboard")
      } else if (event === "SIGNED_OUT") {
        console.log("AuthProvider: User signed out")
        setUser(null)
      }
    })

    return () => {
      console.log("AuthProvider: Cleaning up subscription...")
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthProvider: Attempting sign in for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("AuthProvider: Sign in error:", error)
        return { data: null, error }
      }

      console.log("AuthProvider: Sign in successful:", data.user?.email)
      // O redirecionamento será feito pelo onAuthStateChange
      return { data, error: null }
    } catch (error) {
      console.error("AuthProvider: Sign in error:", error)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      console.log("AuthProvider: Attempting sign up for:", email)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nome,
          plano: "free",
        }),
      })

      const result = await response.json()
      console.log("AuthProvider: Register response:", result)

      if (!response.ok) {
        return { data: null, error: { message: result.error || "Erro ao criar conta" } }
      }

      // Fazer login automaticamente após registro bem-sucedido
      console.log("AuthProvider: Registration successful, attempting auto-login...")
      const loginResult = await signIn(email, password)

      return loginResult
    } catch (error) {
      console.error("AuthProvider: Sign up error:", error)
      return { data: null, error: { message: "Erro inesperado ao criar conta" } }
    }
  }

  const signOut = async () => {
    try {
      console.log("AuthProvider: Signing out...")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("AuthProvider: Error signing out:", error)
      } else {
        console.log("AuthProvider: Successfully signed out")
        setUser(null)
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("AuthProvider: Error in signOut:", error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
