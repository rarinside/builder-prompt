"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Menu, X, Zap, Target, Brain } from "lucide-react"
import RicardoTimeline from "@/components/ricardo-timeline"
import PricingSection from "@/components/pricing-section"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src="/images/logo-ricardo.png" alt="Ricardo Santos Logo" className="h-16 w-auto" />
              <span className="text-2xl font-bold text-slate-800">{"Framework"} </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                Recursos
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
                Como Funciona
              </a>
              <a href="#examples" className="text-slate-600 hover:text-blue-600 transition-colors">
                Exemplos
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                Preços
              </a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/register">
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Começar Agora
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-slate-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Recursos
                </a>
                <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Como Funciona
                </a>
                <a href="#examples" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Exemplos
                </a>
                <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Preços
                </a>
                <Link href="/auth/register">
                  <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full">
                    Começar Agora
                  </button>
                </Link>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100" style={{ y }} />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Zap className="w-4 h-4" />
                <span>Framework Revolucionário para IA</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Crie Prompts Eficazes com o Framework <span className="text-blue-600">R.I.C.A.R.D.O</span>
              </motion.h1>

              <motion.p
                className="text-xl text-slate-600 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Uma ferramenta inteligente para criar prompts estruturados e eficazes para IA. Transforme suas ideias em
                comandos precisos que geram resultados extraordinários.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10k+</div>
                  <div className="text-sm text-slate-600">Prompts Criados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-slate-600">Taxa de Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2k+</div>
                  <div className="text-sm text-slate-600">Usuários Ativos</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Glassmorphism Card */}
                <motion.div
                  className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600 text-sm ml-4">RICARDO Prompt Builder</span>
                    </div>

                    {/* Framework Steps */}
                    <div className="space-y-4">
                      {[
                        { letter: "R", title: "Role (Papel)", desc: "Defina o papel" },
                        { letter: "I", title: "Instrução", desc: "Comando específico" },
                        { letter: "C", title: "Contexto", desc: "Informações relevantes" },
                        { letter: "A", title: "Audiência", desc: "Público-alvo" },
                        { letter: "R", title: "Restrições", desc: "Limitações e regras" },
                        { letter: "D", title: "Dados", desc: "Exemplos e referências" },
                        { letter: "O", title: "Output", desc: "Formato de saída" },
                      ].map((step, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                        >
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {step.letter}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{step.title}</div>
                            <div className="text-slate-600 text-xs">{step.desc}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Target className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-8 p-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">R</div>
              <div className="text-sm font-medium">Role (Papel)</div>
              <div className="text-xs">Defina seu papel</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">I</div>
              <div className="text-sm font-medium">Intenção</div>
              <div className="text-xs">Seja específico</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">C</div>
              <div className="text-sm font-medium">Contexto</div>
              <div className="text-xs">Forneça background</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">A</div>
              <div className="text-sm font-medium">Ajuste de Tom</div>
              <div className="text-xs">Escolha o tom</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">R</div>
              <div className="text-sm font-medium">Restrições</div>
              <div className="text-xs">Defina limites</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">D</div>
              <div className="text-sm font-medium">Direcionamento</div>
              <div className="text-xs">Especifique formato</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">O</div>
              <div className="text-sm font-medium">Output Desejado</div>
              <div className="text-xs">Determine resultado</div>
            </div>
          </div>
        </div>
      </section>

      {/* RICARDO Timeline */}
      <RicardoTimeline />

      {/* Pricing Section */}
      <PricingSection />
    </div>
  )
}
