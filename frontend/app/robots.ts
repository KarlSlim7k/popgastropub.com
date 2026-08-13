import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/staff',
        '/staff/',
        '/login',
        '/registro',
        '/recuperar-contrasena',
        '/perfil',
        '/facturacion',
        '/mis-facturas',
        '/reservas',
        '/puntos',
        '/recompensas',
        '/referidos',
        '/calificar-mesero',
      ],
    },
    sitemap: 'https://popgastropub.com/sitemap.xml',
  };
}
