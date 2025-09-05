"use client"

import { useState } from "react"
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

// Datos de ejemplo para las diligencias
const diligenciasData = [
  {
    titulo: "Diligencia de Archivo",
    tipo: ["Archivo"],
    descripcion: "Diligencia para el archivo de actuaciones"
  },
  {
    id: "2",
    titulo: "Carátula (Archivo)",
    tipo: ["Archivo", "Carátula"],
    descripcion: "Carátula para procedimientos de archivo"
  },
  {
    id: "3",
    titulo: "Diligencia de aviso letrado (detenido)",
    tipo: ["Letrado", "Aviso"],
    descripcion: "Aviso al letrado de persona detenida"
  },
  {
    id: "4",
    titulo: "Diligencia de información de derechos y de los elementos esenciales de las actuaciones para impugnar la detención",
    tipo: ["Detenido", "Derechos"],
    descripcion: "Información de derechos del detenido"
  },
  {
    id: "5",
    titulo: "Diligencia de aviso a familiar o persona designada",
    tipo: ["Detenido", "Aviso"],
    descripcion: "Aviso a familiar del detenido"
  },
  {
    id: "6",
    titulo: "Diligencia de aviso a Autoridad Judicial",
    tipo: ["Aviso"],
    descripcion: "Comunicación a la autoridad judicial"
  },
  {
    id: "7",
    titulo: "Diligencia de Derechos delitos violentos/sexuales",
    tipo: ["Sexual", "Derechos"],
    descripcion: "Derechos específicos para delitos violentos o sexuales"
  },
  {
    id: "8",
    titulo: "Diligencia de Solicitud medios telemáticos (VIOGEN)",
    tipo: ["VIOGEN"],
    descripcion: "Solicitud de medios telemáticos del sistema VIOGEN"
  },
  {
    id: "9",
    titulo: "Diligencia de Manifestación detenido/investigado",
    tipo: ["Detenido", "Manifestacion"],
    descripcion: "Manifestación del detenido o investigado"
  },
  {
    id: "10",
    titulo: "Diligencia de entrega de Plan de Seguridad",
    tipo: ["VIOGEN"],
    descripcion: "Entrega del plan de seguridad a la víctima"
  },
  {
    id: "11",
    titulo: "Anexo",
    tipo: ["Anexo"],
    descripcion: "Documentación anexa al procedimiento"
  },
  {
    id: "12",
    titulo: "Diligencia resumen",
    tipo: ["JRDL", "JRSD", "JRD"],
    descripcion: "Resumen de las actuaciones realizadas"
  },
  {
    id: "13",
    titulo: "Diligencia haciendo constar renuncia del perjudicado a llevar a cabo acciones penales",
    tipo: ["Renuncia", "VIOGEN", "VIODOM"],
    descripcion: "Renuncia del perjudicado a acciones penales"
  },
  {
    id: "14",
    titulo: "Dispensa de Denunciar",
    tipo: ["Dispensa"],
    descripcion: "Dispensa del deber de denunciar"
  },
  {
    id: "15",
    titulo: "Derechos víctima VIOGEN",
    tipo: ["VIOGEN", "Derechos"],
    descripcion: "Derechos específicos de víctimas en el sistema VIOGEN"
  },
  {
    id: "16",
    titulo: "Diligencia haciendo constar resultado de la valoración policial de RIESGO",
    tipo: ["VIOGEN"],
    descripcion: "Resultado de la valoración policial de riesgo"
  },
  {
    id: "17",
    titulo: "Diligencia informando a la víctima del derecho de acceso a una vivienda de acogida",
    tipo: ["VIOGEN", "Derechos"],
    descripcion: "Información sobre derecho a vivienda de acogida"
  },
  {
    id: "18",
    titulo: "Diligencia dirigida a FISCALÍA proponiendo solicitud a la autoridad judicial de Instalación de dispositivo telemático control",
    tipo: ["VIOGEN"],
    descripcion: "Propuesta de dispositivo telemático de control"
  },
  {
    id: "19",
    titulo: "Diligencia de antecedentes del Sistema de Registro Integral de Seguimiento de Víctimas de Violencia de Género",
    tipo: ["VIOGEN", "Antecedentes"],
    descripcion: "Antecedentes del sistema de seguimiento de víctimas"
  },
  {
    id: "20",
    titulo: "Diligencia informando a la víctima de caso con autor persistente",
    tipo: ["VIOGEN"],
    descripcion: "Información sobre casos con autor persistente"
  },
  {
    id: "21",
    titulo: "Diligencia describiendo lesiones de la víctima",
    tipo: ["Lesiones"],
    descripcion: "Descripción detallada de las lesiones de la víctima"
  },
  {
    id: "22",
    titulo: "Diligencia haciendo constar consulta en Intervención Central de Armas y Explosivos",
    tipo: ["Consulta"],
    descripcion: "Consulta en base de datos de armas y explosivos"
  },
  {
    id: "23",
    titulo: "Consentimiento de la víctma para subir su fotografía al Sistema VIOGEN",
    tipo: ["VIOGEN"],
    descripcion: "Consentimiento para fotografía en sistema VIOGEN"
  },
  {
    id: "24",
    titulo: "Carátula (Traspaso)",
    tipo: ["Traspaso", "Carátula"],
    descripcion: "Carátula para procedimientos de traspaso"
  },
  {
    id: "25",
    titulo: "Acta de información de derechos a persona víctima de un delito",
    tipo: ["Derechos"],
    descripcion: "Acta informativa de derechos de la víctima"
  },
  {
    id: "26",
    titulo: "Diligencia haciendo constar situación administrativa de la víctima extranjera",
    tipo: ["Extranjero"],
    descripcion: "Situación administrativa de víctima extranjera"
  },
  {
    id: "27",
    titulo: "Diligencia haciendo constar situación administrativa del autor extranjero",
    tipo: ["Extranjero"],
    descripcion: "Situación administrativa de autor extranjero"
  },
  {
    id: "28",
    titulo: "Diligencia de remisión/entrega de atestado",
    tipo: ["Remisiones"],
    descripcion: "Remisión o entrega del atestado policial"
  },
  {
    id: "29",
    titulo: "Diligencia de traspaso",
    tipo: ["Traspaso"],
    descripcion: "Traspaso de competencias o procedimiento"
  },
  {
    id: "30",
    titulo: "Diligencia de lectura de derechos investigado no detenido",
    tipo: ["Investigado", "Derechos"],
    descripcion: "Lectura de derechos a investigado no detenido"
  },
  {
    id: "31",
    titulo: "Carátula",
    tipo: ["Carátula"],
    descripcion: "Carátula general del procedimiento"
  }
]

interface DiligenciasPageProps {
  className?: string
}

export function DiligenciasPage({ className }: DiligenciasPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado] = useState("todos")

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
    // Aquí puedes implementar la navegación a la página específica del documento
    console.log(`Navegando al documento: ${id}`)
    // Por ejemplo: router.push(`/diligencias/${id}`)
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
              <Card key={diligencia.titulo} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary/40">
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
                      <Button
                        onClick={() => handleVerDocumento(diligencia.titulo)}
                        className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                        size="sm"
                      >
                        <FileText className="h-4 w-4" />
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