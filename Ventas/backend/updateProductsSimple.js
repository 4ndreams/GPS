import { AppDataSource } from "./src/config/configDb.js";

// Función para generar número aleatorio entre min y max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateAllProducts() {
  try {
    console.log("🚀 Iniciando actualización de productos...");
    
    // Conectar a la base de datos
    await AppDataSource.initialize();
    console.log("✅ Conexión establecida");

    // Obtener repositorio
    const productRepository = AppDataSource.getRepository("Producto");
    
    // Obtener todos los productos
    const products = await productRepository.find();
    console.log(`📦 Productos encontrados: ${products.length}`);

    if (products.length === 0) {
      console.log("❌ No hay productos para actualizar");
      return;
    }

    // Actualizar cada producto
    console.log("🔄 Iniciando actualización...\n");
    
    for (const product of products) {
      const newStock = getRandomInt(5, 10);
      const newPrice = getRandomInt(50000, 400000);
      
      await productRepository.update(product.id_producto, {
        stock: newStock,
        precio: newPrice
      });

      console.log(`✅ ID ${product.id_producto} - ${product.nombre_producto}`);
      console.log(`   Stock: ${product.stock} → ${newStock}`);
      console.log(`   Precio: $${Number(product.precio).toLocaleString('es-CL')} → $${newPrice.toLocaleString('es-CL')}\n`);
    }

    console.log(`🎉 ¡Actualización completada! Se actualizaron ${products.length} productos`);

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Conexión cerrada");
    }
  }
}

// Ejecutar
updateAllProducts().then(() => {
  console.log("✨ Proceso completado");
  process.exit(0);
}).catch(error => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
