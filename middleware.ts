import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay sesión y está intentando acceder a rutas protegidas
  if (!session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si hay sesión y está en login, redirigir al dashboard
  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/login']
}