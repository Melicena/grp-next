"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import {
  FileText,
  Code,
  ClipboardList,
  Users,
  Calendar,
  Bell,
  BookOpen,
  Printer,
  Building,
  Mail,
  User,
  Archive,
  Shield,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react"

const navigationItems = [
  { id: "atestados", name: "Atestados", icon: FileText, description: "Gestión de atestados policiales", href: "/atestados" },
  { id: "codificados", name: "Codificados", icon: Code, description: "Códigos y clasificaciones", href: "/codificados" },
  { id: "diligencias", name: "Diligencias", icon: ClipboardList, description: "Generador de diligencias", href: "/diligencias" },
  { id: "directorio", name: "Directorio", icon: Users, description: "Directorio de contactos", href: "/directorio" },
  { id: "eventos", name: "Eventos", icon: Calendar, description: "Calendario de eventos", href: "/eventos" },
  { id: "novedades", name: "Novedades", icon: Bell, description: "Últimas novedades", href: "/novedades" },
  { id: "guias", name: "Guías", icon: BookOpen, description: "Guías y procedimientos", href: "/guias" },
  { id: "impresos", name: "Impresos", icon: Printer, description: "Formularios e impresos", href: "/impresos" },
  { id: "instancias", name: "Instancias", icon: Building, description: "Gestión de instancias", href: "/instancias" },
  { id: "oficios", name: "Oficios", icon: Mail, description: "Oficios y comunicaciones", href: "/oficios" },
  { id: "personal", name: "Personal", icon: User, description: "Gestión de personal", href: "/personal" },
  { id: "repositorio", name: "Repositorio", icon: Archive, description: "Repositorio de documentos", href: "/repositorio" },
]

interface SharedLayoutProps {
  children: React.ReactNode
}

export function SharedLayout({ children }: SharedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      // La redirección se maneja automáticamente en el contexto de autenticación
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-sidebar border-b border-sidebar-border px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Gesrepol - Sistema Policial</h1>
                <p className="text-sm text-sidebar-foreground/70">Gestión y Procedimientos</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => {
                router.push('/configuracion')
                setSidebarOpen(false)
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-400 hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0">
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => {
                  router.push("/")
                  setSidebarOpen(false)
                }}
              >
                <Shield className="h-4 w-4 mr-3" />
                Dashboard
              </Button>

              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              ))}
              
              <Button
                variant={pathname === "/configuracion" ? "secondary" : "ghost"}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => {
                  router.push("/configuracion")
                  setSidebarOpen(false)
                }}
              >
                <Settings className="h-4 w-4 mr-3" />
                Configuración
              </Button>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-0">
          {children}
        </main>
      </div>
    </div>
  )
}