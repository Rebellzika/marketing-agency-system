"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFirebase } from "@/hooks/use-firebase"
import { collection, query, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { Plus, Trash2, Ban, Pause, Play, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  uid: string
  email: string
  name: string
  role: {
    id: string
    name: string
    level: number
  }
  status: "active" | "paused" | "banned"
  whatsappNumber?: string
  createdAt: Date
}

export default function UsersPage() {
  const { user, isAdmin } = useAuth()
  const { db, auth, loading: firebaseLoading } = useFirebase()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    roleId: "",
    whatsappNumber: "",
  })
  const [roles, setRoles] = useState<any[]>([])

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/dashboard")
      return
    }
    if (!firebaseLoading && db) {
      loadUsers()
      loadRoles()
    }
  }, [isAdmin, router, firebaseLoading, db])

  const loadUsers = async () => {
    if (!db) return
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef)
      const snapshot = await getDocs(q)
      const usersData = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as User[]
      setUsers(usersData)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    if (!db) return
    try {
      const rolesRef = collection(db, "roles")
      const snapshot = await getDocs(rolesRef)
      const rolesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setRoles(rolesData)
    } catch (error) {
      console.error("Erro ao carregar cargos:", error)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.name || !formData.roleId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      })
      return
    }

    if (!auth || !db) {
      toast({
        title: "Erro",
        description: "Firebase não está configurado",
      })
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      const selectedRole = roles.find((r) => r.id === formData.roleId)

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: formData.email,
        name: formData.name,
        role: {
          id: selectedRole.id,
          name: selectedRole.name,
          level: selectedRole.level,
          permissions: selectedRole.permissions,
        },
        status: "active",
        whatsappNumber: formData.whatsappNumber || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      })

      setFormData({
        email: "",
        password: "",
        name: "",
        roleId: "",
        whatsappNumber: "",
      })
      setShowCreateForm(false)
      loadUsers()
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserStatus = async (userId: string, newStatus: "active" | "paused" | "banned") => {
    if (!db) return
    try {
      await updateDoc(doc(db, "users", userId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: `Usuário ${newStatus === "active" ? "ativado" : newStatus === "paused" ? "pausado" : "banido"}`,
      })

      loadUsers()
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!db) return
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return

    try {
      await deleteDoc(doc(db, "users", userId))

      toast({
        title: "Sucesso",
        description: "Usuário deletado com sucesso",
      })

      loadUsers()
    } catch (error) {
      console.error("Erro ao deletar usuário:", error)
      toast({
        title: "Erro",
        description: "Erro ao deletar usuário",
      })
    }
  }

  if ((loading || firebaseLoading) && users.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Usuários</h1>
          <p className="text-muted">Crie, edite e gerencie os usuários da sua agência</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-card border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Criar Novo Usuário</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@email.com"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cargo</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-foreground"
                >
                  <option value="">Selecione um cargo</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">WhatsApp (opcional)</label>
                <Input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+55 11 99999-9999"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Criar Usuário
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {users.map((u) => (
          <Card key={u.uid} className="bg-card border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{u.name}</h3>
                <p className="text-sm text-muted">{u.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{u.role.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      u.status === "active"
                        ? "bg-success/20 text-success"
                        : u.status === "paused"
                          ? "bg-warning/20 text-warning"
                          : "bg-error/20 text-error"
                    }`}
                  >
                    {u.status === "active" ? "Ativo" : u.status === "paused" ? "Pausado" : "Banido"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {u.status === "active" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateUserStatus(u.uid, "paused")}
                    className="gap-1"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                )}
                {u.status === "paused" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateUserStatus(u.uid, "active")}
                    className="gap-1"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                {u.status !== "banned" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateUserStatus(u.uid, "banned")}
                    className="gap-1 text-error"
                  >
                    <Ban className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteUser(u.uid)}
                  className="gap-1 text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
