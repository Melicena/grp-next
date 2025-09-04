'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { session, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // Si no hay sesión y no estamos en login, redirigir a login
      if (!session && pathname !== '/login') {
        console.log('🔴 Redirigiendo a /login - No hay sesión')
        router.push('/login')
        return
      }
      
      // Si hay sesión y estamos en login, redirigir a home
      if (session && pathname === '/login') {
        console.log('🟢 Redirigiendo a / - Sesión activa')
        router.push('/')
        return
      }
    }
  }, [session, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}