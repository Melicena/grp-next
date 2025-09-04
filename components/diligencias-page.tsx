"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Calendar,
  User,
  ExternalLink,
  Filter,
  Download,
  Eye
} from "lucide-react"

// Datos de ejemplo para las diligencias
const diligenciasData = [
  {
    titulo: "Diligencia de Verificación - Denuncia",
    tipo: "Verificación",
    descripcion: "Verificación de datos en denuncia por estafa",
  },
  {
    titulo: "Diligencia de Seguimiento - Caso Violencia",
    tipo: "Seguimiento",
    descripcion: "Seguimiento de caso de violencia doméstica",
  },
  {
    titulo: "Diligencia de Reconocimiento - Identificación",
    tipo: "Reconocimiento",
    descripcion: "Reconocimiento fotográfico para identificación",
  }
]

interface DiligenciasPageProps {
  className?: string
}

export function DiligenciasPage({ className }: DiligenciasPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  // Filtrar diligencias basado en búsqueda y filtros
  const diligenciasFiltradas = diligenciasData.filter((diligencia) => {
    const matchesSearch = 
      diligencia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diligencia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTipo = filtroTipo === "todos" || diligencia.tipo === filtroTipo
    const matchesEstado = filtroEstado === "todos" 
    
    return matchesSearch && matchesTipo && matchesEstado
  })

  const handleVerDocumento = (id: string) => {
    // Aquí puedes implementar la navegación a la página específica del documento
    console.log(`Navegando al documento: ${id}`)
    // Por ejemplo: router.push(`/diligencias/${id}`)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Diligencias</h1>
        <p className="text-muted-foreground mt-2">
          Generador y gestión de diligencias policiales
        </p>
      </div>

      {/* Buscador y Filtros */}
      <Card>
        <CardContent className="space-y-4">
          {/* Buscador principal */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/70" />
            <Input
              placeholder="Buscar diligencias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-foreground/30 bg-background/80 backdrop-blur-sm focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-foreground/50 text-foreground font-medium shadow-sm"
            />
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-muted-foreground">
            Mostrando {diligenciasFiltradas.length} de {diligenciasData.length} diligencias
          </div>
        </CardContent>
      </Card>

      {/* Lista de Diligencias */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lista de Documentos</h2>
        
        {diligenciasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No se encontraron diligencias que coincidan con los criterios de búsqueda</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {diligenciasFiltradas.map((diligencia) => (
              <Card key={diligencia.titulo} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{diligencia.titulo}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {diligencia.descripcion}
                      </CardDescription>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleVerDocumento(diligencia.titulo)}
                        className="flex items-center gap-2"
                      >
                        Abrir
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}