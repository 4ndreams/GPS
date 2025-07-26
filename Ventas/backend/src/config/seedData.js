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
    medida_alto: 200.00,

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
const DEFAULT_MATERIALES = [
  { nombre_material: "Madera Wengue", caracteristicas: "Resistente y elegante" },
  { nombre_material: "Vidrio Templado", caracteristicas: "Alta seguridad y transparencia" },
  { nombre_material: "Roble Sólido", caracteristicas: "Madera maciza de alta calidad" },
  { nombre_material: "Acero Reforzado", caracteristicas: "Ideal para puertas de seguridad" },
  { nombre_material: "MDF Blanco", caracteristicas: "Acabado moderno y liso" },
];
const DEFAULT_RELLENOS = [
  { nombre_relleno: "Espuma de Poliuretano", caracteristicas: "Aislante y ligero" },
  { nombre_relleno: "Fibra de Vidrio", caracteristicas: "Alta resistencia y durabilidad" },
  { nombre_relleno: "Poliestireno Expandido", caracteristicas: "Económico y eficiente" },
  { nombre_relleno: "Poliuretano Expandido", caracteristicas: "Excelente aislante térmico" },
  { nombre_relleno: "Celulosa", caracteristicas: "Ecológico y biodegradable" },
];
const DEFAULT_TIPOS = [
  { nombre_tipo: "puertas" },
  { nombre_tipo: "molduras" },
];
const DEFAULT_BODEGAS = [
  { stock: 100 }, { stock: 50 }, { stock: 75 }, { stock: 200 }, { stock: 150 },
  { stock: 300 }, { stock: 120 }, { stock: 80 }, { stock: 60 }, { stock: 90 },
  { stock: 110 }, { stock: 130 }, { stock: 140 }, { stock: 160 }, { stock: 170 },
  { stock: 180 }, { stock: 190 }, { stock: 200 }, { stock: 210 }, { stock: 220 },
  { stock: 230 }, { stock: 240 }, { stock: 250 }, { stock: 260 }, { stock: 270 },
  { stock: 280 }, { stock: 290 }, { stock: 300 }, { stock: 310 }, { stock: 320 },
  { stock: 330 }, { stock: 340 }, { stock: 350 }, { stock: 360 }, { stock: 370 }
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
export async function seedDefaultProducts() {
  try {
    const productoRepository = AppDataSource.getRepository("Producto");
    const materialRepository = AppDataSource.getRepository("Material");
    const rellenoRepository = AppDataSource.getRepository("Relleno");
    const tipoRepository = AppDataSource.getRepository("Tipo");
    const bodegaRepository = AppDataSource.getRepository("Bodega");

    console.log("🌱 Iniciando seeding de productos por defecto...");

    // MATERIAL
    let materiales = await materialRepository.find();
    if (materiales.length === 0) {
      await materialRepository.save(DEFAULT_MATERIALES);
      materiales = await materialRepository.find();
      console.log(`✅ ${materiales.length} materiales creados`);
    }

    // RELLENO
    let rellenos = await rellenoRepository.find();
    if (rellenos.length === 0) {
      await rellenoRepository.save(DEFAULT_RELLENOS);
      rellenos = await rellenoRepository.find();
      console.log(`✅ ${rellenos.length} rellenos creados`);
    }

    // TIPOS
    let tipos = await tipoRepository.find();
    if (tipos.length === 0) {
      await tipoRepository.save(DEFAULT_TIPOS);
      tipos = await tipoRepository.find();
      console.log(`✅ ${tipos.length} tipos creados`);
    }

    const createdProducts = [];

    for (const productData of DEFAULT_PRODUCTOS) {
      try {
        const existingProduct = await productoRepository.findOne({
          where: { nombre_producto: productData.nombre_producto }
        });

        if (existingProduct) {
          console.log(`⏭️  Producto ya existe: ${productData.nombre_producto}`);
          continue;
        }

        const randomMaterial = materiales[Math.floor(Math.random() * materiales.length)];
        const randomRelleno = rellenos[Math.floor(Math.random() * rellenos.length)];
        const randomTipo = tipos[Math.floor(Math.random() * tipos.length)];

        const newProduct = productoRepository.create({
          ...productData,
          material: randomMaterial,
          relleno: randomRelleno,
          tipo: randomTipo
        });

        const savedProduct = await productoRepository.save(newProduct);
        createdProducts.push(savedProduct);

        console.log(`✅ Producto creado: ${productData.nombre_producto}`);
      } catch (error) {
        console.error(`❌ Error creando producto ${productData.nombre_producto}:`, error.message);
      }
    }

    // Asignación a bodegas
    const asignables = [
      ...(await productoRepository.find()),
      ...(await materialRepository.find()),
      ...(await rellenoRepository.find()),
    ];

    let bodegaIndex = 0;
    for (const item of asignables) {
      if (bodegaIndex >= DEFAULT_BODEGAS.length) break;

      const whereClause = item.id_producto
        ? { producto: { id_producto: item.id_producto } }
        : item.id_material
        ? { material: { id_material: item.id_material } }
        : { relleno: { id_relleno: item.id_relleno } };

      const exists = await bodegaRepository.findOne({ where: whereClause });

      if (!exists) {
        const nuevaBodega = bodegaRepository.create({
          stock: DEFAULT_BODEGAS[bodegaIndex].stock,
          producto: item.id_producto ? item : null,
          material: item.id_material ? item : null,
          relleno: item.id_relleno ? item : null
        });

        await bodegaRepository.save(nuevaBodega);
        console.log(`🏠 Bodega creada para: ${item.nombre_producto || item.nombre_material || item.nombre_relleno}`);
        bodegaIndex++;
      } else {
        console.log(`✅ Bodega ya existe para: ${item.nombre_producto || item.nombre_material || item.nombre_relleno}`);
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
