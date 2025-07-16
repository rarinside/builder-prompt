"use client"

import { motion } from "framer-motion"
import { User, Target, FileText, MessageSquare, Shield, List, CheckCircle } from "lucide-react"
import Link from "next/link"

const timelineData = [
  {
    letter: "R",
    title: "Role (Papel)",
    description: "Defina o papel que a IA deve assumir",
    example: "Atue como um especialista em marketing digital",
    icon: User,
    color: "bg-blue-600",
  },
  {
    letter: "I",
    title: "Intenção",
    description: "Seja claro e específico sobre o que você espera",
    example: "Quero criar uma estratégia de conteúdo para redes sociais",
    icon: Target,
    color: "bg-blue-600",
  },
  {
    letter: "C",
    title: "Contexto",
    description: "Forneça informações de background relevantes",
    example: "Para uma startup de tecnologia B2B com foco em PMEs",
    icon: FileText,
    color: "bg-blue-600",
  },
  {
    letter: "A",
    title: "Ajuste de Tom",
    description: "Escolha o tom: formal, técnico, criativo, casual...",
    example: "Use um tom profissional mas acessível",
    icon: MessageSquare,
    color: "bg-blue-600",
  },
  {
    letter: "R",
    title: "Restrições",
    description: "Defina limites e diretrizes específicas",
    example: "Máximo 500 palavras, evite jargões técnicos",
    icon: Shield,
    color: "bg-blue-600",
  },
  {
    letter: "D",
    title: "Direcionamento",
    description: "Especifique o formato da resposta desejada",
    example: "Organize como uma lista numerada com subtópicos",
    icon: List,
    color: "bg-blue-600",
  },
  {
    letter: "O",
    title: "Output Desejado",
    description: "Determine o resultado final específico",
    example: "Um plano de conteúdo mensal pronto para execução",
    icon: CheckCircle,
    color: "bg-blue-600",
  },
]

export default function RicardoTimeline() {
  return (
    <section className="py-20 bg-slate-50" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Framework <span className="text-blue-600">R.I.C.A.R.D.O</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Um processo estruturado em 7 etapas para criar prompts eficazes que geram resultados excepcionais
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line - Always centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-300" />

          {/* Timeline Items */}
          <div className="space-y-16">
            {timelineData.map((item, index) => {
              const Icon = item.icon
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  className="relative flex items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:flex items-center w-full">
                    {/* Left Card */}
                    {isLeft ? (
                      <div className="w-1/2 pr-8 flex justify-end">
                        <motion.div
                          className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-6 max-w-md w-full"
                          whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                              <p className="text-slate-700 mb-3 text-sm">{item.description}</p>
                              <p className="text-slate-500 italic text-sm">"{item.example}"</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="w-1/2 pr-8" />
                    )}

                    {/* Center Circle - Always centered */}
                    <div className="relative z-10 flex-shrink-0">
                      <motion.div
                        className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.letter}
                      </motion.div>
                    </div>

                    {/* Right Card */}
                    {!isLeft ? (
                      <div className="w-1/2 pl-8 flex justify-start">
                        <motion.div
                          className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-6 max-w-md w-full"
                          whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                              <p className="text-slate-700 mb-3 text-sm">{item.description}</p>
                              <p className="text-slate-500 italic text-sm">"{item.example}"</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="w-1/2 pl-8" />
                    )}
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden flex items-center w-full">
                    {/* Left side - Circle always centered */}
                    <div className="flex justify-center w-16">
                      <motion.div
                        className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.letter}
                      </motion.div>
                    </div>

                    {/* Right side - Card */}
                    <div className="flex-1 pl-6">
                      <motion.div
                        className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-6"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-slate-700 mb-3 text-sm">{item.description}</p>
                            <p className="text-slate-500 italic text-sm">"{item.example}"</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Arrow pointing down */}
        <motion.div
          className="flex justify-center mt-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="w-0.5 h-12 bg-blue-300 mb-2" />
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-blue-600" />
          </motion.div>
        </motion.div>

        {/* Final Prompt Example */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2" id="examples">
              Prompt Final Estruturado
            </h3>
            <p className="text-slate-600">Veja como fica o prompt completo usando o framework R.I.C.A.R.D.O</p>
          </div>

          <motion.div
            className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-xl border border-blue-200 p-8"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                  R
                </span>
                <p className="text-slate-700">
                  <strong>Role:</strong> Atue como um especialista em marketing digital
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                  I
                </span>
                <p className="text-slate-700">
                  <strong>Intenção:</strong> Quero criar uma estratégia de conteúdo para redes sociais
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                  C
                </span>
                <p className="text-slate-700">
                  <strong>Contexto:</strong> Para uma startup de tecnologia B2B com foco em PMEs
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                  A
                </span>
                <p className="text-slate-700">
                  <strong>Ajuste de Tom:</strong> Use um tom profissional mas acessível
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                  R
                </span>
                <p className="text-slate-700">
                  <strong>Restrições:</strong> Máximo 500 palavras, evite jargões técnicos
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                  D
                </span>
                <p className="text-slate-700">
                  <strong>Direcionamento:</strong> Organize como uma lista numerada com subtópicos
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                  O
                </span>
                <p className="text-slate-700">
                  <strong>Output Desejado:</strong> Um plano de conteúdo mensal pronto para execução
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm ml-2">Prompt Completo</span>
                </div>
                <div className="text-green-400 font-mono text-sm leading-relaxed">
                  <p className="mb-2">
                    "Atue como um especialista em marketing digital. Quero criar uma estratégia de conteúdo para redes
                    sociais para uma startup de tecnologia B2B com foco em PMEs.
                  </p>
                  <p className="mb-2">
                    Use um tom profissional mas acessível. Máximo 500 palavras, evite jargões técnicos.
                  </p>
                  <p>
                    Organize como uma lista numerada com subtópicos. Preciso de um plano de conteúdo mensal pronto para
                    execução."
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-slate-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Prompt estruturado e pronto para usar!</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Link href="/builder">
            <motion.button
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Começar a Usar o Framework
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
