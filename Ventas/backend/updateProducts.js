import { AppDataSource } from "./src/config/configDb.js";

/**
 * Script para actualizar precios y stock de todos los productos
 * - Stock: valores aleatorios entre 5 y 10
 * - Precios: valores aleatorios entre 50000 y 400000
 */

// Función para generar número aleatorio entre min y max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateProductsData() {
  try {
    // Inicializar conexión a la base de datos
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos establecida");

    // Obtener el repositorio de productos
    const productRepository = AppDataSource.getRepository("Producto");
    
    // Obtener todos los productos
    const products = await productRepository.find();
    console.log(`📦 Se encontraron ${products.length} productos para actualizar`);

    if (products.length === 0) {
      console.log("❌ No hay productos en la base de datos");
      return;
    }

    // Actualizar cada producto
    let updatedCount = 0;
    for (const product of products) {
      const newStock = getRandomInt(5, 10);
      const newPrice = getRandomInt(50000, 400000);
      
      // Actualizar el producto
      await productRepository.update(product.id_producto, {
        stock: newStock,
        precio: newPrice
      });

      console.log(`🔄 Producto ID ${product.id_producto} - "${product.nombre_producto}": Stock: ${newStock}, Precio: $${newPrice.toLocaleString('es-CL')}`);
      updatedCount++;
    }

    console.log(`\n🎉 ¡Actualización completada!`);
    console.log(`✨ Se actualizaron ${updatedCount} productos exitosamente`);
    console.log(`📊 Nuevo rango de stock: 5-10 unidades`);
    console.log(`💰 Nuevo rango de precios: $50,000 - $400,000`);

  } catch (error) {
    console.error("❌ Error al actualizar productos:", error);
  } finally {
    // Cerrar conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Conexión a la base de datos cerrada");
    }
  }
}

// Función para verificar los productos actualizados
async function verifyUpdatedProducts() {
  try {
    await AppDataSource.initialize();
    console.log("\n🔍 Verificando productos actualizados...");

    const productRepository = AppDataSource.getRepository("Producto");
    const products = await productRepository.find({
      select: ["id_producto", "nombre_producto", "precio", "stock"]
    });

    console.log("\n📋 Lista de productos actualizados:");
    console.log("=" .repeat(80));
    
    products.forEach(product => {
      console.log(`ID: ${product.id_producto.toString().padStart(3)} | Stock: ${product.stock.toString().padStart(2)} | Precio: $${Number(product.precio).toLocaleString('es-CL').padStart(10)} | ${product.nombre_producto}`);
    });

    console.log("=" .repeat(80));
    console.log(`Total productos: ${products.length}`);

    // Estadísticas
    const stocks = products.map(p => p.stock);
    const prices = products.map(p => Number(p.precio));
    
    console.log(`\n📈 Estadísticas:`);
    console.log(`Stock mínimo: ${Math.min(...stocks)}`);
    console.log(`Stock máximo: ${Math.max(...stocks)}`);
    console.log(`Precio mínimo: $${Math.min(...prices).toLocaleString('es-CL')}`);
    console.log(`Precio máximo: $${Math.max(...prices).toLocaleString('es-CL')}`);

  } catch (error) {
    console.error("❌ Error al verificar productos:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Ejecutar el script
async function main() {
  console.log("🚀 Iniciando actualización de productos...\n");
  
  // Primero actualizar
  await updateProductsData();
  
  // Luego verificar
  await verifyUpdatedProducts();
  
  console.log("\n✅ Proceso completado");
  process.exit(0);
}

// Ejecutar solo si este archivo es ejecutado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
}

export { updateProductsData, verifyUpdatedProducts };
