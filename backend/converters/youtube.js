import ytDlp from 'yt-dlp-exec'
import ffmpeg from '@ffmpeg-installer/ffmpeg'
import { readFile, unlink, mkdir, readdir, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomBytes } from 'crypto'

/**
 * Converts a YouTube video to MP3 using yt-dlp
 * @param {string} url - YouTube video URL
 * @param {Function} onProgress - Callback for progress updates (progress, message)
 * @returns {Promise<{buffer: Buffer, filename: string}>}
 */
export async function convertYouTube(url, onProgress = null) {
  const tempId = randomBytes(16).toString('hex')
  const tempDir = join(tmpdir(), `youtube-${tempId}`)
  const outputTemplate = join(tempDir, '%(title)s.%(ext)s')

  try {
    // Create temp directory
    await mkdir(tempDir, { recursive: true })
    console.log('Directorio temporal creado:', tempDir)

    if (onProgress) onProgress(10, 'Obteniendo información del vídeo...')
    console.log('Obteniendo metadatos del vídeo...')
    
    // Get video info first to extract metadata
    const metadata = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    })

    console.log('Título del vídeo:', metadata.title)
    console.log('Artista:', metadata.artist || metadata.uploader)
    console.log('Duración:', metadata.duration, 'segundos')

    if (onProgress) onProgress(25, 'Descargando audio de YouTube...')
    console.log('Iniciando descarga y conversión...')
    
    // Download and convert to MP3 using yt-dlp with progress tracking
    let lastProgress = 25
    await ytDlp(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0,
      output: outputTemplate,
      noPlaylist: true,
      ffmpegLocation: ffmpeg.path,
      addMetadata: true,
      embedThumbnail: false,
      progress: (progress) => {
        if (onProgress && progress.percent) {
          const percent = parseFloat(progress.percent)
          // Map download progress to 25-75% range
          const mappedProgress = Math.min(75, 25 + (percent * 0.5))
          
          if (mappedProgress > lastProgress + 2) { // Update every 2%
            lastProgress = mappedProgress
            if (mappedProgress < 40) {
              onProgress(Math.floor(mappedProgress), 'Descargando audio...')
            } else if (mappedProgress < 60) {
              onProgress(Math.floor(mappedProgress), 'Descargando y procesando...')
            } else {
              onProgress(Math.floor(mappedProgress), 'Convirtiendo a MP3...')
            }
          }
        }
      }
    })

    if (onProgress) onProgress(80, 'Procesando metadatos...')
    console.log('Descarga completa, leyendo archivo...')

    // Find the downloaded MP3 file
    const files = await readdir(tempDir)
    const mp3File = files.find(f => f.endsWith('.mp3'))

    if (!mp3File) {
      throw new Error('Archivo MP3 no encontrado después de la conversión')
    }

    const filePath = join(tempDir, mp3File)
    console.log('Leyendo archivo:', filePath)

    if (onProgress) onProgress(92, 'Preparando archivo para descarga...')

    // Read the file
    const buffer = await readFile(filePath)
    console.log('Archivo leído correctamente, tamaño:', buffer.length)

    // Use metadata for a clean filename
    const cleanTitle = (metadata.title || 'video')
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, ' ')      // Normalize spaces
      .trim()
      .substring(0, 100)         // Limit length

    // Only use artist if it's different from the title and exists
    const artist = metadata.artist || metadata.uploader || ''
    const cleanArtist = artist
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50)

    // Check if title already contains the artist name
    const titleContainsArtist = cleanArtist && cleanTitle.toLowerCase().includes(cleanArtist.toLowerCase())

    // Create filename: "Artist - Title.mp3" only if artist is not already in title
    const filename = (cleanArtist && !titleContainsArtist)
      ? `${cleanArtist} - ${cleanTitle}.mp3`
      : `${cleanTitle}.mp3`

    console.log('Nombre del archivo final:', filename)

    if (onProgress) onProgress(97, 'Limpiando archivos temporales...')

    // Cleanup
    await rm(tempDir, { recursive: true, force: true })

    return {
      buffer,
      filename,
      metadata: {
        title: metadata.title,
        artist: metadata.artist || metadata.uploader,
        duration: metadata.duration,
        thumbnail: metadata.thumbnail,
      }
    }
  } catch (error) {
    // Cleanup on error
    try {
      await rm(tempDir, { recursive: true, force: true })
    } catch (cleanupError) {
      console.error('Error de limpieza:', cleanupError)
    }

    console.error('Error de conversión de YouTube:', error)
    throw new Error(
      error instanceof Error 
        ? `Error al convertir desde YouTube: ${error.message}` 
        : 'Error al convertir desde YouTube'
    )
  }
}

