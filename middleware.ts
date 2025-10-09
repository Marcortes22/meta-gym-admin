import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SupabaseEnvironment } from './shared/types/enviroment'
import { getSupabaseCredentials } from './shared/lib/supabase-config';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })


   const { url, anonKey } = getSupabaseCredentials();

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()


  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isHomeRoute = request.nextUrl.pathname === '/'
  

  if (!user && !isPublicRoute) {
    console.log('🔒 Redirigiendo a login:', request.nextUrl.pathname)
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }



  if (user && isHomeRoute) {
    console.log('✅ Usuario autenticado accediendo al home:', user.email)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}