import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://popgastropub.com';
  const routes = [
    ['', 1],
    ['/menu', 0.9],
    ['/promociones', 0.8],
    ['/pop-points', 0.8],
    ['/ubicacion', 0.8],
    ['/sobre-nosotros', 0.7],
    ['/facturacion', 0.7],
    ['/privacidad', 0.3],
    ['/terminos', 0.3],
  ] as const;

  return routes.map(([path, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/promociones' ? 'weekly' : 'monthly',
    priority,
  }));
}
