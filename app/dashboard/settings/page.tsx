"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { updateProfile, updateEmail, updatePassword } from "firebase/auth"
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user, firebaseUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        whatsappNumber: user.whatsappNumber || "",
      }))
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!firebaseUser) throw new Error("Usuário não autenticado")

      // Atualizar nome
      if (formData.name !== user?.name) {
        await updateProfile(firebaseUser, { displayName: formData.name })
      }

      // Atualizar email
      if (formData.email !== user?.email) {
        await updateEmail(firebaseUser, formData.email)
      }

      // Atualizar dados no Firestore
      await updateDoc(doc(db, "users", user!.uid), {
        name: formData.name,
        email: formData.email,
        whatsappNumber: formData.whatsappNumber,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      })
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar perfil",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
      })
      return
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
      })
      return
    }

    setLoading(true)

    try {
      if (!firebaseUser) throw new Error("Usuário não autenticado")

      await updatePassword(firebaseUser, formData.newPassword)

      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso",
      })

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar senha",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted">Gerencie suas configurações pessoais e de segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Perfil */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Informações Pessoais</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
              <Input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+55 11 99999-9999"
                className="bg-background border-border"
              />
            </div>

            <Button type="submit" disabled={loading} className="gap-2 w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Alterações
            </Button>
          </form>
        </Card>

        {/* Segurança */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Segurança</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning">Altere sua senha regularmente para manter sua conta segura</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nova Senha</label>
              <Input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="••••••••"
                className="bg-background border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmar Senha</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="bg-background border-border"
              />
            </div>

            <Button type="submit" disabled={loading} className="gap-2 w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Alterar Senha
            </Button>
          </form>
        </Card>
      </div>

      {/* Informações da Conta */}
      <Card className="bg-card border-border p-6 mt-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Informações da Conta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted mb-1">Cargo</p>
            <p className="text-foreground font-medium">{user?.role.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Status</p>
            <span
              className={`text-sm px-2 py-1 rounded inline-block ${
                user?.status === "active"
                  ? "bg-success/20 text-success"
                  : user?.status === "paused"
                    ? "bg-warning/20 text-warning"
                    : "bg-error/20 text-error"
              }`}
            >
              {user?.status === "active" ? "Ativo" : user?.status === "paused" ? "Pausado" : "Banido"}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Membro desde</p>
            <p className="text-foreground font-medium">{user?.createdAt.toLocaleDateString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Última atualização</p>
            <p className="text-foreground font-medium">{user?.updatedAt.toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
