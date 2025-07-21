"use strict";

import { AppDataSource } from "./configDb.js";

/**
 * Datos por defecto de productos (puertas) para inicializar el sistema
 * Basado en el catálogo de puertas del móvil
 */
const DEFAULT_PRODUCTOS = [
  // Puertas Enchapadas
  {
    nombre_producto: "Geno Enchape Wengue",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Doble Castell Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 160.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Alcala Enchape Wengue",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "3 Palos Ranurada Enchape Wengue",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Milano Vidrio Centrado Enchape Wengue",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Milano Vidrio Centrado Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Milano Roma Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Juego Alcala Cinco Vidrios Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 160.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Lisa Con Mirilla Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "3 Palos Lisa Enchape Wengue",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Tres Palos Lisa Vidrio Centrado Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "3 Palos Ranurada Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "3 Palos Alcala Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Tres Palos Cinco Vidrios",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Closet Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 60.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "3 Palos Lisa Enchape Mara",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Enchapada Modelo Vero",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Enchapada Modelo Roma",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Enchapada Medio Cuerpo",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Enchapada Mara Castella",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Enchapada Cedro Lisa",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  // Puertas Terciadas
  {
    nombre_producto: "Terciado Corriente Lisa",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Terciado Corriente 1/2 Cuerpo",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Terciado Corriente Con Mirilla De Colegio",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  },
  {
    nombre_producto: "Terciado Corriente 6 Luces",
    precio: 60000.00,
    stock: 0,
    medida_ancho: 80.00,
    medida_alto: 200.00
  }
];

/**
 * Verifica si ya existen productos en la base de datos
 * @returns {Promise<boolean>} true si existen productos, false si no
 */
export async function checkIfProductsExist() {
  try {
    const productoRepository = AppDataSource.getRepository("Producto");
    const count = await productoRepository.count();
    return count > 0;
  } catch (error) {
    console.error("❌ Error verificando productos existentes:", error);
    return true; // En caso de error, asumimos que existen para no duplicar
  }
}

/**
 * Crea los productos por defecto en la base de datos
 * @returns {Promise<void>}
 */
export async function seedDefaultProducts() {
  try {
    const productoRepository = AppDataSource.getRepository("Producto");
    
    console.log("🌱 Iniciando seeding de productos por defecto...");
    
    const createdProducts = [];
    
    for (const productData of DEFAULT_PRODUCTOS) {
      try {
        // Verificar si el producto ya existe por nombre
        const existingProduct = await productoRepository.findOne({
          where: { nombre_producto: productData.nombre_producto }
        });
        
        if (existingProduct) {
          console.log(`⏭️  Producto ya existe: ${productData.nombre_producto}`);
          continue;
        }
        
        // Crear nuevo producto
        const newProduct = productoRepository.create(productData);
        const savedProduct = await productoRepository.save(newProduct);
        createdProducts.push(savedProduct);
        
        console.log(`✅ Producto creado: ${productData.nombre_producto}`);
      } catch (error) {
        console.error(`❌ Error creando producto ${productData.nombre_producto}:`, error.message);
      }
    }
    
    if (createdProducts.length > 0) {
      console.log(`🎉 Seeding completado: ${createdProducts.length} productos creados`);
    } else {
      console.log("ℹ️  No se crearon nuevos productos (todos ya existían)");
    }
    
  } catch (error) {
    console.error("❌ Error en seedDefaultProducts:", error);
  }
}

/**
 * Función principal de seeding que verifica y crea productos si es necesario
 * @returns {Promise<void>}
 */
export async function initializeDefaultData() {
  try {
    console.log("🔍 Verificando si necesitamos crear productos por defecto...");
    
    const productsExist = await checkIfProductsExist();
    
    if (productsExist) {
      console.log("ℹ️  Ya existen productos en la base de datos, omitiendo seeding");
      return;
    }
    
    console.log("📦 No se encontraron productos, procediendo con el seeding...");
    await seedDefaultProducts();
    
  } catch (error) {
    console.error("❌ Error en initializeDefaultData:", error);
  }
}
