# 🌱 Sistema de Seeding de Productos

Este sistema automatiza la creación de productos por defecto (puertas) en la base de datos del backend de Ventas.

## 🚀 Funcionamiento Automático

Cuando inicias el servidor con `npm run dev` o `npm start`, el sistema:

1. ✅ Se conecta a la base de datos
2. 🔍 Verifica si ya existen productos
3. 📦 Si NO hay productos, crea 10 puertas por defecto
4. ⏭️ Si YA hay productos, omite la creación
5. 🚀 Inicia el servidor normalmente

## 📋 Productos Creados por Defecto

El seeding crea estos 10 productos automáticamente:

1. **Puerta 3 Palos Lisa Enchape Mara** - $250,000
2. **Puerta 3 Palos Ranurada Enchape Wengue** - $280,000
3. **Puerta Alcala Enchape Wengue** - $320,000
4. **Puerta Milano Roma Enchape Mara** - $350,000
5. **Puerta Doble Castell Enchape Mara** - $450,000
6. **Puerta Enchapada Cedro Lisa** - $300,000
7. **Puerta 3 Palos 5 Vidrios Enchape Mara** - $380,000
8. **Puerta Geno Enchape Wengue** - $330,000
9. **Juego de Puertas Alcala 5 Vidrios Enchape Mara** - $720,000
10. **Puerta Milano Vidrio Centrado Enchape Wengue** - $370,000

## 🛠️ Scripts Disponibles

### Seeding Automático
```bash
npm run dev    # Desarrollo con seeding automático
npm start      # Producción con seeding automático
```

### Seeding Manual
```bash
npm run seed        # Crear productos solo si no existen
npm run seed:force  # Forzar creación sin verificar duplicados
```

### Script Directo
```bash
node seedProducts.js         # Modo normal
node seedProducts.js --force # Modo forzado
node seedProducts.js --help  # Ver ayuda
```

## 📁 Archivos del Sistema

- `src/config/seedData.js` - Lógica principal del seeding
- `seedProducts.js` - Script independiente para ejecución manual
- `index.js` - Integración automática en el inicio del servidor

## 🔧 Configuración

### Datos de Productos
Los datos por defecto están definidos en `src/config/seedData.js` en la constante `DEFAULT_PRODUCTOS`.

### Personalización
Para modificar los productos por defecto:

1. Edita el array `DEFAULT_PRODUCTOS` en `seedData.js`
2. Reinicia el servidor o ejecuta `npm run seed:force`

## 🐞 Troubleshooting

### Error de conexión a base de datos
```bash
❌ Error al conectar con la base de datos
```
**Solución:** Verifica que PostgreSQL esté corriendo y las credenciales en `.env` sean correctas.

### Productos duplicados
```bash
⏭️ Producto ya existe: [nombre]
```
**Solución:** Esto es normal. El sistema previene duplicados automáticamente.

### Forzar recreación
```bash
npm run seed:force
```
**Cuidado:** Esto puede crear duplicados si los productos ya existen.

## 📊 Logs del Sistema

El seeding muestra logs detallados:
- 🔍 Verificación de productos existentes
- 📦 Inicio del proceso de seeding
- ✅ Productos creados exitosamente
- ⏭️ Productos que ya existen
- 🎉 Resumen final del proceso

## 🔒 Seguridad

- ✅ Verifica duplicados por nombre de producto
- ✅ Maneja errores de conexión graciosamente
- ✅ No interfiere con datos existentes (modo normal)
- ⚠️ El modo `--force` puede crear duplicados

## 🎯 Propósito

Este sistema asegura que:
1. Los desarrolladores tengan datos de prueba consistentes
2. El frontend móvil pueda cargar productos inmediatamente
3. Las pruebas de la aplicación funcionen sin configuración manual
4. El sistema sea fácil de desplegar en producción
