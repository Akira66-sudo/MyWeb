import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Penjaga Gerbang: Proteksi semua rute /admin/*
  if (url.pathname.startsWith('/admin')) {
    const token = context.cookies.get('sb-access-token');
    
    console.log("[Middleware] Akses ke /admin, token:", token ? token.value : "TIDAK ADA");
    
    // Jika tidak ada cookie sesi akses, alihkan ke /login
    if (!token || !token.value) {
      console.log("[Middleware] Redirecting to /login due to missing token.");
      return context.redirect('/login');
    }
  }

  return next();
});
