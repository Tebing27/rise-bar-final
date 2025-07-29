import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rise Bar',
    short_name: 'Rise Bar',
    description: 'Platform cerdas untuk memantau, menganalisis, dan mengelola kadar glukosa Anda.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc', 
    theme_color: '#115e59',     
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}