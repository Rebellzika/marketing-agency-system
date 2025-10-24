import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users } from "lucide-react"

// Função necessária para export estático
export async function generateStaticParams() {
  // Para export estático, retornamos alguns IDs de exemplo
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const projectId = params.id

  // Dados estáticos para demonstração
  const project = {
    id: projectId,
    title: `Projeto ${projectId}`,
    description: "Descrição do projeto de exemplo",
    status: "active" as const,
    dueDate: new Date("2024-12-31"),
    assignedUsers: ["Usuário 1", "Usuário 2"],
    content: "<p>Conteúdo do projeto de exemplo</p>"
  }

  return (
    <div className="p-8">
      <Link href="/dashboard/projects">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">{project.title}</h1>
            <p className="text-foreground mb-4">{project.description}</p>
            <div className="text-sm text-muted-foreground">
              <p>Data de entrega: {project.dueDate.toLocaleDateString("pt-BR")}</p>
            </div>
          </Card>

          {/* Conteúdo do Projeto */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Conteúdo do Projeto</h2>
            <div
              className="w-full min-h-96 p-4 bg-background border border-border rounded-md text-foreground prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informações do Projeto */}
          <Card className="bg-card border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Informações</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted mb-1">Status</p>
                <span className="text-xs px-2 py-1 rounded bg-success/20 text-success">
                  Ativo
                </span>
              </div>

              <div>
                <p className="text-xs text-muted mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Data de Entrega
                </p>
                <p className="text-sm text-foreground">{project.dueDate.toLocaleDateString("pt-BR")}</p>
              </div>

              <div>
                <p className="text-xs text-muted mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Atribuídos
                </p>
                <div className="space-y-1">
                  {project.assignedUsers.map((user, index) => (
                    <div key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {user}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
