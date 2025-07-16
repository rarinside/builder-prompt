"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star, Zap, Crown, Gift, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: "Gratuito",
      description: "Para começar a explorar",
      price: "0",
      originalPrice: null,
      period: "sempre",
      badge: null,
      features: [
        "3 prompts por mês",
        "Framework R.I.C.A.R.D.O básico",
        "Análise de qualidade simples",
        "Exportação em TXT",
        "Suporte por email",
      ],
      limitations: ["Sem histórico de prompts", "Sem templates avançados", "Sem análise de IA"],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      description: "Para profissionais e empresas",
      price: "9,90",
      originalPrice: "129,90",
      period: "mês",
      badge: "🔥 OFERTA LIMITADA",
      features: [
        "Prompts ilimitados",
        "Framework R.I.C.A.R.D.O completo",
        "Análise avançada de IA",
        "Histórico completo",
        "Templates premium",
        "Exportação em todos os formatos",
        "Dashboard analytics",
        "Suporte prioritário",
        "Otimização automática",
        "Colaboração em equipe",
      ],
      limitations: [],
      buttonText: "Começar Agora",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Alunos IA para Negócios",
      description: "Exclusivo para alunos do curso",
      price: "0",
      originalPrice: "129,90",
      period: "sempre",
      badge: "🎓 EXCLUSIVO",
      features: [
        "Tudo do plano Pro",
        "Acesso vitalício",
        "Conteúdo exclusivo",
        "Mentoria em grupo",
        "Certificado de conclusão",
        "Atualizações gratuitas",
        "Comunidade VIP",
        "Cases práticos",
      ],
      limitations: [],
      buttonText: "Sou Aluno",
      buttonVariant: "outline" as const,
      popular: false,
      special: true,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Crown className="w-4 h-4" />
            <span>Oferta por Tempo Limitado</span>
          </motion.div>

          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Escolha o Plano <span className="text-blue-600">Perfeito</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Transforme sua forma de criar prompts com o framework R.I.C.A.R.D.O. Oferta especial por tempo limitado!
          </p>

          {/* Countdown Timer */}
          <motion.div
            className="mt-8 inline-flex items-center space-x-2 bg-red-100 text-red-600 px-6 py-3 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Oferta válida até 31/01/2025 - Últimas vagas!</span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    MAIS POPULAR
                  </Badge>
                </div>
              )}

              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? "border-2 border-blue-500 shadow-xl scale-105"
                    : plan.special
                      ? "border-2 border-purple-500 shadow-lg"
                      : "border border-slate-200 hover:border-blue-300"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-4 right-4">
                    <div
                      className={`text-center py-2 px-4 rounded-full text-sm font-bold text-white ${
                        plan.special
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gradient-to-r from-red-500 to-orange-500"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.badge ? "pt-8" : "pt-6"}`}>
                  <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                  <p className="text-slate-600 mt-2">{plan.description}</p>

                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2">
                      {plan.originalPrice && (
                        <span className="text-2xl text-slate-400 line-through font-medium">
                          R$ {plan.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-center space-x-1 mt-2">
                      <span className="text-5xl font-bold text-slate-800">R$</span>
                      <span className="text-6xl font-bold text-slate-800">{plan.price}</span>
                      <span className="text-xl text-slate-600">/{plan.period}</span>
                    </div>

                    {plan.originalPrice && (
                      <div className="mt-3 inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <Gift className="w-4 h-4" />
                        <span>Economia de 92%</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {plan.name === "Gratuito" ? (
                    <Link href="/auth/register">
                      <Button size="lg" variant="outline" className="w-full mb-6 bg-transparent">
                        Começar Grátis
                      </Button>
                    </Link>
                  ) : plan.name === "Pro" ? (
                    <Link href="/auth/register">
                      <Button
                        size="lg"
                        className="w-full mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      >
                        Começar Agora
                        <Zap className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/student-access">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full mb-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        Sou Aluno
                      </Button>
                    </Link>
                  )}

                  <div className="space-y-4">
                    <div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-600 mb-3">Limitações:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-start space-x-3">
                              <div className="w-4 h-4 border border-slate-300 rounded mt-0.5 flex-shrink-0" />
                              <span className="text-slate-500 text-sm">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">🚀 Não Perca Esta Oportunidade!</h3>
            <p className="text-xl mb-6 opacity-90">
              Mais de <strong>10.000 profissionais</strong> já estão criando prompts mais eficazes com o R.I.C.A.R.D.O
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm opacity-80">Taxa de Sucesso</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-sm opacity-80">Prompts Criados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.9⭐</div>
                <div className="text-sm opacity-80">Avaliação Média</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
                  Começar Agora - R$ 9,90/mês
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <Users className="w-4 h-4" />
                <span>Junte-se a milhares de usuários satisfeitos</span>
              </div>
            </div>

            <p className="text-sm mt-4 opacity-70">
              ✅ Garantia de 30 dias • ✅ Cancele quando quiser • ✅ Suporte 24/7
            </p>
          </div>
        </motion.div>

        {/* FAQ Preview */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Perguntas Frequentes</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Como funciona a oferta promocional?</h4>
              <p className="text-slate-600 text-sm">
                O valor promocional de R$ 9,90 é válido enquanto você mantiver sua assinatura ativa. Após o
                cancelamento, o preço volta ao valor normal.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Como alunos podem acessar gratuitamente?</h4>
              <p className="text-slate-600 text-sm">
                Alunos do curso "IA para Negócios - R$antos" recebem acesso vitalício gratuito. Basta fazer login com o
                email cadastrado no curso.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
