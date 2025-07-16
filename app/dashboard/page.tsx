"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, MoreVertical, Edit3, Copy, Trash2, TrendingUp, Eye, Share2, FileText, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { usePrompts } from "@/hooks/usePrompts"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const analyticsData = [
  { date: "Jan 8", prompts: 2 },
  { date: "Jan 9", prompts: 4 },
  { date: "Jan 10", prompts: 3 },
  { date: "Jan 11", prompts: 6 },
  { date: "Jan 12", prompts: 5 },
  { date: "Jan 13", prompts: 8 },
  { date: "Jan 14", prompts: 7 },
  { date: "Jan 15", prompts: 9 },
]

const categoryData = [
  { name: "Marketing", value: 35, color: "#3B82F6" },
  { name: "Vendas", value: 25, color: "#10B981" },
  { name: "Conteúdo", value: 20, color: "#F59E0B" },
  { name: "RH", value: 12, color: "#EF4444" },
  { name: "Finanças", value: 8, color: "#8B5CF6" },
]

const qualityData = [
  { range: "90-100", count: 12 },
  { range: "80-89", count: 18 },
  { range: "70-79", count: 8 },
  { range: "60-69", count: 3 },
  { range: "50-59", count: 1 },
]

// Função para extrair o primeiro nome do email
function getFirstNameFromEmail(email: string): string {
  const localPart = email.split("@")[0]
  const nameParts = localPart.split(".")
  return nameParts[0] || localPart
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { prompts, loading: promptsLoading, error: promptsError, deletePrompt } = usePrompts()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const firstName = user?.email ? getFirstNameFromEmail(user.email) : "Usuário"
  const totalPrompts = prompts.length
  const promptsThisWeek = prompts.filter((prompt) => {
    const promptDate = new Date(prompt.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return promptDate >= weekAgo
  }).length

  const averageScore = totalPrompts > 0 ? 84 : 0

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("Dashboard: Component mounted, user:", user?.email || "No user", "loading:", loading)

    if (!loading && !user) {
      console.log("Dashboard: No user found, redirecting to login...")
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const getFirstName = (email: string) => {
    if (email.includes("@")) {
      const username = email.split("@")[0]
      // Se o username contém ponto, pega a primeira parte
      if (username.includes(".")) {
        return username.split(".")[0]
      }
      return username
    }
    return email
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.prompt_original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.prompt_sugerido.toLowerCase().includes(searchTerm.toLowerCase())
    // Por enquanto não temos categorias nos prompts reais, então retorna todos
    return matchesSearch
  })

  const togglePromptSelection = (id: string) => {
    setSelectedPrompts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleDeletePrompt = async (promptId: string) => {
    const result = await deletePrompt(promptId)
    if (!result.success) {
      console.error("Error deleting prompt:", result.error)
    }
  }

  const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      let startTime: number
      let animationFrame: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * value))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }, [value, duration])

    return <span>{count}</span>
  }

  // Show loading while checking auth
  if (loading) {
    console.log("Dashboard: Still loading...")
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Carregando...</h3>
          <p className="text-slate-600">Verificando autenticação</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log("Dashboard: No user, showing loading...")
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Redirecionando...</h3>
          <p className="text-slate-600">Você será redirecionado para o login</p>
        </div>
      </div>
    )
  }

  console.log("Dashboard: Rendering dashboard for user:", user.email)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Olá, {firstName}!</h1>
              <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/builder">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Prompt
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Prompts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : totalPrompts}</div>
              <p className="text-xs text-muted-foreground">Prompts salvos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Últimos 7 dias</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : promptsThisWeek}</div>
              <p className="text-xs text-muted-foreground">Novos prompts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Qualidade dos prompts</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Prompts */}
        <Card>
          <CardHeader>
            <CardTitle>Prompts Recentes</CardTitle>
            <CardDescription>Seus prompts mais recentes criados com R.I.C.A.R.D.O</CardDescription>
          </CardHeader>
          <CardContent>
            {promptsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando prompts...</p>
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum prompt ainda</h3>
                <p className="text-gray-500 mb-4">
                  Você ainda não criou nenhum prompt. Comece criando seu primeiro prompt com a metodologia
                  R.I.C.A.R.D.O.
                </p>
                <Button asChild>
                  <Link href="/builder">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Prompt
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {prompts.slice(0, 5).map((prompt) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{prompt.prompt_original.substring(0, 50)}...</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {prompt.prompt_sugerido.substring(0, 150)}...
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="secondary">{new Date(prompt.created_at).toLocaleDateString("pt-BR")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeletePrompt(prompt.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
                {prompts.length > 5 && (
                  <>
                    <Separator />
                    <div className="text-center">
                      <Button variant="outline" asChild>
                        <Link href="/prompts">Ver todos os prompts ({prompts.length})</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
