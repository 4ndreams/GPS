#!/usr/bin/env node
"use strict";

/**
 * Script independiente para ejecutar el seeding de productos
 * Uso: node seedProducts.js
 */

import { connectDB, AppDataSource } from "./src/config/configDb.js";
import { initializeDefaultData, seedDefaultProducts } from "./src/config/seedData.js";

async function runSeeding() {
  try {
    console.log("🚀 Iniciando script de seeding de productos...");
    
    // Conectar a la base de datos
    await connectDB();
    
    // Preguntar al usuario qué quiere hacer
    const args = process.argv.slice(2);
    const forceFlag = args.includes('--force') || args.includes('-f');
    
    if (forceFlag) {
      console.log("⚠️  Modo FORCE activado: se crearán productos sin verificar duplicados");
      await seedDefaultProducts();
    } else {
      console.log("📋 Modo normal: verificando productos existentes...");
      await initializeDefaultData();
    }
    
    console.log("✅ Script de seeding completado");
    
  } catch (error) {
    console.error("❌ Error en el script de seeding:", error);
  } finally {
    // Cerrar la conexión
    if (AppDataSource && AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔒 Conexión a la base de datos cerrada");
    }
    process.exit(0);
  }
}

// Mostrar ayuda si se solicita
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📦 Script de Seeding de Productos

Uso:
  node seedProducts.js           - Modo normal (verifica duplicados)
  node seedProducts.js --force   - Fuerza la creación sin verificar
  node seedProducts.js -f        - Fuerza la creación sin verificar
  node seedProducts.js --help    - Muestra esta ayuda

Descripción:
  Este script crea productos por defecto en la base de datos.
  En modo normal, verifica si ya existen productos antes de crear.
  En modo force, intenta crear todos los productos sin verificar.
  `);
  process.exit(0);
}

runSeeding();
