'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Solo manejar redirecciones en carga inicial si es necesario
      if (isInitialLoad) {
        handleInitialRedirection(session, pathname)
        setIsInitialLoad(false)
      }
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Solo redirigir en cambios de estado de auth, no en refresh
      if (!isInitialLoad) {
        handleAuthStateChange(session, pathname, event)
      }
    })

    return () => subscription.unsubscribe()
  }, [router]) // Remover 'pathname' de las dependencias

  const handleInitialRedirection = (session: Session | null, currentPath: string) => {
    // Solo redirigir si no hay sesión y no estamos en login
    if (!session && currentPath !== '/login') {
      console.log('🔴 Redirigiendo a /login - No hay sesión en carga inicial')
      router.push('/login')
    }
  }

  const handleAuthStateChange = (session: Session | null, currentPath: string, event: string) => {
    // Redirigir solo en eventos específicos
    if (event === 'SIGNED_OUT' && currentPath !== '/login') {
      console.log('🔴 Redirigiendo a /login - Usuario deslogueado')
      router.push('/login')
    } else if (event === 'SIGNED_IN' && currentPath === '/login') {
      console.log('🟢 Redirigiendo a / - Usuario logueado desde login')
      router.push('/')
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}