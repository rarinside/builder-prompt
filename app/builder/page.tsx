"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  User,
  Target,
  FileText,
  MessageSquare,
  Shield,
  List,
  CheckCircle,
  Save,
  Eye,
  EyeOff,
  Copy,
  Download,
  Check,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  { id: "role", letter: "R", title: "Role (Papel)", icon: User, description: "Defina o papel que a IA deve assumir" },
  { id: "intention", letter: "I", title: "Intenção", icon: Target, description: "Seja claro sobre o que você espera" },
  { id: "context", letter: "C", title: "Contexto", icon: FileText, description: "Forneça informações relevantes" },
  { id: "adjustment", letter: "A", title: "Ajuste de Tom", icon: MessageSquare, description: "Escolha o tom adequado" },
  { id: "restrictions", letter: "R", title: "Restrições", icon: Shield, description: "Defina limites e diretrizes" },
  { id: "direction", letter: "D", title: "Direcionamento", icon: List, description: "Especifique o formato" },
  { id: "output", letter: "O", title: "Output", icon: CheckCircle, description: "Determine o resultado final" },
]

const popularRoles = [
  "Especialista em Marketing Digital",
  "Consultor de Negócios",
  "Professor Universitário",
  "Analista de Dados",
  "Copywriter Profissional",
  "Desenvolvedor Senior",
  "Designer UX/UI",
  "Consultor Financeiro",
]

const toneOptions = [
  { id: "formal", label: "Formal", description: "Linguagem profissional e respeitosa" },
  { id: "casual", label: "Casual", description: "Linguagem descontraída e amigável" },
  { id: "technical", label: "Técnico", description: "Linguagem especializada e precisa" },
  { id: "creative", label: "Criativo", description: "Linguagem inovadora e inspiradora" },
  { id: "direct", label: "Direto", description: "Linguagem objetiva e concisa" },
  { id: "friendly", label: "Amigável", description: "Linguagem calorosa e acolhedora" },
]

const formatOptions = [
  { id: "list", label: "Lista", description: "Organizado em tópicos numerados" },
  { id: "summary", label: "Resumo", description: "Texto corrido e conciso" },
  { id: "table", label: "Tabela", description: "Dados organizados em colunas" },
  { id: "steps", label: "Passo a passo", description: "Instruções sequenciais" },
  { id: "analysis", label: "Análise", description: "Avaliação detalhada e estruturada" },
]

const outputTypes = [
  { id: "text", label: "Texto", description: "Resposta em formato de texto" },
  { id: "code", label: "Código", description: "Resposta com código ou scripts" },
  { id: "plan", label: "Plano", description: "Estratégia ou plano de ação" },
  { id: "template", label: "Template", description: "Modelo reutilizável" },
]

