import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hugo Converter - YouTube & SoundCloud',
  description: 'Convert YouTube videos and SoundCloud tracks to MP3 format easily and quickly.',
  keywords: ['YouTube', 'SoundCloud', 'MP3', 'converter', 'download', 'music'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
