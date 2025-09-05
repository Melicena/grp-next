"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { diligenciasData } from "@/app/diligencias/diligencias-data"
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
import ConfiguracionPage from "@/components/configuracion-page"

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
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === "dashboard" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-balance">Panel de Control</h2>
                <p className="text-muted-foreground mt-2">Acceso rápido a todas las funciones del sistema policial</p>
              </div>

              {/* Quick Access Grid */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {navigationItems.map((item) => {
                    // Función para obtener el contador según el tipo de tarjeta
                    const getCounterValue = (itemId: string) => {
                      switch (itemId) {
                        case "diligencias":
                          return diligenciasData.length;
                        case "atestados":
                          return 0; // Temporal - pendiente fuente de datos
                        case "codificados":
                          return 0; // Temporal - pendiente fuente de datos
                        case "directorio":
                          return 0; // Temporal - pendiente fuente de datos
                        case "eventos":
                          return 0; // Temporal - pendiente fuente de datos
                        case "novedades":
                          return 0; // Temporal - pendiente fuente de datos
                        case "guias":
                          return 0; // Temporal - pendiente fuente de datos
                        case "impresos":
                          return 0; // Temporal - pendiente fuente de datos
                        case "instancias":
                          return 0; // Temporal - pendiente fuente de datos
                        case "oficios":
                          return 0; // Temporal - pendiente fuente de datos
                        case "personal":
                          return 0; // Temporal - pendiente fuente de datos
                        case "repositorio":
                          return 0; // Temporal - pendiente fuente de datos
                        default:
                          return 0;
                      }
                    };

                    return (
                      <Card
                        key={item.id}
                        className="cursor-pointer hover:shadow-md transition-shadow relative"
                        onClick={() => {
                          if (item.id === "diligencias") {
                            router.push("/diligencias");
                          } else {
                            setActiveSection(item.id);
                          }
                        }}
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
                          {/* Contador elegante con color uniforme para todas las tarjetas */}
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              <span>{getCounterValue(item.id)}</span>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            
              {/* Encartados Section - Now using the reusable component */}
              <EncartadosSection />
            
            
            </div>
          ) : activeSection === "diligencias" ? (
            <DiligenciasPage />
          ) : activeSection === "configuracion" ? (
            <ConfiguracionPage />
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
