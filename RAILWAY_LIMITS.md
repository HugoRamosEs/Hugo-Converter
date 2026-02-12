# 💰 Configurar Límites de Gasto en Railway

Esta guía te ayuda a establecer límites para no exceder los $5 gratis mensuales de Railway.

---

## 🛡️ Paso 1: Configurar límite de gasto en Railway

### En el Dashboard de Railway:

1. **Accede a tu proyecto**
   - Ve a [railway.app](https://railway.app)
   - Selecciona tu proyecto `Hugo-Converter`

2. **Configura el límite**
   - Click en **"Settings"** (⚙️)
   - Busca la sección **"Usage Limits"**
   - Establece: **Usage Limit: $5.00**
   - Click en **"Save"**

3. **Configura notificaciones**
   - En **"Settings"** → **"Notifications"**
   - Activa: **"Email notifications"**
   - Recibirás alertas cuando:
     - 📧 **80% del límite** ($4.00 usado)
     - 📧 **95% del límite** ($4.75 usado)
     - 🛑 **100% del límite** (servicio detenido)

---

## ⚙️ Cómo funciona

### Cuando alcanzas el límite:

1. **Railway detiene el servicio automáticamente**
   - El contenedor deja de ejecutarse
   - No se generan más costos

2. **Los usuarios ven un mensaje claro**
   - Frontend detecta que el backend no responde
   - Muestra: *"Service temporarily unavailable. The free tier limit may have been reached for this month."*

3. **El servicio se reinicia automáticamente**
   - 📅 **El día 1 de cada mes**
   - Los $5 de crédito se renuevan
   - El servicio vuelve a estar disponible

---

## 📊 Monitorear uso

### Ver consumo actual:

1. En Railway, ve a tu proyecto
2. Click en **"Usage"**
3. Verás:
   - 💵 **Gasto del mes actual**
   - ⏱️ **Horas de ejecución**
   - 📦 **GB transferidos**
   - 💾 **RAM utilizada**

### Estimación de uso:

Para **Hugo Converter**:
- **Backend idle:** ~$0.50/mes (512MB RAM, siempre activo)
- **Por conversión:** ~$0.01-0.05 (dependiendo duración video)
- **Estimado total:** $2-4/mes con uso moderado

---

## 🚨 Qué hacer si se detiene

### Opción 1: Esperar al próximo mes (Gratis)
- El servicio se reinicia automáticamente el día 1
- Los $5 de crédito se renuevan

### Opción 2: Agregar método de pago (Pay as you go)
1. En Railway → **"Settings"** → **"Billing"**
2. Agrega tarjeta de crédito
3. Elimina el límite de $5
4. **Pagarás solo lo que uses** ($0.000231 por GB-second)
5. ~$5-10/mes con uso normal

### Opción 3: Optimizar para reducir costos
- Reducir RAM del contenedor (256MB en lugar de 512MB)
- Agregar "sleep mode" cuando no se usa por X horas
- Implementar caché para videos frecuentes

---

## 📝 Mensaje personalizado

Si quieres cambiar el mensaje que ven los usuarios cuando el servicio está detenido, edita:

**Archivo:** `components/ConversionForm.tsx`

```typescript
message: '⚠️ Tu mensaje personalizado aquí'
```

Ejemplos:
- *"🔧 Service under maintenance. Back soon!"*
- *"💤 Monthly limit reached. Service resumes on [fecha]"*
- *"📧 Contact support@tudominio.com for immediate access"*

---

## ✅ Checklist de configuración

Antes de ir a producción, verifica:

- [ ] **Límite de $5 configurado** en Railway
- [ ] **Email notifications activadas**
- [ ] **Mensaje de error** personalizado en frontend
- [ ] **Monitoreo activo** - Revisa uso semanalmente
- [ ] **Plan B** - Decide qué hacer si llegas al límite

---

## 💡 Tips para reducir costos

### 1. Optimizar Docker image
```dockerfile
# Usa alpine en lugar de slim
FROM node:20-alpine
```
**Ahorro:** ~30% menos RAM

### 2. Agregar timeout
En `backend/server.js`:
```javascript
// Timeout de 5 minutos máximo por conversión
req.setTimeout(300000)
```

### 3. Limitar duración de videos
En `backend/converters/youtube.js`:
```javascript
if (metadata.duration > 600) { // 10 minutos
  throw new Error('Video too long. Max 10 minutes.')
}
```

---

## 🎯 Conclusión

Con el límite de $5 configurado:
- ✅ **Nunca pagarás de más**
- ✅ **Railway detiene automáticamente el servicio**
- ✅ **Los usuarios ven un mensaje claro**
- ✅ **Se reinicia cada mes automáticamente**

**¡Tu billetera está protegida!** 💰🛡️
