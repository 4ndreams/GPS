console.log("🚀 Iniciando script de actualización...");

import { AppDataSource } from "./src/config/configDb.js";

async function testConnection() {
  try {
    console.log("📡 Intentando conectar a la base de datos...");
    await AppDataSource.initialize();
    console.log("✅ Conexión exitosa!");
    
    const productRepository = AppDataSource.getRepository("Producto");
    const products = await productRepository.find();
    console.log(`📦 Se encontraron ${products.length} productos`);
    
    if (products.length > 0) {
      console.log("🔍 Primeros 3 productos:");
      products.slice(0, 3).forEach(p => {
        console.log(`- ID: ${p.id_producto}, Nombre: ${p.nombre_producto}, Stock: ${p.stock}, Precio: ${p.precio}`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Conexión cerrada");
    }
  }
}

testConnection().then(() => {
  console.log("✅ Test completado");
  process.exit(0);
}).catch(error => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
