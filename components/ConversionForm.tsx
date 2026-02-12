'use client'

import { useState, FormEvent } from 'react'
import ProgressBar from './ProgressBar'
import StatusMessage from './StatusMessage'

interface ConversionFormProps {
  platform: 'youtube' | 'soundcloud'
}

export default function ConversionForm({ platform }: ConversionFormProps) {
  const [url, setUrl] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })
  const [format, setFormat] = useState<'mp3' | 'mp4'>('mp3')
  const [quality, setQuality] = useState<'best' | 'high' | 'medium' | 'low'>('high')

  const buttonBg = platform === 'youtube' 
    ? 'bg-youtube-primary hover:bg-youtube-hover' 
    : 'bg-soundcloud-primary hover:bg-soundcloud-hover'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setStatus({
        type: 'error',
        message: 'Por favor, introduce una URL válida',
      })
      return
    }

    setIsConverting(true)
    setProgress(0)
    setProgressMessage('Iniciando conversión...')
    setStatus({ type: null, message: '' })

    const conversionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    let eventSource: EventSource | null = null

    try {
      // Connect to SSE endpoint for progress updates
      eventSource = new EventSource(`${apiUrl}/api/convert/progress/${conversionId}`)
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'progress') {
            setProgress(data.progress)
            setProgressMessage(data.message)
            console.log(`Progreso: ${data.progress}% - ${data.message}`)
          } else if (data.type === 'complete') {
            console.log('Conversión completada')
            setProgress(100)
            setProgressMessage('Descargando archivo...')
          } else if (data.type === 'error') {
            throw new Error(data.message)
          } else if (data.type === 'connected') {
            console.log('Conectado al stream de progreso')
          }
        } catch (err) {
          console.error('Error procesando evento SSE:', err)
        }
      }

      eventSource.onerror = (error) => {
        console.error('Error en EventSource:', error)
        // Don't throw here, the conversion might still succeed
      }

      // Start the actual conversion
      const response = await fetch(`${apiUrl}/api/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url, 
          conversionId,
          format: platform === 'youtube' ? format : 'mp3',
          quality: format === 'mp4' ? quality : undefined
        }),
      })

      // Close the SSE connection
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error en la conversión')
      }

      const blob = await response.blob()
      
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = format === 'mp4' ? 'video.mp4' : 'audio.mp3'
      
      if (contentDisposition) {
        let match = contentDisposition.match(/filename="([^"]+)"/)
        if (match && match[1]) {
          filename = match[1]
        } else {
          match = contentDisposition.match(/filename\*=UTF-8''([^;\s]+)/)
          if (match && match[1]) {
            filename = decodeURIComponent(match[1])
          }
        }
      }

      setProgress(100)
      setProgressMessage('Descargando archivo...')

      // Download file
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)

      setStatus({
        type: 'success',
        message: 'Conversión completada correctamente. El archivo se está descargando.',
      })
      setUrl('')
    } catch (error) {
      // Close the SSE connection on error
      if (eventSource) {
        eventSource.close()
      }
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setStatus({
          type: 'error',
          message: 'Servicio temporalmente no disponible. Es posible que se haya alcanzado el límite gratuito de este mes. Por favor, inténtalo de nuevo el próximo mes.',
        })
      } else {
        setStatus({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ocurrió un error durante la conversión',
        })
      }
    } finally {
      setTimeout(() => {
        setIsConverting(false)
        setProgress(0)
        setProgressMessage('')
      }, 2000)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-4 animate-fade-in">
      <div className="bg-[#2b2b2b] rounded-xl p-8 border border-[#3f3f3f]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {platform === 'youtube' ? 'YouTube' : 'SoundCloud'} a {platform === 'youtube' ? format.toUpperCase() : 'MP3'}
          </h2>
          <p className="text-gray-400 text-base">
            Pega el enlace y descarga {platform === 'youtube' && format === 'mp4' ? 'tu vídeo' : 'tu audio'} en alta calidad
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Format selection for YouTube */}
          {platform === 'youtube' && (
            <div>
              <label className="block text-base font-semibold text-gray-300 mb-3">
                Formato de salida
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('mp3')}
                  disabled={isConverting}
                  className={`
                    px-4 py-3 rounded-lg font-medium text-base
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${format === 'mp3'
                      ? 'bg-red-500 text-white border-2 border-red-500'
                      : 'bg-[#1a1a1a] text-gray-300 border-2 border-[#3f3f3f] hover:border-red-500'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Audio MP3
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('mp4')}
                  disabled={isConverting}
                  className={`
                    px-4 py-3 rounded-lg font-medium text-base
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${format === 'mp4'
                      ? 'bg-red-500 text-white border-2 border-red-500'
                      : 'bg-[#1a1a1a] text-gray-300 border-2 border-[#3f3f3f] hover:border-red-500'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Vídeo MP4
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Quality selection for MP4 */}
          {platform === 'youtube' && format === 'mp4' && (
            <div>
              <label htmlFor="quality-select" className="block text-base font-semibold text-gray-300 mb-3">
                Calidad del vídeo
              </label>
              <div className="relative">
                <select
                  id="quality-select"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as 'best' | 'high' | 'medium' | 'low')}
                  disabled={isConverting}
                  className={`
                    w-full px-5 py-4 text-base bg-[#1a1a1a] border-2 border-[#3f3f3f] rounded-lg
                    text-white appearance-none cursor-pointer
                    focus:outline-none focus:border-red-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  `}
                >
                  <option value="best" className="bg-[#1a1a1a] text-white">Mejor calidad (4K+)</option>
                  <option value="high" className="bg-[#1a1a1a] text-white">Alta calidad (1080p)</option>
                  <option value="medium" className="bg-[#1a1a1a] text-white">Calidad media (720p)</option>
                  <option value="low" className="bg-[#1a1a1a] text-white">Calidad baja (480p)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="url-input" className="block text-base font-semibold text-gray-300 mb-3">
              URL de {platform === 'youtube' ? 'YouTube' : 'SoundCloud'}
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={`https://${platform === 'youtube' ? 'youtube.com/watch?v=' : 'soundcloud.com/'}...`}
                disabled={isConverting}
                className={`
                  w-full px-5 py-4 text-base bg-[#1a1a1a] border-2 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:bg-[#1a1a1a]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  ${platform === 'youtube' 
                    ? 'border-[#3f3f3f] focus:border-red-500' 
                    : 'border-[#3f3f3f] focus:border-orange-500'
                  }
                `}
                required
              />
              {url && (
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full ${
                  platform === 'youtube' ? 'bg-red-500' : 'bg-orange-500'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {isConverting ? (
            <ProgressBar progress={progress} platform={platform} message={progressMessage} />
          ) : (
            <button
              type="submit"
              className={`
                w-full py-4 px-6 rounded-lg font-semibold text-base text-white
                transform transition-all duration-200 
                hover:scale-[1.02]
                active:scale-[0.98]
                focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${platform === 'youtube' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {platform === 'youtube' && format === 'mp4' 
                  ? `Descargar Vídeo ${quality === 'best' ? '4K+' : quality === 'high' ? '1080p' : quality === 'medium' ? '720p' : '480p'}`
                  : 'Convertir a MP3'
                }
              </span>
            </button>
          )}
        </form>
      </div>

      <StatusMessage type={status.type} message={status.message} />
    </div>
  )
}
