"use client"

import { SharedLayout } from "@/components/shared-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Archive, Send } from "lucide-react"

const PREDEFINED_TEXT = `Realizadas gestiones por la Unidad instructora para el esclarecimiento de los hechos, hasta el momento, no han dado resultado positivo. No obstante, se seguirá con la práctica de las mismas de cuyo resultado, en caso positivo, se dará oportuna cuenta.

En cumplimiento de lo previsto en el art. 284.2 de la LECrim, al no existir autor conocido, las presentes diligencias quedan archivadas en este acuartelamiento, donde quedarán a disposición de la Autoridad Judicial competente y del Ministerio Fiscal.

Y para que conste, se extiende la presente en el lugar y fecha señalados, que es firmada por la Fuerza Instructora.

La Fuerza Instructora:`

function formatSpanishDate(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const day = now.getDate()
  const year = now.getFullYear()
  
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  
  const month = months[now.getMonth()]
  
  return `${hours}:${minutes} horas del día ${day} de ${month} de ${year}`
}

export default function ArchivoPage() {
  const [atestado, setAtestado] = useState("2025-1353-")
  const [fecha, setFecha] = useState("")
  const [texto, setTexto] = useState(PREDEFINED_TEXT)

  useEffect(() => {
    setFecha(formatSpanishDate())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    // El formulario se enviará automáticamente al servidor con todos los valores
  }

  return (
    <SharedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Archive className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Archivo de Diligencias</h1>
            <p className="text-muted-foreground">
              Formulario para el archivado de diligencias policiales
            </p>
          </div>
        </div>

        {/* Formulario */}
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Datos de la Diligencia
            </CardTitle>
            <CardDescription>
              Complete los siguientes campos para procesar el archivo de la diligencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              id="formArchivo"
              action="https://gpr-server.dj1x7g.easypanel.host/procesar-diligencia-archivo"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Campo Atestado */}
              <div className="space-y-2">
                <Label htmlFor="atestado" className="text-sm font-medium">
                  Atestado
                </Label>
                <Input
                  id="atestado"
                  name="atestado"
                  type="text"
                  value={atestado}
                  onChange={(e) => setAtestado(e.target.value)}
                  className="font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="2025-1353-"
                />
              </div>

              {/* Campo Fecha */}
              <div className="space-y-2">
                <Label htmlFor="fecha" className="text-sm font-medium">
                  Fecha de la diligencia
                </Label>
                <Input
                  id="fecha"
                  name="fecha_diligencia"
                  type="text"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="Fecha y hora actual"
                />
              </div>

              {/* Campo Texto */}
              <div className="space-y-2">
                <Label htmlFor="texto" className="text-sm font-medium">
                  Texto de la diligencia
                </Label>
                <Textarea
                  id="texto"
                  name="texto_diligencia"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="min-h-[400px] font-mono text-sm leading-relaxed border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="Texto de la diligencia..."
                />
              </div>

              {/* Campos ocultos para el servidor - ahora con datos reales */}
              {/* Campos ocultos para el servidor - ahora con datos reales */}
              <input type="hidden" name="datos_comandancia" value={userData?.comandancia || "VACIA"} />
              <input type="hidden" name="datos_compania" value={userData?.compania || "VACIA"} />
              <input type="hidden" name="datos_puesto" value={userData?.puesto || "VACIA"} />
              <input type="hidden" name="datos_localidad" value={userData?.localidad || "VACIA"} />
              <input type="hidden" name="datos_telefono" value={userData?.telefono || "VACIA"} />
              <input type="hidden" name="datos_email" value={userData?.email || "VACIA"} />
              <input type="hidden" name="datos_direccion" value={userData?.direccion || "VACIA"} />
              <input type="hidden" name="datos_provincia" value={userData?.provincia || "VACIA"} />
              <input type="hidden" name="datos_cp" value={userData?.cp || "VACIA"} />
              {/* Botón de envío */}
              <div className="flex justify-end pt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Generar diligencia
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SharedLayout>
  )
}