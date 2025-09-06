"use client"

import { useState, useEffect } from "react"
import { SharedLayout } from "@/components/shared-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Edit, Trash2, Plus, Calendar, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

interface Evento {
  id: number
  numero: number
  descripcion: string
  actualizado: string
}

export function EventosPage() {
  const { user } = useAuth()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEvento, setNewEvento] = useState({ numero: "", descripcion: "" })
  const [saving, setSaving] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventoToDelete, setEventoToDelete] = useState<Evento | null>(null)

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('eventos')
        .select('id, numero, descripcion, actualizado')
        .order('numero', { ascending: true })

      if (error) {
        console.error('Error fetching eventos:', error)
        toast.error('Error al cargar los eventos')
        return
      }

      setEventos(data || [])
      setFilteredEventos(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al conectar con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento)
    setNewEvento({ 
      numero: evento.numero.toString(), 
      descripcion: evento.descripcion 
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (evento: Evento) => {
    setEventoToDelete(evento)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!eventoToDelete) return

    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', eventoToDelete.id)

      if (error) {
        console.error('Error deleting evento:', error)
        toast.error('Error al eliminar el evento')
        return
      }

      toast.success('Evento eliminado correctamente')
      fetchEventos() // Recargar la lista
      setIsDeleteDialogOpen(false)
      setEventoToDelete(null)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar el evento')
    }
  }

  const handleSaveEvento = async () => {
    if (!newEvento.numero || !newEvento.descripcion) {
      toast.error('Por favor completa todos los campos')
      return
    }

    const numeroValue = parseInt(newEvento.numero)
    if (isNaN(numeroValue)) {
      toast.error('El número debe ser un valor numérico válido')
      return
    }

    try {
      setSaving(true)
      
      if (editingEvento) {
        // Actualizar evento existente
        const { error } = await supabase
          .from('eventos')
          .update({
            numero: numeroValue,
            descripcion: newEvento.descripcion.trim(),
            actualizado: new Date().toISOString()
          })
          .eq('id', editingEvento.id)

        if (error) {
          console.error('Error updating evento:', error)
          toast.error('Error al actualizar el evento')
          return
        }

        toast.success('Evento actualizado correctamente')
      } else {
        // Crear nuevo evento
        const { error } = await supabase
          .from('eventos')
          .insert({
            numero: numeroValue,
            descripcion: newEvento.descripcion.trim(),
            usuario: user?.id,
            actualizado: new Date().toISOString()
          })

        if (error) {
          console.error('Error creating evento:', error)
          toast.error('Error al crear el evento')
          return
        }

        toast.success('Evento creado correctamente')
      }

      setIsDialogOpen(false)
      setNewEvento({ numero: "", descripcion: "" })
      setEditingEvento(null)
      fetchEventos() // Recargar la lista
    } catch (error) {
      console.error('Error:', error)
      toast.error(editingEvento ? 'Error al actualizar el evento' : 'Error al crear el evento')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEvento = () => {
    setNewEvento({ numero: "", descripcion: "" })
    setEditingEvento(null)
    setIsDialogOpen(false)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFilteredEventos(eventos)
    } else {
      const filtered = eventos.filter(evento =>
        evento.descripcion.toLowerCase().includes(term.toLowerCase()) ||
        evento.numero.toString().includes(term)
      )
      setFilteredEventos(filtered)
    }
  }

  useEffect(() => {
    handleSearch(searchTerm)
  }, [eventos])

  return (
    <SharedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
              <p className="text-muted-foreground">
                Gestión y calendario de eventos
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingEvento ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
                <DialogDescription>
                  {editingEvento 
                    ? 'Modifica los datos del evento seleccionado.' 
                    : 'Añade un nuevo evento al sistema. Completa todos los campos requeridos.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="numero" className="text-right">
                    Número
                  </Label>
                  <Input
                    id="numero"
                    type="number"
                    value={newEvento.numero}
                    onChange={(e) => setNewEvento({ ...newEvento, numero: e.target.value })}
                    className="col-span-3"
                    placeholder="Ej: 001"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Input
                    id="descripcion"
                    value={newEvento.descripcion}
                    onChange={(e) => setNewEvento({ ...newEvento, descripcion: e.target.value })}
                    className="col-span-3"
                    placeholder="Descripción del evento"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEvento}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  onClick={handleSaveEvento}
                  disabled={saving}
                >
                  {saving 
                    ? (editingEvento ? "Actualizando..." : "Guardando...") 
                    : (editingEvento ? "Actualizar" : "Guardar")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Barra de búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="flex w-full max-w-md gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar eventos por descripción o número..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => handleSearch(searchTerm)}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Eventos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Eventos</CardTitle>
            <CardDescription>
              Todos los eventos registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Cargando eventos...</div>
              </div>
            ) : filteredEventos.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">
                  {searchTerm ? "No se encontraron eventos que coincidan con la búsqueda" : "No hay eventos registrados"}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Número</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-[200px]">Actualizado</TableHead>
                    <TableHead className="w-[150px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEventos.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-medium">{evento.numero}</TableCell>
                      <TableCell>{evento.descripcion}</TableCell>
                      <TableCell>{formatDate(evento.actualizado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(evento)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(evento)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el evento 
              "{eventoToDelete?.descripcion}" de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setEventoToDelete(null)
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SharedLayout>
  )
}