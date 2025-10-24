"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { FolderOpen, Users, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      label: "Projetos Ativos",
      value: "0",
      icon: FolderOpen,
      href: "/dashboard/projects",
    },
    {
      label: "Projetos Aprovados",
      value: "0",
      icon: CheckCircle2,
      href: "/dashboard/approved-projects",
    },
    {
      label: "Pendentes de Revisão",
      value: "0",
      icon: Clock,
      href: "/dashboard/reviews",
    },
    {
      label: "Membros da Equipe",
      value: "0",
      icon: Users,
      href: "/dashboard/users",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo, {user?.name}!</h1>
        <p className="text-muted">Aqui está um resumo da sua agência</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Atividades Recentes</h2>
        <p className="text-muted text-sm">Nenhuma atividade recente</p>
      </Card>
    </div>
  )
}
