"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Copy } from "lucide-react"
import { useState } from "react"

export default function SetupPage() {
  const [copied, setCopied] = useState(false)

  const envVars = `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBvNAjE8H6KyEg4wxBVkAozl09rhpzXNfA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=curso2-b3102.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=curso2-b3102
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=curso2-b3102.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=701286382065
NEXT_PUBLIC_FIREBASE_APP_ID=1:701286382065:web:796e6fa063cc892bc9ec50
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-58GED45K4Z`

  const handleCopy = () => {
    navigator.clipboard.writeText(envVars)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-warning" />
            <h1 className="text-3xl font-bold text-foreground">Configuração Necessária</h1>
          </div>

          <p className="text-muted mb-6">
            O Firebase não está configurado. Para usar o sistema, você precisa adicionar as variáveis de ambiente.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Passo 1: Copiar Variáveis de Ambiente</h2>
              <p className="text-sm text-muted mb-3">Clique no botão abaixo para copiar as variáveis de ambiente:</p>
              <div className="bg-background border border-border rounded-lg p-4 mb-3">
                <pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap break-words">{envVars}</pre>
              </div>
              <Button onClick={handleCopy} className="gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Variáveis
                  </>
                )}
              </Button>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Passo 2: Adicionar no Painel</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted">
                <li>Clique em "Vars" no painel esquerdo do chat</li>
                <li>Cole as variáveis copiadas</li>
                <li>Clique em "Save"</li>
                <li>Recarregue a página (F5)</li>
              </ol>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Passo 3: Usar Suas Próprias Credenciais</h2>
              <p className="text-sm text-muted mb-3">
                Se você tem um projeto Firebase próprio, substitua os valores acima pelos seus:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted">
                <li>
                  Acesse{" "}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Firebase Console
                  </a>
                </li>
                <li>Selecione seu projeto</li>
                <li>Vá para Configurações do Projeto</li>
                <li>Copie as credenciais da seção "Seu aplicativo web"</li>
                <li>Substitua os valores nas variáveis de ambiente</li>
              </ol>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm text-primary">
                <strong>Nota:</strong> As variáveis de ambiente precisam começar com{" "}
                <code className="bg-background px-2 py-1 rounded">NEXT_PUBLIC_</code> para serem acessíveis no cliente.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
