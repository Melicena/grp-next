"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Save, Settings, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ConfiguracionData {
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

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const [configuracion, setConfiguracion] = useState<ConfiguracionData>({
    tip: "",
    comandancia: "",
    compania: "",
    puesto: "",
    localidad: "",
    telefono: "",
    email: "",
    direccion: "",
    provincia: "",
    cp: "",
    partido_judicial: "",
    codigo_unidad: "",
    zona: ""
  })

  useEffect(() => {
    obtenerUsuarioActual()
  }, [])

  useEffect(() => {
    if (userId) {
      cargarConfiguracion()
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

  const cargarConfiguracion = async () => {
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
        setConfiguracion({
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
      console.error('Error cargando configuración:', error)
      toast.error("Error", {
        description: "No se pudo cargar la configuración"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ConfiguracionData, value: string) => {
    setConfiguracion(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const guardarConfiguracion = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')
      
      const userId = user.id
      
      const { error } = await supabase
        .from('datos')
        .upsert({
          usuario: userId,
          ...configuracion
        }, {
          onConflict: 'usuario'
        })

      if (error) throw error

      toast.success("Datos guardados exitosamente", {
        description: "La configuración de tu unidad se ha actualizado correctamente",
        duration: 5000
      })
    } catch (error: unknown) {
      console.error('Error guardando configuración:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error("Error", {
        description: `No se pudo guardar la configuración: ${errorMessage}`
      })
    } finally {
      setSaving(false)
    }
  }

  const handleVolver = () => {
    router.back()
  }

    if (loading) {
      return (
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando configuración...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-muted-foreground">Gestiona la información de tu unidad policial</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Unidad</CardTitle>
            <CardDescription>
              Completa los datos de tu unidad policial. Esta información se utilizará en los documentos y reportes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tip" className="text-sm font-semibold text-foreground">TIP</Label>
                <Input
                  id="tip"
                  value={configuracion.tip}
                  onChange={(e) => handleInputChange('tip', e.target.value)}
                  placeholder="Ingrese el TIP"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comandancia" className="text-sm font-semibold text-foreground">Comandancia</Label>
                <Input
                  id="comandancia"
                  value={configuracion.comandancia}
                  onChange={(e) => handleInputChange('comandancia', e.target.value)}
                  placeholder="Ingrese la comandancia"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="compania" className="text-sm font-semibold text-foreground">Compañía</Label>
                <Input
                  id="compania"
                  value={configuracion.compania}
                  onChange={(e) => handleInputChange('compania', e.target.value)}
                  placeholder="Ingrese la compañía"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="puesto" className="text-sm font-semibold text-foreground">Puesto</Label>
                <Input
                  id="puesto"
                  value={configuracion.puesto}
                  onChange={(e) => handleInputChange('puesto', e.target.value)}
                  placeholder="Ingrese el puesto"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="localidad" className="text-sm font-semibold text-foreground">Localidad</Label>
                <Input
                  id="localidad"
                  value={configuracion.localidad}
                  onChange={(e) => handleInputChange('localidad', e.target.value)}
                  placeholder="Ingrese la localidad"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-sm font-semibold text-foreground">Provincia</Label>
                <Input
                  id="provincia"
                  value={configuracion.provincia}
                  onChange={(e) => handleInputChange('provincia', e.target.value)}
                  placeholder="Ingrese la provincia"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-semibold text-foreground">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={configuracion.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  placeholder="Ingrese el teléfono"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={configuracion.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Ingrese el email"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="cp" className="text-sm font-semibold text-foreground">Código Postal</Label>
                <Input
                  id="cp"
                  value={configuracion.cp}
                  onChange={(e) => handleInputChange('cp', e.target.value)}
                  placeholder="Ingrese el código postal"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="partido_judicial" className="text-sm font-semibold text-foreground">Partido Judicial</Label>
                <Input
                  id="partido_judicial"
                  value={configuracion.partido_judicial}
                  onChange={(e) => handleInputChange('partido_judicial', e.target.value)}
                  placeholder="Ingrese el partido judicial"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="codigo_unidad" className="text-sm font-semibold text-foreground">Código de Unidad</Label>
                <Input
                  id="codigo_unidad"
                  value={configuracion.codigo_unidad}
                  onChange={(e) => handleInputChange('codigo_unidad', e.target.value)}
                  placeholder="Ingrese el código de unidad"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="zona" className="text-sm font-semibold text-foreground">Zona</Label>
                <Input
                  id="zona"
                  value={configuracion.zona}
                  onChange={(e) => handleInputChange('zona', e.target.value)}
                  placeholder="Ingrese la zona"
                  className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-sm font-semibold text-foreground">Dirección</Label>
              <Textarea
                id="direccion"
                value={configuracion.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Ingrese la dirección completa"
                rows={3}
                className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
  
            <div className="flex justify-between pt-4">
              <Button 
                onClick={handleVolver}
                variant="outline"
                className="min-w-[120px]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button 
                onClick={guardarConfiguracion}
                disabled={saving}
                className="min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}