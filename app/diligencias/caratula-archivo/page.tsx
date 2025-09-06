"use client"

import { SharedLayout } from "@/components/shared-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BackButton } from "@/components/back-button"
import { useState, useEffect } from "react"
import { Archive, Send, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { SPANISH_MONTHS } from "../archivo/constants"
import { DELITOS } from "@/delitos"

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

export default function CaratulaArchivoPage() {
  const [atestado, setAtestado] = useState("")
  const [fecha, setFecha] = useState("")
  const [instructor, setInstructor] = useState("")
  const [supuesto, setSupuesto] = useState("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Estados para el modal de entidades
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entidades, setEntidades] = useState<EntidadDGS[]>([])
  const [loadingEntidades, setLoadingEntidades] = useState(false)

  const { user } = useAuth()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (userData?.codigo_unidad) {
      const currentYear = new Date().getFullYear()
      setAtestado(`${currentYear}-${userData.codigo_unidad}-`)
    }
  }, [userData])
  
  // Agregar este nuevo useEffect para rellenar el campo instructor
  useEffect(() => {
    if (userData?.tip) {
      setInstructor(userData.tip)
    }
  }, [userData])
  
  useEffect(() => {
    setFecha(formatSpanishDate())
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
            <Archive className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Carátula de Archivo</h1>
              <p className="text-muted-foreground">
                Formulario para la carátula de archivo de diligencias policiales
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
                <Archive className="h-5 w-5" />
                Datos de la Carátula
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
              Complete los siguientes campos para procesar la carátula de archivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              id="formCaratulaArchivo"
              action="https://gpr-server.dj1x7g.easypanel.host/procesar-caratula-archivo"
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

              {/* Campo Instructor */}
              <div className="space-y-2">
                <Label htmlFor="instructor" className="text-sm font-medium">
                  Instructor
                </Label>
                <Input
                  id="instructor"
                  name="instructor"
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700"
                  placeholder="Nombre del instructor"
                />
              </div>

              {/* Campo Supuesto */}
              <div className="space-y-2">
                <Label htmlFor="supuesto" className="text-sm font-medium">
                  Supuesto
                </Label>
                <input
                  type="text"
                  id="supuesto"
                  name="supuesto"
                  list="delitos_list"
                  value={supuesto}
                  onChange={(e) => setSupuesto(e.target.value)}
                  required
                  className="w-full px-3 py-2 font-mono border-2 border-gray-300 bg-white focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Seleccionar delito o escribir manualmente..."
                />
                <datalist id="delitos_list">
                  {DELITOS.map((delito, index) => (
                    <option key={index} value={delito.label} />
                  ))}
                </datalist>
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
                  Generar carátula
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
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
                <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
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