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
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🟡 AUTH CONTEXT: Sesión inicial:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        currentPath: pathname
      })
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Manejar redirecciones basadas en el estado de autenticación
      handleRedirection(session, pathname)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🟡 AUTH CONTEXT: Evento de autenticación:', {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        currentPath: pathname
      })
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Manejar redirecciones en cambios de estado
      handleRedirection(session, pathname)
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  const handleRedirection = (session: Session | null, currentPath: string) => {
    // Si no hay sesión y no estamos en login, redirigir a login
    if (!session && currentPath !== '/login') {
      console.log('🔴 Redirigiendo a /login - No hay sesión')
      router.push('/login')
      return
    }
    
    // Si hay sesión y estamos en login, redirigir a home
    if (session && currentPath === '/login') {
      console.log('🟢 Redirigiendo a / - Sesión activa')
      router.push('/')
      return
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