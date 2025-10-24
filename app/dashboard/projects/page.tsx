"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  where,
} from "firebase/firestore"
import { Plus, Trash2, Pause, Play, Calendar, Users, Eye, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  status: "active" | "paused" | "completed" | "approved"
  dueDate: Date
  assignedUsers: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export default function ProjectsPage() {
  const { user, hasPermission } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  })
  const [users, setUsers] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    loadProjects()
    loadUsers()
  }, [])

  const loadProjects = async () => {
    try {
      const projectsRef = collection(db, "projects")
      let q

      // Se não for admin, mostrar apenas projetos atribuídos ao usuário
      if (!user?.role || user.role.level > 1) {
        q = query(projectsRef, where("assignedUsers", "array-contains", user?.uid))
      } else {
        q = query(projectsRef)
      }

      const snapshot = await getDocs(q)
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate?.() || new Date(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      })) as Project[]

      setProjects(projectsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (error) {
      console.error("Erro ao carregar projetos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, "users")
      const snapshot = await getDocs(usersRef)
      const usersData = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }))
      setUsers(usersData)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.dueDate || selectedUsers.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      })
      return
    }

    setLoading(true)

    try {
      const projectId = `project-${Date.now()}`
      await setDoc(doc(db, "projects", projectId), {
        title: formData.title,
        description: formData.description,
        status: "active",
        dueDate: new Date(formData.dueDate),
        assignedUsers: selectedUsers,
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso",
      })

      setFormData({
        title: "",
        description: "",
        dueDate: "",
      })
      setSelectedUsers([])
      setShowCreateForm(false)
      loadProjects()
    } catch (error: any) {
      console.error("Erro ao criar projeto:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar projeto",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso",
      })

      loadProjects()
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto",
      })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return

    try {
      await deleteDoc(doc(db, "projects", projectId))

      toast({
        title: "Sucesso",
        description: "Projeto deletado com sucesso",
      })

      loadProjects()
    } catch (error) {
      console.error("Erro ao deletar projeto:", error)
      toast({
        title: "Erro",
        description: "Erro ao deletar projeto",
      })
    }
  }

  if (loading && projects.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Projetos</h1>
          <p className="text-muted">Gerencie todos os seus projetos de marketing</p>
        </div>
        {hasPermission("create_projects") && (
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="bg-card border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Criar Novo Projeto</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Título do Projeto</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Campanha de Verão 2025"
                className="bg-background border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do projeto"
                className="w-full h-24 rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Data de Entrega</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Atribuir Usuários</label>
                <select
                  multiple
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, (option) => option.value))}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-foreground"
                >
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.name} ({u.role.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Criar Projeto
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-card border-border p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link href={`/dashboard/projects/${project.id}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">{project.title}</h3>
                </Link>
                <p className="text-sm text-muted mt-1">{project.description}</p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <Calendar className="w-4 h-4" />
                    {project.dueDate.toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <Users className="w-4 h-4" />
                    {project.assignedUsers.length} usuário(s)
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      project.status === "active"
                        ? "bg-success/20 text-success"
                        : project.status === "paused"
                          ? "bg-warning/20 text-warning"
                          : project.status === "completed"
                            ? "bg-primary/20 text-primary"
                            : "bg-success/20 text-success"
                    }`}
                  >
                    {project.status === "active"
                      ? "Ativo"
                      : project.status === "paused"
                        ? "Pausado"
                        : project.status === "completed"
                          ? "Concluído"
                          : "Aprovado"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>

                {hasPermission("edit_projects") && (
                  <>
                    {project.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateProjectStatus(project.id, "paused")}
                        className="gap-1"
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    {project.status === "paused" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateProjectStatus(project.id, "active")}
                        className="gap-1"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                )}

                {hasPermission("delete_projects") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProject(project.id)}
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
