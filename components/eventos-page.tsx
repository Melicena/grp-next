"use client"

import { useState, useEffect } from "react"
import { SharedLayout } from "@/components/shared-layout"
import { Button } from "@/components/ui/button"
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
import { Edit, Trash2, Plus, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Evento {
  id: number
  numero: number
  descripcion: string
  actualizado: string
}

export function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al conectar con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (evento: Evento) => {
    // TODO: Implementar modal de edición
    toast.info(`Editar evento: ${evento.descripcion}`)
  }

  const handleDelete = async (evento: Evento) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el evento "${evento.descripcion}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', evento.id)

      if (error) {
        console.error('Error deleting evento:', error)
        toast.error('Error al eliminar el evento')
        return
      }

      toast.success('Evento eliminado correctamente')
      fetchEventos() // Recargar la lista
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar el evento')
    }
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>

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
            ) : eventos.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">No hay eventos registrados</div>
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
                  {eventos.map((evento) => (
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
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Modificar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(evento)}
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            Borrar
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
    </SharedLayout>
  )
}