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

  // IMPORTANTE: Evita escribir cualquier lógica entre createServerClient y
  // supabase.auth.getUser(). Un simple error podría hacer muy difícil debuggear
  // problemas con usuarios siendo desconectados aleatoriamente.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Definir rutas protegidas y públicas
  const publicRoutes = ['/login', '/register', '/auth']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isHomeRoute = request.nextUrl.pathname === '/'

  // Redirigir página principal al login para usuarios no autenticados, al dashboard para autenticados
  if (isHomeRoute) {
    const url = request.nextUrl.clone()
    if (user) {
      console.log('✅ Usuario autenticado redirigiendo al dashboard desde inicio')
      url.pathname = '/dashboard'
    } else {
      console.log('🔒 Usuario no autenticado redirigiendo al login desde inicio')
      url.pathname = '/login'
    }
    return NextResponse.redirect(url)
  }

  // Verificar si el usuario está accediendo a rutas protegidas sin autenticación
  if (!user && (isDashboardRoute || (!isPublicRoute))) {
    console.log('🔒 Usuario no autenticado intentando acceder a ruta protegida:', request.nextUrl.pathname)
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si el usuario está logueado y trata de acceder a páginas de autenticación, redirigir al dashboard
  if (user && isPublicRoute) {
    console.log('✅ Usuario autenticado redirigiendo al dashboard desde:', request.nextUrl.pathname)
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Registrar estado de autenticación para debugging
  if (user && isDashboardRoute) {
    console.log('✅ Usuario autenticado accediendo al dashboard:', user.email)
  }

  // IMPORTANTE: Debes retornar el objeto supabaseResponse tal como está. Si estás
  // creando un nuevo objeto de respuesta con NextResponse.next() asegúrate de:
  // 1. Pasar la request en él, así:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copiar las cookies, así:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Cambiar el objeto myNewResponse en lugar del objeto supabaseResponse

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * Siéntete libre de modificar este patrón para incluir más rutas.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}