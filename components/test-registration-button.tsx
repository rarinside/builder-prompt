"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, User, Database, Server } from "lucide-react"

export default function TestRegistrationButton() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const testRegistration = async () => {
    setTesting(true)
    setResults(null)

    const testData = {
      email: `teste${Date.now()}@exemplo.com`,
      password: "123456",
      nome: "Usuário Teste",
      plano: "free",
    }

    try {
      // 1. Testar API de registro
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      const result = await response.json()

      setResults({
        success: response.ok,
        status: response.status,
        data: result,
        testData,
        timestamp: new Date().toLocaleString(),
      })
    } catch (error) {
      setResults({
        success: false,
        error: error.message,
        testData,
        timestamp: new Date().toLocaleString(),
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Teste de Cadastro - Pós Migração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            Teste se o sistema de cadastro está funcionando após a migração para a nova arquitetura.
          </p>

          <Button onClick={testRegistration} disabled={testing} className="w-full">
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testando cadastro...
              </>
            ) : (
              "🧪 Testar Cadastro"
            )}
          </Button>

          {results && (
            <div className="space-y-4">
              <Alert variant={results.success ? "default" : "destructive"}>
                <div className="flex items-center">
                  {results.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span className="font-medium">
                    {results.success ? "✅ Cadastro funcionando!" : "❌ Erro no cadastro"}
                  </span>
                </div>
                <AlertDescription className="mt-2">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Status:</strong> {results.status}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {results.timestamp}
                    </div>

                    {results.success ? (
                      <div className="space-y-1">
                        <div>
                          <strong>✅ Usuário criado:</strong> {results.data.user?.email}
                        </div>
                        <div>
                          <strong>✅ Plano:</strong> {results.data.user?.plano}
                        </div>
                        <div>
                          <strong>✅ ID:</strong> {results.data.user?.id}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div>
                          <strong>❌ Erro:</strong> {results.data?.error || results.error}
                        </div>
                        {results.data?.details && (
                          <div>
                            <strong>Detalhes:</strong> {results.data.details}
                          </div>
                        )}
                        {results.data?.instructions && (
                          <div>
                            <strong>Instruções:</strong>
                            <ol className="list-decimal list-inside mt-1">
                              {results.data.instructions.map((instruction: string, index: number) => (
                                <li key={index}>{instruction}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              {/* Dados do teste */}
              <Card className="bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Dados do Teste</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                    {JSON.stringify(results.testData, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Próximos passos */}
              {results.success && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-green-800 mb-2">🎉 Próximos passos:</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <div>1. ✅ Verificar usuário no Supabase hospedado</div>
                      <div>2. 🔄 Testar login com as credenciais</div>
                      <div>3. 📝 Testar criação de prompt</div>
                      <div>4. 📊 Verificar dashboard</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Instruções */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">📋 Como verificar manualmente:</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  <span>Supabase Hospedado: Verificar tabela `usuarios`</span>
                </div>
                <div className="flex items-center">
                  <Server className="w-4 h-4 mr-2" />
                  <span>Self-hosted: Verificar se prompts podem ser criados</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>Interface: Testar login em `/auth/login`</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
