# Hugo Converter
![license](https://img.shields.io/badge/license-MIT-blue) ![type](https://img.shields.io/badge/type-web%20app-orange) ![platform](https://img.shields.io/badge/platform-cross--platform-green)

Una aplicación web moderna para convertir vídeos de YouTube y pistas de SoundCloud a formato MP3.

## ✨ Características

- ✅ Convierte vídeos de YouTube a MP3
- ✅ Convierte pistas de SoundCloud a MP3
- ✅ Totalmente responsive (móvil, tablet, escritorio)
- ✅ Progreso de conversión en tiempo real con Server-Sent Events (SSE)
- ✅ Descarga automática con títulos originales
- ✅ Backend separado con Express.js

## 🛠️ Construido Con

### Frontend
| Tecnología                                              | Descripción                                                                    |
|---------------------------------------------------------|--------------------------------------------------------------------------------|
| [Next.js 15](https://nextjs.org/)                       | Framework de React para aplicaciones web con renderizado del lado del servidor |
| [React 18](https://react.dev/)                          | Biblioteca de JavaScript para construir interfaces de usuario                  |
| [TypeScript](https://www.typescriptlang.org/)           | Superset de JavaScript tipado para mayor seguridad en el código                |
| [Tailwind CSS](https://tailwindcss.com/)                | Framework de CSS utility-first para diseño rápido y responsive                 |

### Backend
| Tecnología                                                                   | Descripción                                                        |
|------------------------------------------------------------------------------|--------------------------------------------------------------------|
| [Node.js](https://nodejs.org/)                                               | Entorno de ejecución de JavaScript del lado del servidor           |
| [Express.js](https://expressjs.com/)                                         | Framework web minimalista y flexible para Node.js                  |
| [yt-dlp-exec](https://github.com/microlinkhq/youtube-dl-exec)                | Wrapper de Node.js para yt-dlp, herramienta de descarga de YouTube |
| [soundcloud-downloader](https://www.npmjs.com/package/soundcloud-downloader) | Biblioteca para descargar pistas de SoundCloud                     |
| [FFmpeg](https://ffmpeg.org/)                                                | Herramienta de conversión y procesamiento multimedia               |

## 📦 Configuración e Instalación

### Requisitos Previos
---
- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior

### Instalación
---

#### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Hugo-Converter
```

#### 2. Instalar dependencias del Frontend
```bash
npm install
```

#### 3. Instalar dependencias del Backend
```bash
cd backend
npm install
cd ..
```

#### 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Ejecución en Desarrollo
---

#### Iniciar el Backend (Terminal 1)
```bash
cd backend
npm start
```
El backend se ejecutará en `http://localhost:3001`

#### Iniciar el Frontend (Terminal 2)
```bash
npm run dev
```
El frontend se ejecutará en `http://localhost:3000`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Despliegue

### Backend (Railway/Render/Fly.io)

El backend incluye un `Dockerfile` para despliegue en contenedores:

```bash
cd backend
docker build -t hugo-converter-backend .
docker run -p 3001:3001 hugo-converter-backend
```

### Frontend (Vercel)

1. Sube tu código a GitHub
2. Importa el proyecto en Vercel
3. Configura la variable de entorno `NEXT_PUBLIC_API_URL` con la URL de tu backend
4. Despliega con la configuración predeterminada

## 📖 Uso

1. Selecciona la plataforma (YouTube o SoundCloud)
2. Pega la URL del vídeo o pista
3. Haz clic en "Convertir a MP3"
4. Observa el progreso de la conversión en tiempo real
5. El archivo se descargará automáticamente cuando esté listo

## 📁 Estructura del Proyecto

```
Hugo-Converter/
├── app/                        # Aplicación Next.js
│   ├── globals.css            # Estilos globales (tema oscuro Windows 11)
│   ├── layout.tsx             # Layout raíz
│   └── page.tsx               # Página principal
├── backend/                    # Servidor Express.js
│   ├── converters/            
│   │   ├── youtube.js         # Lógica de conversión de YouTube
│   │   └── soundcloud.js      # Lógica de conversión de SoundCloud
│   ├── server.js              # Servidor principal con SSE
│   ├── Dockerfile             # Configuración de Docker
│   └── package.json           # Dependencias del backend
├── components/                 # Componentes de React
│   ├── ConversionForm.tsx     # Formulario principal de conversión
│   ├── Footer.tsx             # Componente de pie de página
│   ├── Header.tsx             # Componente de encabezado
│   ├── ProgressBar.tsx        # Indicador de progreso
│   ├── StatusMessage.tsx      # Mensajes de éxito/error
│   └── TabMenu.tsx            # Selector de plataforma
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Características de Diseño

- **Responsive Design**: Optimizado con breakpoints móvil y tablet
- **Animaciones Sutiles**: Transiciones suaves sin excesos para mejor rendimiento
- **Progreso Real**: Server-Sent Events (SSE) para actualizaciones de progreso en tiempo real
- **UX Mejorada**: Feedback visual inmediato y mensajes descriptivos en español

## 🔧 API Endpoints

### Backend (Puerto 3001)

#### `GET /health`
Comprobación de estado del servidor
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T10:30:00.000Z"
}
```

#### `GET /api/convert/progress/:conversionId`
Stream SSE para actualizaciones de progreso en tiempo real

#### `POST /api/convert`
Endpoint principal de conversión
```json
{
  "url": "https://youtube.com/watch?v=...",
  "conversionId": "conv_123456789"
}
```

## 📄 Licencia

© 2026 Hugo Converter. Todos los derechos reservados.

Este proyecto está bajo la licencia [MIT](./LICENSE).

## 📝 Notas

- La aplicación usa APIs y bibliotecas oficiales
- La velocidad de conversión depende de la duración del vídeo/pista
- El progreso se actualiza en tiempo real mediante Server-Sent Events
- Los archivos temporales se limpian automáticamente después de cada conversión
- Backend y frontend están completamente separados para mejor escalabilidad

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.
