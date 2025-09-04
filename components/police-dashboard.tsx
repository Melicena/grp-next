"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
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
  LogOut,
  Search,
  Settings,
  Menu,
  X,
  UserPlus,
  Plus,
  Save,
  Upload,
  Trash2
} from "lucide-react"
import { DiligenciasPage } from "@/components/diligencias-page"
import { EncartadosSection } from "@/components/encartados-section"

const navigationItems = [
  { id: "atestados", name: "Atestados", icon: FileText, description: "Gestión de atestados policiales" },
  { id: "codificados", name: "Codificados", icon: Code, description: "Códigos y clasificaciones" },
  { id: "diligencias", name: "Diligencias", icon: ClipboardList, description: "Generador de diligencias" },
  { id: "directorio", name: "Directorio", icon: Users, description: "Directorio de contactos" },
  { id: "eventos", name: "Eventos", icon: Calendar, description: "Calendario de eventos" },
  { id: "novedades", name: "Novedades", icon: Bell, description: "Últimas novedades" },
  { id: "guias", name: "Guías", icon: BookOpen, description: "Guías y procedimientos" },
  { id: "impresos", name: "Impresos", icon: Printer, description: "Formularios e impresos" },
  { id: "instancias", name: "Instancias", icon: Building, description: "Gestión de instancias" },
  { id: "oficios", name: "Oficios", icon: Mail, description: "Oficios y comunicaciones" },
  { id: "personal", name: "Personal", icon: User, description: "Gestión de personal" },
  { id: "repositorio", name: "Repositorio", icon: Archive, description: "Repositorio de documentos" },
]

export function PoliceDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
                <h1 className="text-xl font-bold text-sidebar-foreground">GPR - Sistema Policial</h1>
                <p className="text-sm text-sidebar-foreground/70">Gestión y Procedimientos</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="text-sidebar-foreground hover:bg-sidebar-accent">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" className="text-sidebar-foreground hover:bg-sidebar-accent">
              <Plus className="h-4 w-4 mr-1" /> AÑADIR
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
                variant={activeSection === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => {
                  setActiveSection("dashboard")
                  setSidebarOpen(false)
                }}
              >
                <Shield className="h-4 w-4 mr-3" />
                Dashboard
              </Button>

              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === "dashboard" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-balance">Panel de Control</h2>
                <p className="text-muted-foreground mt-2">Acceso rápido a todas las funciones del sistema policial</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Atestados Activos</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+2 desde ayer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Diligencias Pendientes</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">-3 desde ayer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Personal Activo</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">+1 desde ayer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Eventos Hoy</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">3 completados</p>
                  </CardContent>
                </Card>
              </div>



              {/* Quick Access Grid */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Acceso Rápido</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {navigationItems.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <item.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            
              {/* Encartados Section - Now using the reusable component */}
              <EncartadosSection />
            
            
            </div>
          ) : activeSection === "diligencias" ? (
            <DiligenciasPage />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-balance">
                  {navigationItems.find((item) => item.id === activeSection)?.name || "Sección"}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {navigationItems.find((item) => item.id === activeSection)?.description ||
                    "Descripción de la sección"}
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Contenido de {navigationItems.find((item) => item.id === activeSection)?.name}</CardTitle>
                  <CardDescription>
                    Esta sección está en desarrollo. Aquí se mostrará el contenido específico para{" "}
                    {navigationItems.find((item) => item.id === activeSection)?.name}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      {navigationItems.find((item) => item.id === activeSection)?.icon && (
                        <div className="h-12 w-12 mx-auto mb-2">
                          {navigationItems
                            .find((item) => item.id === activeSection)!
                            .icon({ className: "h-12 w-12 mx-auto mb-2" })}
                        </div>
                      )}
                      <p>Contenido próximamente disponible</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
