'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { UserPlus, Save, Upload, Trash2, Edit, Loader2 } from "lucide-react"
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
  numero: string
  delito: string
  juzgado: string
}

interface Entidad {
  id: number
  numero: string
  delito: string
  juzgado: string
  created_at: string
  usuario: string
}

export function EncartadosSection({ 
  title = "Entidades Relacionados",
  description = "Denunciantes, denunciados, detenidos, letrados, testigos, etc.",
  showActions = true,
  className = ""
}: EncartadosSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEntidades, setIsLoadingEntidades] = useState(true)
  const [entidades, setEntidades] = useState<Entidad[]>([])
  const [editingEntidad, setEditingEntidad] = useState<Entidad | null>(null)
  const [deletingEntidad, setDeletingEntidad] = useState<Entidad | null>(null)
  const [formData, setFormData] = useState<FormData>({
    numero: '',
    delito: '',
    juzgado: ''
  })
  const { user } = useAuth()

  // Cargar entidades al montar el componente
  useEffect(() => {
    if (user) {
      loadEntidades()
    }
  }, [user])

  const loadEntidades = async () => {
    if (!user) return
    
    setIsLoadingEntidades(true)
    try {
      const { data, error } = await supabase
        .from('entidades_dgs')
        .select('*')
        .eq('usuario', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar entidades:', error)
        toast.error('Error al cargar las entidades')
        return
      }

      setEntidades(data || [])
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

    // Validación básica
    if (!formData.numero.trim() || !formData.delito.trim() || !formData.juzgado.trim()) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    setIsLoading(true)

    try {
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

      setIsModalOpen(false)
      setFormData({ numero: '', delito: '', juzgado: '' })
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
    setFormData({
      numero: entidad.numero,
      delito: entidad.delito,
      juzgado: entidad.juzgado
    })
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingEntidad || !user) return

    try {
      const { error } = await supabase
        .from('entidades_dgs')
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

  const handleDiscard = () => {
    setFormData({ numero: '', delito: '', juzgado: '' })
    setEditingEntidad(null)
    setIsModalOpen(false)
  }

  const handleAddNew = () => {
    setEditingEntidad(null)
    setFormData({ numero: '', delito: '', juzgado: '' })
    setIsModalOpen(true)
  }

  return (
    <div className={`mt-8 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Listado de Entidades</CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
            {showActions && (
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddNew}
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Añadir
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadEntidades}
                  disabled={isLoadingEntidades}
                >
                  {isLoadingEntidades ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Cargar
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" /> Guardar
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" /> Borrar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingEntidades ? (
              <div className="text-center text-muted-foreground py-8">
                <Loader2 className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                <p>Cargando entidades...</p>
              </div>
            ) : entidades.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay entidades relacionadas</p>    
                <p className="text-sm">Haz clic en "Añadir" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entidades.map((entidad) => (
                  <div key={entidad.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{entidad.numero}</p>
                          <p className="text-sm text-muted-foreground">{entidad.delito}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p><span className="font-medium">Juzgado:</span> {entidad.juzgado}</p>
                          <p><span className="font-medium">Creado:</span> {new Date(entidad.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entidad)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingEntidad(entidad)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingEntidad ? 'Editar Entidad' : 'Añadir Nueva Entidad'}
            </DialogTitle>
            <DialogDescription>
              {editingEntidad 
                ? 'Modifica los datos de la entidad DGS.' 
                : 'Completa los datos de la nueva entidad DGS.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero" className="text-right">
                Núm. DGS
              </Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                className="col-span-3"
                placeholder="Ej: DGS-2024-001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delito" className="text-right">
                Delito
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
                Juzgado
              </Label>
              <Input
                id="juzgado"
                value={formData.juzgado}
                onChange={(e) => handleInputChange('juzgado', e.target.value)}
                className="col-span-3"
                placeholder="Ej: Juzgado de Instrucción Nº 1"
              />
            </div>
          </div>
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!deletingEntidad} onOpenChange={() => setDeletingEntidad(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la entidad 
              <strong>"{deletingEntidad?.numero}"</strong> de la base de datos.
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
    </div>
  )
}