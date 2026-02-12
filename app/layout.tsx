import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hugo Converter - YouTube & SoundCloud to MP3/MP4',
  description: 'Convert YouTube videos to MP3 or download as MP4 with quality selection. Convert SoundCloud tracks to MP3 format easily and quickly.',
  keywords: ['YouTube', 'SoundCloud', 'MP3', 'MP4', 'converter', 'download', 'music', 'video', '1080p', '4K'],
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
