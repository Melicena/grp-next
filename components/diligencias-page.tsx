"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Filter,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { diligenciasData, type DiligenciaData } from "@/app/diligencias/diligencias-data"
import { EncartadosSection } from "@/components/encartados-section"

interface DiligenciasPageProps {
  className?: string
}

export function DiligenciasPage({ className }: DiligenciasPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado] = useState("todos")
  const router = useRouter()

  // Obtener tipos únicos para el filtro - ahora desde arrays
  const tiposUnicos = Array.from(new Set(diligenciasData.flatMap(d => d.tipo))).sort()

  // Filtrar diligencias basado en búsqueda y filtros
  const diligenciasFiltradas = diligenciasData.filter((diligencia) => {
    const matchesSearch = 
      diligencia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diligencia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTipo = filtroTipo === "todos" || diligencia.tipo.includes(filtroTipo)
    const matchesEstado = filtroEstado === "todos" 
    
    return matchesSearch && matchesTipo && matchesEstado
  }).sort((a, b) => a.titulo.localeCompare(b.titulo))

  const handleVerDocumento = (id: string) => {
    // Navegación específica según el tipo de diligencia
    if (id === "Diligencia de Archivo") {
      router.push("/diligencias/archivo")
    } else {
      console.log(`Navegando al documento: ${id}`)
      // Para otros tipos de diligencias, implementar navegación específica
      // router.push(`/diligencias/${id}`)
    }
  }

  // Función para obtener el color del badge según el tipo - todos en azul
  const getTipoBadgeVariant = (tipo: string) => {
    const colorMap: { [key: string]: string } = {
      "Violencia": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    }
    return colorMap[tipo] || "bg-blue-100 text-blue-800 hover:bg-blue-200"
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
          {/* Buscador y Filtros en una sola fila */}
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Buscador principal */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/70" />
                <Input
                  placeholder="Buscar diligencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-foreground/30 bg-background/80 backdrop-blur-sm focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-foreground/50 text-foreground font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Filtro de Tipo */}
            <div className="w-full lg:w-64">
              <label className="text-sm font-medium mb-2 block">Tipo de Diligencia</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="border-2 focus:border-primary/50">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposUnicos.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Icono de filtros */}
            <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg bg-muted/30 border">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-muted-foreground">
            Mostrando {diligenciasFiltradas.length} de {diligenciasData.length} diligencias
          </div>
        </CardContent>
      </Card>

      {/* Lista de Diligencias */}
      <div className="space-y-2">
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
              <Card 
                key={diligencia.titulo} 
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary/40 cursor-pointer"
                onClick={() => handleVerDocumento(diligencia.titulo)}
              >
                <CardHeader className="">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-sm leading-tight">{diligencia.titulo}</CardTitle>
                        <div className="flex flex-wrap gap-1">
                          {diligencia.tipo.map((tipo, index) => (
                            <Badge 
                              key={index}
                              variant="secondary" 
                              className={`${getTipoBadgeVariant(tipo)} font-medium px-1.5 py-0 rounded-md shadow-sm w-fit text-[10px]`}
                            >
                              {tipo}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Abrir</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Sección de Entidades Relacionadas */}
      <EncartadosSection />
    </div>
  )
}