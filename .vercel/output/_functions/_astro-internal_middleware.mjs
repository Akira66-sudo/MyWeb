import { d as defineMiddleware, s as sequence } from './chunks/index_BgcIjHpy.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BkJJSSj-.mjs';
import 'piccolore';
import './chunks/astro/server_CFwk7vK6.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
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

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
