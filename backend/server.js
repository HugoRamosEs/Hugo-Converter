import express from 'express'
import cors from 'cors'
import { convertYouTube } from './converters/youtube.js'
import { convertSoundCloud } from './converters/soundcloud.js'

const app = express()
const PORT = process.env.PORT || 3001

// Store for active conversions
const activeConversions = new Map()

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// SSE endpoint for progress updates
app.get('/api/convert/progress/:conversionId', (req, res) => {
  const { conversionId } = req.params

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

  // Store the response object for this conversion
  if (!activeConversions.has(conversionId)) {
    activeConversions.set(conversionId, { progressClients: [] })
  }
  activeConversions.get(conversionId).progressClients.push(res)

  // Clean up on client disconnect
  req.on('close', () => {
    const conversion = activeConversions.get(conversionId)
    if (conversion) {
      conversion.progressClients = conversion.progressClients.filter(client => client !== res)
    }
  })
})

// Main conversion endpoint
app.post('/api/convert', async (req, res) => {
  const { url, conversionId } = req.body

  if (!url) {
    return res.status(400).json({ error: 'La URL es obligatoria' })
  }

  if (!conversionId) {
    return res.status(400).json({ error: 'ID de conversión obligatorio' })
  }

  console.log('Solicitud de conversión recibida:', url, 'ID:', conversionId)

  // Function to send progress updates to all connected clients
  const sendProgress = (progress, message) => {
    const conversion = activeConversions.get(conversionId)
    if (conversion && conversion.progressClients) {
      const data = JSON.stringify({ type: 'progress', progress, message })
      conversion.progressClients.forEach(client => {
        try {
          client.write(`data: ${data}\n\n`)
        } catch (err) {
          console.error('Error enviando progreso:', err)
        }
      })
    }
  }

  try {
    let result
    let platform

    // Detect platform
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube'
      console.log('Plataforma: YouTube')
      sendProgress(5, 'Conectando con YouTube...')
      result = await convertYouTube(url, sendProgress)
    } else if (url.includes('soundcloud.com')) {
      platform = 'soundcloud'
      console.log('Plataforma: SoundCloud')
      sendProgress(5, 'Conectando con SoundCloud...')
      result = await convertSoundCloud(url, sendProgress)
    } else {
      return res.status(400).json({ error: 'Plataforma no soportada. Solo se admiten YouTube y SoundCloud.' })
    }

    console.log(`Conversión completa: ${result.filename}`)
    sendProgress(100, 'Conversión completada')

    // Send completion event
    const conversion = activeConversions.get(conversionId)
    if (conversion && conversion.progressClients) {
      const data = JSON.stringify({ type: 'complete' })
      conversion.progressClients.forEach(client => {
        try {
          client.write(`data: ${data}\n\n`)
          client.end()
        } catch (err) {
          console.error('Error enviando completado:', err)
        }
      })
    }

    // Clean up
    activeConversions.delete(conversionId)

    // Send the file with proper headers
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
    
    const encodedFilename = encodeURIComponent(result.filename)
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"; filename*=UTF-8''${encodedFilename}`)
    
    console.log('Enviando archivo:', result.filename)
    res.send(result.buffer)

  } catch (error) {
    console.error('Error de conversión:', error)
    
    // Send error to progress clients
    const conversion = activeConversions.get(conversionId)
    if (conversion && conversion.progressClients) {
      const data = JSON.stringify({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Error en la conversión' 
      })
      conversion.progressClients.forEach(client => {
        try {
          client.write(`data: ${data}\n\n`)
          client.end()
        } catch (err) {
          console.error('Error enviando error:', err)
        }
      })
    }

    // Clean up
    activeConversions.delete(conversionId)

    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error en la conversión',
      platform: req.body.url?.includes('youtube') ? 'youtube' : 'soundcloud'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend en ejecución en el puerto ${PORT}`)
  console.log(`Comprobación de estado: http://localhost:${PORT}/health`)
  console.log(`API de conversión: http://localhost:${PORT}/api/convert`)
})
