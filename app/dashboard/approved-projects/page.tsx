"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore"
import { Trash2, Search, Loader2, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ApprovedProject {
  id: string
  projectId: string
  projectTitle: string
  approvedBy: string
  approvedByName: string
  approvedAt: Date
}

export default function ApprovedProjectsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<ApprovedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState("")

  useEffect(() => {
    loadApprovedProjects()
  }, [])

  const loadApprovedProjects = async () => {
    try {
      const projectsRef = collection(db, "approved-projects")
      const q = query(projectsRef, orderBy("approvedAt", "desc"))
      const snapshot = await getDocs(q)
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        approvedAt: doc.data().approvedAt?.toDate?.() || new Date(),
      })) as ApprovedProject[]

      setProjects(projectsData)
    } catch (error) {
      console.error("Erro ao carregar projetos aprovados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos aprovados",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto do histórico?")) return

    try {
      await deleteDoc(doc(db, "approved-projects", projectId))

      toast({
        title: "Sucesso",
        description: "Projeto removido do histórico",
      })

      loadApprovedProjects()
    } catch (error) {
      console.error("Erro ao deletar projeto:", error)
      toast({
        title: "Erro",
        description: "Erro ao deletar projeto",
      })
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = !filterMonth || project.approvedAt.toISOString().substring(0, 7) === filterMonth

    return matchesSearch && matchesMonth
  })

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Projetos Aprovados</h1>
        <p className="text-muted">Histórico de todos os projetos aprovados</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
          <Input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        <Input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-background border-border"
        />

        {(searchTerm || filterMonth) && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setFilterMonth("")
            }}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <Card className="bg-card border-border p-6 col-span-full text-center">
            <p className="text-muted">Nenhum projeto aprovado encontrado</p>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="bg-card border-border p-4 hover:border-primary/50 transition-colors">
              <div className="space-y-3">
                <Link href={`/dashboard/projects/${project.projectId}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer line-clamp-2">
                    {project.projectTitle}
                  </h3>
                </Link>

                <div className="space-y-2 text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>Aprovado por: {project.approvedByName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{project.approvedAt.toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/dashboard/projects/${project.projectId}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Ver Projeto
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
