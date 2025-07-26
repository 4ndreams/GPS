#!/usr/bin/env node
"use strict";

/**
 * Script independiente para ejecutar el seeding de productos
 * Uso: node seedProducts.js
 */

import { connectDB, AppDataSource } from "./src/config/configDb.js";
import ProductoSchema from "./src/entity/producto.entity.js";
import { initializeDefaultData, seedDefaultProducts } from "./src/config/seedData.js";

// Catálogo de puertas extraído de crear-minuta.tsx
const catalogoPuertas = [
  // Puertas Enchapadas
  {
    nombre_producto: 'Geno Enchape Wengue',
    precio: 180000,
    descripcion: 'Puerta enchapada modelo Geno en color Wengue, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Doble Castell Enchape Mara',
    precio: 320000,
    descripcion: 'Puerta doble enchapada modelo Castell en color Mara, medidas estándar 200x160x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 160, espesor: 4 }
  },
  {
    nombre_producto: 'Alcala Enchape Wengue',
    precio: 190000,
    descripcion: 'Puerta enchapada modelo Alcala en color Wengue, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: '3 Palos Ranurada Enchape Wengue',
    precio: 175000,
    descripcion: 'Puerta enchapada 3 palos ranurada en color Wengue, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Milano Vidrio Centrado Enchape Wengue',
    precio: 220000,
    descripcion: 'Puerta enchapada Milano con vidrio centrado en color Wengue, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Milano Vidrio Centrado Enchape Mara',
    precio: 225000,
    descripcion: 'Puerta enchapada Milano con vidrio centrado en color Mara, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Milano Roma Enchape Mara',
    precio: 210000,
    descripcion: 'Puerta enchapada Milano modelo Roma en color Mara, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Juego Alcala Cinco Vidrios Enchape Mara',
    precio: 450000,
    descripcion: 'Juego de puertas Alcala con cinco vidrios en color Mara, medidas estándar 200x160x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 160, espesor: 4 }
  },
  {
    nombre_producto: 'Lisa Con Mirilla Enchape Mara',
    precio: 185000,
    descripcion: 'Puerta lisa con mirilla enchapada en color Mara, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: '3 Palos Lisa Enchape Wengue',
    precio: 170000,
    descripcion: 'Puerta enchapada 3 palos lisa en color Wengue, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Tres Palos Lisa Vidrio Centrado Enchape Mara',
    precio: 215000,
    descripcion: 'Puerta enchapada 3 palos lisa con vidrio centrado en color Mara, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: '3 Palos Ranurada Enchape Mara',
    precio: 180000,
    descripcion: 'Puerta enchapada 3 palos ranurada en color Mara, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: '3 Palos Alcala Enchape Mara',
    precio: 195000,
    descripcion: 'Puerta enchapada 3 palos modelo Alcala en color Mara, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Tres Palos Cinco Vidrios',
    precio: 240000,
    descripcion: 'Puerta enchapada 3 palos con cinco vidrios, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Closet Enchape Mara',
    precio: 140000,
    descripcion: 'Puerta de closet enchapada en color Mara, medidas estándar 200x60x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 60, espesor: 4 }
  },
  {
    nombre_producto: '3 Palos Lisa Enchape Mara',
    precio: 175000,
    descripcion: 'Puerta enchapada 3 palos lisa en color Mara, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Enchapada Modelo Vero',
    precio: 200000,
    descripcion: 'Puerta enchapada modelo Vero, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Enchapada Modelo Roma',
    precio: 205000,
    descripcion: 'Puerta enchapada modelo Roma, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Enchapada Medio Cuerpo',
    precio: 160000,
    descripcion: 'Puerta enchapada medio cuerpo, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Enchapada Mara Castella',
    precio: 195000,
    descripcion: 'Puerta enchapada Mara modelo Castella, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'mara',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  {
    nombre_producto: 'Enchapada Cedro Lisa',
    precio: 185000,
    descripcion: 'Puerta enchapada Cedro lisa, medidas estándar 200x80x4 cm',
    categoria: 'enchapadas',
    subcategoria: 'wengue',
    material_exterior: 'MDF Enchapado',
    relleno_interior: 'Nido de Abeja',
    medidas_standard: { alto: 200, ancho: 80, espesor: 4 }
  },
  // Puertas Terciadas
  {
    nombre_producto: 'Terciado Corriente Lisa',
    precio: 120000,
    descripcion: 'Puerta terciada corriente lisa, medidas estándar 200x80x3 cm',
    categoria: 'terciadas',
    material_exterior: 'Terciado',
    relleno_interior: 'Relleno de Madera',
    medidas_standard: { alto: 200, ancho: 80, espesor: 3 }
  },
  {
    nombre_producto: 'Terciado Corriente 1/2 Cuerpo',
    precio: 110000,
    descripcion: 'Puerta terciada corriente medio cuerpo, medidas estándar 200x80x3 cm',
    categoria: 'terciadas',
    material_exterior: 'Terciado',
    relleno_interior: 'Relleno de Madera',
    medidas_standard: { alto: 200, ancho: 80, espesor: 3 }
  },
  {
    nombre_producto: 'Terciado Corriente Con Mirilla De Colegio',
    precio: 125000,
    descripcion: 'Puerta terciada corriente con mirilla de colegio, medidas estándar 200x80x3 cm',
    categoria: 'terciadas',
    material_exterior: 'Terciado',
    relleno_interior: 'Relleno de Madera',
    medidas_standard: { alto: 200, ancho: 80, espesor: 3 }
  },
  {
    nombre_producto: 'Terciado Corriente 6 Luces',
    precio: 135000,
    descripcion: 'Puerta terciada corriente con 6 luces, medidas estándar 200x80x3 cm',
    categoria: 'terciadas',
    material_exterior: 'Terciado',
    relleno_interior: 'Relleno de Madera',
    medidas_standard: { alto: 200, ancho: 80, espesor: 3 }
  }
];

