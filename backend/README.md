# Hugo Converter Backend API

Backend service for converting YouTube and SoundCloud links to MP3 and MP4 formats.

## Features

- ✅ YouTube to MP3 conversion using yt-dlp
- ✅ YouTube to MP4 download with quality selection (480p, 720p, 1080p, 4K+)
- ✅ SoundCloud to MP3 conversion
- ✅ Real-time progress updates via Server-Sent Events (SSE)
- ✅ REST API with Express
- ✅ Docker support
- ✅ Health check endpoint

## Tech Stack

- **Node.js 20** - Runtime environment
- **Express** - Web framework
- **yt-dlp** - YouTube downloader
- **ffmpeg** - Audio conversion
- **soundcloud-scraper** - SoundCloud downloader

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T00:00:00.000Z"
}
```

### Progress Stream (SSE)
```
GET /api/convert/progress/:conversionId
```

Returns real-time progress updates via Server-Sent Events.

### Convert Audio/Video
```
POST /api/convert
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=...",
  "conversionId": "conv_1234567890",
  "format": "mp3",        // "mp3" | "mp4" (mp4 only for YouTube)
  "quality": "high"       // "best" | "high" | "medium" | "low" (only for mp4)
}
```

**Format options:**
- `mp3`: Audio only (default)
- `mp4`: Video with audio (YouTube only)

**Quality options (for MP4):**
- `best`: Best available quality (4K+)
- `high`: 1080p (Full HD)
- `medium`: 720p (HD)
- `low`: 480p (SD)

Response: Binary MP3 or MP4 file with proper headers

## Local Development

### Prerequisites
- Node.js 18+
- yt-dlp installed (`pip install yt-dlp` or download binary)
- ffmpeg installed

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Docker Deployment

### Build Image
```bash
docker build -t hugo-converter-backend .
```

### Run Container
```bash
docker run -p 3001:3001 hugo-converter-backend
```

## Railway Deployment

1. Create new project in Railway
2. Connect GitHub repository
3. Select `/backend` as root directory
4. Railway will automatically detect Dockerfile
5. Deploy!

### Environment Variables (Optional)
```
PORT=3001
```

## Usage Example

### cURL - Convert to MP3
```bash
curl -X POST http://localhost:3001/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ","conversionId":"conv_123","format":"mp3"}' \
  --output song.mp3
```

### cURL - Download MP4 (1080p)
```bash
curl -X POST http://localhost:3001/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ","conversionId":"conv_124","format":"mp4","quality":"high"}' \
  --output video.mp4
```

### JavaScript/Fetch
```javascript
// MP3 Conversion
const response = await fetch('http://localhost:3001/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    conversionId: 'conv_123',
    format: 'mp3'
  })
})

// MP4 Download
const response = await fetch('http://localhost:3001/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    conversionId: 'conv_124',
    format: 'mp4',
    quality: 'high'
  })
})

const blob = await response.blob()
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'file.mp3' // or 'file.mp4'
a.click()
```

## Error Handling

All errors return JSON:
```json
{
  "error": "Error message description",
  "platform": "youtube" | "soundcloud"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad request (invalid URL or unsupported platform)
- `500` - Server error (conversion failed)

## License

MIT
