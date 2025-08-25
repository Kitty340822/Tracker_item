import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ให้ /admin/claim เข้าถึงได้โดยไม่ redirect
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // ถ้าเป็นหน้า /admin อื่นๆ ให้ redirect ไป /admin/claim
  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/', request.url))
  }

  // หน้าอื่นไม่ต้องทำอะไร
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*', // middleware ใช้กับ /admin/*
}
