"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, FolderOpen, Users, Settings, LogOut, Shield, CheckCircle2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { user, signOut, isSuperAdmin, isAdmin, hasPermission } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: "Projetos",
      href: "/dashboard/projects",
      icon: FolderOpen,
      show: true,
    },
    {
      label: "Projetos Aprovados",
      href: "/dashboard/approved-projects",
      icon: CheckCircle2,
      show: true,
    },
    {
      label: "Revisões",
      href: "/dashboard/reviews",
      icon: MessageSquare,
      show: hasPermission("view_reviews"),
    },
    {
      label: "Usuários",
      href: "/dashboard/users",
      icon: Users,
      show: isAdmin(),
    },
    {
      label: "Cargos",
      href: "/dashboard/roles",
      icon: Shield,
      show: isSuperAdmin(),
    },
    {
      label: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
      show: true,
    },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Marketing Pro</h1>
        <p className="text-xs text-muted mt-1">{user?.role.name}</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          if (!item.show) return null
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-foreground hover:bg-card-hover",
                  isActive && "bg-primary/20 text-primary",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="px-3 py-2 text-xs text-muted">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs">{user?.email}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-error hover:bg-error/10"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
