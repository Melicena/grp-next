"use client"

import { SharedLayout } from "@/components/shared-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BackButton } from "@/components/back-button"
import { EncartadosSection } from "@/components/encartados-section"
import { useState, useEffect } from "react"
import { Phone, Send, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { SPANISH_MONTHS } from "../archivo/constants"

function formatSpanishDate(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const day = now.getDate()
  const year = now.getFullYear()
  
  const month = SPANISH_MONTHS[now.getMonth()]
  
  return `${hours}:${minutes} horas del día ${day} de ${month} de ${year}`
}

// Interfaz para los datos del usuario
interface UserData {
  tip: string
  comandancia: string
  compania: string
  puesto: string
  localidad: string
  telefono: string
  email: string
  direccion: string
  provincia: string
  cp: string
  partido_judicial: string
  codigo_unidad: string
  zona: string
}

// Interfaz para las entidades DGS
interface EntidadDGS {
  id: number
  numero: string
  delito: string
  juzgado: string
  created_at: string
  usuario: string
}

// Interfaz para las entidades de letrados
interface EntidadLetrado {
  id: number
  nombre: string
  numero: string
  letrado_tipo: string
  telefono?: string
  atestado?: string
  created_at: string
  usuario: string
}

export default function AvisoLetradoDetenidoPage() {
  const [atestado, setAtestado] = useState("")
  const [fecha, setFecha] = useState("")
  const [fechaAviso, setFechaAviso] = useState("")
  const [telefonoContacto, setTelefonoContacto] = useState("950.95.18.70")
  const [nombreLetrado, setNombreLetrado] = useState("")
  const [numeroColegiado, setNumeroColegiado] = useState("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Estados para el modal de entidades
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entidades, setEntidades] = useState<EntidadDGS[]>([])
  const [loadingEntidades, setLoadingEntidades] = useState(false)

  // Función para manejar la selección de letrado
  const handleLetradoSelect = (letrado: { nombre: string, numero: string }) => {
    setNombreLetrado(letrado.nombre)
    setNumeroColegiado(letrado.numero)
    toast.success(`Letrado ${letrado.nombre} seleccionado`)
  }

  const { user } = useAuth()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (userData?.codigo_unidad) {
      const currentYear = new Date().getFullYear()
      setAtestado(`${currentYear}-${userData.codigo_unidad}-`)
    }
  }, [userData])
  
  useEffect(() => {
    const currentDateTime = formatSpanishDate()
    setFecha(currentDateTime)
    setFechaAviso(currentDateTime)
    obtenerUsuarioActual()
  }, [])

  useEffect(() => {
    if (userId) {
      cargarDatosUsuario()
    }
  }, [userId])

  const obtenerUsuarioActual = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    } catch (error: unknown) {
      console.error('Error obteniendo usuario:', error)
      toast.error("Error", {
        description: "No se pudo obtener la información del usuario"
      })
    }
  }

  const cargarDatosUsuario = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('datos')
        .select('*')
        .eq('usuario', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setUserData({
          tip: data.tip || "",
          comandancia: data.comandancia || "",
          compania: data.compania || "",
          puesto: data.puesto || "",
          localidad: data.localidad || "",
          telefono: data.telefono || "",
          email: data.email || "",
          direccion: data.direccion || "",
          provincia: data.provincia || "",
          cp: data.cp || "",
          partido_judicial: data.partido_judicial || "",
          codigo_unidad: data.codigo_unidad || "",
          zona: data.zona || ""
        })
      }
    } catch (error: unknown) {
      console.error('Error cargando datos del usuario:', error)
      toast.error("Error", {
        description: "No se pudieron cargar los datos del usuario"
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar entidades DGS
  const loadEntidades = async () => {
    if (!user) return
    
    setLoadingEntidades(true)
    try {
      const { data, error } = await supabase
        .from('entidades_dgs')
        .select('*')
        .eq('usuario', user.id)
        .order('created_at', { ascending: false })
  
      if (error) {
        console.error('Error al cargar entidades:', error)
        toast.error('Error al cargar las entidades DGS')
        return
      }
  
      setEntidades(data || [])
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Error inesperado al cargar entidades')
    } finally {
      setLoadingEntidades(false)
    }
  }

  // Función para seleccionar una entidad
  const handleSelectEntidad = (entidad: EntidadDGS) => {
    setAtestado(entidad.numero)
    setIsModalOpen(false)
    toast.success(`Atestado ${entidad.numero} seleccionado`)
  }

  // Función para abrir el modal y cargar entidades
  const handleOpenModal = async () => {
    setIsModalOpen(true)
    await loadEntidades()
  }

  const handleSubmit = (e: React.FormEvent) => {
    // El formulario se enviará automáticamente al servidor con todos los valores
  }

  if (loading) {
    return (
      <SharedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos del usuario...</p>
          </div>
        </div>
      </SharedLayout>
    )
  }

  return (
    <SharedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Aviso Letrado (Detenido)</h1>
              <p className="text-muted-foreground">
                Formulario para el aviso al letrado de persona detenida
              </p>
            </div>
          </div>
          <BackButton href="/diligencias" />
        </div>

        {/* Formulario */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Datos del Aviso
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleOpenModal}
              >
                <Plus className="h-4 w-4" />
                Añadir atestado
              </Button>
            </CardTitle>
            <CardDescription>
              Complete los siguientes campos para procesar el aviso al letrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              id="formAvisoLetradoDetenido"
              action="https://gpr-server.dj1x7g.easypanel.host/procesar-diligencia-aviso-letrado"
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

              {/* Campo Fecha Aviso */}
              <div className="space-y-2">
                <Label htmlFor="fechaAviso" className="text-sm font-medium">
                  Fecha del aviso
                </Label>
                <Input
                  id="fechaAviso"
                  name="fecha_aviso"
                  type="text"
                  value={fechaAviso}
                  onChange={(e) => setFechaAviso(e.target.value)}
                  className="font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="Fecha y hora del aviso"
                />
              </div>

              {/* Campo Teléfono de Contacto */}
              <div className="space-y-2">
                <Label htmlFor="telefonoContacto" className="text-sm font-medium">
                  Teléfono de contacto (Colegio de Abogados)
                </Label>
                <Input
                  id="telefonoContacto"
                  name="telefono_colegio_abogados"
                  type="text"
                  value={telefonoContacto}
                  onChange={(e) => setTelefonoContacto(e.target.value)}
                  className="font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="950.95.18.70"
                />
              </div>

              {/* Campo Nombre del Letrado */}
              <div className="space-y-2">
                <Label htmlFor="nombreLetrado" className="text-sm font-medium">
                  Nombre del letrado
                </Label>
                <Input
                  id="nombreLetrado"
                  name="letrado"
                  type="text"
                  value={nombreLetrado}
                  onChange={(e) => setNombreLetrado(e.target.value)}
                  className="font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="Nombre completo del letrado"
                  required
                />
              </div>

              {/* Campo Número de Colegiado */}
              <div className="space-y-2">
                <Label htmlFor="numeroColegiado" className="text-sm font-medium">
                  Número de colegiado
                </Label>
                <Input
                  id="numeroColegiado"
                  name="numero_colegiado"
                  type="text"
                  value={numeroColegiado}
                  onChange={(e) => setNumeroColegiado(e.target.value)}
                  className="font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="Número de colegiado"
                  required
                />
              </div>

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
              <div className="flex justify-between items-center pt-4">
                <BackButton href="/diligencias" variant="outline" />
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Generar aviso
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Sección de Entidades */}
        <EncartadosSection 
          title="Entidades Relacionadas"
          description="Gestiona atestados, personas y letrados relacionados con las diligencias"
          showActions={true}
          className=""
          onAtestadoSelect={(numeroAtestado) => {
            setAtestado(numeroAtestado)
            toast.success(`Atestado ${numeroAtestado} seleccionado automáticamente`)
          }}
          onLetradoSelect={handleLetradoSelect}
        />
      </div>
      
      {/* Modal para seleccionar entidades DGS */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Seleccionar Entidad DGS</DialogTitle>
            <DialogDescription>
              Selecciona una entidad DGS de la lista para añadir al atestado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            {loadingEntidades ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando entidades...</span>
              </div>
            ) : entidades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay entidades DGS disponibles</p>
                <p className="text-sm">Crea una nueva entidad desde la sección correspondiente</p>
              </div>
            ) : (
              <div className="space-y-2">
                {entidades.map((entidad) => (
                  <div
                    key={entidad.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectEntidad(entidad)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{entidad.numero}</p>
                          <p className="text-sm text-muted-foreground">{entidad.delito}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{entidad.juzgado}</p>
                          <p>{new Date(entidad.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Seleccionar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SharedLayout>
  )
}