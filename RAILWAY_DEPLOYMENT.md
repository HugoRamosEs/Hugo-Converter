# 🚀 Deployment Guide - Railway + Vercel

Esta guía te ayudará a desplegar la aplicación completa con arquitectura separada:
- **Frontend (Next.js)** → Vercel
- **Backend (Node.js + yt-dlp)** → Railway

---

## 📋 Requisitos Previos

- ✅ Cuenta en [Railway.app](https://railway.app) (gratis con GitHub)
- ✅ Cuenta en [Vercel](https://vercel.com) (gratis con GitHub)
- ✅ Repositorio en GitHub con el código

---

## 🎯 Paso 1: Deploy del Backend en Railway

### 1.1 Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub
5. Selecciona el repositorio `Hugo-Converter`

### 1.2 Configurar el Servicio

1. Railway detectará automáticamente el `Dockerfile` en `/backend`
2. Si no lo detecta:
   - Click en **"Settings"**
   - En **"Root Directory"**, pon: `backend`
   - En **"Builder"**, selecciona: `Dockerfile`

### 1.3 Variables de Entorno (Opcional)

En la pestaña **"Variables"**, agrega:
```
PORT=3001
```

### 1.4 Desplegar

1. Click en **"Deploy"**
2. Espera 3-5 minutos (instala yt-dlp y ffmpeg)
3. Una vez desplegado, copia la **URL pública**
   - Ejemplo: `https://your-app.up.railway.app`

### 1.5 Verificar que Funciona

Prueba el health check:
```bash
curl https://your-app.up.railway.app/health
```

Deberías ver:
```json
{"status":"ok","timestamp":"2026-02-12T..."}
```

---

## 🎨 Paso 2: Deploy del Frontend en Vercel

### 2.1 Configurar Variable de Entorno

**IMPORTANTE:** Antes de desplegar, necesitas configurar la URL del backend.

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **"Settings" → "Environment Variables"**
4. Agrega una nueva variable:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-app.up.railway.app
   ```
   ⚠️ **Reemplaza con tu URL real de Railway**
5. Aplica a: **Production, Preview, Development**

### 2.2 Desplegar en Vercel

**Opción A: Desde GitHub (Recomendado)**
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio GitHub
3. Vercel detectará Next.js automáticamente
4. **Root Directory:** Dejar vacío (raíz del proyecto)
5. Click en **"Deploy"**

**Opción B: Desde CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# En la raíz del proyecto
vercel

# Seguir las instrucciones
# Cuando pregunte por root directory, presionar Enter (raíz)
```

### 2.3 Verificar Deployment

1. Una vez desplegado, visita tu URL de Vercel
2. Deberías ver la aplicación funcionando
3. Prueba convertir un video de YouTube y SoundCloud

---

## 🧪 Paso 3: Testing Local

Si quieres probar localmente antes de desplegar:

### Backend (Terminal 1)
```bash
cd backend
npm install
npm start
```

Backend corriendo en `http://localhost:3001`

### Frontend (Terminal 2)
```bash
# En la raíz del proyecto
npm run dev
```

Frontend corriendo en `http://localhost:3000`

Asegúrate de tener `.env.local` con:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔧 Troubleshooting

### Error: CORS en producción

Si ves errores de CORS, el backend ya tiene `cors()` habilitado para todas las origins. Verifica que:
1. La URL del backend en `NEXT_PUBLIC_API_URL` sea correcta
2. No tenga `/` al final
3. Use `https://` (no `http://`)

### Error: yt-dlp no funciona

Railway puede tardar en instalar yt-dlp. Verifica los logs:
1. En Railway, ve a tu servicio
2. Click en **"Deployments"**
3. Click en el deployment activo
4. Ve la pestaña **"Deploy Logs"**
5. Busca errores en la instalación de yt-dlp

### Error: Conversión tarda mucho

Videos largos pueden tardar. Consideraciones:
- Railway free tier: Sin límite de tiempo de ejecución
- Videos >10min pueden tardar 1-2 minutos
- Agrega un timeout en el frontend si es necesario

### Error: 413 Payload Too Large

Si el video es muy grande:
1. Railway tiene límite de 512MB de RAM en free tier
2. Considera actualizar a plan Pro ($5/mes)
3. O limita la duración de videos en el frontend

---

## 💰 Costos Estimados

### Railway (Backend)
- **Free tier:** $5 crédito gratis/mes
- **Uso típico:** ~$2-3/mes para uso personal
- **Si se agota:** $0.000231 por GB-second

### Vercel (Frontend)
- **Free tier:** 100GB bandwidth/mes
- **Función serverless:** 100GB-hours/mes
- **Uso típico:** Gratis para proyectos personales

### Total Estimado
- **Uso personal/demo:** $0-5/mes
- **Con tráfico moderado:** $5-10/mes

---

## 📚 Recursos Adicionales

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)

---

## 🎉 ¡Listo!

Tu aplicación ahora está desplegada en:
- 🎨 **Frontend:** `https://your-app.vercel.app`
- 🔧 **Backend:** `https://your-app.railway.app`

Comparte tu proyecto y disfruta convirtiendo música! 🎵
