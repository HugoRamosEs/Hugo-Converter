import SCDL from 'soundcloud-downloader'
import ffmpeg from '@ffmpeg-installer/ffmpeg'
import { exec } from 'child_process'
import { promisify } from 'util'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'
import { readFile, unlink, mkdir, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { Transform } from 'stream'

const execPromise = promisify(exec)
const scdl = SCDL.create()

/**
 * Converts a SoundCloud track to MP3
 * @param {string} url - SoundCloud track URL
 * @param {Function} onProgress - Callback for progress updates (progress, message)
 * @returns {Promise<{buffer: Buffer, filename: string}>}
 */
export async function convertSoundCloud(url, onProgress = null) {
  const tempId = randomBytes(16).toString('hex')
  const tempDir = join(tmpdir(), `soundcloud-${tempId}`)
  const tempDownload = join(tempDir, 'audio')
  const tempOutput = join(tempDir, 'output.mp3')

  try {
    if (onProgress) onProgress(10, 'Obteniendo información de la pista...')
    console.log('Obteniendo información de la pista de SoundCloud...')
    
    // Create temp directory
    await mkdir(tempDir, { recursive: true })

    // Get track info
    const info = await scdl.getInfo(url)
    
    if (!info) {
      throw new Error('No se pudo obtener la información de la pista de SoundCloud')
    }

    console.log('Título de la pista:', info.title)
    console.log('Artista:', info.user?.username)
    console.log('Duración:', Math.round(info.duration / 1000), 'segundos')

    if (onProgress) onProgress(20, 'Iniciando descarga...')
    console.log('Descargando pista...')
    
    // Download the track with progress tracking
    const stream = await scdl.download(url)
    
    if (!stream) {
      throw new Error('No se pudo obtener el stream de audio')
    }

    // Track download progress
    let downloadedBytes = 0
    let lastProgressUpdate = 20

    const progressTransform = new Transform({
      transform(chunk, encoding, callback) {
        downloadedBytes += chunk.length
        
        // Update progress every 500KB approximately
        if (onProgress && downloadedBytes % 500000 < chunk.length) {
          // Estimate progress (20% to 50% range for download)
          const estimatedProgress = Math.min(50, 20 + (downloadedBytes / 100000))
          if (estimatedProgress > lastProgressUpdate) {
            lastProgressUpdate = estimatedProgress
            onProgress(Math.floor(estimatedProgress), 'Descargando pista de SoundCloud...')
          }
        }
        
        callback(null, chunk)
      }
    })

    // Save to temp file with progress tracking
    const writeStream = createWriteStream(tempDownload)
    await pipeline(stream, progressTransform, writeStream)

    if (onProgress) onProgress(55, 'Descarga completada, iniciando conversión...')
    console.log('Descarga completa, convirtiendo a MP3...')

    // Convert to proper MP3 with metadata using ffmpeg
    const durationSeconds = Math.round(info.duration / 1000)
    const ffmpegCommand = `"${ffmpeg.path}" -i "${tempDownload}" -vn -ar 44100 -ac 2 -b:a 192k -metadata title="${info.title.replace(/"/g, '\\"')}" -metadata artist="${(info.user?.username || '').replace(/"/g, '\\"')}" "${tempOutput}"`
    
    if (onProgress) onProgress(65, 'Convirtiendo audio a MP3...')
    console.log('Ejecutando conversión con ffmpeg...')
    await execPromise(ffmpegCommand)

    if (onProgress) onProgress(85, 'Procesando metadatos...')
    console.log('Conversión completa, leyendo archivo...')

    // Read the converted file
    const buffer = await readFile(tempOutput)
    console.log('Archivo leído correctamente, tamaño:', buffer.length)

    if (onProgress) onProgress(92, 'Preparando archivo para descarga...')

    // Create clean filename
    const cleanTitle = (info.title || 'track')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100)

    const artist = info.user?.username || ''
    const cleanArtist = artist
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50)

    // Check if title already contains artist
    const titleContainsArtist = cleanArtist && cleanTitle.toLowerCase().includes(cleanArtist.toLowerCase())

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
        title: info.title,
        artist: info.user?.username,
        duration: durationSeconds,
        artwork: info.artwork_url,
      }
    }
  } catch (error) {
    // Cleanup on error
    try {
      await rm(tempDir, { recursive: true, force: true })
    } catch (cleanupError) {
      console.error('Error de limpieza:', cleanupError)
    }

    console.error('Error de conversión de SoundCloud:', error)
    throw new Error(
      error instanceof Error
        ? `Error al convertir desde SoundCloud: ${error.message}`
        : 'Error al convertir desde SoundCloud'
    )
  }
}
