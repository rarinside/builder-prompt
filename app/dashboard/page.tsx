
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, MoreVertical, Edit3, Copy, Trash2, TrendingUp, Eye, Share2, FileText, Clock, LogOut, Zap, Target, Brain, Sparkles, BookOpen, Users, BarChart3 } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Carregando...</h3>
          <p className="text-slate-600">Verificando autenticação</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    console.log("Dashboard: No user, showing loading...")
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Redirecionando...</h3>
          <p className="text-slate-600">Você será redirecionado para o login</p>
        </motion.div>
      </div>
    )
  }

  console.log("Dashboard: Rendering dashboard for user:", user.email)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-indigo-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-400 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Olá, {firstName}!
                  </h1>
                  <p className="text-slate-600 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                    Bem-vindo ao seu painel R.I.C.A.R.D.O
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                  <Link href="/builder">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Prompt
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={handleSignOut} className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-white/20 shadow-lg">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Total de Prompts</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : <AnimatedCounter value={totalPrompts} />}
                </div>
                <p className="text-xs text-slate-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  Prompts salvos
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Últimos 7 dias</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : <AnimatedCounter value={promptsThisWeek} />}
                </div>
                <p className="text-xs text-slate-600 mt-1 flex items-center">
                  <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                  Novos prompts
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Score Médio</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">
                  <AnimatedCounter value={averageScore} />%
                </div>
                <p className="text-xs text-slate-600 mt-1 flex items-center">
                  <Target className="w-3 h-3 mr-1 text-blue-500" />
                  Qualidade dos prompts
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                    Prompts Recentes
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Seus prompts mais recentes criados com a metodologia R.I.C.A.R.D.O
                  </CardDescription>
                </div>
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </CardHeader>
            <CardContent>
              {promptsLoading ? (
                <div className="text-center py-12">
                  <motion.div
                    className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  <p className="text-slate-600">Carregando prompts...</p>
                </div>
              ) : prompts.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <FileText className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Nenhum prompt ainda</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Você ainda não criou nenhum prompt. Comece criando seu primeiro prompt com a metodologia
                    R.I.C.A.R.D.O e descubra o poder da IA estruturada.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                      <Link href="/builder">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Prompt
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {prompts.slice(0, 5).map((prompt, index) => (
                    <motion.div
                      key={prompt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="group relative bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {prompt.prompt_original.substring(0, 60)}...
                            </h4>
                          </div>
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                            {prompt.prompt_sugerido.substring(0, 150)}...
                          </p>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                              {new Date(prompt.created_at).toLocaleDateString("pt-BR")}
                            </Badge>
                            <Badge variant="outline" className="border-green-200 text-green-700">
                              R.I.C.A.R.D.O
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-white/90 backdrop-blur-sm border-white/20">
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
                                  className="text-red-600 hover:text-red-700"
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
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {prompts.length > 5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Separator className="my-6" />
                      <div className="text-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" asChild className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-white/20 shadow-lg">
                            <Link href="/prompts">
                              <Users className="w-4 h-4 mr-2" />
                              Ver todos os prompts ({prompts.length})
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="group"
        >
          <Button
            asChild
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <Link href="/builder">
              <Plus className="w-6 h-6" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