export default function PromptBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [formData, setFormData] = useState({
    role: "",
    roleType: "",
    intention: "",
    context: "",
    contextDetails: "",
    tone: "",
    restrictions: {
      wordLimit: "",
      customRestrictions: "",
      avoidJargon: false,
      keepSimple: false,
      includeExamples: false,
    },
    format: "",
    outputType: "",
    outputSpecs: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [showResetModal, setShowResetModal] = useState(false)

  const router = useRouter()

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoSaving(true)
      setTimeout(() => setIsAutoSaving(false), 1000)
    }, 2000)
    return () => clearTimeout(timer)
  }, [formData])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generatePrompt = () => {
    let prompt = ""

    if (formData.role) {
      prompt += `Atue como ${formData.role}. `
    }

    if (formData.intention) {
      prompt += `${formData.intention}. `
    }

    if (formData.context) {
      prompt += `Contexto: ${formData.context}. `
    }

    if (formData.tone) {
      const selectedTone = toneOptions.find((t) => t.id === formData.tone)
      prompt += `Use um tom ${selectedTone?.label.toLowerCase()}. `
    }

    if (formData.restrictions.wordLimit) {
      prompt += `Limite a resposta a ${formData.restrictions.wordLimit} palavras. `
    }

    if (formData.restrictions.customRestrictions) {
      prompt += `Restrições: ${formData.restrictions.customRestrictions}. `
    }

    // Adicionar restrições comuns selecionadas
    const commonRestrictions = []
    if (formData.restrictions.avoidJargon) {
      commonRestrictions.push("evitar jargões técnicos")
    }
    if (formData.restrictions.keepSimple) {
      commonRestrictions.push("manter linguagem simples")
    }
    if (formData.restrictions.includeExamples) {
      commonRestrictions.push("incluir exemplos práticos")
    }

    if (commonRestrictions.length > 0) {
      prompt += `Diretrizes adicionais: ${commonRestrictions.join(", ")}. `
    }

    if (formData.format) {
      const selectedFormat = formatOptions.find((f) => f.id === formData.format)
      prompt += `Organize a resposta como ${selectedFormat?.label.toLowerCase()}. `
    }

    if (formData.outputType) {
      const selectedOutput = outputTypes.find((o) => o.id === formData.outputType)
      prompt += `Tipo de resposta: ${selectedOutput?.label}. `
    }

    if (formData.outputSpecs) {
      prompt += `Especificações do output: ${formData.outputSpecs}.`
    }

    return prompt.trim()
  }

  const calculateQualityScore = () => {
    let score = 0
    const maxScore = 100

    // Role defined (15 points)
    if (formData.role) score += 15

    // Intention clear (20 points)
    if (formData.intention && formData.intention.length > 20) score += 20

    // Context provided (15 points)
    if (formData.context) score += 15

    // Tone selected (10 points)
    if (formData.tone) score += 10

    // Restrictions defined (15 points)
    if (formData.restrictions.wordLimit || formData.restrictions.customRestrictions) score += 15

    // Format specified (15 points)
    if (formData.format) score += 15

    // Output type defined (10 points)
    if (formData.outputType) score += 10

    return Math.min(score, maxScore)
  }

  const getQualitySuggestions = () => {
    const suggestions = []

    if (!formData.role) {
      suggestions.push({
        icon: User,
        text: "Defina um papel específico para a IA assumir",
        priority: "high",
      })
    }

    if (!formData.intention || formData.intention.length < 20) {
      suggestions.push({
        icon: Target,
        text: "Seja mais específico sobre sua intenção",
        priority: "high",
      })
    }

    if (!formData.context) {
      suggestions.push({
        icon: FileText,
        text: "Adicione contexto para melhorar a relevância",
        priority: "medium",
      })
    }

    if (!formData.tone) {
      suggestions.push({
        icon: MessageSquare,
        text: "Escolha um tom para guiar a resposta",
        priority: "medium",
      })
    }

    if (!formData.format) {
      suggestions.push({
        icon: List,
        text: "Especifique o formato da resposta",
        priority: "low",
      })
    }

    return suggestions
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt())
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const processPrompt = async () => {
    setIsProcessing(true)
    console.log("🚀 Iniciando processamento do prompt...")

    try {
      const promptToSend = generatePrompt()
      console.log("📝 Prompt a ser enviado:", promptToSend)

      // Verificar se o prompt não está vazio
      if (!promptToSend.trim()) {
        alert("Por favor, preencha pelo menos alguns campos antes de finalizar.")
        return
      }

      const response = await fetch("https://rarwhk.rardevops.com/webhook/ricardo-ai-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptToSend,
        }),
      })

      console.log("📡 Status da resposta:", response.status)
      console.log("📡 Response OK:", response.ok)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("📦 Dados recebidos:", data)

      // Verificar se é array e pegar o primeiro item, ou usar os dados diretamente
      const analysisData = Array.isArray(data) ? data[0] : data
      console.log("🔍 Dados da análise:", analysisData)

      if (analysisData) {
        setAnalysisResults(analysisData)
        console.log("✅ Dados salvos no state, exibindo resultados...")

        // Scroll para os resultados após um pequeno delay
        setTimeout(() => {
          const resultsElement = document.querySelector("[data-results-section]")
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: "smooth" })
          }
        }, 500)
      } else {
        console.error("❌ Dados da análise estão vazios")
        alert("Erro: Dados da análise não foram recebidos corretamente")
      }
    } catch (error) {
      console.error("❌ Erro ao processar prompt:", error)

      // Mostrar erro mais específico para o usuário
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        alert("Erro de conexão. Verifique sua internet e tente novamente.")
      } else if (error.message.includes("HTTP error")) {
        alert(`Erro do servidor: ${error.message}. Tente novamente em alguns minutos.`)
      } else {
        alert(`Erro ao processar prompt: ${error.message}`)
      }
    } finally {
      setIsProcessing(false)
      console.log("🏁 Processamento finalizado")
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToTXT = () => {
    const prompt = generatePrompt()
    const content = `PROMPT RICARDO FRAMEWORK
========================

${prompt}

---
Gerado em: ${new Date().toLocaleString("pt-BR")}
Framework: R.I.C.A.R.D.O v2.0`

    downloadFile(content, "prompt-ricardo.txt", "text/plain")
    setShowExportModal(false)
  }

  const exportToPDF = () => {
    // Para PDF, vamos criar um HTML e usar window.print
    const prompt = generatePrompt()
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prompt R.I.C.A.R.D.O</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
          .prompt-content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Prompt Framework R.I.C.A.R.D.O</h1>
          <p>Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
        </div>
        <div class="prompt-content">
          <h2>Prompt Gerado:</h2>
          <p>${prompt}</p>
        </div>
        <div class="footer">
          <p>Framework R.I.C.A.R.D.O v2.0 - Sistema de Criação de Prompts Inteligentes</p>
        </div>
      </body>
      </html>
    `

    const newWindow = window.open("", "_blank")
    newWindow.document.write(htmlContent)
    newWindow.document.close()
    newWindow.print()
    setShowExportModal(false)
  }

  const exportToMarkdown = () => {
    const prompt = generatePrompt()
    const content = `# Prompt Framework R.I.C.A.R.D.O

**Gerado em:** ${new Date().toLocaleString("pt-BR")}  
**Framework:** R.I.C.A.R.D.O v2.0

## Prompt Gerado

\`\`\`
${prompt}
\`\`\`

## Componentes Utilizados

- **R** - Role (Papel): ${formData.role || "Não definido"}
- **I** - Intenção: ${formData.intention || "Não definido"}
- **C** - Contexto: ${formData.context || "Não definido"}
- **A** - Ajuste de Tom: ${formData.tone || "Não definido"}
- **R** - Restrições: ${formData.restrictions.customRestrictions || "Não definido"}
- **D** - Direcionamento: ${formData.format || "Não definido"}
- **O** - Output: ${formData.outputType || "Não definido"}

---
*Criado com R.I.C.A.R.D.O Prompt Builder*`

    downloadFile(content, "prompt-ricardo.md", "text/markdown")
    setShowExportModal(false)
  }

  const qualityScore = calculateQualityScore()
  const suggestions = getQualitySuggestions()

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case "role":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Defina o papel que a IA deve assumir
              </label>
              <Input
                placeholder="Ex: Atue como um especialista em marketing digital"
                value={formData.role}
                onChange={(e) => updateFormData("role", e.target.value)}
                className="mb-4"
              />

              <div className="space-y-2">
                <p className="text-sm text-slate-600">Roles populares:</p>
                <div className="flex flex-wrap gap-2">
                  {popularRoles.map((role, index) => (
                    <button
                      key={index}
                      onClick={() => updateFormData("role", role)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "intention":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Seja claro e específico sobre o que você espera
              </label>
              <Textarea
                placeholder="Ex: Quero criar uma estratégia de conteúdo para redes sociais"
                value={formData.intention}
                onChange={(e) => updateFormData("intention", e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Seja específico sobre seu objetivo</span>
                <span>{formData.intention.length} caracteres</span>
              </div>
            </div>
          </div>
        )

      case "context":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Forneça informações de background relevantes
              </label>
              <Textarea
                placeholder="Ex: Para uma startup de tecnologia B2B com foco em PMEs"
                value={formData.context}
                onChange={(e) => updateFormData("context", e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        )

      case "adjustment":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Escolha o tom adequado para sua solicitação
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {toneOptions.map((tone) => (
                  <label
                    key={tone.id}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.tone === tone.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={tone.id}
                      checked={formData.tone === tone.id}
                      onChange={(e) => updateFormData("tone", e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-slate-800">{tone.label}</div>
                      <div className="text-sm text-slate-600">{tone.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case "restrictions":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Limite de palavras</label>
              <Input
                type="number"
                placeholder="Ex: 500"
                value={formData.restrictions.wordLimit}
                onChange={(e) =>
                  updateFormData("restrictions", {
                    ...formData.restrictions,
                    wordLimit: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Restrições comuns</label>

              {[
                { key: "avoidJargon", label: "Evitar jargões técnicos" },
                { key: "keepSimple", label: "Manter linguagem simples" },
                { key: "includeExamples", label: "Incluir exemplos práticos" },
              ].map((restriction) => (
                <label key={restriction.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.restrictions[restriction.key as keyof typeof formData.restrictions] as boolean}
                    onChange={(e) =>
                      updateFormData("restrictions", {
                        ...formData.restrictions,
                        [restriction.key]: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">{restriction.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Restrições customizadas</label>
              <Textarea
                placeholder="Ex: Não mencionar concorrentes, focar apenas em soluções práticas..."
                value={formData.restrictions.customRestrictions}
                onChange={(e) =>
                  updateFormData("restrictions", {
                    ...formData.restrictions,
                    customRestrictions: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>
          </div>
        )

      case "direction":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Especifique o formato da resposta desejada
              </label>
              <div className="space-y-3">
                {formatOptions.map((format) => (
                  <label
                    key={format.id}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.format === format.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={formData.format === format.id}
                      onChange={(e) => updateFormData("format", e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-slate-800">{format.label}</div>
                      <div className="text-sm text-slate-600">{format.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case "output":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">Tipo de output desejado</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {outputTypes.map((output) => (
                  <label
                    key={output.id}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.outputType === output.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="outputType"
                      value={output.id}
                      checked={formData.outputType === output.id}
                      onChange={(e) => updateFormData("outputType", e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-slate-800">{output.label}</div>
                      <div className="text-sm text-slate-600">{output.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Especificações adicionais do output
              </label>
              <Textarea
                placeholder="Ex: Incluir métricas de performance, adicionar call-to-actions..."
                value={formData.outputSpecs}
                onChange={(e) => updateFormData("outputSpecs", e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const [copyOriginalSuccess, setCopyOriginalSuccess] = useState(false)
  const [copyOptimizedSuccess, setCopyOptimizedSuccess] = useState(false)

  const copyOriginalToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(analysisResults.prompt_original || "")
      setCopyOriginalSuccess(true)
      setTimeout(() => setCopyOriginalSuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const copyOptimizedToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(analysisResults.dados_raw?.otimizacao_completa || "")
      setCopyOptimizedSuccess(true)
      setTimeout(() => setCopyOptimizedSuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const resetForm = () => {
    setFormData({
      role: "",
      roleType: "",
      intention: "",
      context: "",
      contextDetails: "",
      tone: "",
      restrictions: {
        wordLimit: "",
        customRestrictions: "",
        avoidJargon: false,
        keepSimple: false,
        includeExamples: false,
      },
      format: "",
      outputType: "",
      outputSpecs: "",
    })
    setCurrentStep(0)
    setAnalysisResults(null)
    setCopySuccess(false)
    setCopyOriginalSuccess(false)
    setCopyOptimizedSuccess(false)
    setShowResetModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetModal(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
            <h1 className="text-xl font-bold text-slate-800">R.I.C.A.R.D.O - Construtor de Prompts</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Save className={`w-4 h-4 ${isAutoSaving ? "text-green-500" : "text-slate-400"}`} />
              <span>{isAutoSaving ? "Salvando..." : "Salvo"}</span>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="lg:hidden">
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Etapa {currentStep + 1} de {steps.length}
                </span>
                <span className="text-sm text-slate-500">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% completo
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Desktop Stepper */}
            <div className="hidden lg:block mb-8">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep || (analysisResults && index === steps.length - 1)

                  return (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => goToStep(index)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                          isActive
                            ? "border-blue-600 bg-blue-600 text-white"
                            : isCompleted
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-slate-300 bg-white text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="font-bold">{step.letter}</span>
                        )}
                      </button>

                      {index < steps.length - 1 && (
                        <div className={`w-12 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-slate-300"}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile Stepper */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
                {steps.map((step, index) => {
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep || (analysisResults && index === steps.length - 1)

                  return (
                    <button
                      key={step.id}
                      onClick={() => goToStep(index)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-slate-300 bg-white text-slate-400"
                      }`}
                    >
                      {isCompleted ? "✓" : step.letter}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step Content */}
            {currentStep < steps.length && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {steps[currentStep].letter}
                    </div>
                    <div>
                      <CardTitle>{steps[currentStep].title}</CardTitle>
                      <p className="text-sm text-slate-600">{steps[currentStep].description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button
                onClick={currentStep === steps.length - 1 ? processPrompt : nextStep}
                disabled={isProcessing}
                className={isProcessing ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  "Finalizar"
                ) : (
                  "Próximo"
                )}
                {!isProcessing && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Analisando seu prompt com IA...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Enhanced Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Quality Score Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Score de Qualidade
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <motion.path
                            className="text-blue-600"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeLinecap="round"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: `${qualityScore} 100` }}
                            transition={{ duration: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-800">{qualityScore}</span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Completude:</span>
                        <span className="font-medium">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Clareza:</span>
                        <span className="font-medium">
                          {qualityScore > 70 ? "Alta" : qualityScore > 40 ? "Média" : "Baixa"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggestions Card */}
                {suggestions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                        Sugestões
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {suggestions.slice(0, 3).map((suggestion, index) => {
                          const Icon = suggestion.icon
                          return (
                            <div key={index} className="flex items-start space-x-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  suggestion.priority === "high"
                                    ? "bg-red-100 text-red-600"
                                    : suggestion.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                              </div>
                              <p className="text-sm text-slate-700">{suggestion.text}</p>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Preview Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Preview do Prompt</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="lg:hidden"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {(!isCollapsed || window.innerWidth >= 1024) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent>
                          <div className="bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm min-h-[200px] relative overflow-hidden">
                            <motion.div
                              key={generatePrompt()}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {generatePrompt() || (
                                <span className="text-slate-500">
                                  Seu prompt aparecerá aqui conforme você preenche os campos...
                                </span>
                              )}
                            </motion.div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Caracteres:</span>
                              <span className="font-medium">{generatePrompt().length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Palavras:</span>
                              <span className="font-medium">{generatePrompt().split(" ").length}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 grid grid-cols-3 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={copyToClipboard}
                              className="relative overflow-hidden bg-transparent"
                            >
                              <AnimatePresence mode="wait">
                                {copySuccess ? (
                                  <motion.div
                                    key="success"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="flex items-center"
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Copiado!
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="copy"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="flex items-center"
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowSaveModal(true)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Salvar
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowExportModal(true)}
                              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Exportar
                            </Button>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Results Section - aparece após processamento */}
        {analysisResults && (
          <motion.div
            data-results-section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
          >
            {/* Header da Análise */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center mb-2">
                <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
                Análise Completa do Prompt
              </h3>
              <p className="text-slate-600">Framework R.I.C.A.R.D.O - Versão 2.0 AI Agent</p>
              <p className="text-sm text-slate-500 mt-1">Processado em: {new Date().toLocaleString("pt-BR")}</p>
            </div>

            {/* Prompt Original */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-slate-600" />
                  Prompt Original
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm ml-2">Versão Original</span>
                  </div>
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {analysisResults.prompt_original || "Prompt não disponível"}
                  </pre>
                </div>
                <Button variant="outline" size="sm" onClick={copyOriginalToClipboard} className="mt-3 bg-transparent">
                  {copyOriginalSuccess ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar Original
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Prompt Otimizado */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Prompt Otimizado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm ml-2">Versão Otimizada</span>
                  </div>
                  <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
                    {analysisResults.dados_raw?.otimizacao_completa || "Versão otimizada não disponível"}
                  </pre>
                </div>
                <Button variant="outline" size="sm" onClick={copyOptimizedToClipboard} className="mt-3 bg-transparent">
                  {copyOptimizedSuccess ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar Otimizado
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Análise Completa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Análise Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-6 border border-purple-200">
                  <div className="prose prose-sm max-w-none">
                    {(() => {
                      const analise = analysisResults.dados_raw?.analise_completa
                      if (typeof analise === "string") {
                        try {
                          const parsed = JSON.parse(analise)
                          return (
                            <div className="space-y-6">
                              {Object.entries(parsed).map(([key, value]) => (
                                <div key={key} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                  <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    {key}:
                                  </h4>
                                  <div className="text-green-300">
                                    {typeof value === "object" && value !== null ? (
                                      <div className="space-y-3">
                                        {Object.entries(value).map(([subKey, subValue]) => (
                                          <div
                                            key={subKey}
                                            className="bg-slate-700 rounded p-3 border-l-4 border-green-400"
                                          >
                                            <div className="font-medium text-green-400 mb-1">{subKey}:</div>
                                            <div className="text-green-300 leading-relaxed">{String(subValue)}</div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : Array.isArray(value) ? (
                                      <div className="bg-slate-700 rounded p-3">
                                        <ul className="space-y-2">
                                          {value.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                              <span className="text-green-300 leading-relaxed">{String(item)}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : (
                                      <div className="bg-slate-700 rounded p-3 border-l-4 border-green-400">
                                        <span className="text-green-300 leading-relaxed">{String(value)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        } catch {
                          return (
                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                              <pre className="text-green-300 whitespace-pre-wrap leading-relaxed text-sm">
                                {analise}
                              </pre>
                            </div>
                          )
                        }
                      }
                      return (
                        <div className="text-center py-8">
                          <span className="text-slate-400 italic">Análise não disponível</span>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Componentes R.I.C.A.R.D.O Analisados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <List className="w-5 h-5 mr-2 text-indigo-600" />
                  Componentes R.I.C.A.R.D.O Analisados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { letter: "R", name: "Role", description: "Papel definido" },
                    { letter: "I", name: "Intenção", description: "Objetivo claro" },
                    { letter: "C", name: "Contexto", description: "Background fornecido" },
                    { letter: "A", name: "Ajuste", description: "Tom adequado" },
                    { letter: "R", name: "Restrições", description: "Limites definidos" },
                    { letter: "D", name: "Direcionamento", description: "Formato especificado" },
                    { letter: "O", name: "Output", description: "Resultado esperado" },
                  ].map((component, index) => (
                    <div key={`${component.letter}-${index}`} className="bg-slate-800 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{component.name}</span>
                        <span className="text-sm font-bold bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center">
                          {component.letter}
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-slate-300">{component.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      {/* Modal de Confirmação de Reset */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <RotateCcw className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Reiniciar Processo</h3>
                <p className="text-sm text-slate-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <p className="text-slate-700 mb-6">
              Tem certeza que deseja reiniciar? Todos os dados preenchidos e resultados da análise serão perdidos.
            </p>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowResetModal(false)}>
                Cancelar
              </Button>
              <Button onClick={resetForm} className="bg-red-600 hover:bg-red-700 text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Sim, Reiniciar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Modal de Exportação */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Exportar Prompt</h3>
                <p className="text-sm text-slate-600">Escolha o formato de exportação</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button onClick={exportToTXT} variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                Exportar como TXT
              </Button>
              <Button onClick={exportToPDF} variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                Exportar como PDF
              </Button>
              <Button onClick={exportToMarkdown} variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                Exportar como Markdown
              </Button>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
