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

export function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  })
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorDialogMessage, setErrorDialogMessage] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const clearLoginForm = () => {
    setLoginData({ email: "", password: "" })
  }

  const clearRegisterForm = () => {
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "" })
  }

  const clearForgotPasswordForm = () => {
    setForgotPasswordData({ email: "" })
  }

  const showErrorAlert = (message: string) => {
    setErrorDialogMessage(message)
    setShowErrorDialog(true)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")
    console.log('Login data:', loginData) // Agregar esta línea
    const newErrors: Record<string, string> = {}
    
    if (!loginData.email) {
      newErrors.email = "El email es requerido"
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Ingresa un email válido"
    }
    
    if (!loginData.password) {
      newErrors.password = "La contraseña es requerida"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await signIn(loginData.email, loginData.password)
      
      if (error) {
        // Mostrar ventana de advertencia y limpiar formulario
        let errorMessage = "Credenciales incorrectas"
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email o contraseña incorrectos. Por favor, verifica tus credenciales."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor, confirma tu email antes de iniciar sesión."
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Por favor, espera un momento antes de intentar nuevamente."
        } else {
          errorMessage = error.message || "Error al iniciar sesión"
        }
        
        showErrorAlert(errorMessage)
        clearLoginForm()
      } else {
        setSuccessMessage("¡Inicio de sesión exitoso!")
        // La redirección se maneja automáticamente en el contexto de autenticación
      }
    } catch (error) {
      showErrorAlert("Error inesperado al iniciar sesión")
      clearLoginForm()
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")
    
    const newErrors: Record<string, string> = {}
    
    if (!registerData.name) {
      newErrors.name = "El nombre es requerido"
    }
    
    if (!registerData.email) {
      newErrors.email = "El email es requerido"
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = "Ingresa un email válido"
    }
    
    if (!registerData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (!validatePassword(registerData.password)) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }
    
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await signUp(registerData.email, registerData.password)
      
      if (error) {
        let errorMessage = "Error al registrarse"
        
        if (error.message.includes("User already registered")) {
          errorMessage = "Este email ya está registrado. Intenta iniciar sesión."
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres."
        } else {
          errorMessage = error.message || "Error al registrarse"
        }
        
        showErrorAlert(errorMessage)
        clearRegisterForm()
      } else {
        setSuccessMessage("¡Registro exitoso! Revisa tu email para confirmar tu cuenta.")
        clearRegisterForm()
      }
    } catch (error) {
      showErrorAlert("Error inesperado al registrarse")
      clearRegisterForm()
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")
    
    if (!forgotPasswordData.email) {
      setErrors({ email: "El email es requerido" })
      return
    }
    
    if (!validateEmail(forgotPasswordData.email)) {
      setErrors({ email: "Ingresa un email válido" })
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await resetPassword(forgotPasswordData.email)
      
      if (error) {
        showErrorAlert(error.message || "Error al enviar email de recuperación")
        clearForgotPasswordForm()
      } else {
        setSuccessMessage("¡Email de recuperación enviado! Revisa tu bandeja de entrada.")
        clearForgotPasswordForm()
      }
    } catch (error) {
      showErrorAlert("Error inesperado al enviar email de recuperación")
      clearForgotPasswordForm()
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
              Sistema GPR
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestión Policial y Reportes
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

                {/* Resto de las pestañas... */}
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

// En la función signIn, después de la línea 60:
const signIn = async (email: string, password: string) => {
  console.log('🟠 LOGIN: Intentando iniciar sesión con:', email)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log('🟠 LOGIN: Resultado del login:', { error: error?.message })
  return { error }
}