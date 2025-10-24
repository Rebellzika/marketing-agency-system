"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Role {
  id: string
  name: string
  level: number
  permissions: string[]
  description: string
  createdAt: Date
}

const AVAILABLE_PERMISSIONS = [
  { id: "view_projects", label: "Ver Projetos" },
  { id: "create_projects", label: "Criar Projetos" },
  { id: "edit_projects", label: "Editar Projetos" },
  { id: "delete_projects", label: "Deletar Projetos" },
  { id: "view_reviews", label: "Ver Revisões" },
  { id: "create_reviews", label: "Criar Revisões" },
  { id: "approve_projects", label: "Aprovar Projetos" },
  { id: "manage_users", label: "Gerenciar Usuários" },
  { id: "manage_roles", label: "Gerenciar Cargos" },
  { id: "view_analytics", label: "Ver Análises" },
  { id: "send_whatsapp", label: "Enviar WhatsApp" },
]

export default function RolesPage() {
  const { user, isSuperAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  useEffect(() => {
    if (!isSuperAdmin()) {
      router.push("/dashboard")
      return
    }
    loadRoles()
  }, [isSuperAdmin, router])

  const loadRoles = async () => {
    try {
      const rolesRef = collection(db, "roles")
      const snapshot = await getDocs(rolesRef)
      const rolesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Role[]
      setRoles(rolesData.sort((a, b) => a.level - b.level))
    } catch (error) {
      console.error("Erro ao carregar cargos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cargos",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Erro",
        description: "Nome do cargo é obrigatório",
      })
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        await updateDoc(doc(db, "roles", editingId), {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          updatedAt: serverTimestamp(),
        })
        toast({
          title: "Sucesso",
          description: "Cargo atualizado com sucesso",
        })
      } else {
        const newLevel = Math.max(...roles.map((r) => r.level), 1) + 1
        await setDoc(doc(db, "roles", formData.name.toLowerCase().replace(/\s+/g, "-")), {
          name: formData.name,
          description: formData.description,
          level: newLevel,
          permissions: formData.permissions,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        toast({
          title: "Sucesso",
          description: "Cargo criado com sucesso",
        })
      }

      setFormData({
        name: "",
        description: "",
        permissions: [],
      })
      setEditingId(null)
      setShowCreateForm(false)
      loadRoles()
    } catch (error: any) {
      console.error("Erro ao salvar cargo:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar cargo",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Tem certeza que deseja deletar este cargo?")) return

    try {
      await deleteDoc(doc(db, "roles", roleId))

      toast({
        title: "Sucesso",
        description: "Cargo deletado com sucesso",
      })

      loadRoles()
    } catch (error) {
      console.error("Erro ao deletar cargo:", error)
      toast({
        title: "Erro",
        description: "Erro ao deletar cargo",
      })
    }
  }

  const handleEditRole = (role: Role) => {
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })
    setEditingId(role.id)
    setShowCreateForm(true)
  }

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  if (loading && roles.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Cargos</h1>
          <p className="text-muted">Crie e customize os cargos e permissões da sua agência</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Cargo
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-card border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">{editingId ? "Editar Cargo" : "Criar Novo Cargo"}</h2>
          <form onSubmit={handleSaveRole} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nome do Cargo</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Designer Sênior"
                className="bg-background border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do cargo"
                className="w-full h-24 rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-4">Permissões</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingId ? "Atualizar Cargo" : "Criar Cargo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingId(null)
                  setFormData({
                    name: "",
                    description: "",
                    permissions: [],
                  })
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {roles.map((role) => (
          <Card key={role.id} className="bg-card border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{role.name}</h3>
                <p className="text-sm text-muted">{role.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {role.permissions.map((perm) => {
                    const permLabel = AVAILABLE_PERMISSIONS.find((p) => p.id === perm)?.label
                    return (
                      <span key={perm} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {permLabel}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEditRole(role)} className="gap-1">
                  <Edit2 className="w-4 h-4" />
                </Button>
                {role.level > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteRole(role.id)}
                    className="gap-1 text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
