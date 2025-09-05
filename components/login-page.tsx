"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Shield, Mail, Lock, User, ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorDialogMessage, setErrorDialogMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  })
  
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Función para validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Función para validar contraseña
  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  // Función para mostrar errores
  const showError = (message: string) => {
    setErrorDialogMessage(message)
    setShowErrorDialog(true)
  }

  // Función para limpiar mensajes
  const clearMessages = () => {
    setErrors({})
    setSuccessMessage('')
  }

  // Manejar login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    
    // Validaciones
    const newErrors: {[key: string]: string} = {}
    
    if (!loginData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }
    
    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await signIn(loginData.email, loginData.password)
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          showError('Credenciales incorrectas. Verifica tu email y contraseña.')
        } else if (error.message.includes('Email not confirmed')) {
          showError('Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.')
        } else {
          showError(`Error al iniciar sesión: ${error.message}`)
        }
      }
    } catch (error) {
      showError('Error inesperado al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    
    // Validaciones
    const newErrors: {[key: string]: string} = {}
    
    if (!registerData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }
    
    if (!registerData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (!validatePassword(registerData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      // Registrar usuario en Supabase Auth
      const { error: authError, data } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      })
      
      if (authError) {
        if (authError.message.includes('User already registered')) {
          showError('Este email ya está registrado. Intenta iniciar sesión.')
        } else {
          showError(`Error al registrar usuario: ${authError.message}`)
        }
        return
      }
      
      // Si el registro en Auth fue exitoso, crear registro en tabla usuarios
      if (data.user) {
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: registerData.email,
            rol: 'free',
            estado: 'activo'
          })
        
        if (dbError) {
          console.error('Error al crear registro en tabla usuarios:', dbError)
          // Aunque falle la inserción en usuarios, el registro en Auth fue exitoso
          // Mostrar mensaje de éxito pero con advertencia
          setSuccessMessage('¡Cuenta creada exitosamente! 📧 IMPORTANTE: Hemos enviado un email de activación a tu correo electrónico. Debes hacer clic en el enlace del email para activar tu cuenta antes de poder iniciar sesión. Revisa también tu carpeta de spam si no lo encuentras.')
        } else {
          setSuccessMessage('¡Cuenta creada exitosamente! 📧 IMPORTANTE: Hemos enviado un email de activación a tu correo electrónico. Debes hacer clic en el enlace del email para activar tu cuenta antes de poder iniciar sesión. Revisa también tu carpeta de spam si no lo encuentras.')
        }
        
        // Limpiar formulario
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Error inesperado en registro:', error)
      showError('Error inesperado al registrar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar recuperación de contraseña
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    
    if (!forgotPasswordData.email) {
      setErrors({ email: 'El email es requerido' })
      return
    }
    
    if (!validateEmail(forgotPasswordData.email)) {
      setErrors({ email: 'Ingresa un email válido' })
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await resetPassword(forgotPasswordData.email)
      
      if (error) {
        showError(`Error al enviar email de recuperación: ${error.message}`)
      } else {
        setSuccessMessage('Se ha enviado un email con instrucciones para recuperar tu contraseña.')
        setForgotPasswordData({ email: '' })
      }
    } catch (error) {
      showError('Error inesperado al enviar email de recuperación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Gesrepol
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestion de recursos policiales para Guardias Civiles.
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Acceso al Sistema</CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registro</TabsTrigger>
                  <TabsTrigger value="forgot">Recuperar</TabsTrigger>
                </TabsList>

                {/* Mensajes de éxito */}
                {successMessage && (
                  <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Pestaña de Login */}
                <TabsContent value="login" className="space-y-4 mt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          className="pl-10 pr-10"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Pestaña de Registro */}
                <TabsContent value="register" className="space-y-4 mt-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-10"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          className="pl-10 pr-10"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirma tu contraseña"
                          className="pl-10 pr-10"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registrando..." : "Crear Cuenta"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Pestaña de Recuperar Contraseña */}
                <TabsContent value="forgot" className="space-y-4 mt-4">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-10"
                          value={forgotPasswordData.email}
                          onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Enviando..." : "Enviar Email de Recuperación"}
                    </Button>
                  </form>
                </TabsContent>
                {/* ... existing code for register and forgot password tabs ... */}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ventana de Advertencia */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <AlertDialogTitle>Error de Autenticación</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              {errorDialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowErrorDialog(false)}
              className="bg-red-600 hover:bg-red-700"
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}