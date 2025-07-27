# Guía de Despliegue - App Móvil con Backend Universitario

Esta guía te ayudará a generar la APK de tu aplicación móvil para que funcione con tu backend ya configurado en el servidor universitario.

## 📋 Prerrequisitos

- ✅ Backend ya funcionando en el servidor universitario 
- ✅ Base de datos PostgreSQL ya configurada
- ✅ Conexión a la red universitaria (Wi-Fi o LAN)
- EAS CLI instalado (`npm install -g @expo/eas-cli`)
- Node.js y npm instalados

##  Configuración de la App Móvil

### 1. Variables de entorno ya configuradas ✅

El archivo `mobile/.env` ya está configurado para conectar con tu backend:

```env
EXPO_PUBLIC_API_BASE_URL=http://146.83.198.35:1237/api
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_UNIVERSITY_NETWORK=true
```

### 2. Generar APK

```bash
cd mobile

# Instalar dependencias
npm install

# Para generar APK de prueba (recomendado primero)
npm run build:preview

# Para generar APK de producción (cuando todo esté probado)
npm run build:production
```

## 🔍 Verificación antes de generar APK

### 1. Verificar que tu backend esté funcionando

```bash
# Desde tu navegador o terminal, verifica que responda:
curl http://146.83.198.35:1237/api
# Debería responder: {"message":"¡API funcionando!"}
```

### 2. Probar conexión desde la app

```bash
cd mobile
npm run verify-connection
```

## 🚀 Proceso completo de generación de APK

### Pasos recomendados:

1. **Verificar backend funcionando** ✅ (ya lo tienes)
2. **Verificar conexión** desde la red universitaria
3. **Generar APK preview** para pruebas
4. **Probar APK** en dispositivo conectado a red universitaria  
5. **Si todo funciona, generar APK production**

### Comandos paso a paso:

```bash
# 1. Ir al directorio móvil
cd mobile

# 2. Verificar conexión
npm run verify-connection

# 3. Generar APK de prueba
npm run build:preview

# 4. Una vez que descargues y pruebes la APK preview exitosamente:
npm run build:production
```

## 🎯 Resultado Final

Una vez que descargues e instales la APK en un dispositivo conectado a la red universitaria:

- ✅ Se conectará automáticamente a tu backend en `http://146.83.198.35:1237/api`
- ✅ Funcionará con tu base de datos PostgreSQL ya configurada
- ✅ Mantendrá todas las funcionalidades (login, gestión de productos, órdenes, etc.)
- ✅ No requerirá configuración adicional

## 🚨 Troubleshooting

### Si la app no se conecta al backend:

1. **Verificar red**: Asegúrate de estar conectado a la red universitaria
2. **Verificar backend**: Confirma que tu backend esté ejecutándose en `146.83.198.35:1237`
3. **Verificar firewall**: Puede que necesites abrir el puerto 1237 en el servidor
4. **Probar desde navegador**: Abre `http://146.83.198.35:1237/api` en tu navegador

### Si hay errores en la APK:

1. **Regenerar con logs**: `eas build --platform android --profile preview --clear-cache`
2. **Verificar variables de entorno**: Asegúrate de que estén incluidas en `eas.json`
3. **Probar en modo desarrollo primero**: `expo start` y conectar desde tu dispositivo

## ⚡ Comandos Rápidos

```bash
# Verificar conexión
npm run verify-connection

# Generar APK de prueba
npm run build:preview  

# Generar APK final
npm run build:production
```

¡Listo! Tu app móvil está configurada para funcionar con tu backend universitario. 🎉