async function seedProducts() {
  try {
    console.log("🚀 Iniciando seeding de productos...\n");

    // Inicializar la conexión de la base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("🔗 Conexión a base de datos inicializada\n");
    }

    const productoRepository = AppDataSource.getRepository(ProductoSchema);
    
    console.log(`📦 Procesando ${catalogoPuertas.length} productos...\n`);

    const createdProducts = [];
    const existingProducts = [];

    for (const puerta of catalogoPuertas) {
      console.log(`🔍 Verificando producto: ${puerta.nombre_producto}...`);

      // Verificar si el producto ya existe
      const existingProduct = await productoRepository.findOne({ 
        where: { nombre_producto: puerta.nombre_producto } 
      });

      if (existingProduct) {
        console.log(`⚠️  El producto ya existe: ${puerta.nombre_producto}`);
        existingProducts.push(existingProduct);
        continue;
      }

      // Crear el producto
      const newProduct = productoRepository.create({
        nombre_producto: puerta.nombre_producto,
        precio: puerta.precio,
        descripcion: puerta.descripcion,
        categoria: puerta.categoria,
        subcategoria: puerta.subcategoria || null,
        material_exterior: puerta.material_exterior,
        relleno_interior: puerta.relleno_interior,
        medidas_standard: JSON.stringify(puerta.medidas_standard),
        stock: 0, // Stock inicial en 0
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedProduct = await productoRepository.save(newProduct);
      createdProducts.push(savedProduct);
      
      console.log(`✅ Producto creado: ${puerta.nombre_producto} - $${puerta.precio.toLocaleString()}`);
    }

    // Mostrar resumen
    console.log("\n🎉 Resumen del seeding:");
    console.log("═══════════════════════════════════════");
    console.log(`📦 Productos creados: ${createdProducts.length}`);
    console.log(`⚠️  Productos existentes: ${existingProducts.length}`);
    console.log(`📊 Total procesados: ${catalogoPuertas.length}`);

    if (createdProducts.length > 0) {
      console.log("\n📋 Productos creados:");
      console.log("═══════════════════════════════════════");
      createdProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.nombre_producto}`);
        console.log(`   💰 $${product.precio.toLocaleString()}`);
        console.log(`   🏷️  ${product.categoria}${product.subcategoria ? ` - ${product.subcategoria}` : ''}`);
        console.log(`   🆔 ID: ${product.id_producto}`);
        console.log("");
      });
    }

    // Mostrar estadísticas por categoría
    const stats = {
      enchapadas: createdProducts.filter(p => p.categoria === 'enchapadas').length,
      terciadas: createdProducts.filter(p => p.categoria === 'terciadas').length,
      wengue: createdProducts.filter(p => p.subcategoria === 'wengue').length,
      mara: createdProducts.filter(p => p.subcategoria === 'mara').length
    };

    console.log("📊 Estadísticas por categoría:");
    console.log("═══════════════════════════════════════");
    console.log(`🏷️  Enchapadas: ${stats.enchapadas}`);
    console.log(`🏷️  Terciadas: ${stats.terciadas}`);
    console.log(`🎨 Wengue: ${stats.wengue}`);
    console.log(`🎨 Mara: ${stats.mara}`);

  } catch (error) {
    console.error("\n❌ Error durante el seeding:", error.message);
    console.error("💡 Stack trace:", error.stack);
  } finally {
    // Cerrar conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("\n🔌 Conexión cerrada");
    }
  }
}

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

// Ejecutar el script
runSeeding().catch(error => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
