'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Save, Trash, Trash2, Edit, Loader2 } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface EncartadosSectionProps {
  title?: string
  description?: string
  showActions?: boolean
  className?: string
}

interface FormData {
  // Campos para Atestados
  numero: string
  delito: string
  juzgado: string
  // Campos para Personas
  nombre: string
  apellido1: string
  apellido2: string
  documento: string
  fecha_nacimiento: string
  nacimiento_lugar: string
  direccion: string
  telefono: string
  relacion: string
  // Campos para Letrados
  nombreLetrado: string
  apellidosLetrado: string
  colegio: string
  numeroColegial: string
  telefonoLetrado: string
}

interface Entidad {
  id: number
  // Campos comunes
  created_at: string
  usuario: string
  tipo: 'atestado' | 'persona' | 'letrado'
  // Campos para Atestados
  numero?: string
  delito?: string
  juzgado?: string
  // Campos para Personas
  nombre?: string
  apellido1?: string
  apellido2?: string
  documento?: string
  fecha_nacimiento?: string
  nacimiento_lugar?: string
  direccion?: string
  telefono?: string
  relacion?: string
  // Campos para Letrados
  nombreLetrado?: string
  apellidosLetrado?: string
  colegio?: string
  numeroColegial?: string
  telefonoLetrado?: string
}

interface UserData {
  codigo_unidad: string
}

