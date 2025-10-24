"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isConfigured) {
        return
      }

      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, isConfigured, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-foreground">Sistema de Gerenciamento de Marketing</h1>

            <p className="text-xl text-muted-foreground">Modo de Demonstração</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Bem-vindo ao Sistema</h2>

            <div className="space-y-3 text-muted-foreground">
              <p>Este é um sistema completo de gerenciamento de agência de marketing digital com:</p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sistema de autenticação e permissões hierárquico</li>
                <li>Gerenciamento de usuários e cargos customizáveis</li>
                <li>Criação e gerenciamento de projetos</li>
                <li>Editor de conteúdo rico com formatação</li>
                <li>Sistema de revisão e comentários</li>
                <li>Integração com WhatsApp para notificações</li>
                <li>Histórico de projetos aprovados com filtros</li>
                <li>Tema escuro elegante e moderno</li>
              </ul>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Modo de Demonstração Ativo
              </h3>
              <p className="text-sm text-muted-foreground">
                O sistema está rodando em modo de demonstração porque o Firebase não está configurado. Quando você
                hospedar este projeto no Cloudflare Pages e configurar as variáveis de ambiente do Firebase, o sistema
                funcionará completamente com autenticação real e banco de dados.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Para usar o sistema completo:</h3>

              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Faça o deploy no Cloudflare Pages</li>
                <li>Configure as variáveis de ambiente do Firebase</li>
                <li>Crie o primeiro usuário Super Admin no Firebase Console</li>
                <li>Faça login e comece a usar!</li>
              </ol>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/login")} variant="default" size="lg">
                Ver Tela de Login
              </Button>

              <Button onClick={() => window.open("https://github.com", "_blank")} variant="outline" size="lg">
                Documentação
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Sistema desenvolvido para gerenciamento profissional de agências de marketing digital</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