/**
 * Downloads a YouTube video as MP4
 * @param {string} url - YouTube video URL
 * @param {string} quality - Quality preset: 'best', 'high', 'medium', 'low'
 * @param {Function} onProgress - Callback for progress updates (progress, message)
 * @returns {Promise<{buffer: Buffer, filename: string, metadata: object}>}
 */
export async function downloadYouTubeVideo(url, quality = 'high', onProgress = null) {
  const tempId = randomBytes(16).toString('hex')
  const tempDir = join(tmpdir(), `youtube-video-${tempId}`)
  const outputTemplate = join(tempDir, '%(title)s.%(ext)s')

  try {
    // Create temp directory
    await mkdir(tempDir, { recursive: true })
    console.log('Directorio temporal creado:', tempDir)

    if (onProgress) onProgress(10, 'Obteniendo información del vídeo...')
    console.log('Obteniendo metadatos del vídeo...')
    
    // Get video info first to extract metadata
    const metadata = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    })

    console.log('Título del vídeo:', metadata.title)
    console.log('Uploader:', metadata.uploader)
    console.log('Duración:', metadata.duration, 'segundos')

    if (onProgress) onProgress(25, 'Descargando vídeo de YouTube...')
    console.log('Iniciando descarga...')
    
    // Determine format selection based on quality
    let formatSelection
    switch (quality) {
      case 'best':
        formatSelection = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
        break
      case 'high':
        formatSelection = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best'
        break
      case 'medium':
        formatSelection = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best'
        break
      case 'low':
        formatSelection = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best'
        break
      default:
        // Default to high quality
        formatSelection = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best'
    }

    // Download video with progress tracking
    let lastProgress = 25
    await ytDlp(url, {
      format: formatSelection,
      output: outputTemplate,
      noPlaylist: true,
      ffmpegLocation: ffmpeg.path,
      mergeOutputFormat: 'mp4',
      addMetadata: true,
      embedThumbnail: false,
      progress: (progress) => {
        if (onProgress && progress.percent) {
          const percent = parseFloat(progress.percent)
          // Map download progress to 25-90% range
          const mappedProgress = Math.min(90, 25 + (percent * 0.65))
          
          if (mappedProgress > lastProgress + 2) { // Update every 2%
            lastProgress = mappedProgress
            if (mappedProgress < 50) {
              onProgress(Math.floor(mappedProgress), 'Descargando vídeo...')
            } else if (mappedProgress < 75) {
              onProgress(Math.floor(mappedProgress), 'Descargando y combinando...')
            } else {
              onProgress(Math.floor(mappedProgress), 'Procesando vídeo...')
            }
          }
        }
      }
    })

    if (onProgress) onProgress(92, 'Leyendo archivo...')
    console.log('Descarga completa, leyendo archivo...')

    // Find the downloaded MP4 file
    const files = await readdir(tempDir)
    const mp4File = files.find(f => f.endsWith('.mp4'))

    if (!mp4File) {
      throw new Error('Archivo MP4 no encontrado después de la descarga')
    }

    const filePath = join(tempDir, mp4File)
    console.log('Leyendo archivo:', filePath)

    if (onProgress) onProgress(95, 'Preparando archivo para descarga...')

    // Read the file
    const buffer = await readFile(filePath)
    console.log('Archivo leído correctamente, tamaño:', buffer.length)

    // Use metadata for a clean filename
    const cleanTitle = (metadata.title || 'video')
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, ' ')      // Normalize spaces
      .trim()
      .substring(0, 100)         // Limit length

    const filename = `${cleanTitle}.mp4`
    console.log('Nombre del archivo final:', filename)

    if (onProgress) onProgress(97, 'Limpiando archivos temporales...')

    // Cleanup
    await rm(tempDir, { recursive: true, force: true })

    return {
      buffer,
      filename,
      metadata: {
        title: metadata.title,
        uploader: metadata.uploader,
        duration: metadata.duration,
        thumbnail: metadata.thumbnail,
        resolution: metadata.resolution,
      }
    }
  } catch (error) {
    // Cleanup on error
    try {
      await rm(tempDir, { recursive: true, force: true })
    } catch (cleanupError) {
      console.error('Error de limpieza:', cleanupError)
    }

    console.error('Error de descarga de vídeo de YouTube:', error)
    throw new Error(
      error instanceof Error 
        ? `Error al descargar vídeo de YouTube: ${error.message}` 
        : 'Error al descargar vídeo de YouTube'
    )
  }
}