export function EncartadosSection({ 
  title = "Entidades Relacionados",
  description = "Denunciantes, denunciados, detenidos, letrados, testigos, etc.",
  showActions = true,
  className = ""
}: EncartadosSectionProps) {
  const { user } = useAuth()
  const [entidades, setEntidades] = useState<Entidad[]>([])
  const [isLoadingEntidades, setIsLoadingEntidades] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingEntidad, setEditingEntidad] = useState<Entidad | null>(null)
  const [deletingEntidad, setDeletingEntidad] = useState<Entidad | null>(null)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState<'personas' | 'letrados' | 'atestados'>('atestados')
  
  const [formData, setFormData] = useState<FormData>({
    // Atestados
    numero: '',
    delito: '',
    juzgado: '',
    // Personas
    nombre: '',
    apellido1: '',
    apellido2: '',
    documento: '',
    fecha_nacimiento: '',
    nacimiento_lugar: '',
    direccion: '',
    telefono: '',
    relacion: '',
    // Letrados
    nombreLetrado: '',
    apellidosLetrado: '',
    colegio: '',
    numeroColegial: '',
    telefonoLetrado: ''
  })

  useEffect(() => {
    if (user) {
      loadUserData()
      loadEntidades()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('codigo_unidad')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error al cargar datos del usuario:', error)
        return
      }

      setUserData(data)
    } catch (error) {
      console.error('Error inesperado:', error)
    }
  }

  const loadEntidades = async () => {
    if (!user) return

    setIsLoadingEntidades(true)
    try {
      // Cargar datos de las tres tablas en paralelo
      const [atestadosResult, personasResult, letradosResult] = await Promise.all([
        supabase
          .from('entidades_dgs')
          .select('*')
          .eq('usuario', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('entidades_personas')
          .select('*')
          .eq('usuario', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('entidades_letrados')
          .select('*')
          .eq('usuario', user.id)
          .order('created_at', { ascending: false })
      ])

      // Verificar errores
      if (atestadosResult.error) {
        console.error('Error al cargar atestados:', atestadosResult.error)
        toast.error('Error al cargar los atestados')
        return
      }
      if (personasResult.error) {
        console.error('Error al cargar personas:', personasResult.error)
        toast.error('Error al cargar las personas')
        return
      }
      if (letradosResult.error) {
        console.error('Error al cargar letrados:', letradosResult.error)
        toast.error('Error al cargar los letrados')
        return
      }

      // Combinar y formatear los datos
      const entidadesCombinadas: Entidad[] = [
        // Atestados
        ...(atestadosResult.data || []).map(item => ({
          ...item,
          tipo: 'atestado' as const
        })),
        // Personas
        ...(personasResult.data || []).map(item => ({
          ...item,
          tipo: 'persona' as const
        })),
        // Letrados
        ...(letradosResult.data || []).map(item => ({
          ...item,
          tipo: 'letrado' as const
        }))
      ]

      // Ordenar por fecha de creación (más recientes primero)
      entidadesCombinadas.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setEntidades(entidadesCombinadas)
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Error inesperado al cargar entidades')
    } finally {
      setIsLoadingEntidades(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para guardar datos')
      return
    }

    // Validación básica según la pestaña activa
    let isValid = false
    if (activeTab === 'atestados') {
      isValid = formData.numero.trim() && formData.delito.trim() && formData.juzgado.trim()
    } else if (activeTab === 'personas') {
      isValid = formData.nombre.trim() && formData.apellido1.trim() && formData.documento.trim()
    } else if (activeTab === 'letrados') {
      isValid = formData.nombreLetrado.trim() && formData.apellidosLetrado.trim() && formData.colegio.trim()
    }
    
    if (!isValid) {
      toast.error('Todos los campos obligatorios deben estar completos')
      return
    }

    setIsLoading(true)

    try {
      if (activeTab === 'personas') {
        if (editingEntidad) {
          // Actualizar persona existente
          const { error } = await supabase
            .from('entidades_personas')
            .update({
              nombre: formData.nombre.trim(),
              apellido1: formData.apellido1.trim(),
              apellido2: formData.apellido2.trim(),
              documento: formData.documento.trim(),
              fecha_nacimiento: formData.fecha_nacimiento || null,
              nacimiento_lugar: formData.nacimiento_lugar.trim() || null,
              direccion: formData.direccion.trim() || null,
              telefono: formData.telefono.trim() || null,
              relacion: formData.relacion || null
            })
            .eq('id', editingEntidad.id)
            .eq('usuario', user.id) // Seguridad adicional

          if (error) {
            console.error('Error al actualizar persona:', error)
            toast.error('Error al actualizar la persona')
            return
          }

          toast.success('Persona actualizada correctamente')
        } else {
          // Crear nueva persona
          const { error } = await supabase
            .from('entidades_personas')
            .insert({
              nombre: formData.nombre.trim(),
              apellido1: formData.apellido1.trim(),
              apellido2: formData.apellido2.trim(),
              documento: formData.documento.trim(),
              fecha_nacimiento: formData.fecha_nacimiento || null,
              nacimiento_lugar: formData.nacimiento_lugar.trim() || null,
              direccion: formData.direccion.trim() || null,
              telefono: formData.telefono.trim() || null,
              relacion: formData.relacion || null,
              usuario: user.id
            })

          if (error) {
            console.error('Error al guardar persona:', error)
            toast.error('Error al guardar los datos de la persona')
            return
          }

          toast.success('Persona guardada correctamente')
        }
      } else if (activeTab === 'atestados') {
        if (editingEntidad) {
          // Actualizar entidad existente
          const { error } = await supabase
            .from('entidades_dgs')
            .update({
              numero: formData.numero.trim(),
              delito: formData.delito.trim(),
              juzgado: formData.juzgado.trim()
            })
            .eq('id', editingEntidad.id)
            .eq('usuario', user.id) // Seguridad adicional

          if (error) {
            console.error('Error al actualizar:', error)
            toast.error('Error al actualizar la entidad')
            return
          }

          toast.success('Entidad actualizada correctamente')
        } else {
          // Crear nueva entidad
          const { error } = await supabase
            .from('entidades_dgs')
            .insert({
              numero: formData.numero.trim(),
              delito: formData.delito.trim(),
              juzgado: formData.juzgado.trim(),
              usuario: user.id
            })

          if (error) {
            console.error('Error al guardar:', error)
            toast.error('Error al guardar los datos')
            return
          }

          toast.success('Entidad guardada correctamente')
        }
      } else if (activeTab === 'letrados') {
        if (editingEntidad) {
          // Actualizar letrado existente
          const { error } = await supabase
            .from('entidades_letrados')
            .update({
              nombreLetrado: formData.nombreLetrado.trim(),
              apellidosLetrado: formData.apellidosLetrado.trim(),
              colegio: formData.colegio.trim(),
              numeroColegial: formData.numeroColegial.trim() || null,
              telefonoLetrado: formData.telefonoLetrado.trim() || null
            })
            .eq('id', editingEntidad.id)
            .eq('usuario', user.id) // Seguridad adicional

          if (error) {
            console.error('Error al actualizar letrado:', error)
            toast.error('Error al actualizar el letrado')
            return
          }

          toast.success('Letrado actualizado correctamente')
        } else {
          // Crear nuevo letrado
          const { error } = await supabase
            .from('entidades_letrados')
            .insert({
              nombreLetrado: formData.nombreLetrado.trim(),
              apellidosLetrado: formData.apellidosLetrado.trim(),
              colegio: formData.colegio.trim(),
              numeroColegial: formData.numeroColegial.trim() || null,
              telefonoLetrado: formData.telefonoLetrado.trim() || null,
              usuario: user.id
            })

          if (error) {
            console.error('Error al guardar letrado:', error)
            toast.error('Error al guardar los datos del letrado')
            return
          }

          toast.success('Letrado guardado correctamente')
        }
      }

      setIsModalOpen(false)
      resetForm()
      setEditingEntidad(null)
      await loadEntidades() // Recargar la lista
      
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Error inesperado al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (entidad: Entidad) => {
    setEditingEntidad(entidad)
    
    // Establecer la pestaña activa según el tipo de entidad
    if (entidad.tipo === 'atestado') {
      setActiveTab('atestados')
      setFormData({
        // Atestados
        numero: entidad.numero || '',
        delito: entidad.delito || '',
        juzgado: entidad.juzgado || '',
        // Personas
        nombre: '',
        apellido1: '',
        apellido2: '',
        documento: '',
        fecha_nacimiento: '',
        nacimiento_lugar: '',
        direccion: '',
        telefono: '',
        relacion: '',
        // Letrados
        nombreLetrado: '',
        apellidosLetrado: '',
        colegio: '',
        numeroColegial: '',
        telefonoLetrado: ''
      })
    } else if (entidad.tipo === 'persona') {
      setActiveTab('personas')
      setFormData({
        // Atestados
        numero: '',
        delito: '',
        juzgado: '',
        // Personas
        nombre: entidad.nombre || '',
        apellido1: entidad.apellido1 || '',
        apellido2: entidad.apellido2 || '',
        documento: entidad.documento || '',
        fecha_nacimiento: entidad.fecha_nacimiento || '',
        nacimiento_lugar: entidad.nacimiento_lugar || '',
        direccion: entidad.direccion || '',
        telefono: entidad.telefono || '',
        relacion: entidad.relacion || '',
        // Letrados
        nombreLetrado: '',
        apellidosLetrado: '',
        colegio: '',
        numeroColegial: '',
        telefonoLetrado: ''
      })
    } else if (entidad.tipo === 'letrado') {
      setActiveTab('letrados')
      setFormData({
        // Atestados
        numero: '',
        delito: '',
        juzgado: '',
        // Personas
        nombre: '',
        apellido1: '',
        apellido2: '',
        documento: '',
        fecha_nacimiento: '',
        nacimiento_lugar: '',
        direccion: '',
        telefono: '',
        relacion: '',
        // Letrados
        nombreLetrado: entidad.nombreLetrado || '',
        apellidosLetrado: entidad.apellidosLetrado || '',
        colegio: entidad.colegio || '',
        numeroColegial: entidad.numeroColegial || '',
        telefonoLetrado: entidad.telefonoLetrado || ''
      })
    }
    
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingEntidad || !user) return

    try {
      let tableName = ''
      if (deletingEntidad.tipo === 'atestado') {
        tableName = 'entidades_dgs'
      } else if (deletingEntidad.tipo === 'persona') {
        tableName = 'entidades_personas'
      } else if (deletingEntidad.tipo === 'letrado') {
        tableName = 'entidades_letrados'
      }

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', deletingEntidad.id)
        .eq('usuario', user.id) // Seguridad adicional

      if (error) {
        console.error('Error al eliminar:', error)
        toast.error('Error al eliminar la entidad')
        return
      }

      toast.success('Entidad eliminada correctamente')
      setDeletingEntidad(null)
      await loadEntidades() // Recargar la lista
      
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Error inesperado al eliminar')
    }
  }

  const handleDeleteAll = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para eliminar datos')
      return
    }

    try {
      // Eliminar de las tres tablas en paralelo
      const [atestadosResult, personasResult, letradosResult] = await Promise.all([
        supabase
          .from('entidades_dgs')
          .delete()
          .eq('usuario', user.id),
        supabase
          .from('entidades_personas')
          .delete()
          .eq('usuario', user.id),
        supabase
          .from('entidades_letrados')
          .delete()
          .eq('usuario', user.id)
      ])

      // Verificar errores
      if (atestadosResult.error) {
        console.error('Error al eliminar atestados:', atestadosResult.error)
        toast.error('Error al eliminar los atestados')
        return
      }
      if (personasResult.error) {
        console.error('Error al eliminar personas:', personasResult.error)
        toast.error('Error al eliminar las personas')
        return
      }
      if (letradosResult.error) {
        console.error('Error al eliminar letrados:', letradosResult.error)
        toast.error('Error al eliminar los letrados')
        return
      }

      toast.success('Todas las entidades han sido eliminadas correctamente')
      setIsDeletingAll(false)
      await loadEntidades() // Recargar la lista
      
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Error inesperado al eliminar todas las entidades')
    }
  }

  const handleDiscard = () => {
    resetForm()
    setEditingEntidad(null)
    setIsModalOpen(false)
  }

  const handleAddNew = () => {
    setEditingEntidad(null)
    resetForm()
    setIsModalOpen(true)
  }

  const resetForm = () => {
    const currentYear = new Date().getFullYear()
    const initialNumero = userData?.codigo_unidad ? `${currentYear}-${userData.codigo_unidad}-` : ''
    
    setFormData({
      // Atestados
      numero: initialNumero,
      delito: '',
      juzgado: '',
      // Personas
      nombre: '',
      apellido1: '',
      apellido2: '',
      documento: '',
      fecha_nacimiento: '',
      nacimiento_lugar: '',
      direccion: '',
      telefono: '',
      relacion: '',
      // Letrados
      nombreLetrado: '',
      apellidosLetrado: '',
      colegio: '',
      numeroColegial: '',
      telefonoLetrado: ''
    })
    setEditingEntidad(null)
  }

  const handleOpenModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    resetForm()
    setIsModalOpen(false)
  }
  
  return (
    <div className={`mt-8 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Listado de Entidades</CardTitle>
              <CardDescription className="mt-1">
                {description}
              </CardDescription>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleOpenModal}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Añadir
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setIsDeletingAll(true)}
                  disabled={entidades.length === 0}
                >
                  <Trash className="h-4 w-4" />
                  Borrar Todo
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingEntidades ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Cargando entidades...</span>
              </div>
            ) : entidades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay entidades registradas</p>
                <p className="text-sm mt-1">Haz clic en "Añadir" para crear la primera entidad</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entidades.map((entidad) => (
                  <div key={`${entidad.tipo}-${entidad.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      {/* Mostrar información según el tipo de entidad */}
                      {entidad.tipo === 'atestado' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Atestado
                            </span>
                            <div className="font-medium">{entidad.numero}</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Delito:</span> {entidad.delito}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Juzgado:</span> {entidad.juzgado}
                          </div>
                        </>
                      )}
                      {entidad.tipo === 'persona' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Persona
                            </span>
                            <div className="font-medium">
                              {entidad.nombre} {entidad.apellido1} {entidad.apellido2}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Documento:</span> {entidad.documento}
                          </div>
                          {entidad.relacion && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Relación:</span> {entidad.relacion}
                            </div>
                          )}
                          {entidad.telefono && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Teléfono:</span> {entidad.telefono}
                            </div>
                          )}
                        </>
                      )}
                      {entidad.tipo === 'letrado' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              Letrado
                            </span>
                            <div className="font-medium">
                              {entidad.nombreLetrado} {entidad.apellidosLetrado}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Colegio:</span> {entidad.colegio}
                          </div>
                          {entidad.numeroColegial && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Nº Colegial:</span> {entidad.numeroColegial}
                            </div>
                          )}
                          {entidad.telefonoLetrado && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Teléfono:</span> {entidad.telefonoLetrado}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entidad)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingEntidad(entidad)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para añadir/editar entidad */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] w-full mx-auto flex flex-col items-center">
          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-center">
              {editingEntidad ? 'Editar Entidad' : 'Añadir Nueva Entidad'}
            </DialogTitle>
            <DialogDescription>
              {editingEntidad 
                ? 'Modifica los datos de la entidad DGS.' 
                : 'Completa los datos de la nueva entidad DGS.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 w-full max-w-md mx-auto">
            {/* Campos para Atestados */}
            {activeTab === 'atestados' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="numero" className="text-right">
                    Núm. DGS *
                  </Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: 2025-1353-568"
                    onFocus={(e) => {
                      e.target.setSelectionRange(e.target.value.length, e.target.value.length)
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="delito" className="text-right">
                    Delito *
                  </Label>
                  <Input
                    id="delito"
                    value={formData.delito}
                    onChange={(e) => handleInputChange('delito', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: Robo con fuerza"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="juzgado" className="text-right">
                    Juzgado *
                  </Label>
                  <Input
                    id="juzgado"
                    value={formData.juzgado}
                    onChange={(e) => handleInputChange('juzgado', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: Juzgado de Instrucción Nº 1"
                  />
                </div>
              </>
            )}

            {/* Campos para Personas */}
             {activeTab === 'personas' && (
               <>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="nombre" className="text-right">
                     Nombre *
                   </Label>
                   <Input
                     id="nombre"
                     value={formData.nombre}
                     onChange={(e) => handleInputChange('nombre', e.target.value)}
                     className="col-span-3"
                     placeholder="Ej: Juan"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="apellido1" className="text-right">
                     Primer Apellido *
                   </Label>
                   <Input
                     id="apellido1"
                     value={formData.apellido1}
                     onChange={(e) => handleInputChange('apellido1', e.target.value)}
                     className="col-span-3"
                     placeholder="Ej: García"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="apellido2" className="text-right">
                     Segundo Apellido
                   </Label>
                   <Input
                     id="apellido2"
                     value={formData.apellido2}
                     onChange={(e) => handleInputChange('apellido2', e.target.value)}
                     className="col-span-3"
                     placeholder="Ej: López"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="documento" className="text-right">
                     Documento *
                   </Label>
                   <Input
                     id="documento"
                     value={formData.documento}
                     onChange={(e) => handleInputChange('documento', e.target.value)}
                     className="col-span-3"
                     placeholder="Ej: 12345678A"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="fecha_nacimiento" className="text-right">
                     Fecha Nacimiento
                   </Label>
                   <Input
                     id="fecha_nacimiento"
                     type="date"
                     value={formData.fecha_nacimiento}
                     onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                     className="col-span-3"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="nacimiento_lugar" className="text-right">
                     Lugar Nacimiento
                   </Label>
                   <Input
                     id="nacimiento_lugar"
                     value={formData.nacimiento_lugar}
                     onChange={(e) => handleInputChange('nacimiento_lugar', e.target.value)}
                     className="col-span-3"
                     placeholder="Ej: Madrid, España"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="direccion" className="text-right">
                     Dirección
                   </Label>
                   <Input
                     id="direccion"
                     value={formData.direccion}
                     onChange={(e) => handleInputChange('direccion', e.target.value)}
                     className="col-span-3"
                     placeholder="Ej: Calle Mayor, 123"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="telefono" className="text-right">
                     Teléfono
                   </Label>
                   <Input
                     id="telefono"
                     value={formData.telefono}
                     onChange={(e) => handleInputChange('telefono', e.target.value)}
                     className="col-span-3"
                     placeholder="Ej: 666 123 456"
                   />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="relacion" className="text-right">
                     Relación
                   </Label>
                   <Select value={formData.relacion} onValueChange={(value) => handleInputChange('relacion', value)}>
                     <SelectTrigger className="col-span-3">
                       <SelectValue placeholder="Seleccionar relación" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Denunciante">Denunciante</SelectItem>
                       <SelectItem value="Denunciado">Denunciado</SelectItem>
                       <SelectItem value="Detenido">Detenido</SelectItem>
                       <SelectItem value="Investigado">Investigado</SelectItem>
                       <SelectItem value="Testigo">Testigo</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </>
             )}

            {/* Campos para Letrados */}
            {activeTab === 'letrados' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombreLetrado" className="text-right">
                    Nombre *
                  </Label>
                  <Input
                    id="nombreLetrado"
                    value={formData.nombreLetrado}
                    onChange={(e) => handleInputChange('nombreLetrado', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: María"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apellidosLetrado" className="text-right">
                    Apellidos *
                  </Label>
                  <Input
                    id="apellidosLetrado"
                    value={formData.apellidosLetrado}
                    onChange={(e) => handleInputChange('apellidosLetrado', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: Rodríguez Martín"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="colegio" className="text-right">
                    Colegio *
                  </Label>
                  <Input
                    id="colegio"
                    value={formData.colegio}
                    onChange={(e) => handleInputChange('colegio', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: Colegio de Abogados de Madrid"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="numeroColegial" className="text-right">
                    Nº Colegial
                  </Label>
                  <Input
                    id="numeroColegial"
                    value={formData.numeroColegial}
                    onChange={(e) => handleInputChange('numeroColegial', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: 12345"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefonoLetrado" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="telefonoLetrado"
                    value={formData.telefonoLetrado}
                    onChange={(e) => handleInputChange('telefonoLetrado', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: 91 123 45 67"
                  />
                </div>
              </>
            )}
            
            {/* Botones Descartar y Guardar centrados */}
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={handleDiscard}
                disabled={isLoading}
              >
                Descartar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : (editingEntidad ? 'Actualizar' : 'Guardar')}
              </Button>
            </div>
            
            {/* Pestañas para cambiar entre tipos de formulario */}
            <div className="flex justify-center gap-2 mt-8 pt-6 border-t">
              <Button 
                variant={activeTab === 'personas' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('personas')}
              >
                Personas
              </Button>
              <Button 
                variant={activeTab === 'letrados' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('letrados')}
              >
                Letrados
              </Button>
              <Button 
                variant={activeTab === 'atestados' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('atestados')}
              >
                Atestados
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar una entidad */}
      <AlertDialog open={!!deletingEntidad} onOpenChange={() => setDeletingEntidad(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente {deletingEntidad?.tipo === 'atestado' ? `el atestado "${deletingEntidad?.numero}"` : deletingEntidad?.tipo === 'persona' ? `la persona "${deletingEntidad?.nombre} ${deletingEntidad?.apellido1}"` : deletingEntidad?.tipo === 'letrado' ? `el letrado "${deletingEntidad?.nombreLetrado} ${deletingEntidad?.apellidosLetrado}"` : 'esta entidad'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmación para eliminar todas las entidades */}
      <AlertDialog open={isDeletingAll} onOpenChange={setIsDeletingAll}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash className="h-5 w-5" />
              ⚠️ Eliminar Todas las Entidades
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="font-semibold text-destructive mb-2">
                  Esta acción es irreversible y eliminará:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>{entidades.length}</strong> entidades registradas</li>
                  <li>Todos los <strong>atestados</strong> (números DGS, delitos, juzgados)</li>
                  <li>Todas las <strong>personas</strong> (denunciantes, denunciados, testigos, etc.)</li>
                  <li>Todos los <strong>letrados</strong> (abogados y representantes legales)</li>
                  <li>El historial completo de todas las entidades</li>
                </ul>
              </div>
              <p className="text-center font-medium">
                ¿Estás completamente seguro de que deseas continuar?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="flex-1">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAll}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
            >
              Sí, Eliminar Todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}