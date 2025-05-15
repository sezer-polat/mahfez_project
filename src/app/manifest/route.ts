import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "Yeşil Yolculuk",
    short_name: "Yeşil Yolculuk",
    description: "Doğa dostu seyahat platformu",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4CAF50",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  return NextResponse.json(manifest);
} 