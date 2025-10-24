"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2, Info } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, isConfigured } = useAuth()

  if (user) {
    router.push("/dashboard")
    return null
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <div className="p-8">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Agency Pro</h1>
              <p className="text-muted-foreground text-sm">Sistema de gerenciamento de agência</p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Modo de Demonstração
                </h3>
                <p className="text-sm text-muted-foreground">
                  O Firebase não está configurado. Este é um preview do sistema.
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Para usar o sistema completo:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Faça o deploy no Cloudflare Pages</li>
                  <li>Configure as variáveis de ambiente do Firebase</li>
                  <li>Crie o primeiro usuário Super Admin no Firebase Console</li>
                  <li>Faça login e comece a usar!</li>
                </ol>
              </div>

              <div className="pt-4">
                <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                  Voltar para Home
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-xs text-muted-foreground">Apenas administradores podem criar contas</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { initializeFirebase } = await import("@/lib/firebase")
      const firebaseResult = await initializeFirebase()

      if (!firebaseResult?.auth || !firebaseResult?.db) {
        setError("Firebase não está disponível")
        setLoading(false)
        return
      }

      const { auth, db } = firebaseResult
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const { doc, getDoc } = await import("firebase/firestore")

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
      const userData = userDoc.data()

      if (userData?.status === "banned") {
        setError("Sua conta foi banida. Entre em contato com o administrador.")
        const { signOut } = await import("firebase/auth")
        await signOut(auth)
        setLoading(false)
        return
      }

      if (userData?.status === "paused") {
        setError("Sua conta está pausada. Entre em contato com o administrador.")
        const { signOut } = await import("firebase/auth")
        await signOut(auth)
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Usuário não encontrado.")
      } else if (err.code === "auth/wrong-password") {
        setError("Senha incorreta.")
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido.")
      } else {
        setError("Erro ao fazer login. Tente novamente.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Agency Pro</h1>
            <p className="text-muted-foreground text-sm">Sistema de gerenciamento de agência</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="bg-background border-border text-foreground"
              />
            </div>

            <Button type="submit" disabled={loading || !email || !password} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">Apenas administradores podem criar contas</p>
        </div>
      </Card>
    </div>
  )
}
