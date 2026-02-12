# Hugo Converter Backend API

Backend service for converting YouTube and SoundCloud links to MP3 format.

## Features

- ✅ YouTube to MP3 conversion using yt-dlp
- ✅ SoundCloud to MP3 conversion
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

### Convert Audio
```
POST /api/convert
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=..."
}
```

Response: Binary MP3 file with proper headers

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

### cURL
```bash
curl -X POST http://localhost:3001/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ"}' \
  --output song.mp3
```

### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3001/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' })
})

const blob = await response.blob()
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'song.mp3'
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
